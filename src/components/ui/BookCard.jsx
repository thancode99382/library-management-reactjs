import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        {/* Book cover image */}
        <img 
          src={bookCoverUrl} 
          alt={book.title} 
          className="w-full h-48 object-cover"
        />
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center gap-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
          <Link to={`/books/${book.id}`} className="text-white bg-greenlove p-2 rounded-full hover:bg-greenlove_1">
            <FaEye size={16} />
          </Link>
          <Link to={`/books/${book.id}/edit`} className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600">
            <FaEdit size={16} />
          </Link>
          <button 
            onClick={() => onDelete(book.id)} 
            className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm">{book.author || 'Unknown author'}</p>
        
        {/* Book category/topic */}
        {book.detailTopic && (
          <div className="mt-2 flex items-center">
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
              {book.detailTopic.topic?.topicName} &gt; {book.detailTopic.name}
            </span>
          </div>
        )}
        
        {/* Description preview */}
        <p className="mt-2 text-gray-500 text-sm line-clamp-2">
          {book.description || 'No description available.'}
        </p>
        
        {/* Date added */}
        <p className="mt-3 text-xs text-gray-400">
          Added: {formatDate(book.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default BookCard;