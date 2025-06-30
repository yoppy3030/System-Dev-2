// server.js (AI message ကို ရွေးချယ်ထားသော ဘာသာစကားအလိုက် ပြပါမည်)

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

// ရာသီဥတု data တောင်းဆိုရန် endpoint
app.get('/weather', async (req, res) => {
    try {
        const city = req.query.city;
        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
             throw new Error("WEATHER_API_KEY ကို server မှာ ရှာမတွေ့ပါ။");
        }
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);

    } catch (error) {
        let statusCode = 500;
        let errorMessage = 'ရာသီဥတုအချက်အလက်များကို ရယူနိုင်ခြင်းမရှိပါ။';
        if (error.response) {
            statusCode = error.response.status;
            errorMessage = error.response.data.message;
        }
        console.error("Weather Error:", errorMessage);
        res.status(statusCode).json({ message: errorMessage });
    }
});

// AI အကြံပေးချက် တောင်းဆိုရန် endpoint (ဘာသာစကားမျိုးစုံအတွက် ပြင်ဆင်ပြီး)
app.get('/generate-weather-advice', async (req, res) => {
    try {
        const { city, weather, temp, lang } = req.query; // 'lang' parameter အသစ်ကို လက်ခံပါမယ်။
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            throw new Error("GEMINI_API_KEY ကို server မှာ ရှာမတွေ့ပါ။");
        }

        // ဘာသာစကားအလိုက် AI ကို ခိုင်းစေမည့် instruction ကို ပြောင်းလဲပါမယ်။
        let languageInstruction = "Respond in a single sentence in English only."; // Default to English
        if (lang === 'ja') {
            languageInstruction = "Respond in a single sentence in Japanese only.";
        } else if (lang === 'zh') {
            languageInstruction = "Respond in a single sentence in Chinese only.";
        }

        const prompt = `You are a friendly travel assistant for a website called 'Japan Life Manual'. 
        Give a very short, helpful, and friendly travel advice for someone currently in ${city}, Japan.
        The current weather is '${weather}' with a temperature of ${temp}°C.
        ${languageInstruction}`;
        
        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        const response = await axios.post(geminiApiUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const adviceText = response.data.candidates[0].content.parts[0].text;
        res.json({ advice: adviceText });

    } catch(error) {
        console.error("Gemini AI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'AI အကြံပေးချက်ကို ရယူနိုင်ခြင်းမရှိပါ။' });
    }
});

app.listen(port, () => {
    console.log(`Node.js weather proxy server က http://localhost:${port} မှာ အလုပ်လုပ်နေပါပြီ`);
});
