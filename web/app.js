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
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application d'Authentification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #333;
                margin-bottom: 1.5rem;
            }
            form {
                display: flex;
                flex-direction: column;
            }
            input {
                margin-bottom: 1rem;
                padding: 0.5rem;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            button {
                background-color: #4CAF50;
                color: white;
                padding: 0.5rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Bienvenue sur l'Application d'Authentification</h1>
            <form action="/login" method="POST">
                <input type="text" name="username" placeholder="Nom d'utilisateur" required/>
                <input type="password" name="password" placeholder="Mot de passe" required/>
                <button type="submit">Se connecter</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.post('https://tp2p3-1.onrender.com/auth', { 
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

