import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';

// GraphQL Queries
export const GET_BOOKS = gql`
  query Books {
    books {
      author
      bookCover
      bookCoverMimeType
      createdAt
      description
      id
      title
      updatedAt
      detailTopic {
        createdAt
        deletedAt
        id
        name
        updatedAt
        topic {
          createdAt
          deletedAt
          id
          topicName
          updatedAt
        }
      }
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query Book($id: Int!) {
    book(id: $id) {
      author
      bookCover
      bookCoverMimeType
      createdAt
      description
      id
      title
      updatedAt
      detailTopic {
        id
        name
        topic {
          id
          topicName
        }
      }
    }
  }
`;

// GraphQL Mutations
export const CREATE_BOOK = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      author
      bookCover
      bookCoverMimeType
      createdAt
      description
      id
      title
      updatedAt
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      author
      bookCover
      bookCoverMimeType
      createdAt
      description
      id
      title
      updatedAt
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation RemoveBook($id: Int!) {
    removeBook(id: $id) {
      author
      bookCover
      bookCoverMimeType
      createdAt
      description
      id
      title
      updatedAt
    }
  }
`;

// Service functions
export const bookService = {
  getBookId: (id) => {
    // Check if id exists
    if (id === undefined || id === null) {
      throw new Error('Book ID is required');
    }
    
    // Convert the id to an integer
    const bookId = parseInt(id, 10);
    
    // Check if id is valid
    if (isNaN(bookId)) {
      throw new Error('Invalid book ID provided - must be a valid integer');
    }
    
    return bookId;
  },

  getBooks: async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_BOOKS,
        fetchPolicy: 'network-only' // Don't use cache
      });
      return data.books;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      // Use the getBookId function to validate and convert the ID
      const bookId = bookService.getBookId(id);
      
      const { data } = await apolloClient.query({
        query: GET_BOOK_BY_ID,
        variables: { id: bookId },
        fetchPolicy: 'no-cache'
      });
      return data.book;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      // Create a copy of the data to avoid mutation
      const processedData = { ...bookData };
     
      // Ensure topicDetailId is an integer or remove it if empty/null
      if (processedData.topicDetailId === '' || processedData.topicDetailId === null) {
        delete processedData.topicDetailId; // Remove the property entirely
      } else {
        processedData.topicDetailId = parseInt(processedData.topicDetailId, 10);
        if (isNaN(processedData.topicDetailId)) {
          throw new Error("Topic detail ID must be a valid number");
        }
      }

      const { data } = await apolloClient.mutate({
        mutation: CREATE_BOOK,
        variables: { createBookInput: processedData }
      });
      return data.createBook;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (bookData) => {
    try {
      // Create a copy of the data to avoid mutation
      const processedData = { ...bookData };
      
      // Ensure id is an integer
      if (processedData.id) {
        processedData.id = parseInt(processedData.id, 10);
        if (isNaN(processedData.id)) {
          throw new Error("Book ID must be a valid number");
        }
      }
     
      // Ensure topicDetailId is an integer or remove it if empty/null
      if (processedData.topicDetailId === '' || processedData.topicDetailId === null) {
        delete processedData.topicDetailId; // Remove the property entirely
      } else {
        processedData.topicDetailId = parseInt(processedData.topicDetailId, 10);
        if (isNaN(processedData.topicDetailId)) {
          throw new Error("Topic detail ID must be a valid number");
        }
      }

      const { data } = await apolloClient.mutate({
        mutation: UPDATE_BOOK,
        variables: { updateBookInput: processedData }
      });
      return data.updateBook;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      // Use the getBookId function to validate and convert the ID
      const bookId = bookService.getBookId(id);
      
      const { data } = await apolloClient.mutate({
        mutation: DELETE_BOOK,
        variables: { id: bookId },
        fetchPolicy: 'no-cache' 
      });
      return data.removeBook;
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  }
};