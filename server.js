const express = require('express');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express(); // Déclaration de l'objet app
const PORT = process.env.PORT || 3000;

// Remplace 'YOUR_OPENAI_API_KEY' par ta clé API OpenAI
const apiKey = process.env.OPENAI_API_KEY; // Load from environment variables

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route pour gérer les requêtes à l'API ChatGPT avec gestion de l'historique
app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt;
    const history = req.cookies.history ? JSON.parse(req.cookies.history) : [];
    const mood = req.cookies.mood || 'gentil'; // Valeur par défaut : gentil

    // Définir l'instruction système en fonction de l'humeur
    const moodInstruction =
        mood === 'hautain'
            ? "Réponds de manière hautaine et désagréable."
            : "Réponds de manière gentille et bienveillante.";

    // Ajouter l'instruction système au début de l'historique si nécessaire
    if (history.length === 0 || history[0].role !== "system") {
        history.unshift({ role: "system", content: moodInstruction });
    }

    // Ajouter le nouveau message utilisateur à l'historique
    history.push({ role: "user", content: prompt });

    try {
        // Appeler l'API OpenAI avec l'historique des messages
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: history
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Récupérer la réponse du bot
        const reply = response.data.choices[0].message.content;

        // Ajouter la réponse du bot à l'historique
        history.push({ role: "assistant", content: reply, mood });

        // Stocker l'historique mis à jour dans les cookies (avec expiration de 1 jour)
        res.cookie('history', JSON.stringify(history), { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

        // Envoyer la réponse au client, avec le mood
        res.json({ reply, mood });
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        res.status(500).send('Error communicating with OpenAI');
    }
});

// Route pour changer l'humeur
app.post('/api/mood', (req, res) => {
    const mood = req.body.mood; // 'gentil' ou 'hautain'
    if (mood !== 'gentil' && mood !== 'hautain') {
        return res.status(400).send('Humeur invalide.');
    }

    // Stocker l'humeur dans les cookies
    res.cookie('mood', mood, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.send(`Humeur changée à : ${mood}`);
});

// Route pour réinitialiser l'historique
app.post('/api/reset', (req, res) => {
    res.clearCookie('history');
    res.clearCookie('mood'); // Réinitialise également l'humeur
    res.send('Historique et humeur réinitialisés.');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
