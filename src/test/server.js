// server.js (Handles secure API calls and AI requests)

// Load environment variables from a .env file (for secret keys)
require('dotenv').config(); 
// Import necessary packages
const express = require('express'); // For creating the server
const axios = require('axios');   // For making HTTP requests to other APIs
const cors = require('cors');     // To allow the frontend to communicate with this server

const app = express(); // Create a new Express server application
const port = 3000;     // The server will run on port 3000

// --- Middleware ---
app.use(cors()); // Allow requests from any origin (your PHP site)
app.use(express.static(__dirname)); // Serve static files like CSS and JS from the main directory

// === API Endpoints ===

// This endpoint is for the weather widget on your main page
app.get('/weather', async (req, res) => {
    // ... (This logic remains the same) ...
});

// This endpoint is for the AI weather advice on your main page
app.get('/generate-weather-advice', async (req, res) => {
    // ... (This logic remains the same) ...
});


// --- NEW ENDPOINTS FOR GARBAGE RULES PAGE ---

// Endpoint 1: Gets a city name from geographic coordinates (latitude, longitude)
app.get('/get-city-from-coords', async (req, res) => {
    try {
        const { lat, lon } = req.query; // Get lat and lon from the frontend request
        const apiKey = process.env.WEATHER_API_KEY; // Use the weather API key for this
        if (!apiKey) throw new Error("WEATHER_API_KEY is not configured.");

        // Use OpenWeatherMap's 'reverse geocoding' feature
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        // Send back just the city name
        res.json({ city: response.data.name });

    } catch (error) {
        console.error("Reverse Geocoding Error:", error.message);
        res.status(500).json({ message: 'Could not determine city from location.' });
    }
});

// Endpoint 2: Generates garbage rules for a specific city using AI
app.get('/generate-garbage-rules', async (req, res) => {
    try {
        const { city, lang } = req.query; // Get the city and language from the frontend
        const geminiApiKey = process.env.GEMINI_API_KEY; // Get the AI API key
        if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not configured.");

        // Prepare the instruction for the AI based on the selected language
        let languageInstruction = "Provide the response in clear, simple English.";
        if (lang === 'ja') languageInstruction = "Provide the response in natural, easy-to-understand Japanese.";
        if (lang === 'zh') languageInstruction = "Provide the response in clear, standard Mandarin Chinese.";

        // This is the detailed instruction (prompt) we send to the AI
        const prompt = `Act as a helpful guide for a foreigner in Japan. For the city of "${city}, Japan", provide a simple, bulleted list of the most important garbage disposal rules.
        Include:
        - The general collection days for 'Burnable' (燃えるゴミ), 'Non-burnable' (燃えないゴミ), and 'Recyclables' (資源ごみ). If specific days aren't known, give a typical example (e.g., 'Burnable: Mon & Thu').
        - A brief, one-sentence explanation for each of the 5 essential rules: schedule, bags, cleaning, location, and time.
        - Format the response clearly using markdown for bullet points.
        - ${languageInstruction}`;
        
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        // Send the request to the Gemini AI API
        const response = await axios.post(geminiApiUrl, payload, { headers: { 'Content-Type': 'application/json' } });

        // Extract the text from the AI's response
        const rulesText = response.data.candidates[0].content.parts[0].text;
        // Send the AI-generated text back to the frontend
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
