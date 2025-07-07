// server.js (Handles secure API calls and AI requests)

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// --- Initial Check for API Keys ---
if (!process.env.WEATHER_API_KEY) {
    console.error("FATAL ERROR: WEATHER_API_KEY is not defined in your .env file.");
    process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
    process.exit(1);
}
// NEW: Check for Google Search keys
if (!process.env.Google_Search_API_KEY) {
    console.error("FATAL ERROR: Google Search_API_KEY is not defined in your .env file.");
    process.exit(1);
}
if (!process.env.SEARCH_ENGINE_ID) {
    console.error("FATAL ERROR: SEARCH_ENGINE_ID is not defined in your .env file.");
    process.exit(1);
}


const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

// === API Endpoints ===

// [Your existing /weather, /generate-weather-advice, /get-city-from-coords, /generate-garbage-rules endpoints remain here...]
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


// ==============================================================
// === NEW: REAL-TIME EVENTS ENDPOINT for events.php          ===
// ==============================================================

/**
 * A helper function to process search results with Gemini
 * @param {Array} searchResults - An array of items from Google Custom Search
 * @param {string} geminiApiKey - The API key for Gemini
 * @returns {Promise<Array>} - A promise that resolves to an array of cleaned event objects
 */
async function processEventsWithGemini(searchResults, geminiApiKey) {
    if (!searchResults || searchResults.length === 0) {
        return [];
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    // Create a detailed prompt for Gemini
    const prompt = `
        You are an expert event curator. Based ONLY on the following Google Search results, create a JSON array of event objects.
        Each object must have these exact properties: "name", "link", "description", "image", "category", "location", "date".
        - "name": string (The official name of the event).
        - "link": string (The provided link).
        - "description": string (Write a new, single, engaging sentence based on the event's title and snippet).
        - "image": string (Use the provided Image URL. If it's empty or invalid, leave as an empty string).
        - "category": string (Categorize it. Choose ONE from: 'Festival', 'Academic', 'Culture', 'Music', 'Art', 'Career', 'Community', 'Shopping').
        - "location": string (Extract the city or prefecture, e.g., 'Osaka'. If not found, use 'Kansai Area').
        - "date": string (Summarize the dates, e.g., 'Mid-August 2025' or 'July 25-26'. If not found, use 'See link for details').
        Ignore any results that are not specific events. Respond with ONLY the raw JSON array.

        Search Results:
        ${searchResults.map(item => `
            Title: ${item.title}
            Snippet: ${item.snippet}
            Link: ${item.link}
            Image URL: ${item.pagemap?.cse_image?.[0]?.src || ''}
        `).join('\n')}
    `;
    
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const geminiResponse = await axios.post(geminiApiUrl, payload, { headers: { 'Content-Type': 'application/json' } });
        let eventText = geminiResponse.data.candidates[0].content.parts[0].text;
        eventText = eventText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(eventText);
    } catch (error) {
        console.error("Error processing with Gemini:", error.response ? error.response.data : error.message);
        return []; // Return empty array on failure
    }
}


app.get('/events', async (req, res) => {
    try {
        const googleApiKey = process.env.Google_Search_API_KEY;
        const searchEngineId = process.env.SEARCH_ENGINE_ID;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        // --- Define two different search queries ---
        const studentSearchQuery = "関西 学生向け イベント 2025"; // "Kansai student-oriented events 2025"
        const otherSearchQuery = "関西 夏祭り 花火大会 2025";   // "Kansai summer festivals fireworks 2025"

        const studentSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(studentSearchQuery)}`;
        const otherSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(otherSearchQuery)}`;

        // --- Fetch search results in parallel ---
        const [studentSearchResponse, otherSearchResponse] = await Promise.all([
            axios.get(studentSearchUrl),
            axios.get(otherSearchUrl)
        ]);
        
        const studentSearchResults = studentSearchResponse.data.items?.slice(0, 6) || [];
        const otherSearchResults = otherSearchResponse.data.items?.slice(0, 6) || [];

        // --- Process both sets of results with Gemini in parallel ---
        const [studentEvents, otherEvents] = await Promise.all([
            processEventsWithGemini(studentSearchResults, geminiApiKey),
            processEventsWithGemini(otherSearchResults, geminiApiKey)
        ]);

        res.json({ studentEvents, otherEvents });

    } catch (error) {
        console.error("Events Endpoint Error:", error.response ? error.response.data.error : error.message);
        res.status(500).json({ message: 'Could not fetch real-time events.' });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Node.js proxy server is running at http://localhost:${port}`);
});