/**********************************************************************************
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name:
Jilloju Sri Harshini
Student ID:
N01649103
Date:
7th March, 2025
*
***********************************************************************************/
const express = require("express");
const hostname = "127.0.0.1";
const port = "8080";
const app = express();
const fs = require("fs");
const express_hbs = require("express-handlebars");
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const hbs = express_hbs.create({
    extname: ".hbs",
    defaultLayout: 'main',
});

hbs.handlebars.registerHelper('eq', function (a, b) {
    return a.toLowerCase() === b.toLowerCase();
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Book list
app.get("/books", (req, res) => {
    const book_data = fs.existsSync("./books.json") ? JSON.parse(fs.readFileSync("./books.json", "utf-8")) : [];
    let filter_books = book_data;
    const { q } = req.query;

    if (q) {
        filter_books = filter_books.filter(book_data => book_data.title.toLowerCase().includes(q.toLowerCase().trim()));
    }

    const booksWithplaceholder = filter_books.map(book => ({
        ...book,
        cover_image: book.cover_image || '/uploads/placeholder.jpg',
        status: book.status.toLowerCase()
    }));

    res.render('pages/book-list', {
        books: booksWithplaceholder,
        query: q || " ",
        placeholderImage: '/uploads/placeholder.jpg'
    });
});

// Add book
app.get('/books/create', (req, res) => {
    res.render('pages/add-book');
});

// Book details
app.get("/books/:isbn", (req, res) => {
    const book_data = fs.existsSync("./books.json") ? JSON.parse(fs.readFileSync("./books.json", "utf-8")) : [];

    const book = book_data.find(b => {
        const isbnFromParam = req.params.isbn && req.params.isbn.trim();
        const isbnFromData = b.isbn && b.isbn.trim();
        return isbnFromParam === isbnFromData;
    });

    if (!book) return res.status(404).render("pages/error", { message: "Book with the following ISBN is not found" });

    const booksWithplaceholder = {
        ...book,
        cover_image: book.cover_image || '/uploads/placeholder.jpg',
        status: book.status.toLowerCase()
    };

    res.render('pages/book-details', {
        book: booksWithplaceholder,
        placeholderImage: '/uploads/placeholder.jpg'
    });
});

// Create book
app.post('/api/books/create', (req, res) => {
    const { isbn, title, author, genre, description, published_year, status } = req.body;

    if (!isbn || !title || !author) {
        return res.status(400).render("pages/add-book", { error: 'isbn,title,author are required fields' });
    }

    const book_data = fs.existsSync("./books.json") ? JSON.parse(fs.readFileSync("./books.json", "utf-8")) : [];

    const new_book = { isbn, title, author, genre, description, published_year, status };
    book_data.push(new_book);

    fs.writeFileSync("./books.json", JSON.stringify(book_data, null, 2));

    res.redirect('/books');
});

// Edit book
app.get('/books/:isbn/edit', (req, res) => {
    const book_data = fs.existsSync("./books.json") ? JSON.parse(fs.readFileSync("./books.json", "utf-8")) : [];

    const book = book_data.find(b => {
        const isbnFromParam = req.params.isbn && req.params.isbn.trim();
        const isbnFromData = b.isbn && b.isbn.trim();
        return isbnFromParam === isbnFromData;
    });

    if (!book) return res.status(404).json({ error: "Book with the following ISBN is not found" });

    res.render('pages/edit-books', { book });
});

// Update book
app.put('/api/books/:isbn/edit', (req, res) => {
    const { title, author, genre, description, publication_year, status } = req.body;

    const isbn = req.params.isbn.trim();

    if (!title || !author) {
        return res.status(400).render("pages/edit-books", { error: 'title,author are required fields' });
    }

    const book_data = fs.existsSync("./books.json") ? JSON.parse(fs.readFileSync("./books.json", "utf-8")) : [];

    const bookIndex = book_data.findIndex(b => {
        const isbnFromData = b.isbn && b.isbn.trim();
        return isbnFromData === isbn;
    });

    if (bookIndex === -1) {
        return res.status(400).render("pages/error", { message: "Book not found" });
    }

    book_data[bookIndex] = { ...book_data[bookIndex], title, author, genre, description, publication_year, status };

    fs.writeFileSync("./books.json", JSON.stringify(book_data, null, 2));

    res.redirect(`/books/${isbn}`);
});

// Error Handling
app.use((req, res) => {
    res.status(404).render("pages/error", { message: "404 - Page Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("pages/error", { message: "500 - Internal server error. Please Try Again" });
});

app.listen(port, hostname, () => {
    console.log(`Server running on ${hostname}:${port}`);
});
