// web/app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// smtp configuration

// Home route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Authentication App</h1><form action="/login" method="POST"><input type="text" name="username" placeholder="Username" required/><input type="password" name="password" placeholder="Password" required/><button type="submit">Login</button></form>');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.post('http://flask-app:5000/auth', { 
            username,
            password
        });

        if (response.data.authenticated) {
            req.session.user = username; // Store user in session
            res.redirect('/download'); // Redirect to dashboard on success
        } else {
            res.send('Authentication failed. Please try again.');
        }
    } catch (error) {
        console.error(error);
        res.send('Error during authentication.');
    }
});

// Route pour le téléchargement du fichier setup.exe
app.get('/download', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); // Redirect to home if not logged in
    }
    const filePath = path.join('app', 'GestionnaireLicences.zip'); // Chemin vers votre fichier setup.exe
    res.download(filePath, 'GestionnaireLicences.zip', (err) => {
        if (err) {
            console.error("Erreur lors du téléchargement :", err);
            res.status(500).send("Erreur lors du téléchargement du fichier.");
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

