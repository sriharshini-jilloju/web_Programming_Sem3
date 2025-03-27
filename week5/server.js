const express = require("express");
const upload = require("./upload-middleware"); // File Upload Middleware
const auth = require("./auth-middleware"); // Authentication Middleware

const hostname = "127.0.0.1";
const port = 8084;

const app = express();

//  Middleware to log requests
app.use((req, res, next) => {
    console.log(`IP: ${req.ip} | Method: ${req.method} | Route: ${req.originalUrl}`);
    next();
});

//  Middleware to parse JSON & URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Route to submit car data (Protected with `auth`)
app.post("/api/create", auth, upload.single("image"), (req, res) => {
    console.log(req.body);
    res.json({ message: "People data received successfully!", data: req.body });
});

//  Route for image upload
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});
//  Middleware to handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

//  Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

//  Start Server
app.listen(port, hostname, () => {
    console.log(`🚀 Server running on http://${hostname}:${port}`);
});
