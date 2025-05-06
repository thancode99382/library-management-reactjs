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
  query Topic($id: ID!) {
    topic(id: $id) {
      createdAt
      deletedAt
      id
      topicName
      updatedAt
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
  mutation RemoveTopic($id: ID!) {
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
    try {
      const { data } = await apolloClient.query({
        query: GET_TOPIC_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only'
      });
      return data.topic;
    } catch (error) {
      console.error(`Error fetching topic with ID ${id}:`, error);
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
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TOPIC,
        variables: { updateTopicInput: topicData }
      });
      return data.updateTopic;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  },

  deleteTopic: async (id) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_TOPIC,
        variables: { id }
      });
      return data.removeTopic;
    } catch (error) {
      console.error(`Error deleting topic with ID ${id}:`, error);
      throw error;
    }
  }
};