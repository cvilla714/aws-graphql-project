const { Pool } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Load .env file locally
}

let pool;

async function getSecretAndConnect() {
  if (process.env.NODE_ENV !== 'production') {
    // Use local .env file for testing
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  } else {
    try {
      const secret_name = 'aws-graphql-project-credentials';
      const client = new SecretsManagerClient({ region: 'us-east-1' });
      const data = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));

      let secret;
      if ('SecretString' in data) {
        secret = JSON.parse(data.SecretString);
      } else {
        let buff = new Buffer(data.SecretBinary, 'base64');
        secret = JSON.parse(buff.toString('ascii'));
      }

      pool = new Pool({
        user: secret.DB_USER,
        host: secret.DB_HOST,
        database: secret.DB_NAME,
        password: secret.DB_PASSWORD,
        port: secret.DB_PORT,
      });
    } catch (err) {
      console.error('Error retrieving secret from AWS Secrets Manager: ', err);
    }
  }

  pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
  });

  module.exports = { pool };
}

getSecretAndConnect();
