// =========================================
// グローバル変数の初期化
// =========================================
let likeCount = 0;
let dislikeCount = 0;
let viewCount = 0;
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = null;
let translationsZh = null;
let lastWeatherData = null; // NEW: To store the last fetched weather data

// =========================================
// DOM要素の取得
// =========================================
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountElement = document.getElementById("like-count");
const dislikeCountElement = document.getElementById("dislike-count");
const viewCountElement = document.getElementById("view-count");
const translateBtn = document.getElementById('translateBtn');
const languageDropdown = document.querySelector('.language-dropdown');
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.getElementById("dropdown-content");

// =========================================
// ページ読み込み時の処理
// =========================================
window.onload = function() {
    viewCount++;
    viewCountElement.textContent = viewCount;
};

// =========================================
// いいね/いいね解除の処理
// =========================================
likeBtn.addEventListener("click", () => {
    likeCount++;
    likeCountElement.textContent = likeCount;
});

dislikeBtn.addEventListener("click", () => {
    dislikeCount++;
    dislikeCountElement.textContent = dislikeCount;
});

// =========================================
// ドロップダウンメニューの処理
// =========================================
dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
});

window.addEventListener("click", (e) => {
    if (!e.target.matches('.dropdown-btn')) {
        dropdownContent.classList.remove("show");
    }
});

// =========================================
// 翻訳機能の初期設定
// =========================================
translateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

// 言語選択オプションのイベントリスナー設定
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const targetLang = option.dataset.lang;
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        languageDropdown.classList.remove('show');
        translatePage(targetLang);
    });
});

// =========================================
// ユーティリティ関数
// =========================================
/**
 * テキストの正規化（余分な空白を削除）
 * @param {string} text - 正規化するテキスト
 * @returns {string} 正規化されたテキスト
 */
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// =========================================
// 翻訳データの読み込み
// =========================================
Promise.all([
    fetch('./js/translations/index-ja.json').then(response => response.json()),
    fetch('./js/translations/index-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

// =========================================
// ページ翻訳の実行
// =========================================
/**
 * ページ全体の翻訳を実行
 * @param {string} targetLang - 翻訳先の言語（'en', 'ja', 'zh'）
 */
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    // メニューアイテムの特別な処理
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        const pElement = menuItem.querySelector('p');
        if (pElement) {
            const originalText = pElement.textContent;
            if (!originalTexts.has(pElement)) {
                originalTexts.set(pElement, originalText);
            }

            if (targetLang === 'en') {
                pElement.textContent = originalTexts.get(pElement);
            } else {
                const normalizedText = normalizeText(originalTexts.get(pElement));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                if (translation) {
                    pElement.textContent = translation;
                }
            }
        }
    });

    // その他の要素の処理
    const elements = document.querySelectorAll('p:not(.menu-item p), h1, h2, h3, h4, h5, h6, span, a:not(.menu-item a), .sidebar a, .translate-btn, button');
    
    for (const element of elements) {
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            continue;
        }
        if (element.closest('.logo')) {
            continue;
        }
        if (element.tagName === 'BUTTON') {
            const icon = element.querySelector('i');
            const iconHTML = icon ? icon.outerHTML : '';
            const textNodes = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('')
                .trim();
            if (!textNodes) continue;
            if (!originalTexts.has(element)) {
                originalTexts.set(element, textNodes);
            }
            if (targetLang === 'en') {
                element.innerHTML = iconHTML + ' ' + originalTexts.get(element);
            } else {
                const normalizedText = normalizeText(originalTexts.get(element));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                if (translation) {
                    element.innerHTML = iconHTML + ' ' + translation;
                }
            }
            continue;
        }
        const originalText = element.textContent;
        if (!originalText || !originalText.trim()) {
            continue;
        }
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
            continue;
        }
        const normalizedText = normalizeText(originalTexts.get(element));
        if (targetLang === 'ja') {
            if (translations[normalizedText]) {
                element.textContent = translations[normalizedText];
            }
        } else if (targetLang === 'zh') {
            if (translationsZh[normalizedText]) {
                element.textContent = translationsZh[normalizedText];
            }
        }
    }
    
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    
    currentLanguage = targetLang;

    // NEW: Re-fetch AI advice in the new language if weather data exists
    if (lastWeatherData) {
        const { city, weather, temp } = lastWeatherData;
        // This function is defined in the DOMContentLoaded event listener below
        fetchAIWeatherAdvice(city, weather, temp);
    }
}

