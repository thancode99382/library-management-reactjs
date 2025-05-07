import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';

// GraphQL Queries
export const GET_TOPICS = gql`
  query Topics {
    topics {
      createdAt
      deletedAt
      id
      topicName
      updatedAt
    }
  }
`;

export const GET_TOPIC_BY_ID = gql`
  query Topic($id: Int!) {
    topic(id: $id) {
      createdAt
        deletedAt
        id
        topicName
        updatedAt
        detailTopics {
            createdAt
            deletedAt
            id
            name
            updatedAt
        }
    }
  }
`;

// GraphQL Mutations
export const CREATE_TOPIC = gql`
  mutation CreateTopic($createTopicInput: CreateTopicInput!) {
    createTopic(createTopicInput: $createTopicInput) {
      createdAt
      deletedAt
      id
      topicName
      updatedAt
    }
  }
`;

export const UPDATE_TOPIC = gql`
  mutation UpdateTopic($updateTopicInput: UpdateTopicInput!) {
    updateTopic(updateTopicInput: $updateTopicInput) {
      createdAt
      deletedAt
      id
      topicName
      updatedAt
    }
  }
`;

export const DELETE_TOPIC = gql`
  mutation RemoveTopic($id: Int!) {
    removeTopic(id: $id) {
      createdAt
      deletedAt
      id
      topicName
      updatedAt
    }
  }
`;

// Service functions
export const topicService = {
  getTopics: async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_TOPICS,
        fetchPolicy: 'network-only'
      });
      return data.topics;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },

  getTopicById: async (id) => {
    console.log("Original id received:", id, "Type:", typeof id);
    try {
      // Convert the id to an integer since the GraphQL schema expects Int type
      const topicId = parseInt(id, 10);
      
      // Check if id is valid
      if (isNaN(topicId)) {
        throw new Error('Invalid topic ID provided - must be a valid integer');
      }
      
      console.log("Sending request with topic ID:", topicId, "Type:", typeof topicId);
      
      const { data } = await apolloClient.query({
        query: GET_TOPIC_BY_ID,
        variables: { id: topicId }, // Ensure this is a number, not a string
        fetchPolicy: 'no-cache' // Use no-cache to avoid caching issues
      });
      
      if (!data || !data.topic) {
        console.log("No topic data returned for ID:", topicId);
        throw new Error(`Topic with ID ${topicId} not found`);
      }
      
     
      return data.topic;
    } catch (error) {
      console.error(`Error fetching topic with ID ${id}:`, error);
      
      // Enhanced error logging
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", JSON.stringify(error.graphQLErrors, null, 2));
      }
      if (error.networkError) {
        console.error("Network Error details:", error.networkError);
        if (error.networkError.result) {
          console.error("Server response:", JSON.stringify(error.networkError.result, null, 2));
        }
      }
      
      throw error;
    }
  },

  createTopic: async (topicData) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TOPIC,
        variables: { createTopicInput: topicData }
      });
      return data.createTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  },

  updateTopic: async (topicData) => {
    try {
      // Create a copy of the data to avoid mutating the original
      const processedData = { ...topicData };
      
      // Convert id to integer if it exists
      if (processedData.id !== undefined) {
        processedData.id = parseInt(processedData.id, 10);
        
        // Check if conversion was successful
        if (isNaN(processedData.id)) {
          throw new Error('Invalid topic ID provided - must be a valid integer');
        }
        
        console.log("Sending updateTopic with id:", processedData.id, "Type:", typeof processedData.id);
      }
      
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TOPIC,
        variables: { updateTopicInput: processedData }
      });
      return data.updateTopic;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  },

  deleteTopic: async (id) => {
    try {
      // Convert the id to an integer since the GraphQL schema expects Int type
      const topicId = parseInt(id, 10);
      
      // Check if id is valid
      if (isNaN(topicId)) {
        throw new Error('Invalid topic ID provided - must be a valid integer');
      }
      
      console.log("Deleting topic with ID:", topicId, "Type:", typeof topicId);
      
      const { data } = await apolloClient.mutate({
        mutation: DELETE_TOPIC,
        variables: { id: topicId }
      });
      return data.removeTopic;
    } catch (error) {
      console.error(`Error deleting topic with ID ${id}:`, error);
      throw error;
    }
  }
};