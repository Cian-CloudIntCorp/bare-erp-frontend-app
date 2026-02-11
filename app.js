// app.js - Enterprise Module Loader

document.addEventListener('DOMContentLoaded', () => {
    // Removed SecurityService related code as the service is not implemented.
    // If a security service is implemented later, it can be re-integrated here.

    // --- SELECTORS ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const headerLinks = document.querySelectorAll('.header-nav a');
    const appContent = document.getElementById('app-content');

    // --- CORE LOADING FUNCTION ---
    async function loadModule(moduleName) {
        // UI: Remove active class from all sidebar items and header links
        document.querySelectorAll('.sidebar-item, .header-nav a').forEach(item => {
            item.classList.remove('active');
        });

        // UI: Add active class to Sidebar Item (if found)
        const activeSidebar = document.getElementById(`${moduleName}-nav`);
        if (activeSidebar) {
            activeSidebar.classList.add('active');
        }

        // UI: Add active class to Header Link (if found)
        const activeHeader = document.querySelector(`.header-nav a[data-module='${moduleName}']`);
        if (activeHeader) {
            activeHeader.classList.add('active');
        }

        // UI: Show loading state
        appContent.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <h2 class="section-title mb-4">Loading ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}...</h2>
                    <div class="loading-spinner"></div>
                    <p>Fetching module data.</p>
                </div>
            </div>
        `;

        try {
            // Fetch logic: Correctly points to modules/ folder.
            const response = await fetch(`modules/${moduleName}.html`);
            
            if (!response.ok) {
                // Handle HTTP errors (e.g., 404 Not Found)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            appContent.innerHTML = html;
        } catch (error) {
            console.error('Error loading module:', error);
            appContent.innerHTML = `
                <div class="flex items-center justify-center h-full text-red-500">
                    <div class="text-center">
                        <h2 class="section-title mb-4">Error</h2>
                        <p>Could not load the ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} module.</p>
                        <p class="text-sm mt-2 text-gray-400">Please ensure '${moduleName}.html' exists in the 'modules' folder and is accessible.</p>
                    </div>
                </div>
            `;
        }
    }

    // --- NAVIGATION HANDLER ---
    function handleNavigation(e, element) {
        e.preventDefault();
        const moduleName = element.dataset.module;
        
        if (!moduleName) {
            console.warn('Navigation element missing data-module attribute:', element);
            return;
        }

        loadModule(moduleName);
    }

    // --- EVENT LISTENERS ---
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => handleNavigation(e, item));
    });

    headerLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavigation(e, link));
    });

    // --- EXPOSE TO WINDOW (For potential external interactions) ---
    window.loadModule = loadModule;

    // --- INITIAL LOAD ---
    // Load 'hr' by default on first page load.
    loadModule('hr');
});
