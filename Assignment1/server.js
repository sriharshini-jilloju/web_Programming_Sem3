/**********************************************************************************

* ITE5315 – Assignment 1

* I declare that this assignment is my own work in accordance with Humber Academic Policy.

* No part of this assignment has been copied manually or electronically from any other source

* (including web sites) or distributed to other students. *

* Name: Sri Harshini Jilloju Student ID: N01649103 Date: Feb 20th, 2024 *

***********************************************************************************/
const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("./upload_middleware");
const { notFoundHandler, errorHandler } = require("./middleware");

const app = express();
const PORT = 3000;
const HOST = "127.0.0.1";  
const booksFile = "books.json";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const readBooks = () => {
    if (!fs.existsSync(booksFile)) {
        fs.writeFileSync(booksFile, "[]");
    }
    return JSON.parse(fs.readFileSync(booksFile));
};

const writeBooks = (data) => {
    fs.writeFileSync(booksFile, JSON.stringify(data, null, 2));
};

app.post("/api/create", (req, res) => {
    const { isbn, title, author, genre, description, published_year, status } = req.body;
    if (!isbn || !title || !author) {
        return res.status(400).json({ error: "ISBN, Title, and Author are required" });
    }

    let books = readBooks();
    if (books.find(book => book.isbn === isbn)) {
        return res.status(400).json({ error: "ISBN already exists" });
    }

    const newBook = { isbn, title, author, genre, description, published_year, status: status || "AVAILABLE" };
    books.push(newBook);
    writeBooks(books);

    res.status(201).json({ message: "Book added successfully", book: newBook });
});

app.get("/api/books", (req, res) => {
    const { q, status } = req.query;
    let books = readBooks();

    if (q) {
        books = books.filter(book => book.title.toLowerCase().includes(q.toLowerCase()));
    }
    if (status) {
        books = books.filter(book => book.status.toUpperCase() === status.toUpperCase());
    }

    res.json(books);
});


app.get("/api/books/:isbn", (req, res) => {
    const books = readBooks();
    const book = books.find(book => book.isbn === req.params.isbn);

    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
});

app.post("/api/upload/book-cover", upload.single("cover_image"), (req, res) => {
    console.log("Request Body:", req.body); 
    console.log("File Data:", req.file);  

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded or invalid file type" });
    }

    const { isbn } = req.body;
    const books = readBooks();
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books[bookIndex].cover_image = `/uploads/${req.file.filename}`;
    writeBooks(books);

    res.json({ message: "Cover image uploaded successfully", cover_image: books[bookIndex].cover_image });
});


// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
