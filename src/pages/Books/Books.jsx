import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilter, FaBook, FaExclamationTriangle } from 'react-icons/fa';
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaBook className="mr-3 text-greenlove" />
            Books Collection
          </h1>
          <Link 
            to="/books/create" 
            className="mt-4 md:mt-0 inline-flex items-center px-5 py-2.5 bg-greenlove text-white rounded-lg hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaPlus className="mr-2" />
            Add New Book
          </Link>
        </div>
        <p className="text-gray-600">Manage your library collection - browse, search, filter, and organize your books.</p>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Search & Filter</h2>
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
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200"
            />
          </div>

          {/* <div className="sm:w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select 
                value={selectedTopicDetail}
                onChange={(e) => setSelectedTopicDetail(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200 bg-white appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {topicDetails.map(detail => (
                  <option key={detail.id} value={detail.id}>
                    {detail.topic?.topicName} &gt; {detail.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div> */}
        </div>
        
        {/* Search stats */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredBooks.length} of {books.length} books
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {selectedTopicDetail && (
              <span> in category {
                topicDetails.find(detail => detail.id === selectedTopicDetail)?.name || ''
              }</span>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-8 flex items-start">
          <div className="mr-3 flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-sm p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-greenlove mb-4"></div>
          <p className="text-gray-600 font-medium">Loading book collection...</p>
        </div>
      ) : (
        <>
          {/* Books grid */}
          {filteredBooks.length === 0 ? (
            <div className="bg-white text-gray-500 p-12 rounded-xl shadow-sm text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <FaBook className="h-16 w-16 text-gray-300" />
              </div>
              <p className="text-xl font-medium text-gray-700">No books found</p>
              <p className="mt-2 mb-6 text-gray-500 max-w-md mx-auto">
                {searchTerm || selectedTopicDetail ? 
                  "No books match your current search criteria. Try adjusting your filters or search term." :
                  "Your library collection is empty. Start by adding your first book."}
              </p>
              
              {(searchTerm || selectedTopicDetail) && (
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedTopicDetail('');}}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <Link 
                    to="/books/create" 
                    className="px-4 py-2 bg-greenlove text-white rounded-lg hover:bg-greenlove_1 transition-colors duration-200"
                  >
                    <FaPlus className="inline mr-2" />
                    Add New Book
                  </Link>
                </div>
              )}
              
              {!searchTerm && !selectedTopicDetail && (
                <Link 
                  to="/books/create" 
                  className="inline-flex items-center px-5 py-2.5 bg-greenlove text-white rounded-lg hover:bg-greenlove_1 transition-colors duration-200"
                >
                  <FaPlus className="mr-2" />
                  Add Your First Book
                </Link>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

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
                Are you sure you want to delete this book? This action cannot be undone.
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
                onClick={confirmDelete}
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