import { gql } from '@apollo/client';
import { apolloClient } from './apolloClient';

// GraphQL Queries
export const GET_TOPIC_DETAILS = gql`
  query DetailTopics {
    detailTopics {
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
`;

export const GET_TOPIC_DETAIL_BY_ID = gql`
  query DetailTopic($id: ID!) {
    detailTopic(id: $id) {
      createdAt
      deletedAt
      id
      name
      updatedAt
      topic {
        id
        topicName
      }
    }
  }
`;

export const GET_TOPIC_DETAILS_BY_TOPIC_ID = gql`
  query DetailTopicsByTopicId($topicId: ID!) {
    detailTopicsByTopicId(topicId: $topicId) {
      createdAt
      deletedAt
      id
      name
      updatedAt
      topic {
        id
        topicName
      }
    }
  }
`;

// GraphQL Mutations
export const CREATE_TOPIC_DETAIL = gql`
  mutation CreateDetailTopic($createDetailTopicInput: CreateDetailTopicInput!) {
    createDetailTopic(createDetailTopicInput: $createDetailTopicInput) {
      createdAt
      deletedAt
      id
      name
      updatedAt
    }
  }
`;

export const UPDATE_TOPIC_DETAIL = gql`
  mutation UpdateDetailTopic($updateDetailTopicInput: UpdateDetailTopicInput!) {
    updateDetailTopic(updateDetailTopicInput: $updateDetailTopicInput) {
      createdAt
      deletedAt
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_TOPIC_DETAIL = gql`
  mutation RemoveDetailTopic($id: ID!) {
    removeDetailTopic(id: $id) {
      createdAt
      deletedAt
      id
      name
      updatedAt
    }
  }
`;

// Service functions
export const topicDetailService = {
  getTopicDetails: async () => {
    try {
      const { data } = await apolloClient.query({
        query: GET_TOPIC_DETAILS,
        fetchPolicy: 'network-only'
      });
      return data.detailTopics;
    } catch (error) {
      console.error('Error fetching topic details:', error);
      throw error;
    }
  },

  getTopicDetailById: async (id) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_TOPIC_DETAIL_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only'
      });
      return data.detailTopic;
    } catch (error) {
      console.error(`Error fetching topic detail with ID ${id}:`, error);
      throw error;
    }
  },

  getTopicDetailsByTopicId: async (topicId) => {


   
    try {
      if (!topicId) {
        console.error('Invalid topicId provided:', topicId);
        return [];
      }
      
      // Always convert topicId to string to ensure consistent type for GraphQL ID
      const formattedTopicId = String(topicId);
      
      const { data } = await apolloClient.query({
        query: GET_TOPIC_DETAILS_BY_TOPIC_ID,
        variables: { topicId: formattedTopicId },
        fetchPolicy: 'network-only'
      });
      return data.detailTopicsByTopicId || [];
    } catch (error) {
      console.error(`Error fetching topic details for topic ID ${topicId}:`, error);
      // Return empty array instead of throwing to prevent UI breakage
      return [];
    }
  },

  createTopicDetail: async (detailData) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_TOPIC_DETAIL,
        variables: { createDetailTopicInput: detailData }
      });
      return data.createDetailTopic;
    } catch (error) {
      console.error('Error creating topic detail:', error);
      throw error;
    }
  },

  updateTopicDetail: async (detailData) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_TOPIC_DETAIL,
        variables: { updateDetailTopicInput: detailData }
      });
      return data.updateDetailTopic;
    } catch (error) {
      console.error('Error updating topic detail:', error);
      throw error;
    }
  },

  deleteTopicDetail: async (id) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_TOPIC_DETAIL,
        variables: { id }
      });
      return data.removeDetailTopic;
    } catch (error) {
      console.error(`Error deleting topic detail with ID ${id}:`, error);
      throw error;
    }
  }
};