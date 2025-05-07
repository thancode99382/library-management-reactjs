import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaBook, FaCalendarAlt, FaClock, FaUser, FaTags } from 'react-icons/fa';
import { bookService } from '../../services/bookService';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle book deletion
  const handleDelete = async () => {
    try {
      await bookService.deleteBook(id);
      navigate('/books');
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete the book. Please try again.');
      setShowDeleteModal(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-greenlove mb-4"></div>
        <span className="text-lg font-medium text-gray-700">Loading book details...</span>
      </div>
    );
  }

  // Show error state
  if (error || !book) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 flex items-start">
          <div className="mr-3 flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p>{error || 'Book not found'}</p>
          </div>
        </div>
        <Link 
          to="/books" 
          className="inline-flex items-center px-4 py-2 bg-white text-greenlove hover:text-greenlove_1 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>
      </div>
    );
  }

  // Compute image URL
  const bookCoverUrl = book.bookCover 
    ? `data:${book.bookCoverMimeType};base64,${book.bookCover}` 
    : 'https://via.placeholder.com/300x400?text=No+Cover';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Navigation links */}
      <div className="mb-6">
        <Link 
          to="/books" 
          className="inline-flex items-center px-4 py-2 bg-white text-greenlove hover:text-greenlove_1 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Book header with gradient background */}
        <div className="bg-gradient-to-r from-greenlove to-green-600 py-4 px-6 text-white">
          <h1 className="text-2xl font-bold">Book Details</h1>
          <p className="text-green-100 text-sm mt-1">View complete information about this book</p>
        </div>

        <div className="md:flex">
          {/* Book cover image section */}
          <div className="md:w-1/3 lg:w-1/4 p-6 flex flex-col items-center">
            <div className="w-full aspect-[3/4] max-w-xs rounded-lg overflow-hidden shadow-md border border-gray-200">
              <img 
                className="w-full h-full object-cover" 
                src={bookCoverUrl} 
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                }}
              />
            </div>
            
            {/* Action buttons - larger and below image on mobile, side by side on desktop */}
            <div className="flex mt-6 gap-4 w-full justify-center">
              <Link 
                to={`/books/${book.id}/edit`}
                className="flex-1 max-w-[120px] py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <FaEdit className="mr-2" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 max-w-[120px] py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Book details section */}
          <div className="md:w-2/3 lg:w-3/4 p-6 md:pl-0 border-t md:border-t-0 md:border-l border-gray-100">
            <div className="flex flex-col h-full">
              {/* Book title and author */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaBook className="mr-3 text-greenlove hidden md:block" />
                  {book.title}
                </h2>
                
                {book.author && (
                  <div className="mt-2 flex items-center text-lg text-gray-700">
                    <FaUser className="mr-2 text-greenlove/70" />
                    <span>{book.author}</span>
                  </div>
                )}
              </div>

              {/* Category info */}
              {book.detailTopic && (
                <div className="mt-6">
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaTags className="mr-2 text-greenlove/70" />
                    <span className="font-medium">Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-700 text-sm inline-flex items-center border border-gray-200">
                      {book.detailTopic.topic?.topicName}
                    </span>
                    <span className="px-3 py-1.5 bg-greenlove/10 text-greenlove rounded-lg text-sm inline-flex items-center border border-greenlove/20 font-medium">
                      {book.detailTopic.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-6">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2 text-greenlove/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span className="font-medium">Description</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {book.description ? (
                    <p className="text-gray-700">{book.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available.</p>
                  )}
                </div>
              </div>

              {/* Date information */}
              <div className="mt-auto pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-greenlove/70" />
                    <div>
                      <span className="block text-xs text-gray-500">Added on</span>
                      <span className="font-medium">{formatDate(book.createdAt)}</span>
                    </div>
                  </div>
                  
                  {book.updatedAt && book.updatedAt !== book.createdAt && (
                    <div className="flex items-center">
                      <FaClock className="mr-2 text-greenlove/70" />
                      <div>
                        <span className="block text-xs text-gray-500">Last updated</span>
                        <span className="font-medium">{formatDate(book.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-xl p-6 max-w-md mx-auto shadow-2xl animate-fadeIn">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete "{book.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};