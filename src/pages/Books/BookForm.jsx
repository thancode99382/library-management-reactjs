import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage, FaBook, FaUser, FaTags, FaLayerGroup, FaFileAlt } from 'react-icons/fa';
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
          setTopicDetails([]); // Clear previous topic details while loading
          const topicData = await topicService.getTopicById(selectedTopic);
          
          if (topicData && topicData.detailTopics && topicData.detailTopics.length > 0) {
            setTopicDetails(topicData.detailTopics);
            
            // Clear selected topic detail if it doesn't belong to the selected topic
            const currentDetailExists = topicData.detailTopics.some(detail => detail.id === formData.topicDetailId);
            if (!currentDetailExists) {
              setFormData(prev => ({ ...prev, topicDetailId: '' }));
            }
          } else {
            console.log('No topic details found for this category');
            setTopicDetails([]);
            // Reset the topic detail selection since there are no options
            setFormData(prev => ({ ...prev, topicDetailId: '' }));
          }
        } catch (err) {
          console.error('Error loading topic details:', err);
          setError(`Failed to load sub-categories. Please try selecting the category again.`);
          setTopicDetails([]);
          // Reset the topic detail selection since there was an error
          setFormData(prev => ({ ...prev, topicDetailId: '' }));
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
  const compressImage = (file, maxWidth = 400, maxHeight = 600, quality = 0.3) => {
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
        
        // Adaptive quality based on file size
        let adaptiveQuality = quality;
        if (file.size > 3 * 1024 * 1024) { // If original is over 3MB
          adaptiveQuality = 0.2; // Use very low quality for large images
        } else if (file.size > 1 * 1024 * 1024) { // If original is over 1MB
          adaptiveQuality = 0.25; // Use low quality
        }
        
        // Convert to blob and return
        canvas.toBlob(
          (blob) => {
            // Check if blob is still too large and compress again if needed
            if (blob.size > 500 * 1024) { // If still over 500KB
              const reader = new FileReader();
              reader.onload = () => {
                const img2 = new Image();
                img2.onload = () => {
                  // Further reduce dimensions by 20%
                  const width2 = Math.round(width * 0.8);
                  const height2 = Math.round(height * 0.8);
                  
                  const canvas2 = document.createElement('canvas');
                  canvas2.width = width2;
                  canvas2.height = height2;
                  
                  const ctx2 = canvas2.getContext('2d');
                  ctx2.drawImage(img2, 0, 0, width2, height2);
                  
                  // Use even lower quality
                  canvas2.toBlob(
                    (finalBlob) => {
                      setImageCompressing(false);
                      resolve(finalBlob);
                    },
                    file.type,
                    Math.max(adaptiveQuality - 0.1, 0.15) // Even lower quality, but not less than 0.15
                  );
                };
                img2.src = reader.result;
              };
              reader.readAsDataURL(blob);
            } else {
              setImageCompressing(false);
              resolve(blob);
            }
          },
          file.type,
          adaptiveQuality
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
      <div className="p-6 flex justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-greenlove"></div>
        <span className="ml-4 text-lg font-medium text-gray-700">Loading book data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/books" 
          className="inline-flex items-center px-4 py-2 bg-white text-greenlove hover:text-greenlove_1 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>
      </div>
      
      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FaBook className="mr-3 text-greenlove" />
        {isEditMode ? 'Edit Book' : 'Add New Book'}
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow mb-8 flex items-start">
          <div className="mr-2 flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow mb-8 flex items-start">
          <div className="mr-2 flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* Book form */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-greenlove to-green-600 py-4 px-6 text-white">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Book Information' : 'New Book Details'}
          </h2>
          <p className="text-green-100 text-sm mt-1">
            {isEditMode ? 'Update the information below' : 'Fill in the information below to add a new book'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Book cover */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
                  {imageCompressing ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove mx-auto mb-3"></div>
                      <p className="text-gray-500 font-medium">Optimizing image...</p>
                    </div>
                  ) : imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Book cover preview" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-6">
                      <FaImage className="mx-auto h-16 w-16 mb-3 text-gray-300" />
                      <p className="font-medium">No cover image yet</p>
                      <p className="text-xs text-gray-500 mt-1">Upload a cover to enhance your book listing</p>
                    </div>
                  )}
                </div>

                <label className="w-full flex flex-col items-center px-4 py-3 bg-greenlove hover:bg-greenlove_1 text-white rounded-lg shadow-md tracking-wide cursor-pointer transition-all duration-200 hover:shadow-lg">
                  <div className="flex items-center">
                    <FaImage className="mr-2" />
                    <span className="text-base font-medium">Select Cover Image</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageCompressing}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Max file size: 5MB. Images will be automatically optimized for best performance.
                </p>
              </div>
            </div>

            {/* Right column - Book details */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {/* Book title */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaBook className="mr-2 text-greenlove" />
                    Book Title <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter book title"
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200"
                    required
                  />
                </div>

                {/* Book author */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaUser className="mr-2 text-greenlove" />
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Topic selection */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaTags className="mr-2 text-greenlove" />
                      Main Category
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={handleTopicChange}
                      className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200 bg-white"
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
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FaLayerGroup className="mr-2 text-greenlove" />
                      Sub-category
                    </label>
                    <select
                      name="topicDetailId"
                      value={formData.topicDetailId}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200 bg-white ${!selectedTopic || topicDetails.length === 0 ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
                      <p className="mt-2 text-sm text-amber-600 flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        No sub-categories available
                      </p>
                    )}
                  </div>
                </div>

                {/* Book description */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaFileAlt className="mr-2 text-greenlove" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter book description"
                    rows={6}
                    className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <Link
              to="/books"
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || imageCompressing}
              className={`inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove transition-all duration-200 ${
                (saving || imageCompressing) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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