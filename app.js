const express = require('express');
const path = require('path');
const app = express();
const pageRoutes = require('./routes/pageRoutes');

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set views folder for EJS templates
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like images and CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Use the routes defined in pageRoutes.js
app.use('/', pageRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});