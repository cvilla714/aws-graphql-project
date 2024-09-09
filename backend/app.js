const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); // Import cors
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { getSecretAndConnect } = require('./config/db'); // Import the async pool function
require('dotenv').config();

const app = express();

// Ensure that the request body is parsed as JSON
app.use(express.json());

// Add CORS middleware to allow requests from your frontend URL
app.use(cors({
  origin: 'http://52.91.7.221:3000', // Allow your frontend EC2 URL
  credentials: true // Allow cookies or credentials
}));

async function startServer() {
  // Wait for the pool to be initialized
  const pool = await getSecretAndConnect();
  
  if (!pool) {
    console.error('Database connection failed');
    process.exit(1); // Exit if there's no database connection
  }

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ pool }),
  });

  await server.start();
  server.applyMiddleware({ app });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('Error stack:', err.stack);  // Log the error stack trace
    res.status(500).send('Something went wrong!');
  });

  // Determine the correct URL based on the environment
  const PORT = 4000;
  const serverUrl =
    process.env.NODE_ENV === 'production'
      ? `http://52.91.7.221:${PORT}${server.graphqlPath}` // Production URL
      : `http://localhost:${PORT}${server.graphqlPath}`; // Development URL

  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at ${serverUrl}`));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
