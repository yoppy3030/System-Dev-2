/* =========================================
   types_of_jobs.js 
   ========================================= */

// Global state variables
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = { ja: null, zh: null };

// --- Main execution starts here ---
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    setupEventListeners();
    fetchAndRenderJobs(); // Fetch initial data
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
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetLang = e.currentTarget.dataset.lang;
            languageDropdown.classList.remove('show');
            changeLanguage(targetLang);
        });
    });
}

/**
 * Controller to change language and re-fetch data
 */
function changeLanguage(targetLang) {
    if (targetLang === currentLanguage) return;
    currentLanguage = targetLang;
    fetchAndRenderJobs(); // Re-fetch jobs in the new language
}

// --- Data Fetching and Rendering ---
async function fetchAndRenderJobs() {
    const container = document.getElementById('job-listings-container');
    if (!container) return;

    container.innerHTML = `<div class="step"><p data-translate>Fetching job listings for Osaka...</p></div>`;
    translatePage(); // Translate loading message

    try {
        const response = await fetch(`http://localhost:3000/jobs?lang=${currentLanguage}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const { internships, fullTimeJobs } = await response.json();
        container.innerHTML = ''; // Clear loading message

        if (internships.length === 0 && fullTimeJobs.length === 0) {
            container.innerHTML = `<div class="step"><p data-translate>No job listings found at this time. Please check back later.</p></div>`;
            translatePage();
            return;
        }

        // Render Internships
        if (internships.length > 0) {
            const internshipHeader = `<h2 data-translate>Internships in Osaka</h2>`;
            container.insertAdjacentHTML('beforeend', internshipHeader);
            internships.forEach(job => container.insertAdjacentHTML('beforeend', createJobCard(job)));
        }

        // Render Full-time Jobs
        if (fullTimeJobs.length > 0) {
            const fullTimeHeader = `<h2 data-translate>Full-time Jobs in Osaka</h2>`;
            container.insertAdjacentHTML('beforeend', fullTimeHeader);
            fullTimeJobs.forEach(job => container.insertAdjacentHTML('beforeend', createJobCard(job)));
        }
        
        translatePage(); // Translate all static labels and headers

    } catch (error) {
        console.error('Error fetching job listings:', error);
        container.innerHTML = `<div class="step"><p data-translate>Could not retrieve job listings. Please try again later.</p></div>`;
        translatePage();
    }
}

/**
 * Creates the HTML for a single job card.
 * @param {object} job - The job data object.
 * @returns {string} - The HTML string for the job card.
 */
function createJobCard(job) {
    return `
        <div class="step">
            <h3>${job.title || 'N/A'}</h3>
            <p>
                <strong data-translate>Company:</strong> ${job.company || 'N/A'}<br>
                <strong data-translate>Location:</strong> ${job.location || 'N/A'}<br>
                <strong data-translate>Type:</strong> <span data-translate>${job.type || 'N/A'}</span>
            </p>
            <p>${job.description || 'No description available.'}</p>
            <a href="${job.link}" target="_blank" class="btn" data-translate>View Posting</a>
        </div>
    `;
}


// --- Translation Logic (Adapted from your script) ---
async function loadTranslations() {
    try {
        const [jaData, zhData] = await Promise.all([
            fetch('./js/translations/types_of_jobs-ja.json').then(res => res.json()).catch(() => ({ translations: {} })),
            fetch('./js/translations/types_of_jobs-zh.json').then(res => res.json()).catch(() => ({ translations: {} }))
        ]);
        translations.ja = jaData.translations;
        translations.zh = zhData.translations;
    } catch (error) {
        console.error('Could not load translation files.', error);
    }
}

function translatePage() {
    const lang = currentLanguage;
    const targetDict = lang === 'ja' ? translations.ja : translations.zh;
    if (lang !== 'en' && !targetDict) return;

    // Translate all elements with the 'data-translate' attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }
        const originalText = originalTexts.get(element);
        if (lang === 'en') {
            element.textContent = originalText;
        } else if (targetDict[originalText]) {
            element.textContent = targetDict[originalText];
        }
    });

    // Update active language button
    document.querySelectorAll('.language-option').forEach(btn => btn.classList.remove('active'));
    const activeOption = document.querySelector(`.language-option[data-lang="${lang}"]`);
    if (activeOption) activeOption.classList.add('active');
}