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
        // いいねボタン、閲覧数などの特殊な要素は翻訳対象外
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            continue;
        }

        // ロゴ部分は翻訳対象外
        if (element.closest('.logo')) {
            continue;
        }

        // ボタン要素の特別な処理
        if (element.tagName === 'BUTTON') {
            // アイコン要素を保存
            const icon = element.querySelector('i');
            const iconHTML = icon ? icon.outerHTML : '';
            
            // テキストノードのみを取得
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

        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        
        // 英語の場合は元のテキストに戻す
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
            continue;
        }

        const normalizedText = normalizeText(originalTexts.get(element));

        // 言語に応じた翻訳の適用
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
    
    // アクティブな言語ボタンの更新
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    
    currentLanguage = targetLang;
}
/*
// depends on user

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const activityInput = document.getElementById("user-activity");
      if (!activityInput) {
        alert("User activity not found.");
        return;
      }
      const activity = activityInput.value;

      if (activity === "International Student") {
        window.location.href = "studenthome.php";
      } else if (activity === "Professional") {
        window.location.href = "professional.php";
      } else if (activity === "Tourist") {
        window.location.href = "travelers_homePage.php";
      } else {
        alert("Please sign up or log in to continue.");
      }
    });
  }
});
*/

// =========================================
// Weather Widget Functionality (With AI Alerts)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return;

    const weatherIcon = document.getElementById('weather-icon');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherCity = document.getElementById('weather-city');
    const alertBox = document.getElementById('weather-alert');
    const alertMessage = document.getElementById('alert-message');
    const alertClose = document.getElementById('alert-close');

    /**
     * Shows a styled weather alert with AI-generated message.
     * @param {string} advice - The advice string from the AI.
     */
    function showWeatherAlert(advice) {
        if (!alertBox || !alertMessage || !alertClose) return;

        alertMessage.textContent = advice;
        // Make the alert box always look neutral, as the message has context
        alertBox.className = 'weather-alert'; // Reset classes
        alertBox.classList.add('ai-advice'); // Add a new class for AI styling
        alertBox.style.display = 'flex';

        alertClose.onclick = () => {
            alertBox.style.display = 'none';
        }
    }

    /**
     * Fetches weather data, then gets AI advice.
     * @param {string} city - The name of the city.
     */
    async function fetchWeather(city) {
        const weatherServerUrl = `http://localhost:3000/weather?city=${encodeURIComponent(city)}`;
        
        weatherCity.textContent = 'Loading...';
        weatherTemp.textContent = '--°C';
        weatherIcon.src = '';
        if(alertBox) alertBox.style.display = 'none';

        try {
            const weatherResponse = await fetch(weatherServerUrl);
            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                weatherCity.textContent = errorData.message || 'Error';
                return;
            }

            const weatherData = await weatherResponse.json();

            // Update the main widget
            weatherCity.textContent = weatherData.name;
            weatherTemp.textContent = Math.round(weatherData.main.temp) + '°C';
            weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

            // NEW: Fetch AI advice based on the weather
            const adviceServerUrl = `http://localhost:3000/generate-weather-advice?city=${encodeURIComponent(weatherData.name)}&weather=${encodeURIComponent(weatherData.weather[0].description)}&temp=${Math.round(weatherData.main.temp)}`;
            const adviceResponse = await fetch(adviceServerUrl);

            if (adviceResponse.ok) {
                const adviceData = await adviceResponse.json();
                showWeatherAlert(adviceData.advice);
            }

        } catch (error) {
            weatherCity.textContent = 'Server offline';
            console.error("Failed to connect to the weather server. Is node server.js running?", error);
        }
    }

    weatherWidget.addEventListener('click', () => {
        const currentCity = weatherCity.textContent;
        const promptCity = (currentCity !== 'Loading...' && currentCity !== 'Error' && currentCity !== 'Server offline') ? currentCity : 'Osaka';
        const newCity = prompt('Enter a city name:', promptCity);
        if (newCity && newCity.trim() !== '') {
            fetchWeather(newCity.trim());
        }
    });

    fetchWeather('Osaka');
});
