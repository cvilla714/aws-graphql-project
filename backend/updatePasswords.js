const bcrypt = require('bcrypt');
const { Pool } = require('pg'); // Assuming you're using 'pg' to connect to PostgreSQL
require('dotenv').config(); // Load environment variables

const saltRounds = 10;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const updatePasswords = async () => {
  const usersToUpdate = [
    { username: 'cosmel', newPassword: process.env.CHANGE_PASSWORD1 }, // Replace 'password' with the new password you want to set
    { username: 'armando', newPassword: process.env.CHANGE_PASSWORD2 },
  ];

  for (const user of usersToUpdate) {
    try {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(user.newPassword, saltRounds);

      // Update the database with the hashed password
      await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, user.username]);

      console.log(`Password updated for user: ${user.username}`);
    } catch (error) {
      console.error(`Error updating password for ${user.username}:`, error);
    }
  }

  pool.end(); // Close the database connection
};

updatePasswords();
