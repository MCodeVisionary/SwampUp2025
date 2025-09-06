let http = require('http');
let jwt = require('jsonwebtoken');


const decoded = jwt.verify(token, CONFIG.jwt_secret_key);

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  res.end('Hello from JFROG\n');
}).listen(1337, '127.0.0.1');