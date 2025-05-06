// utils/auth.js
import { ApolloClient, InMemoryCache, gql, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link to capture and log GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    console.log('GraphQL Errors:', graphQLErrors);
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.log('Network Error:', networkError);
  }
});

// HTTP link with credentials
const httpLink = new HttpLink({ 
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
});

// Create Apollo Client instance with error handling
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all' // Return errors and any received data
    }
  }
});

// Login mutation - FIXED to treat data as a JSON scalar type without subfields
const LOGIN_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    generatetoken(email: $email, password: $password) {
      data
      message
    }
  }
`;

// Login function with detailed error handling
export const login = async (email, password) => {
  console.log("Attempting to log in with email:", email);
  
  try {
    console.log("Sending GraphQL mutation with variables:", { email, password });
    
    const response = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      fetchPolicy: 'no-cache', // Bypass cache to ensure fresh request
    });
    
    console.log("Full GraphQL response:", JSON.stringify(response, null, 2));

    if (!response || !response.data) {
      console.error("Empty response or missing data object");
      return { success: false, message: "Empty response from server" };
    }
    
    if (!response.data.generatetoken) {
      console.error("Missing generatetoken in response data:", response.data);
      return { success: false, message: "Invalid response structure" };
    }

    const { data, message } = response.data.generatetoken;
    
    if (data) {
      // Parse the returned JSON data since it's now a scalar
      const userData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Store auth data in localStorage
      localStorage.setItem('token', userData.accessToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify({
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role
      }));
      
      return { success: true, message: message };
    }
    
    return { success: false, message: message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    
    // More detailed error inspection
    if (error.networkError) {
      console.error('Network error details:', error.networkError);
    }
    
    if (error.graphQLErrors) {
      console.error('GraphQL errors:', error.graphQLErrors);
    }
    
    return { 
      success: false, 
      message: error.message || 'Login failed. Please try again.'
    };
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get current user information
export const getCurrentUser = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  return userInfoStr ? JSON.parse(userInfoStr) : null;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
};
