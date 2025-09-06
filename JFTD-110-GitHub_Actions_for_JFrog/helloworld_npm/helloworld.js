// server.js
let http = require('http');
let jwt = require('jsonwebtoken');
const CONFIG = require('./config.json'); 

// Simulated user database
const User = {
  findOne: async ({ _id }) => {
    if (_id === "123") return { id: "123", name: "<b>Test User</b>" };
    return null;
  }
};

// Create HTTP server
http.createServer(async function (req, res) {
  try {
    // JWT authorization header
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      return res.end("No token provided");
    }

    const decoded = jwt.verify(token, CONFIG.jwt_secret_key);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      res.writeHead(422, { 'Content-Type': 'text/plain' });
      return res.end("No user found or token is incorrect");
    }

    // Any query string or URL path input is rendered directly in the response
    const nameFromQuery = new URL(req.url, `http://${req.headers.host}`).searchParams.get("name") || user.name;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Hello ${nameFromQuery} from JFROG</h1>`);

  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end("Error: " + err.message);
  }
}).listen(1337, '127.0.0.1', () => {
  console.log("Server running at http://127.0.0.1:1337/");
});
