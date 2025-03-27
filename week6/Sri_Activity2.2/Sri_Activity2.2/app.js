const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials')  // Ensure partials are registered
}));
app.set('view engine', 'hbs');

// Sample data
const data = [
  { name: 'Item 1', description: 'This is item 1' },
  { name: 'Item 2', description: 'This is item 2' },
  { name: 'Item 3', description: 'This is item 3' }
];

// Routes
app.get('/', (req, res) => {
  res.render('pages/home', { items: data });
});

app.get('/about-us', (req, res) => {
  res.render('pages/about-us');
});

app.get('/contact-us', (req, res) => {
  res.render('pages/contact-us');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
