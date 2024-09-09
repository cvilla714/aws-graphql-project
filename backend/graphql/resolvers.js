const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'your_secret_key'; // Ensure this is secure
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// Initialize S3 client
const s3 = new S3Client({ region: 'us-east-1' });

const resolvers = {
  Query: {
    users: async (_, __, { pool }) => {
      try {
        const res = await pool.query('SELECT * FROM users');
        return res.rows;
      } catch (err) {
        console.error('Error fetching users: ', err);
        throw new Error('Unable to fetch users');
      }
    },
    photos: async (_, __, { pool }) => {
      try {
        const res = await pool.query('SELECT * FROM photos');
        return res.rows;
      } catch (err) {
        console.error('Error fetching photos: ', err);
        throw new Error('Unable to fetch photos');
      }
    },
  },
  Mutation: {
    addUser: async (_, { username, email, password }, { pool }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const res = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        return res.rows[0];
      } catch (err) {
        console.error('Error adding user: ', err);
        throw new Error('Error registering new user');
      }
    },

    login: async (_, { username, password }, { pool }) => {
      try {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = res.rows[0];

        if (!user) {
          throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, secretKey, {
          expiresIn: '1h',
        });

        return { token };
      } catch (err) {
        console.error('Error during login: ', err);
        throw new Error('Login failed');
      }
    },

    // Mutation for uploading image to S3
    uploadImage: async (_, { file, userId }, { pool }) => {
      const { filename, mimetype, createReadStream } = await file;

      // Stream the file
      const fileStream = createReadStream();
      const bucketName = 'devkc-portfolio-dev'; // Replace with your S3 bucket name

      // Define S3 upload parameters
      const uploadParams = {
        Bucket: bucketName,
        Key: filename, // The name of the file in the bucket
        Body: fileStream,
        ContentType: mimetype,
      };

      try {
        // Upload the file to S3
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('File uploaded successfully', data);

        // Create S3 URL
        const s3Url = `https://${bucketName}.s3.amazonaws.com/${filename}`;

        // Insert into the 'images' table
        const res = await pool.query('INSERT INTO images (user_id, image_url, created_at) VALUES ($1, $2, NOW()) RETURNING *', [userId, s3Url]);

        return {
          url: s3Url,
          message: 'Image uploaded successfully!',
        };
      } catch (err) {
        console.error('Error uploading image to S3: ', err);
        throw new Error('Error uploading image to S3');
      }
    },
  },
};

module.exports = resolvers;
