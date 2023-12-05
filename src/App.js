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

app.get('/logout', (req, res) => {
    // Add your logic here to clear the user's session or authentication details
    res.redirect('/login'); // Redirect to the login page after logout
});

// POST Routes for handling form submissions
app.post('/register', (req, res) => {
    // Handle registration logic here
    // Redirect after successful registration
});

app.post('/login', (req, res) => {
    // Handle login logic here
    // On successful login, redirect to a specific page
});
app.post('/logout', (req, res) => {
    // Logic to clear the user's session or authentication details
    res.json({ message: 'Logged out successfully' });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
