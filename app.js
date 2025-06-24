require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for EJS views
app.set('views', path.join(__dirname, 'views'));
// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Connect to the PostgreSQL database
db.connect()
  .then(() => {
    app.use(express.json()); // Parse JSON bodies

    // Import and use student-related routes (all start with /students)
    const studentRoutes = require('./routes/studentRoutes');
    app.use('/students', studentRoutes);
    
    app.get('/help', (req, res) => {
      res.render('help/help');  
    });

    // Import and use authentication routes (login, etc.)
    const authRoutes = require('./routes/authRoutes');
    app.use('/', authRoutes);

    // Import and use guardian-related routes
    const guardianRoutes = require('./routes/guardianRoutes');
    app.use('/', guardianRoutes);

    // Middleware to handle 404 Not Found errors
    app.use((req, res, next) => {
      res.status(404).send('Page not found');
    });

    // Middleware to handle internal server errors
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Server error');
    });

    // Start the server on the specified port (default: 3000)
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/login`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

