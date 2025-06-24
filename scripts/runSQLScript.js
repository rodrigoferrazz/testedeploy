const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Create a new PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Function to run the SQL script
const runSQLScript = async () => {
  // Get the path to the init.sql file
  const filePath = path.join(__dirname, 'init.sql');
  // Read the SQL file content
  const sql = fs.readFileSync(filePath, 'utf8');

  try {
    // Execute the SQL script
    await pool.query(sql);
    console.log('SQL script executed successfully!');
  } catch (err) {
    console.error('Error executing SQL script:', err);
  } finally {
    // Close the database connection pool

    await pool.end();
  }
};

// Run the script
runSQLScript();

