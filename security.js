// ============================================
// SECURITY.JS - Enterprise Authentication & Authorization
// ============================================

// ============================================
// 1. AUTHENTICATION CHECK
// ============================================
function checkAuth() {
    // 1. BYPASS: Don't check auth if we are already on the login page
    // This prevents the infinite redirect loop
    const path = window.location.pathname;
    if (path.includes('login.html')) {
        return null;
    }

    const token = localStorage.getItem('erp_auth_token');
    
    if (!token) {
        // Not logged in - redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    try {
        // Decode token
        const session = JSON.parse(atob(token));
        
        // Check if expired
        if (session.exp < Date.now()) {
            alert('Session expired. Please log in again.');
            logout();
            return null;
        }
        
        return session;
    } catch (e) {
        // Invalid token
        console.error('Invalid auth token:', e);
        logout();
        return null;
    }
}

// ============================================
// 2. AUTHORIZATION - Role-Based Access Control
// ============================================
function hasPermission(permission) {
    const session = checkAuth();
    if (!session) return false;
    
    return session.permissions.includes(permission);
}

function enforceModuleAccess() {
    const session = checkAuth();
    if (!session) return;
    
    // Get all sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const requiredPermission = item.dataset.permission;
        
        if (requiredPermission && !hasPermission(requiredPermission)) {
            // User doesn't have permission - lock this module
            item.classList.add('locked');
            
            // Show lock icon if it exists
            const lockIcon = item.querySelector('.lock-icon');
            if (lockIcon) lockIcon.style.display = 'block';
            
            // Disable click
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                alert(`Access Denied: You don't have permission to view this module.\n\nRequired permission: ${requiredPermission}\nYour role: ${session.role}`);
            });
        }
    });
}

// ============================================
// 3. LOGOUT FUNCTION
// ============================================
function logout() {
    localStorage.removeItem('erp_auth_token');
    localStorage.removeItem('erp_user_name');
    localStorage.removeItem('erp_user_role');
    window.location.href = 'login.html';
}

// ============================================
// 4. SESSION MONITORING
// ============================================
function monitorSession() {
    // Only monitor if not on login page
    if (window.location.pathname.includes('login.html')) return;

    const session = checkAuth();
    if (!session) return;
    
    // Check every minute if session is still valid
    setInterval(() => {
        const currentSession = checkAuth();
        if (!currentSession) {
            // CheckAuth handles the alert/redirect
        }
    }, 60000); // Check every 60 seconds
}

// ============================================
// 5. AUDIT LOGGING (for compliance)
// ============================================
function logAction(action, module, details = {}) {
    const session = checkAuth();
    if (!session) return;
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        user: session.email,
        role: session.role,
        action: action,
        module: module,
        details: details
    };
    
    // In production, send to backend API
    console.log('AUDIT LOG:', logEntry);
    
    // Store in localStorage for demo (in production, backend handles this)
    const auditLog = JSON.parse(localStorage.getItem('erp_audit_log') || '[]');
    auditLog.push(logEntry);
    localStorage.setItem('erp_audit_log', JSON.stringify(auditLog));
}

// ============================================
// 6. INITIALIZE SECURITY
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    // If we are on the login page, don't run the full initialization
    if (window.location.pathname.includes('login.html')) return;

    // Check authentication
    const session = checkAuth();
    if (!session) return;
    
    // Display user info
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = session.name || session.email;
    }
    
    // Enforce module access permissions
    enforceModuleAccess();
    
    // Start session monitoring
    monitorSession();
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                logAction('LOGOUT', 'auth');
                logout();
            }
        });
    }
    
    // Log successful login (page load)
    logAction('PAGE_LOAD', 'app');
});

// ============================================
// 7. EXPORT FUNCTIONS
// ============================================
window.SecurityService = {
    checkAuth,
    hasPermission,
    logout,
    logAction
};
