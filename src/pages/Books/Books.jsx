import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { bookService } from '../../services/bookService';
import { topicDetailService } from '../../services/topicDetailService';
import BookCard from '../../components/ui/BookCard';

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicDetails, setTopicDetails] = useState([]);
  const [selectedTopicDetail, setSelectedTopicDetail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Fetch books and topic details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, topicDetailsData] = await Promise.all([
          bookService.getBooks(),
          topicDetailService.getTopicDetails()
        ]);
        setBooks(booksData);
        setTopicDetails(topicDetailsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete confirmation
  const handleDeleteClick = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteModal(true);
  };

  // Handle actual deletion
  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await bookService.deleteBook(bookToDelete);
      setBooks(books.filter(book => book.id !== bookToDelete));
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete the book. Please try again later.');
    }
  };

  // Filter books based on search term and selected topic
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === '' || 
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTopic = selectedTopicDetail === '' || 
      book.detailTopic?.id === selectedTopicDetail;
    
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Books Management
        </h1>
        <Link 
          to="/books/create" 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-greenlove text-white rounded-md hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Book
        </Link>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenlove focus:border-transparent"
            />
          </div>

          <div className="sm:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select 
                value={selectedTopicDetail}
                onChange={(e) => setSelectedTopicDetail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenlove focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                {topicDetails.map(detail => (
                  <option key={detail.id} value={detail.id}>
                    {detail.topic?.topicName} &gt; {detail.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove"></div>
        </div>
      ) : (
        <>
          {/* Books grid */}
          {filteredBooks.length === 0 ? (
            <div className="bg-gray-50 text-gray-500 p-8 rounded-md text-center">
              <p className="text-xl">No books found</p>
              <p className="mt-2">Try adjusting your search or filter, or add a new book.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-500">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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