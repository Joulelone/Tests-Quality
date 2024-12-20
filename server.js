const express = require('express');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express(); // Déclaration de l'objet app
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Chatbot routes
app.post('/api/chat', async (req, res) => {
    const prompt = req.body.prompt;
    if (!prompt || prompt.trim() === '') {
        return res.status(400).send('Prompt cannot be empty.');
    }
    const history = req.cookies.history ? JSON.parse(req.cookies.history) : [];
    const mood = req.cookies.mood || 'gentil'; // Valeur par défaut : gentil

    const moodInstruction =
        mood === 'hautain'
            ? "Réponds de manière hautaine et désagréable."
            : "Réponds de manière gentille et bienveillante.";

    if (history.length === 0 || history[0].role !== "system") {
        history.unshift({ role: "system", content: moodInstruction });
    }

    history.push({ role: "user", content: prompt });

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: history
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;
        history.push({ role: "assistant", content: reply, mood });

        res.cookie('history', JSON.stringify(history), { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.json({ reply, mood });
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        res.status(500).send('Error communicating with OpenAI');
    }
});

app.post('/api/mood', (req, res) => {
    const mood = req.body.mood;
    if (mood !== 'gentil' && mood !== 'hautain') {
        return res.status(400).send('Humeur invalide.');
    }
    res.cookie('mood', mood, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.send(`Humeur changée à : ${mood}`);
});

app.post('/api/reset', (req, res) => {
    res.clearCookie('history');
    res.clearCookie('mood'); // This clears the mood cookie
    res.status(200).send('Historique et humeur réinitialisés.');
});

// Only start the server in non-test environments
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Chatbot is running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;
