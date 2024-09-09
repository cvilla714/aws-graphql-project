const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'your_secret_key'; // Ensure this is secure
const saltRounds = 10; // Define the number of salt rounds for bcrypt

const resolvers = {
  Query: {
    users: async (_, __, { pool }) => {
      const res = await pool.query('SELECT * FROM users');
      return res.rows;
    },
    photos: async (_, __, { pool }) => {
      const res = await pool.query('SELECT * FROM photos');
      return res.rows;
    },
  },
  Mutation: {
    // Register a new user
    addUser: async (_, { username, email, password }, { pool }) => {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database with the hashed password
      const res = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);

      return res.rows[0];
    },

    // Upload a photo mutation
    uploadPhoto: async (_, { title, imgSrc }, { pool }) => {
      const res = await pool.query('INSERT INTO photos (title, imgSrc) VALUES ($1, $2) RETURNING *', [title, imgSrc]);
      return res.rows[0];
    },

    // User login mutation
    login: async (_, { username, password }, { pool }) => {
      // Check if the user exists
      const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = res.rows[0];

      if (!user) {
        throw new Error('User not found');
      }

      // Compare the hashed password stored in the database with the one provided by the user
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate a token upon successful login
      const token = jwt.sign({ username: user.username, email: user.email }, secretKey, {
        expiresIn: '1h',
      });

      return { token };
    },
  },
};

module.exports = resolvers;
