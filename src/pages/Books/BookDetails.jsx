import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
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
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove"></div>
      </div>
    );
  }

  // Show error state
  if (error || !book) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error || 'Book not found'}
        </div>
        <div className="mt-4">
          <Link 
            to="/books" 
            className="inline-flex items-center text-greenlove hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Books
          </Link>
        </div>
      </div>
    );
  }

  // Compute image URL
  const bookCoverUrl = book.bookCover 
    ? `data:${book.bookCoverMimeType};base64,${book.bookCover}` 
    : 'https://via.placeholder.com/300x400?text=No+Cover';

  return (
    <div className="p-6">
      {/* Navigation links */}
      <div className="mb-6">
        <Link 
          to="/books" 
          className="inline-flex items-center text-greenlove hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Book cover image */}
          <div className="md:flex-shrink-0">
            <img 
              className="h-64 w-full object-cover md:w-48" 
              src={bookCoverUrl} 
              alt={book.title} 
            />
          </div>

          {/* Book details */}
          <div className="p-8 flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                <p className="mt-1 text-lg text-gray-600">{book.author || 'Unknown author'}</p>
              </div>
              
              {/* Action buttons */}
              <div className="flex space-x-2">
                <Link 
                  to={`/books/${book.id}/edit`}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title="Edit Book"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Delete Book"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {/* Category info */}
            {book.detailTopic && (
              <div className="mt-4">
                <span className="text-sm text-gray-500">Category: </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800 text-sm">
                  {book.detailTopic.topic?.topicName} &gt; {book.detailTopic.name}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Description</h2>
              <p className="mt-2 text-gray-600">{book.description || 'No description available.'}</p>
            </div>

            {/* Date information */}
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
              <div>
                <strong>Added:</strong> {formatDate(book.createdAt)}
              </div>
              {book.updatedAt && book.updatedAt !== book.createdAt && (
                <div>
                  <strong>Last updated:</strong> {formatDate(book.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-500">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};