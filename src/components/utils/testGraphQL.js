// Test script to debug GraphQL connection issues
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import fetch from 'cross-fetch';

// Test by running this file directly with Node: node testGraphQL.js

// Standalone GraphQL test function that can be run separately
async function testGraphQLConnection() {
  console.log("🔍 Testing GraphQL connection to: http://localhost:3000/graphql");
  
  // Simple test query - just checking if the server responds
  const testQuery = {
    query: `
      mutation TestLogin($email: String!, $password: String!) {
        generatetoken(email: $email, password: $password) {
          message
        }
      }
    `,
    variables: {
      email: "admin123@gmail.com",
      password: "admin123"
    }
  };

  try {
    // Raw fetch approach to bypass Apollo client
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testQuery),
    });

    console.log("📊 HTTP Status:", response.status);
    console.log("📋 HTTP Headers:", response.headers);
    
    if (!response.ok) {
      console.error("❌ Error response:", response.statusText);
      const errorText = await response.text();
      console.error("📝 Error details:", errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ GraphQL Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
  }
}

// Export for use in browser
export { testGraphQLConnection };

// If running directly with Node
if (typeof window === 'undefined') {
  testGraphQLConnection();
}