// =========================================
// Weather Widget & AI Advice Functionality
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    const weatherWidget = document.getElementById('weather-widget');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherCity = document.getElementById('weather-city');
    
    // --- Get elements for AI Weather Alert Banner ---
    const weatherAlertBanner = document.getElementById('weather-alert');
    const alertMessageSpan = document.getElementById('alert-message');
    const alertCloseBtn = document.getElementById('alert-close');

    /**
     * --- NEW: Fetches AI-powered weather advice from the server ---
     * This function is now globally accessible due to the file structure.
     * @param {string} city - The name of the city.
     * @param {string} weather - The current weather description (e.g., 'clear sky').
     * @param {number} temp - The current temperature.
     */
    window.fetchAIWeatherAdvice = async function(city, weather, temp) {
        const lang = currentLanguage; 
        const serverUrl = `http://localhost:3000/generate-weather-advice?city=${encodeURIComponent(city)}&weather=${encodeURIComponent(weather)}&temp=${temp}&lang=${lang}`;

        try {
            const response = await fetch(serverUrl);
            if (!response.ok) {
                console.error('AI advice server error:', await response.text());
                weatherAlertBanner.style.display = 'none';
                return;
            }
            
            const data = await response.json();
            
            if(data.advice) {
                alertMessageSpan.textContent = data.advice;
                weatherAlertBanner.style.display = 'flex';
                weatherAlertBanner.classList.add('ai-advice');
            }

        } catch (error) {
            console.error("Failed to fetch AI weather advice:", error);
            weatherAlertBanner.style.display = 'none';
        }
    }

    /**
     * Fetches weather data from the server and then fetches AI advice
     * @param {string} city - The name of the city to fetch weather for.
     */
    async function fetchWeather(city) {
        const serverUrl = `http://localhost:3000/weather?city=${encodeURIComponent(city)}`;
        
        weatherCity.textContent = 'Loading...';
        weatherTemp.textContent = '--°C';
        weatherIcon.src = '';
        weatherAlertBanner.style.display = 'none';

        try {
            const response = await fetch(serverUrl);

            if (!response.ok) {
                const errorData = await response.json();
                weatherCity.textContent = errorData.message || 'Error';
                console.error('Server error:', errorData.message);
                return;
            }

            const data = await response.json();
            
            // Store weather data globally
            lastWeatherData = {
                city: data.name,
                temp: Math.round(data.main.temp),
                weather: data.weather[0].description
            };

            // Update the weather widget display
            weatherCity.textContent = lastWeatherData.city;
            weatherTemp.textContent = lastWeatherData.temp + '°C';
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = lastWeatherData.weather;

            // --- After getting weather, fetch the AI advice ---
            fetchAIWeatherAdvice(lastWeatherData.city, lastWeatherData.weather, lastWeatherData.temp);

        } catch (error) {
            weatherCity.textContent = 'Server offline';
            console.error("Failed to connect to the weather server. Is node server.js running?", error);
        }
    }

    // Add event listener for the alert banner's close button
    if (alertCloseBtn) {
        alertCloseBtn.addEventListener('click', () => {
            weatherAlertBanner.style.display = 'none';
        });
    }

    // Add a click listener to the widget to change city
    if (weatherWidget) {
        weatherWidget.addEventListener('click', () => {
            const currentCity = weatherCity.textContent;
            const promptCity = (currentCity !== 'Loading...' && currentCity !== 'Error') ? currentCity : 'Osaka';
            const newCity = prompt('Enter a city name:', promptCity);
            if (newCity && newCity.trim() !== '') {
                fetchWeather(newCity.trim());
            }
        });
    }

    // Initial weather fetch for a default city
    fetchWeather('Osaka');
});