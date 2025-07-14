/* =========================================
   job_platforms.js 
   ========================================= */

// Global state variables
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = { ja: null, zh: null };

// --- Main execution starts here ---
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    setupEventListeners();
    setupInteractiveFeatures();
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
            languageDropdown.classList.remove('show');
        }
    });
}

function setupInteractiveFeatures() {
    // Add hover effects to job platform links
    const platformLinks = document.querySelectorAll('.section a[target="_blank"]');
    platformLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.05)';
            link.style.transition = 'transform 0.2s ease';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)';
        });
    });

    // Add collapsible sections for mobile
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', () => {
                const content = section.querySelector('ul');
                if (content) {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
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
            fetch('./js/translations/job_platforms-ja.json').then(res => res.json()).catch(() => ({ translations: {} })),
            fetch('./js/translations/job_platforms-zh.json').then(res => res.json()).catch(() => ({ translations: {} }))
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 