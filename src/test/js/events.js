/* =========================================
   Event Fetching and Display
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const studentListContainer = document.getElementById('student-event-list');
    const otherListContainer = document.getElementById('other-event-list');
    const placeholderImage = './img/placeholder.jpg'; // A default image

    /**
     * Creates and displays event cards in a given container.
     * @param {Array} events - The array of event objects.
     * @param {HTMLElement} container - The container element to append cards to.
     * @param {string} notFoundMessage - Message to show if events array is empty.
     */
    function displayEvents(events, container, notFoundMessage) {
        container.innerHTML = ''; // Clear previous content or loading message

        if (!events || events.length === 0) {
            container.innerHTML = `<p>${notFoundMessage}</p>`;
            return;
        }

        events.forEach(event => {
            const eventCard = document.createElement('a');
            eventCard.href = event.link;
            eventCard.className = 'event-card';
            eventCard.target = '_blank';
            eventCard.rel = 'noopener noreferrer';

            eventCard.innerHTML = `
                <img src="${event.image || placeholderImage}" alt="${event.name}" class="event-card-image">
                <div class="event-card-content">
                    <span class="event-card-category">${event.category || 'Event'}</span>
                    <h3 class="event-card-title">${event.name}</h3>
                    <p class="event-card-description">${event.description}</p>
                    <div class="event-card-details">
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location || 'N/A'}</p>
                        <p><i class="fas fa-calendar-alt"></i> ${event.date || 'N/A'}</p>
                    </div>
                </div>
            `;
            container.appendChild(eventCard);
        });
    }

    async function fetchAndDisplayEvents() {
        // Initial loading message
        const loadingMessage = '<p>Loading events...</p>';
        studentListContainer.innerHTML = loadingMessage;
        otherListContainer.innerHTML = loadingMessage;

        try {
            const response = await fetch('http://localhost:3000/events');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Display student events
            displayEvents(data.studentEvents, studentListContainer, 'No upcoming student events found.');

            // Display other events
            displayEvents(data.otherEvents, otherListContainer, 'No upcoming festivals or community events found.');

        } catch (error) {
            console.error("Failed to fetch events:", error);
            const errorMessage = '<p style="text-align: center; color: red;">Could not load events. Please make sure the server is running and API keys are correct.</p>';
            studentListContainer.innerHTML = errorMessage;
            otherListContainer.innerHTML = errorMessage;
        }
    }

    fetchAndDisplayEvents();
});


/* =========================================
   翻訳機能 (Existing Translation Logic)
   ========================================= */
// NOTE: This will translate static content. Dynamically loaded events are not part of this system.
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = null;
let translationsZh = null;

const translateBtn = document.getElementById('translateBtn');
const languageDropdown = document.querySelector('.language-dropdown');

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

function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim().replace(/^- /, '').replace(/&amp;/g, '&');
}

Promise.all([
    fetch('./js/translations/events-ja.json').then(response => response.json()),
    fetch('./js/translations/events-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

// translate 

function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    const elements = document.querySelectorAll('[data-translate], .hero-content h1, .hero-content p, .main-nav a, footer h2, footer p, .translate-btn, .category-title');
    
    elements.forEach(element => {
        if (!element.textContent || !element.textContent.trim()) return;

        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }

        // data-translate 属性があればそれをキーに使う
        const key = element.dataset.translate || normalizeText(originalTexts.get(element));
        const translation = targetLang === 'ja' ? translations[key] : translationsZh[key];
        
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
        } else if (translation) {
            element.textContent = translation;
        }
    });

    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    
    currentLanguage = targetLang;
}