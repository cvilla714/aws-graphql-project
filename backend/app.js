const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload'); // Ensure this is correct
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { getSecretAndConnect } = require('./config/db'); 
require('dotenv').config();

const app = express();

// Use the graphql-upload middleware for handling uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }));

// Add CORS middleware to allow requests from your frontend
app.use(cors({
  origin: 'http://54.83.91.201:3000', 
  credentials: true,
}));

async function startServer() {
  const pool = await getSecretAndConnect();

  if (!pool) {
    console.error('Database connection failed');
    process.exit(1);
  }

  // Set up Apollo Server with schema, resolvers, and context
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ pool }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack); 
    res.status(500).send('Something went wrong!');
  });

  const PORT = 4000;
  const serverUrl = process.env.NODE_ENV === 'production'
    ? `http://54.83.91.201:${PORT}${server.graphqlPath}`
    : `http://localhost:${PORT}${server.graphqlPath}`;

  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at ${serverUrl}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
