// =========================================
// Global Variables
// =========================================
let likeCount = 0;
let dislikeCount = 0;
let viewCount = 0;
let currentLanguage = 'en'; // Default language for the page
let originalTexts = new Map(); // Stores original text of elements for translation
let translations = null; // Will hold Japanese translation data
let translationsZh = null; // Will hold Chinese translation data

// =========================================
// DOM Element Retrieval
// =========================================
// Find and store references to all interactive or updatable HTML elements
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountElement = document.getElementById("like-count");
const dislikeCountElement = document.getElementById("dislike-count");
const viewCountElement = document.getElementById("view-count");
const translateBtn = document.getElementById('translateBtn');
const languageDropdown = document.querySelector('.language-dropdown');
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.getElementById("dropdown-content");
const weatherWidget = document.getElementById('weather-widget');
const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherCity = document.getElementById('weather-city');
const alertBox = document.getElementById('weather-alert');
const alertMessage = document.getElementById('alert-message');
const alertClose = document.getElementById('alert-close');


// =========================================
// Initial Page Load Logic
// =========================================
// This runs once the entire HTML document is loaded and ready
document.addEventListener('DOMContentLoaded', () => {
    // Increment the view count when the page loads
    if (viewCountElement) {
        viewCount++;
        viewCountElement.textContent = viewCount;
    }

    // Fetch the initial weather for a default city
    if (weatherWidget) {
        fetchWeather('Osaka');
    }

    // Load both translation files at the same time
    Promise.all([
        fetch('./js/translations/index-ja.json').then(res => res.json()),
        fetch('./js/translations/index-zh.json').then(res => res.json())
    ]).then(([jaData, zhData]) => {
        // Store the loaded translations in the global variables
        translations = jaData.translations;
        translationsZh = zhData.translations;
        console.log('Translation data loaded successfully.');
    }).catch(error => {
        console.error('Failed to load translation data:', error);
    });
});

// =========================================
// Event Listeners for UI elements
// =========================================
if (likeBtn) {
    likeBtn.addEventListener("click", () => {
        likeCount++;
        likeCountElement.textContent = likeCount;
    });
}

if (dislikeBtn) {
    dislikeBtn.addEventListener("click", () => {
        dislikeCount++;
        dislikeCountElement.textContent = dislikeCount;
    });
}

// Main dropdown menu toggle
if (dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents the click from closing the menu immediately
        dropdownContent.classList.toggle("show");
    });
}

// Language dropdown menu toggle
if (translateBtn) {
    translateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
    });
}

// Close dropdowns if the user clicks anywhere else on the page
window.addEventListener("click", (e) => {
    if (dropdownContent && !e.target.matches('.dropdown-btn')) {
        dropdownContent.classList.remove("show");
    }
    if (languageDropdown && !languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});


// *** IMPORTANT: Language Change Event Listener ***
// This is the core logic that connects language selection to the weather AI message
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const targetLang = option.dataset.lang;
        currentLanguage = targetLang; // 1. Update the global language variable first

        translatePage(targetLang); // 2. Translate the static text on the page

        // 3. Re-fetch the weather to get the new AI message in the selected language
        const currentCityText = weatherCity.textContent;
        if (currentCityText && currentCityText !== 'Loading...' && currentCityText !== 'Error' && currentCityText !== 'Server offline') {
            fetchWeather(currentCityText); 
        }

        // 4. Update the active button style and close the dropdown
        document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        if (languageDropdown) languageDropdown.classList.remove('show');
    });
});

// Weather widget click listener to change city
if (weatherWidget) {
    weatherWidget.addEventListener('click', () => {
        const currentCityText = weatherCity.textContent;
        const promptCity = (currentCityText !== 'Loading...' && currentCityText !== 'Error' && currentCityText !== 'Server offline') ? currentCityText : 'Osaka';
        const newCity = prompt('Enter a city name:', promptCity);
        if (newCity && newCity.trim() !== '') {
            fetchWeather(newCity.trim());
        }
    });
}


// =========================================
// Main Functions
// =========================================

/**
 * Translates static text elements on the page based on loaded JSON files.
 * @param {string} targetLang - The language to translate to ('en', 'ja', 'zh').
 */
function translatePage(targetLang) {
    if (!translations || !translationsZh) return; // Exit if translation files aren't loaded

    const elementsToTranslate = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, span');

    elementsToTranslate.forEach(element => {
        // Skip elements that should not be translated (e.g., the weather widget itself)
        if (element.closest('#weather-widget, .like-dislike, .views')) return;

        // Store the original English HTML content the first time we see an element
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.innerHTML);
        }
        
        const originalHTML = originalTexts.get(element);

        if (targetLang === 'en') {
            element.innerHTML = originalHTML; // If English is selected, revert to original
        } else {
            // For other languages, find the translation
            const textToTranslate = element.textContent.replace(/\s+/g, ' ').trim();
            const translationData = targetLang === 'ja' ? translations : translationsZh;
            
            if (translationData && translationData[textToTranslate]) {
                const icon = element.querySelector('i'); // Preserve icons (like in buttons)
                element.innerHTML = icon ? `${icon.outerHTML} ${translationData[textToTranslate]}` : translationData[textToTranslate];
            }
        }
    });
}


/**
 * Shows a styled weather alert with the AI-generated message.
 * @param {string} advice - The advice string received from the AI.
 */
function showWeatherAlert(advice) {
    if (!alertBox || !alertMessage || !alertClose) return;
    alertMessage.textContent = advice;
    alertBox.className = 'weather-alert ai-advice'; // Set CSS class for styling
    alertBox.style.display = 'flex'; // Make the alert visible
    // Add event to the close button
    alertClose.onclick = () => {
        alertBox.style.display = 'none';
    }
}

/**
 * Fetches weather data, then fetches an AI advice message in the currently selected language.
 * @param {string} city - The name of the city to get weather for.
 */
async function fetchWeather(city) {
    if (!weatherWidget) return;

    // Show loading state in the UI
    weatherCity.textContent = 'Loading...';
    weatherTemp.textContent = '--°C';
    weatherIcon.src = '';
    if(alertBox) alertBox.style.display = 'none';

    try {
        // Step 1: Fetch current weather from our Node.js server
        const weatherServerUrl = `http://localhost:3000/weather?city=${encodeURIComponent(city)}`;
        const weatherResponse = await fetch(weatherServerUrl);
        if (!weatherResponse.ok) throw new Error('Weather data fetch failed');
        const weatherData = await weatherResponse.json();

        // Update the weather widget with the received data
        weatherCity.textContent = weatherData.name;
        weatherTemp.textContent = Math.round(weatherData.main.temp) + '°C';
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        
        // Step 2: Fetch an AI-generated advice message using the weather data and current language
        const adviceServerUrl = `http://localhost:3000/generate-weather-advice?city=${encodeURIComponent(weatherData.name)}&weather=${encodeURIComponent(weatherData.weather[0].description)}&temp=${Math.round(weatherData.main.temp)}&lang=${currentLanguage}`;
        const adviceResponse = await fetch(adviceServerUrl);
        if (!adviceResponse.ok) throw new Error('AI advice fetch failed');
        const adviceData = await adviceResponse.json();

        // Step 3: Display the AI advice in the alert banner
        showWeatherAlert(adviceData.advice);

    } catch (error) {
        // This will catch network errors, like if the Node.js server is not running
        weatherCity.textContent = 'Server offline';
        console.error("Weather process failed:", error);
    }
}
