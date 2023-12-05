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
app.get('/register',(req, res) => {
    res.render('register');
});
app.get('/login',(req, res) => {
    res.render('login');
});
app.get('/logout', (req, res) => {
    // Logic to destroy session or clear authentication
    res.redirect('/index'); // Redirect to the index page after logout
});

app.get('/logout',(req, res) => {
    res.render('logout'); // This line is trying to render a view named 'logout'
});

// POST Routes
app.post('/register', (req, res) => {
    // Handle registration logic
    // Redirect after successful registration
});

app.post('/login', (req, res) => {
    // Handle login logic
    // On successful login, redirect to home or another page
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
