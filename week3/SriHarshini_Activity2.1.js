// Importing the 'http' module to create a server
const _http = require("http");

// Defining the hostname and port for the server
const hostname = "127.0.0.1"; // Localhost
const port = 8080; // Port number where the server will listen

// Create the server
_http
  .createServer((req, res) => {
    // Extract the pathname that requested
    const pathname = req.url;

    // Set the response header to inform the browser the content type is HTML
    res.setHeader("Content-Type", "text/html");

    // Check the requested pathname and respond accordingly
    if (pathname === "/" || pathname === "/home") {
      // If the pathname is '/' or '/home', send a 200 status and the Home page content
      res.statusCode = 200; // HTTP 200 OK
      res.end("<h1>Home</h1>"); // Response content for Home page
    } else if (pathname === "/about-us") {
      // If the pathname is '/about-us', send a 200 status and the About Us page content
      res.statusCode = 200; // HTTP 200 OK
      res.end("<h1>About Us</h1>"); // Response content for About Us page
    } else {
      // For any other pathname, send a 404 status and a Not Found page
      res.statusCode = 404; // HTTP 404 Not Found
      res.end("<h1>404 - Not Found</h1>"); // Response content for Not Found
    }
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
