/* =========================================
   scholarships.js
   ========================================= */

// Global state variables
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = { ja: null, zh: null };

// --- Main function to run on page load ---
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    setupEventListeners();
    // Fetch initial data in English
    fetchAndRenderScholarships(); 
});

function setupEventListeners() {
    const translateBtn = document.getElementById('translateBtn');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (translateBtn) {
        translateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (!languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // Event listener now calls the new changeLanguage function
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetLang = e.currentTarget.dataset.lang;
            languageDropdown.classList.remove('show');
            changeLanguage(targetLang); // Use the new controller function
        });
    });
}

/**
 * Main controller for changing the language.
 * This function triggers the data refetch.
 */
function changeLanguage(targetLang) {
    if (targetLang === currentLanguage) {
        return; // Do nothing if the language is already selected
    }
    currentLanguage = targetLang;
    // This is the key change: we fetch new data every time the language is switched.
    fetchAndRenderScholarships();
}

// --- Translation Logic ---
async function loadTranslations() {
    try {
        const [jaData, zhData] = await Promise.all([
            fetch('./js/translations/scholarships-ja.json').then(res => res.json()),
            fetch('./js/translations/scholarships-zh.json').then(res => res.json())
        ]);
        translations.ja = jaData.translations;
        translations.zh = zhData.translations;
    } catch (error) {
        console.error('Could not load translation files.', error);
    }
}

/**
 * This function now ONLY translates the static labels on the page.
 */
function translateStaticLabels() {
    const lang = currentLanguage;
    if (lang !== 'en' && (!translations.ja || !translations.zh)) {
        return; 
    }

    const elements = document.querySelectorAll('[data-translate]'); 
    
    elements.forEach(element => {
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }

        const originalText = originalTexts.get(element);
        
        if (lang === 'en') {
            element.textContent = originalText;
            return;
        }

        const normalizedText = originalText.replace(/\s+/g, ' ').trim();
        const targetDict = lang === 'ja' ? translations.ja : translations.zh;

        if (targetDict && targetDict[normalizedText]) {
            element.textContent = targetDict[normalizedText];
        } else {
            // If translation not found, show original text
            element.textContent = originalText;

        }
    });

    document.querySelectorAll('.language-option').forEach(btn => btn.classList.remove('active'));
    const activeOption = document.querySelector(`.language-option[data-lang="${lang}"]`);
    if (activeOption) activeOption.classList.add('active');
}


// --- Scholarship Fetching and Rendering ---
async function fetchAndRenderScholarships() {
    const container = document.getElementById('scholarship-list-container');
    if (!container) return;

    // Set loading message and translate it immediately
    container.innerHTML = '<p style="text-align:center;" data-translate>Fetching the latest scholarship information...</p>';
    translateStaticLabels(); 

    try {
        // Fetch data using the NEW currentLanguage
        const response = await fetch(`http://localhost:3000/scholarships?lang=${currentLanguage}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const data = await response.json();
        container.innerHTML = ''; 

        if (!data.scholarships || data.scholarships.length === 0) {
            container.innerHTML = '<p style="text-align:center;" data-translate>No current scholarship listings found. Please check back later.</p>';
            translateStaticLabels();
            return;
        }

        data.scholarships.forEach(scholarship => {
            const scholarshipCardHTML = `
                <div class="scholarship-card">
                    <h2>${scholarship.name || 'N/A'}</h2>
                    <p><strong><span data-translate>Provider:</span></strong> <span>${scholarship.organization || 'N/A'}</span></p>
                    <p><strong><span data-translate>Eligibility:</span></strong> <span>${scholarship.eligibility || 'N/A'}</span></p>
                    <p><strong><span data-translate>Amount:</span></strong> <span>${scholarship.amount || 'N/A'}</span></p>
                    <p><strong><span data-translate>Deadline:</span></strong> <span>${scholarship.deadline || 'N/A'}</span></p>
                    <a href="${scholarship.link}" target="_blank" class="btn" data-translate>Learn More</a>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', scholarshipCardHTML);
        });
        
        // After rendering the new content, translate the static labels again
        translateStaticLabels();

    } catch (error) {
        console.error('Error fetching scholarships:', error);
        container.innerHTML = '<p style="text-align:center; color: red;" data-translate>Sorry, we could not retrieve scholarship data. Please try refreshing the page.</p>';
        translateStaticLabels();
    }
}