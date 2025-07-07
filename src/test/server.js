// server.js (Handles secure API calls and AI requests)

require('dotenv').config(); 
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// --- Initial Check for API Keys ---
// Check if the required API keys are present in the .env file when the server starts.
if (!process.env.WEATHER_API_KEY) {
    console.error("FATAL ERROR: WEATHER_API_KEY is not defined in your .env file.");
    process.exit(1); // Stop the server if the key is missing.
}
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
    process.exit(1); // Stop the server if the key is missing.
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

// === API Endpoints ===

// Endpoint for the weather widget on index.php
app.get('/weather', async (req, res) => {
    try {
        const { city } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        const statusCode = error.response ? error.response.status : 500;
        const errorMessage = error.response ? error.response.data.message : "Error fetching weather data.";
        console.error("Weather Endpoint Error:", errorMessage);
        res.status(statusCode).json({ message: errorMessage });
    }
});

// Endpoint for the AI weather advice on index.php
app.get('/generate-weather-advice', async (req, res) => {
    try {
        const { city, weather, temp, lang } = req.query;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        let languageInstruction = "Respond in a single sentence in English only.";
        if (lang === 'ja') languageInstruction = "Respond in a single sentence in Japanese only.";
        if (lang === 'zh') languageInstruction = "Respond in a single sentence in Chinese only.";

        const prompt = `You are a friendly travel assistant for a website called 'Japan Life Manual'. Give a very short, helpful, and friendly travel advice for someone currently in ${city}, Japan. The current weather is '${weather}' with a temperature of ${temp}°C. ${languageInstruction}`;
        
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await axios.post(geminiApiUrl, payload, { headers: { 'Content-Type': 'application/json' } });
        
        const adviceText = response.data.candidates[0].content.parts[0].text;
        res.json({ advice: adviceText });
    } catch (error) {
        console.error("AI Weather Advice Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Could not generate AI advice.' });
    }
});

// Endpoint to get city name from coordinates for garbage_rules.php
app.get('/get-city-from-coords', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        res.json({ city: response.data.name });
    } catch (error) {
        console.error("Reverse Geocoding Error:", error.message);
        res.status(500).json({ message: 'Could not determine city from location.' });
    }
});

// Endpoint to get AI garbage rules for garbage_rules.php
app.get('/generate-garbage-rules', async (req, res) => {
    try {
        const { city, lang } = req.query;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        let languageInstruction = "Provide the response in clear, simple English.";
        if (lang === 'ja') languageInstruction = "Provide the response in natural, easy-to-understand Japanese.";
        if (lang === 'zh') languageInstruction = "Provide the response in clear, standard Mandarin Chinese.";

        const prompt = `Act as a helpful guide for a foreigner in Japan. For the city of "${city}, Japan", provide a simple, bulleted list of the most important garbage disposal rules. Include: general collection days for 'Burnable', 'Non-burnable', and 'Recyclables'. If specific days aren't known, give a typical example (e.g., 'Burnable: Mon & Thu'). Also include a brief, one-sentence explanation for each of the 5 essential rules: schedule, bags, cleaning, location, and time. Format the response clearly using markdown for bullet points. ${languageInstruction}`;
        
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await axios.post(geminiApiUrl, payload, { headers: { 'Content-Type': 'application/json' } });

        const rulesText = response.data.candidates[0].content.parts[0].text;
        res.json({ rules: rulesText });
    } catch (error) {
        console.error("Garbage Rules AI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Could not generate garbage rules.' });
    }
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Node.js proxy server is running at http://localhost:${port}`);
});
