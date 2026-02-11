// app.js - Enterprise Module Loader & Interaction Controller

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SECURITY CHECK ---
    if (window.SecurityService) {
        const session = window.SecurityService.checkAuth();
        if (!session) return; 
        
        // Update User Name in Header
        const userDisplay = document.getElementById('user-name');
        if (userDisplay && session.name) userDisplay.textContent = session.name;
    }

    // --- 2. CORE NAVIGATION ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const headerLinks = document.querySelectorAll('.header-nav a');
    const appContent = document.getElementById('app-content');

    async function loadModule(moduleName) {
        // UI Updates
        document.querySelectorAll('.sidebar-item, .header-nav a').forEach(item => item.classList.remove('active'));
        
        const activeSidebar = document.getElementById(`${moduleName}-nav`);
        if (activeSidebar) activeSidebar.classList.add('active');
        
        const activeHeader = document.querySelector(`.header-nav a[data-module='${moduleName}']`);
        if (activeHeader) activeHeader.classList.add('active');

        // Loading State
        appContent.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <h2 class="text-2xl font-bold mb-4 text-blue-500">Loading ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}...</h2>
                    <p>Fetching enterprise data...</p>
                </div>
            </div>`;

        try {
            const response = await fetch(`modules/${moduleName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            appContent.innerHTML = html;
        } catch (error) {
            console.error('Error loading module:', error);
            appContent.innerHTML = `<div class="p-10 text-center text-red-400">Error loading module. Please check console.</div>`;
        }
    }

    // --- 3. EVENT LISTENERS (Navigation) ---
    function handleNavigation(e, element) {
        e.preventDefault();
        const moduleName = element.dataset.module;
        
        // Check Permissions if SecurityService is active
        if (window.SecurityService && element.dataset.permission) {
            if (!window.SecurityService.hasPermission(element.dataset.permission)) {
                alert('⛔ Access Denied: Insufficient Permissions');
                return;
            }
        }
        loadModule(moduleName);
    }

    sidebarItems.forEach(item => item.addEventListener('click', (e) => handleNavigation(e, item)));
    headerLinks.forEach(link => link.addEventListener('click', (e) => handleNavigation(e, link)));

    // --- 4. GLOBAL BUTTON INTERACTIONS (The Fix) ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        // Logout
        if (btn.id === 'logout-btn' || btn.innerText.includes('Logout')) {
            if(confirm('Are you sure you want to log out?')) window.SecurityService.logout();
            return;
        }

        // Action Buttons (Mock Logic)
        const text = btn.innerText.trim();
        
        if (text.includes('Create Invoice')) {
            alert('🧾 INVOICE WIZARD\n\nStarting new invoice generation workflow...');
        } else if (text.includes('Add Employee')) {
            alert('👤 HR ONBOARDING\n\nOpening new employee registration form...');
        } else if (text.includes('Export')) {
            alert('📊 DATA EXPORT\n\nDownloading CSV report...');
        } else if (text.includes('Settings')) {
            alert('⚙️ SYSTEM SETTINGS\n\nGlobal configuration panel.');
        } else if (text.includes('Send Reminders')) {
            alert('📧 EMAIL JOB\n\nSending payment reminders to 5 clients...');
        }
    });

    // --- 5. INITIAL LOAD ---
    window.loadModule = loadModule; // Expose for search
    loadModule('hr');
});
