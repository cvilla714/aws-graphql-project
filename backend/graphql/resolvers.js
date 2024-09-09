const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'your_secret_key'; // Ensure this is secure
const saltRounds = 10; // Define the number of salt rounds for bcrypt

const resolvers = {
  Query: {
    users: async (_, __, { pool }) => {
      try {
        const res = await pool.query('SELECT * FROM users');
        console.log("Query result for users: ", res.rows); // Add log to track query results
        return res.rows;
      } catch (err) {
        console.error("Error fetching users: ", err);
        throw new Error('Unable to fetch users');
      }
    },
    photos: async (_, __, { pool }) => {
      try {
        const res = await pool.query('SELECT * FROM photos');
        console.log("Query result for photos: ", res.rows); // Add log to track query results
        return res.rows;
      } catch (err) {
        console.error("Error fetching photos: ", err);
        throw new Error('Unable to fetch photos');
      }
    },
  },
  Mutation: {
    // Register a new user
    addUser: async (_, { username, email, password }, { pool }) => {
      try {
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password: ", hashedPassword); // Add log for hashed password

        // Insert the new user into the database with the hashed password
        const res = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        console.log("New user inserted: ", res.rows[0]); // Add log for new user insertion
        return res.rows[0];
      } catch (err) {
        console.error("Error adding user: ", err);
        throw new Error('Error registering new user');
      }
    },

    // Upload a photo mutation
    uploadPhoto: async (_, { title, imgSrc }, { pool }) => {
      try {
        const res = await pool.query('INSERT INTO photos (title, imgSrc) VALUES ($1, $2) RETURNING *', [title, imgSrc]);
        console.log("New photo inserted: ", res.rows[0]); // Add log for new photo insertion
        return res.rows[0];
      } catch (err) {
        console.error("Error uploading photo: ", err);
        throw new Error('Error uploading photo');
      }
    },

    // User login mutation
    login: async (_, { username, password }, { pool }) => {
      try {
        // Debugging log to check pool availability
        console.log("Pool object: ", pool);  
        if (!pool) {
          throw new Error("Database pool not initialized.");
        }
        console.log("Login attempt for username: ", username);
        console.log("Password provided: ", password);

        // Check if the user exists
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log("Query result for database: ", res.rows);

        const user = res.rows[0];

        if (!user) {
          console.log("User not found");
          throw new Error('User not found');
        }

        // Compare the hashed password stored in the database with the one provided by the user
        const validPassword = await bcrypt.compare(password, user.password);
        console.log("Password validation result: ", validPassword);

        if (!validPassword) {
          console.log("Invalid credentials");
          throw new Error('Invalid credentials');
        }

        // Generate a token upon successful login
        const token = jwt.sign({ username: user.username, email: user.email }, secretKey, {
          expiresIn: '1h',
        });

        console.log("Login successful, token generated: ", token);

        return { token };
      } catch (err) {
        console.error("Error during login: ", err);
        throw new Error('Login failed');
      }
    },
  },
};

module.exports = resolvers;
