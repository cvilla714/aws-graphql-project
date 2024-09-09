const { Pool } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

// AWS Secrets Manager configuration
const secret_name = 'aws-graphql-project-credentials'; // Use your secret name
const client = new SecretsManagerClient({ region: 'us-east-1' }); // Adjust region if necessary

let pool;

async function getSecretAndConnect() {
  try {
    const data = await client.send(new GetSecretValueCommand({ SecretId: secret_name }));

    let secret;
    if ('SecretString' in data) {
      secret = JSON.parse(data.SecretString); // Parse the secret JSON
    } else {
      let buff = new Buffer(data.SecretBinary, 'base64');
      secret = JSON.parse(buff.toString('ascii'));
    }

    // Create PostgreSQL connection pool using the retrieved secret values
    pool = new Pool({
      user: secret.DB_USER,
      host: secret.DB_HOST,
      database: secret.DB_NAME,
      password: secret.DB_PASSWORD,
      port: secret.DB_PORT,
    });

    pool.on('connect', () => {
      console.log('Connected to the PostgreSQL database');
    });

    module.exports = { pool };
  } catch (err) {
    console.error('Error retrieving secret from AWS Secrets Manager: ', err);
  }
}

// Call the async function to retrieve secrets and configure the pool
getSecretAndConnect();
