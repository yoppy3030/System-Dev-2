// This runs once the entire HTML document is loaded and ready
document.addEventListener('DOMContentLoaded', () => {

    // --- Global Variables ---
    let currentLanguage = 'en';
    let originalTexts = new Map();
    let translations = {};
    let translationsZh = {};

    // --- DOM Element Selection ---
    const translateBtn = document.getElementById('translateBtn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const getRulesBtn = document.getElementById('get-location-rules-btn');
    const rulesContainer = document.getElementById('ai-rules-container');
    const loadingSpinner = document.getElementById('ai-loading');
    const rulesResultDiv = document.getElementById('ai-rules-result');

    // --- Load Translation Files ---
    Promise.all([
        fetch('./js/translations/garbage_rules-ja.json').catch(() => ({})), // Add .catch to prevent failure if a file is missing
        fetch('./js/translations/garbage_rules-zh.json').catch(() => ({}))
    ])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(([jaData, zhData]) => {
        translations = jaData.translations || {};
        translationsZh = zhData.translations || {};
        console.log('Garbage page translation data loaded.');
    }).catch(error => {
        console.error('Failed to load garbage page translation data:', error);
    });

    // --- Event Listeners ---

    // Toggle the language dropdown menu
    if (translateBtn) {
        translateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    // Handle clicks on individual language options
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', () => {
            currentLanguage = option.dataset.lang;
            translatePage(currentLanguage); // Translate the static content

            // If AI rules are already visible, re-fetch them in the new language
            if (rulesContainer && rulesContainer.style.display === 'block' && rulesResultDiv.innerHTML.trim() !== '') {
                 getRulesBtn.click(); // Simulate a click to re-fetch
            }

            // Update UI and close dropdown
            document.querySelectorAll('.language-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            languageDropdown.classList.remove('show');
        });
    });

    // Handle click on the "Get My Location's Rules" button
    if (getRulesBtn) {
        getRulesBtn.addEventListener('click', () => {
            rulesContainer.style.display = 'block';
            rulesResultDiv.innerHTML = '';
            loadingSpinner.style.display = 'block';

            if (!navigator.geolocation) {
                handleError({ message: "Geolocation is not supported by your browser." });
                return;
            }
            navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
        });
    }

    // Close dropdown if clicked outside
    window.addEventListener('click', (e) => {
        if (languageDropdown && !languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // --- Main Functions ---

    /**
     * Handles successful retrieval of user's location.
     * @param {GeolocationPosition} position - The position object from the browser.
     */
    async function handleSuccess(position) {
        const { latitude, longitude } = position.coords;
        try {
            const cityResponse = await fetch(`http://localhost:3000/get-city-from-coords?lat=${latitude}&lon=${longitude}`);
            if (!cityResponse.ok) throw new Error('Could not get city name.');
            const cityData = await cityResponse.json();
            
            const rulesResponse = await fetch(`http://localhost:3000/generate-garbage-rules?city=${encodeURIComponent(cityData.city)}&lang=${currentLanguage}`);
            if (!rulesResponse.ok) throw new Error('Could not get garbage rules.');
            const rulesData = await rulesResponse.json();

            rulesResultDiv.innerHTML = marked.parse(rulesData.rules);
        } catch (error) {
            handleError(error);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    /**
     * Handles errors from geolocation or API fetching.
     * @param {Error} error - The error object.
     */
    function handleError(error) {
        console.error('Error in personalized guide:', error);
        rulesResultDiv.innerHTML = `<p>Sorry, we couldn't fetch the rules. Please ensure location access is allowed and try again.</p>`;
        loadingSpinner.style.display = 'none';
    }

    /**
     * Translates the static text on the page.
     * @param {string} targetLang - The language to translate to.
     */
    function translatePage(targetLang) {
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, a, button, li');
        elements.forEach(element => {
            // Skip elements within the AI results container
            if (element.closest('#ai-rules-container')) return;

            // 1. 必ず最初の英語テキストを保存
            if (!originalTexts.has(element)) {
                originalTexts.set(element, element.innerHTML);
            }
            // 2. 翻訳キーは常に「最初の英語テキスト」から取得
            const originalHTML = originalTexts.get(element);
            // アイコンを除いたテキスト部分だけを翻訳キーに
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = originalHTML;
            const icon = tempDiv.querySelector('i');
            let textToTranslate = tempDiv.textContent.replace(/\s+/g, ' ').trim();

            const translationData = targetLang === 'ja' ? translations : translationsZh;
            if (targetLang === 'en') {
                element.innerHTML = originalHTML;
            } else if (translationData && translationData[textToTranslate]) {
                element.innerHTML = icon ? `${icon.outerHTML} ${translationData[textToTranslate]}` : translationData[textToTranslate];
            } else {
                // 翻訳がなければ英語のまま
                element.innerHTML = originalHTML;
            }
        });
    }
});
