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

// server.js (REPLACE these two blocks)

async function processScholarshipsWithGemini(searchResults, geminiApiKey, lang = 'en') {
    if (!searchResults || searchResults.length === 0) {
        return [];
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    // --- Language Instruction for the AI ---
    let languageInstruction = "Provide all string values in the final JSON response in English.";
    if (lang === 'ja') {
        languageInstruction = "IMPORTANT: Provide all string values in the final JSON response in natural Japanese.";
    } else if (lang === 'zh') {
        languageInstruction = "IMPORTANT: Provide all string values in the final JSON response in standard Mandarin Chinese.";
    }

    const prompt = `
        You are an expert data extractor for a student website. Based ONLY on the following Google Search results, create a JSON array of scholarship objects.
        Each object must have these exact properties: "name", "organization", "amount", "deadline", "eligibility", "link".
        - "name": string (The official name of the scholarship).
        - "organization": string (The name of the funding body, e.g., "JASSO", "MEXT", or a university name).
        - "amount": string (Summarize the financial award, e.g., "Monthly stipend of ¥80,000" or "Full tuition coverage").
        - "deadline": string (Find the application deadline. If not available, state "Varies" or "Check official site").
        - "eligibility": string (Briefly summarize who can apply, e.g., "Undergraduate & graduate students").
        - "link": string (The provided link to the scholarship page).
        Ignore any results that are not specific scholarships.
        ${languageInstruction} // <-- The new instruction is added here
        Respond with ONLY the raw JSON array.

        Search Results:
        ${searchResults.map(item => `Title: ${item.title}\nSnippet: ${item.snippet}\nLink: ${item.link}`).join('\n')}
    `;
    
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const geminiResponse = await axios.post(geminiApiUrl, payload, { headers: { 'Content-Type': 'application/json' } });
        let scholarshipText = geminiResponse.data.candidates[0].content.parts[0].text;
        scholarshipText = scholarshipText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(scholarshipText);
    } catch (error) {
        console.error("Error processing scholarships with Gemini:", error.response ? error.response.data : error.message);
        return [];
    }
}


app.get('/scholarships', async (req, res) => {
    try {
        const { lang } = req.query; // Get language from the request
        const googleApiKey = process.env.Google_Search_API_KEY;
        const searchEngineId = process.env.SEARCH_ENGINE_ID;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        const searchQuery = "scholarships for international students in Japan 2025 deadline";
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchQuery)}`;

        const searchResponse = await axios.get(searchUrl);
        const searchResults = searchResponse.data.items?.slice(0, 8) || [];

        // Pass the requested language to the Gemini helper function
        const scholarships = await processScholarshipsWithGemini(searchResults, geminiApiKey, lang);

        res.json({ scholarships });

    } catch (error) {
        console.error("Scholarships Endpoint Error:", error.response ? error.response.data.error : error.message);
        res.status(500).json({ message: 'Could not fetch real-time scholarship data.' });
    }
});

// ==============================================================
// === NEW: REAL-TIME JOBS ENDPOINT for types_of_jobs.php     ===
// ==============================================================

/**
 * Processes job search results with Gemini to create structured data.
 * @param {Array} searchResults - Raw results from Google Custom Search.
 * @param {string} geminiApiKey - Your Gemini API key.
 * @param {string} lang - The target language ('en', 'ja', 'zh').
 * @param {string} jobType - The type of job ('Internship' or 'Full-time').
 * @returns {Promise<Array>} - A promise resolving to an array of job objects.
 */
async function processJobsWithGemini(searchResults, geminiApiKey, lang, jobType) {
    if (!searchResults || searchResults.length === 0) return [];

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    let languageInstruction = "Provide all string values in the final JSON response in English.";
    if (lang === 'ja') languageInstruction = "IMPORTANT: Provide all string values in the final JSON response in natural Japanese.";
    if (lang === 'zh') languageInstruction = "IMPORTANT: Provide all string values in the final JSON response in standard Mandarin Chinese.";

    const prompt = `
        You are a job board curator. From the Google Search results below, create a JSON array of job objects.
        Each object must have these properties: "title", "company", "location", "description", "type", "link".
        - "title": string (The job title).
        - "company": string (The hiring company's name).
        - "location": string (Extract the city, e.g., "Osaka". Default to "Kansai Area" if not found).
        - "description": string (Create a new, single engaging sentence from the snippet, summarizing the role).
        - "type": string (Assign this exact value: "${jobType}").
        - "link": string (The provided link).
        ${languageInstruction}
        Respond ONLY with the raw JSON array.

        Search Results:
        ${searchResults.map(item => `Title: ${item.title}\nSnippet: ${item.snippet}\nLink: ${item.link}`).join('\n')}
    `;

    try {
        const response = await axios.post(geminiApiUrl, { contents: [{ parts: [{ text: prompt }] }] }, { headers: { 'Content-Type': 'application/json' } });
        let jobsText = response.data.candidates[0].content.parts[0].text;
        jobsText = jobsText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jobsText);
    } catch (error) {
        console.error(`Error processing ${jobType} jobs with Gemini:`, error.response ? error.response.data : error.message);
        return [];
    }
}

app.get('/jobs', async (req, res) => {
    try {
        const { lang = 'en' } = req.query;
        const googleApiKey = process.env.Google_Search_API_KEY;
        const searchEngineId = process.env.SEARCH_ENGINE_ID;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        // Specific searches for an IT student in Osaka
        const internshipQuery = "インターンシップ 大阪 IT"; // "Internship Osaka IT"
        const fullTimeQuery = "大阪 外国人歓迎 IT求人";   // "Osaka foreigner-welcome IT jobs"

        const internshipUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(internshipQuery)}`;
        const fullTimeUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(fullTimeQuery)}`;

        const [internshipResponse, fullTimeResponse] = await Promise.all([
            axios.get(internshipUrl),
            axios.get(fullTimeUrl)
        ]);

        const [internships, fullTimeJobs] = await Promise.all([
            processJobsWithGemini(internshipResponse.data.items?.slice(0, 4) || [], geminiApiKey, lang, 'Internship'),
            processJobsWithGemini(fullTimeResponse.data.items?.slice(0, 4) || [], geminiApiKey, lang, 'Full-time')
        ]);

        res.json({ internships, fullTimeJobs });

    } catch (error) {
        console.error("Jobs Endpoint Error:", error.response ? error.response.data.error : error.message);
        res.status(500).json({ message: 'Could not fetch job data.' });
    }
});