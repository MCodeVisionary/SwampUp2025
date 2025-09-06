// server.js
const express = require('express');
const { protect } = require('./authMiddleware');
const CONFIG = require('./config');

const app = express();

// A simple function to escape HTML to prevent XSS attacks
const escapeHtml = (unsafe) => {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Define a route. The `protect` middleware runs first.
// If the token is valid, the user will be attached to `req.user`.
app.get('/', protect, (req, res) => {
  // Get the name from the query string OR the authenticated user's name
  const nameFromQuery = req.query.name || req.user.name;

  // IMPORTANT: Sanitize the output to prevent XSS
  const safeName = escapeHtml(nameFromQuery);

  res.status(200).send(`<h1>Hello ${safeName} from JFROG</h1>`);
});

// Start the server
app.listen(CONFIG.port, () => {
  console.log(`Server running at http://127.0.0.1:${CONFIG.port}/`);
});