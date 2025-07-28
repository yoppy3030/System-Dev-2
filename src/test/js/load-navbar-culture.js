// =========================================
// Culture Navbar Loader with Robust Dropdown Support
// =========================================

// Global state to prevent multiple initializations
let navbarLoaded = false;
let dropdownInitialized = false;

// Main function to load culture navbar
async function loadCultureNavbar() {
  if (navbarLoaded) {
    console.log('[load-navbar-culture.js] Navbar already loaded, skipping');
    return;
  }

  try {
    console.log('[load-navbar-culture.js] Loading culture navbar...');
    
    const response = await fetch('./includes/navbar-culture.html');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const navbarHtml = await response.text();
    console.log('[load-navbar-culture.js] Navbar HTML loaded successfully');
    
    // Insert navbar into DOM
    const existingHeader = document.querySelector('.site-header');
    if (existingHeader) {
      existingHeader.outerHTML = navbarHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    }
    
    console.log('[load-navbar-culture.js] Navbar inserted into DOM');
    navbarLoaded = true;
    
    // Initialize dropdowns with retry mechanism
    initializeDropdownsWithRetry();
    
    // Load shared functionality
    loadSharedNavScript();
    
  } catch (error) {
    console.error('[load-navbar-culture.js] Error loading navbar:', error);
  }
}

// Robust dropdown initialization with retry mechanism
function initializeDropdownsWithRetry(maxRetries = 5) {
  let retryCount = 0;
  
  function attemptInitialization() {
    console.log(`[load-navbar-culture.js] Attempting dropdown initialization (attempt ${retryCount + 1})`);
    
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log(`[load-navbar-culture.js] Found ${dropdowns.length} dropdowns`);
    
    if (dropdowns.length === 0) {
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`[load-navbar-culture.js] No dropdowns found, retrying in 100ms...`);
        setTimeout(attemptInitialization, 100);
        return;
      } else {
        console.error('[load-navbar-culture.js] Failed to find dropdowns after all retries');
        return;
      }
    }
    
    // Successfully found dropdowns, initialize them
    initializeDropdowns();
    initializeLanguageSelector();
    dropdownInitialized = true;
    console.log('[load-navbar-culture.js] Dropdown initialization completed successfully');
  }
  
  attemptInitialization();
}

// Initialize dropdown functionality
function initializeDropdowns() {
  console.log('[load-navbar-culture.js] Initializing dropdowns...');
  
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach((dropdown, index) => {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    
    if (!dropdownMenu || !dropdownToggle) {
      console.warn(`[load-navbar-culture.js] Dropdown ${index} missing required elements`);
      return;
    }
    
    console.log(`[load-navbar-culture.js] Setting up dropdown ${index}`);
    
    // Ensure dropdown is hidden by default
    dropdownMenu.classList.remove('show');
    
    // Remove any existing event listeners by cloning
    const newToggle = dropdownToggle.cloneNode(true);
    dropdownToggle.parentNode.replaceChild(newToggle, dropdownToggle);
    
    // Add click event listener
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(`[load-navbar-culture.js] Dropdown ${index} clicked`);
      
      // Close all other dropdowns first
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      const isVisible = dropdownMenu.classList.contains('show');
      dropdownMenu.classList.toggle('show');
      
      console.log(`[load-navbar-culture.js] Dropdown ${index} toggled. Visible: ${!isVisible}`);
    });
    
    // Add hover support for better UX
    dropdown.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) { // Only on desktop
        dropdownMenu.classList.add('show');
      }
    });
    
    dropdown.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) { // Only on desktop
        dropdownMenu.classList.remove('show');
      }
    });
  });
  
  // Global click handler to close dropdowns
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
  
  // Escape key handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
  
  console.log('[load-navbar-culture.js] Dropdown initialization completed');
}

// Initialize language selector
function initializeLanguageSelector() {
  console.log('[load-navbar-culture.js] Initializing language selector...');
  
  const translateBtn = document.getElementById('translateBtn');
  const languageDropdown = document.querySelector('.language-dropdown');
  
  if (!translateBtn || !languageDropdown) {
    console.warn('[load-navbar-culture.js] Language selector elements not found');
    return;
  }
  
  // Remove existing event listeners
  const newTranslateBtn = translateBtn.cloneNode(true);
  translateBtn.parentNode.replaceChild(newTranslateBtn, translateBtn);
  
  // Ensure language dropdown is hidden by default
  languageDropdown.classList.remove('show');
  
  // Add click event listener
  newTranslateBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
    console.log('[load-navbar-culture.js] Language dropdown toggled');
  });
  
  // Language option click handlers
  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const targetLang = e.currentTarget.dataset.lang;
      languageDropdown.classList.remove('show');
      
      console.log(`[load-navbar-culture.js] Language changed to: ${targetLang}`);
      
      if (typeof changeLanguage === 'function') {
        changeLanguage(targetLang);
      }
    });
  });
  
  // Close language dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!languageDropdown.contains(e.target) && !newTranslateBtn.contains(e.target)) {
      languageDropdown.classList.remove('show');
    }
  });
  
  // Close language dropdown with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageDropdown.classList.remove('show');
    }
  });
  
  console.log('[load-navbar-culture.js] Language selector initialization completed');
}

// Load shared navigation script
function loadSharedNavScript() {
  if (window.sharedNavLoaded) {
    console.log('[load-navbar-culture.js] shared-nav.js already loaded');
    return;
  }
  
  console.log('[load-navbar-culture.js] Loading shared-nav.js...');
  
  const script = document.createElement('script');
  script.src = './js/shared-nav.js';
  script.onload = function() {
    console.log('[load-navbar-culture.js] shared-nav.js loaded successfully');
    window.sharedNavLoaded = true;
  };
  script.onerror = function() {
    console.error('[load-navbar-culture.js] Failed to load shared-nav.js');
  };
  document.head.appendChild(script);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCultureNavbar);
} else {
  // DOM already loaded, initialize immediately
  loadCultureNavbar();
}

// Export functions for debugging
window.loadCultureNavbar = loadCultureNavbar;
window.initializeDropdowns = initializeDropdowns;
window.initializeLanguageSelector = initializeLanguageSelector; 