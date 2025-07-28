/* =========================================
   Shared Navigation JavaScript
   ========================================= */

// Global state variables
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = { ja: null, zh: null };

// Check if already initialized
if (window.navigationInitialized) {
    console.log('[shared-nav.js] Navigation already initialized, skipping');
} else {
    // --- Main execution starts here ---
    document.addEventListener('DOMContentLoaded', () => {
        loadTranslations();
        setupNavigation();
    });
    
    window.navigationInitialized = true;
}

function setupNavigation() {
    setupDropdowns();
    setupLanguageSelector();
    setupInteractiveFeatures();
}

function setupDropdowns() {
    console.log('[shared-nav.js] setupDropdowns called');
    // Setup dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const dropdownToggle = dropdown.querySelector('a');
        
        // Ensure dropdown is hidden by default
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
        }
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other dropdowns first
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu !== dropdownMenu) {
                        menu.classList.remove('show');
                    }
                });
                
                dropdownMenu.classList.toggle('show');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
    
    // Close dropdowns when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

function setupLanguageSelector() {
    const translateBtn = document.getElementById('translateBtn');
    const languageDropdown = document.querySelector('.language-dropdown');

    if (translateBtn && languageDropdown) {
        // Ensure language dropdown is hidden by default
        languageDropdown.classList.remove('show');
        
        translateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
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
        
        // Close language dropdown with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                languageDropdown.classList.remove('show');
            }
        });
    }
}

function setupInteractiveFeatures() {
    // Add hover effects to navigation links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Controller to change language
 */
function changeLanguage(targetLang) {
    if (targetLang === currentLanguage) return;
    currentLanguage = targetLang;
    translatePage();
}

// --- Translation Logic ---
async function loadTranslations() {
    try {
        const [jaData, zhData] = await Promise.all([
            fetch('./js/translations/shared-nav-ja.json').then(res => res.json()).catch(() => ({ translations: {} })),
            fetch('./js/translations/shared-nav-zh.json').then(res => res.json()).catch(() => ({ translations: {} }))
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

window.initializeDropdowns = setupDropdowns;
window.initializeLanguageSelector = setupLanguageSelector; 