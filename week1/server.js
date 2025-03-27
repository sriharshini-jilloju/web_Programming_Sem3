const http = require('http'); // Import the HTTP module
 const hostname = '127.0.0.1';// Localhost address
const port = 3000; // Port number

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200; // Set the response status to 'OK' (200)
  res.setHeader('Content-Type', 'text/plain'); // Set the response content type to plain text
  res.end('Hello World\n'); // Send the 'Hello World' message as the response
});

// Make the server listen on the specified port and hostname
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`); // Log the server URL to the console
});
