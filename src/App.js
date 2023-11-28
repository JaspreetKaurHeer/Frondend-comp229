const express = require('express');
const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
