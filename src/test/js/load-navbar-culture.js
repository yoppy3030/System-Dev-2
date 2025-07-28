// Function to load culture navbar from HTML file
async function loadCultureNavbar() {
  try {
    const response = await fetch('./includes/navbar-culture.html');
    const navbarHtml = await response.text();
    
    console.log('[load-navbar-culture.js] Culture navbar HTML loaded');
    // Find the header element and replace it with the loaded navbar
    const existingHeader = document.querySelector('.site-header');
    if (existingHeader) {
      existingHeader.outerHTML = navbarHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    }
    console.log('[load-navbar-culture.js] Culture navbar inserted into DOM');
    
    // Initialize dropdown functionality immediately
    initializeDropdowns();
    initializeLanguageSelector();
    
    // Load shared-nav.js for additional functionality
    if (!window.sharedNavLoaded) {
      const script = document.createElement('script');
      script.src = './js/shared-nav.js';
      script.onload = function() {
        console.log('[load-navbar-culture.js] shared-nav.js loaded');
        window.sharedNavLoaded = true;
      };
      script.onerror = function() {
        console.error('[load-navbar-culture.js] Failed to load shared-nav.js');
      };
      document.head.appendChild(script);
    }
    
  } catch (error) {
    console.error('Error loading culture navbar:', error);
  }
}

// Dropdown initialization function
function initializeDropdowns() {
  console.log('[load-navbar-culture.js] initializeDropdowns called');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    
    // Remove any existing event listeners
    const newToggle = dropdownToggle.cloneNode(true);
    dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);
    
    // Ensure dropdown is hidden by default
    if (dropdownMenu) {
      dropdownMenu.classList.remove('show');
    }
    
    if (newToggle && dropdownMenu) {
      newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          if (menu !== dropdownMenu) {
            menu.classList.remove('show');
          }
        });
        
        dropdownMenu.classList.toggle('show');
        console.log('[load-navbar-culture.js] Dropdown toggled:', dropdownMenu.classList.contains('show'));
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

// Language selector initialization function
function initializeLanguageSelector() {
  console.log('[load-navbar-culture.js] initializeLanguageSelector called');
  const translateBtn = document.getElementById('translateBtn');
  const languageDropdown = document.querySelector('.language-dropdown');

  if (translateBtn && languageDropdown) {
    // Remove any existing event listeners
    const newTranslateBtn = translateBtn.cloneNode(true);
    translateBtn.parentNode.replaceChild(newTranslateBtn, translateBtn);
    
    // Ensure language dropdown is hidden by default
    languageDropdown.classList.remove('show');
    
    newTranslateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', (e) => {
      if (!languageDropdown.contains(e.target) && !newTranslateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
      }
    });
    
    document.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetLang = e.currentTarget.dataset.lang;
        languageDropdown.classList.remove('show');
        if (typeof changeLanguage === 'function') {
          changeLanguage(targetLang);
        }
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

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCultureNavbar);
} else {
  loadCultureNavbar();
} 