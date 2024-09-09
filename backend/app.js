const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { pool } = require('./config/db');
require('dotenv').config();

const app = express();

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ pool }),
});

server.start().then(() => {
  server.applyMiddleware({ app });

  // Determine the correct URL based on the environment
  const PORT = 4000;
  const serverUrl =
    process.env.NODE_ENV === 'production'
      ? `http://52.91.7.221:${PORT}${server.graphqlPath}` // Production URL (change to EC2 IP or domain)
      : `http://localhost:${PORT}${server.graphqlPath}`; // Development URL

  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at ${serverUrl}`));
});
