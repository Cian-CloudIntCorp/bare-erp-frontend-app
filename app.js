// app.js - Enterprise Module Loader & Interactions

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SECURITY CHECK ---
    if (window.SecurityService) {
        const session = window.SecurityService.checkAuth();
        if (!session) return; 
        
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
                    <h2 class="text-2xl font-bold mb-4 text-blue-500">Loading...</h2>
                </div>
            </div>`;

        try {
            const response = await fetch(`modules/${moduleName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            appContent.innerHTML = html;
        } catch (error) {
            appContent.innerHTML = `<div class="p-10 text-center text-red-400">Error loading module.</div>`;
        }
    }

    // --- 3. EVENT LISTENERS ---
    function handleNavigation(e, element) {
        e.preventDefault();
        const moduleName = element.dataset.module;
        // Security Check
        if (window.SecurityService && element.dataset.permission) {
            if (!window.SecurityService.hasPermission(element.dataset.permission)) {
                alert('⛔ Access Denied');
                return;
            }
        }
        loadModule(moduleName);
    }

    sidebarItems.forEach(item => item.addEventListener('click', (e) => handleNavigation(e, item)));
    headerLinks.forEach(link => link.addEventListener('click', (e) => handleNavigation(e, link)));

    // --- 4. BUTTON INTERACTIONS (The Fix) ---
    document.addEventListener('click', (e) => {
        // Find the closest button if user clicked an icon inside a button
        const btn = e.target.closest('button');
        if (!btn) return;

        const text = btn.innerText.trim();

        // Logout Logic
        if (btn.id === 'logout-btn' || text.includes('Logout')) {
            if(confirm('Log out of Enterprise ERP?')) window.SecurityService.logout();
            return;
        }

        // Action Buttons (Mock Logic)
        if (text.includes('Create Invoice')) alert('🧾 STARTING INVOICE WIZARD...\n\n(This would open a modal in a real app)');
        else if (text.includes('Add Employee')) alert('👤 OPENING HR FORM...\n\n(New Employee Wizard)');
        else if (text.includes('Add Lead')) alert('🚀 NEW LEAD ENTRY...\n\n(CRM Contact Form)'); // <--- FIXED THIS LINE
        else if (text.includes('Export')) alert('📊 DOWNLOADING REPORT...\n\n(Generating CSV...)');
        else if (text.includes('Settings')) alert('⚙️ OPENING SETTINGS PANEL');
        else if (text.includes('Send Reminders')) alert('📧 SENDING EMAILS...\n\n(Reminders sent to 5 clients)');
    });

    // --- 5. INITIAL LOAD ---
    window.loadModule = loadModule;
    loadModule('hr');
});
