import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import { bookService } from '../../services/bookService';
import { topicDetailService } from '../../services/topicDetailService';
import { topicService } from '../../services/topicService';

export const BookForm = () => {
  const { id } = useParams(); // If id exists, we're editing a book
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    topicDetailId: '',
    bookCover: null,
    bookCoverMimeType: null
  });
  
  // Additional state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topicDetails, setTopicDetails] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageCompressing, setImageCompressing] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get topics first
        const topicsData = await topicService.getTopics();
        setTopics(topicsData);

        // If editing, load book data
        if (isEditMode) {
          const bookData = await bookService.getBookById(id);
          
          // Set form data from book
          setFormData({
            title: bookData.title || '',
            author: bookData.author || '',
            description: bookData.description || '',
            topicDetailId: bookData.detailTopic?.id || '',
            bookCover: bookData.bookCover || null,
            bookCoverMimeType: bookData.bookCoverMimeType || null
          });

          // Set image preview if there's a book cover
          if (bookData.bookCover) {
            setImagePreview(`data:${bookData.bookCoverMimeType};base64,${bookData.bookCover}`);
          }

          // Set topic from detail topic
          if (bookData.detailTopic?.topic?.id) {
            setSelectedTopic(bookData.detailTopic.topic.id);
            
            // Load topic details for the selected topic
            const topicDetailsData = await topicDetailService.getTopicDetailsByTopicId(
              bookData.detailTopic.topic.id
            );
            setTopicDetails(topicDetailsData);
          }
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load necessary data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  // Load topic details when selected topic changes
  useEffect(() => {
    const loadTopicDetails = async () => {
      if (selectedTopic) {
        try {
          const data = await topicDetailService.getTopicDetailsByTopicId(selectedTopic);
          setTopicDetails(data);
          
          // Clear selected topic detail if it doesn't belong to the selected topic
          const currentDetailExists = data.some(detail => detail.id === formData.topicDetailId);
          if (!currentDetailExists) {
            setFormData(prev => ({ ...prev, topicDetailId: '' }));
          }
        } catch (err) {
          console.error('Error loading topic details:', err);
        }
      } else {
        setTopicDetails([]);
        setFormData(prev => ({ ...prev, topicDetailId: '' }));
      }
    };

    loadTopicDetails();
  }, [selectedTopic]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle topic selection
  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  // Function to compress and resize image
  const compressImage = (file, maxWidth = 800, maxHeight = 1200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      setImageCompressing(true);
      
      // Create an image object
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob and return
        canvas.toBlob(
          (blob) => {
            setImageCompressing(false);
            resolve(blob);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = (err) => {
        setImageCompressing(false);
        reject(err);
      };
      
      // Load image from file
      img.src = URL.createObjectURL(file);
    });
  };

  // Convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        // Extract just the base64 data without the data URL prefix
        const base64Data = base64String.split(',')[1];
        resolve({ base64Data, fullString: base64String });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    setError(null);

    try {
      // Enforce size limit of 5MB for original file
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size cannot exceed 5MB');
        return;
      }
      
      // Compress the image
      const compressedBlob = await compressImage(file);
      
      // Show warning if still too big after compression
      if (compressedBlob.size > 1 * 1024 * 1024) {
        console.warn('Image is still large after compression:', Math.round(compressedBlob.size / 1024), 'KB');
      }
      
      // Convert to base64
      const { base64Data, fullString } = await blobToBase64(compressedBlob);
      
      // Update state
      setFormData(prev => ({ 
        ...prev, 
        bookCover: base64Data,
        bookCoverMimeType: file.type
      }));
      setImagePreview(fullString);
      
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try a different image.');
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Book title is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Create a copy of form data for submission
      const bookDataToSubmit = {...formData};
      
      // Convert topicDetailId to integer or null if empty
      if (bookDataToSubmit.topicDetailId === '') {
        bookDataToSubmit.topicDetailId = null;
      } else {
        bookDataToSubmit.topicDetailId = parseInt(bookDataToSubmit.topicDetailId, 10);
      }
      
      // Prepare data with ID for update operations
      const bookData = isEditMode ? { ...bookDataToSubmit, id } : bookDataToSubmit;
      
      // Save the book
      if (isEditMode) {
        await bookService.updateBook(bookData);
        setSuccess('Book updated successfully!');
      } else {
        await bookService.createBook(bookData);
        setSuccess('Book created successfully!');
      }
      
      // Navigate back to books list after a short delay
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (err) {
      console.error('Error saving book:', err);
      setError(`Failed to save the book: ${err.message || 'Please try again with a smaller image.'}`);
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/books" 
          className="inline-flex items-center text-greenlove hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>
      </div>
      
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Book' : 'Add New Book'}
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          {success}
        </div>
      )}

      {/* Book form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Book cover */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                  {imageCompressing ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-greenlove mx-auto mb-2"></div>
                      <p className="text-gray-500">Optimizing image...</p>
                    </div>
                  ) : imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Book cover preview" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <FaImage className="mx-auto h-12 w-12 mb-2" />
                      <p>No image</p>
                    </div>
                  )}
                </div>

                <label className="w-full flex flex-col items-center px-4 py-2 bg-greenlove text-white rounded-lg shadow-md tracking-wide cursor-pointer hover:bg-greenlove_1 transition-colors">
                  <FaImage className="mr-2" />
                  <span className="mt-2 text-sm">Select Cover Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageCompressing}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max file size: 5MB. Images will be automatically optimized.
                </p>
              </div>
            </div>

            {/* Right column - Book details */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {/* Book title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove sm:text-sm"
                    required
                  />
                </div>

                {/* Book author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove sm:text-sm"
                  />
                </div>

                {/* Topic selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Category
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={handleTopicChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {topics.map(topic => (
                      <option key={topic.id} value={topic.id}>
                        {topic.topicName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Topic detail selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-category
                  </label>
                  <select
                    name="topicDetailId"
                    value={formData.topicDetailId}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove sm:text-sm"
                    disabled={!selectedTopic || topicDetails.length === 0}
                  >
                    <option value="">Select a sub-category</option>
                    {topicDetails.map(detail => (
                      <option key={detail.id} value={detail.id}>
                        {detail.name}
                      </option>
                    ))}
                  </select>
                  {selectedTopic && topicDetails.length === 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      No sub-categories available for this category.
                    </p>
                  )}
                </div>

                {/* Book description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-8 flex justify-end">
            <Link
              to="/books"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || imageCompressing}
              className={`inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove ${
                (saving || imageCompressing) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {isEditMode ? 'Update Book' : 'Create Book'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};