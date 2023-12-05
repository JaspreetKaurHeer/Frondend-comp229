const express = require('express');
const app = express();
const port = 3001;

// In-memory user store with a predefined user
let users = [
    { username: "testuser", password: "testpassword" }
];

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

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

// POST Routes
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    // Check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    // Add new user
    users.push({ username, password });
    res.json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if user exists and password matches
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});




app.post('/logout', (req, res) => {
    // Logic to clear the user's session or authentication details
    res.json({ message: 'Logged out successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
