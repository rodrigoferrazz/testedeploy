// Import the Pool class from the 'pg' package to connect to PostgreSQL
const { Pool } = require('pg');
// Load environment variables from the .env file
require('dotenv').config();

// Check if the connection should use SSL, based on the environment variable
const isSSL = process.env.DB_SSL === 'true';

// Create a new connection pool with database settings from .env
const pool = new Pool({
  user: process.env.DB_USER,         // Database user
  host: process.env.DB_HOST,         // Database host
  database: process.env.DB_DATABASE, // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT,         // Database port
  ssl: isSSL ? { rejectUnauthorized: false } : false, // SSL configuration
});

// Export two methods:
// - query: to execute SQL queries
// - connect: to manually get a connection
module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};