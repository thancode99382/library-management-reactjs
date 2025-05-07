import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaBook, FaUser, FaCalendarAlt } from 'react-icons/fa';

const BookCard = ({ book, onDelete }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Handle placeholder for image
  const bookCoverUrl = book.bookCover 
    ? `data:${book.bookCoverMimeType};base64,${book.bookCover}` 
    : 'https://via.placeholder.com/150x200?text=No+Cover';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative group h-64">
        {/* Book cover image with gradient overlay for better title visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Book cover image */}
        <img 
          src={bookCoverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
          }}
        />
        
        {/* Category tag - shown always */}
        {book.detailTopic && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2 py-1 bg-greenlove/90 text-xs font-medium rounded-lg text-white shadow-sm">
              {book.detailTopic.name}
            </span>
          </div>
        )}
        
        {/* Hover overlay with actions - ENHANCED */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex items-center justify-center">
          <div className="flex gap-4 items-center">
            <Link 
              to={`/books/${book.id}`} 
              className="text-white bg-greenlove hover:bg-greenlove_1 p-3.5 rounded-full shadow-lg transition-all duration-200 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-75" 
              title="View details"
            >
              <FaEye size={18} className="transform group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              to={`/books/${book.id}/edit`} 
              className="text-white bg-blue-500 hover:bg-blue-600 p-3.5 rounded-full shadow-lg transition-all duration-200 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-100"
              title="Edit book"
            >
              <FaEdit size={18} className="transform group-hover:scale-110 transition-transform" />
            </Link>
            <button 
              onClick={() => onDelete(book.id)} 
              className="text-white bg-red-500 hover:bg-red-600 p-3.5 rounded-full shadow-lg transition-all duration-200 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-150"
              title="Delete book"
            >
              <FaTrash size={18} className="transform group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-gray-800 line-clamp-1 hover:text-greenlove transition-colors duration-200">
          <Link to={`/books/${book.id}`} className="hover:underline">
            {book.title}
          </Link>
        </h3>
        
        {/* Author with icon */}
        <div className="flex items-center mt-2 text-gray-600">
          <FaUser size={12} className="mr-2 text-greenlove/70" />
          <p className="text-sm font-medium">{book.author || 'Unknown author'}</p>
        </div>
        
        {/* Topic path - full hierarchy */}
        {book.detailTopic && book.detailTopic.topic && (
          <div className="mt-2 flex items-center">
            <FaBook size={12} className="mr-2 text-greenlove/70" />
            <span className="text-xs text-gray-500">
              {book.detailTopic.topic.topicName} &gt; {book.detailTopic.name}
            </span>
          </div>
        )}
        
        {/* Description preview */}
        <p className="mt-3 text-gray-600 text-sm line-clamp-2 flex-grow">
          {book.description || 'No description available.'}
        </p>
        
        {/* Date added with icon */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-400">
          <FaCalendarAlt size={12} className="mr-1" />
          <span>{formatDate(book.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;