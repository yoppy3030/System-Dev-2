// Function to load navbar from HTML file
async function loadNavbar() {
  try {
    const response = await fetch('./includes/navbar.html');
    const navbarHtml = await response.text();
    
    console.log('[load-navbar.js] Navbar HTML loaded');
    // Find the header element and replace it with the loaded navbar
    const existingHeader = document.querySelector('.site-header');
    if (existingHeader) {
      existingHeader.outerHTML = navbarHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    }
    console.log('[load-navbar.js] Navbar inserted into DOM');
    
    // Check if shared-nav.js is already loaded
    if (window.sharedNavLoaded) {
      console.log('[load-navbar.js] shared-nav.js already loaded, reinitializing');
      if (typeof initializeDropdowns === 'function') {
        console.log('[load-navbar.js] Calling initializeDropdowns');
        initializeDropdowns();
      } else {
        console.warn('[load-navbar.js] initializeDropdowns is not a function');
      }
      if (typeof initializeLanguageSelector === 'function') {
        console.log('[load-navbar.js] Calling initializeLanguageSelector');
        initializeLanguageSelector();
      } else {
        console.warn('[load-navbar.js] initializeLanguageSelector is not a function');
      }
      return;
    }
    
    // Load and initialize the shared navigation functionality
    const script = document.createElement('script');
    script.src = './js/shared-nav.js';
    script.onload = function() {
      console.log('[load-navbar.js] shared-nav.js loaded');
      window.sharedNavLoaded = true;
      // Initialize dropdown functionality after script loads
      if (typeof initializeDropdowns === 'function') {
        console.log('[load-navbar.js] Calling initializeDropdowns');
        initializeDropdowns();
      } else {
        console.warn('[load-navbar.js] initializeDropdowns is not a function');
      }
      if (typeof initializeLanguageSelector === 'function') {
        console.log('[load-navbar.js] Calling initializeLanguageSelector');
        initializeLanguageSelector();
      } else {
        console.warn('[load-navbar.js] initializeLanguageSelector is not a function');
      }
    };
    script.onerror = function() {
      console.error('[load-navbar.js] Failed to load shared-nav.js');
    };
    document.head.appendChild(script);
    
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

// Load navbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  loadNavbar();
} 