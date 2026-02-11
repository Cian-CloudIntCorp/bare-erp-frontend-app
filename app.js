// app.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const headerLinks = document.querySelectorAll('.header-nav a');
    const appContent = document.getElementById('app-content');

    // Function to fetch and inject content
    async function loadModule(moduleName) {
        // Remove active class from all sidebar items and header links
        document.querySelectorAll('.sidebar-item, .header-nav a').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked item/link
        document.getElementById(`${moduleName}-nav`).classList.add('active');
        document.querySelector(`.header-nav a[data-module='${moduleName}']`).classList.add('active');

        // Show loading state
        appContent.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <h2 class="section-title mb-4">Loading ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}...</h2>
                    <p>Fetching module data.</p>
                </div>
            </div>
        `;

        try {
            const response = await fetch(`/modules/${moduleName}.html`);
            if (!response.ok) {
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
                        <p>Could not load the ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} module. Please try again later.</p>
                    </div>
                </div>
            `;
        }
    }

    // Add event listeners for sidebar clicks
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = item.dataset.module;
            loadModule(moduleName);
        });
    });

    // Add event listeners for header link clicks
    headerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = link.dataset.module;
            loadModule(moduleName);
        });
    });

    // Default load: HR module on first page load
    loadModule('hr');
});
