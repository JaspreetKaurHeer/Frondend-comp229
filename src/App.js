const express = require('express');
const app = express();
const port = 3001;

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// GET Routes
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
