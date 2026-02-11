# 🔐 Enterprise Security & Search Implementation Guide

## Overview

This guide shows you how to add enterprise-grade security and global search to your existing Bare-ERP system.

---

## 📦 What You're Getting

### Security Features:
- ✅ Login/logout with JWT-like tokens
- ✅ Role-based access control (RBAC)
- ✅ Session management (8-hour timeout)
- ✅ Permission-based module locking
- ✅ Audit logging (compliance)
- ✅ Session monitoring

### Search Features:
- ✅ Global search bar in header
- ✅ Search across employees, invoices, leads
- ✅ Real-time results as you type
- ✅ Relevance scoring
- ✅ Click to navigate to module
- ✅ Keyboard shortcuts (Ctrl+K)

---

## 🚀 Quick Start Installation

### Step 1: Add New Files

Add these 3 new files to your project:

```
your-project/
├── login.html          ← NEW (login page)
├── security.js         ← NEW (auth middleware)
├── search.js           ← NEW (search functionality)
├── index.html          (replace with index-secure.html)
├── app.js              (keep your existing one)
└── modules/
    ├── hr.html
    ├── finance.html
    └── crm.html
```

### Step 2: Replace index.html

**Option A: Complete Replace**
```bash
# Backup your current index.html
mv index.html index-old.html

# Use the secure version
mv index-secure.html index.html
```

**Option B: Manual Integration** (if you've customized your index.html)

Add these sections to your existing `index.html`:

1. **In `<header>` section** - Add search bar:
```html
<header class="header">
    <!-- Add this -->
    <div class="global-search">
        <svg class="search-icon">...</svg>
        <input 
            type="text" 
            id="global-search-input"
            class="search-input" 
            placeholder="Search employees, invoices, leads..."
        />
        <div id="search-results" class="search-results"></div>
    </div>
    
    <!-- User info -->
    <div class="user-menu">
        <div class="user-info">
            <div id="user-name">Admin User</div>
        </div>
        <button class="btn-logout" id="logout-btn">Logout</button>
    </div>
</header>
```

2. **In sidebar items** - Add permission attributes:
```html
<div id="hr-nav" class="sidebar-item" data-module="hr" data-permission="hr.read">
    <span>HR</span>
    <svg class="lock-icon" style="display: none;">🔒</svg>
</div>
```

3. **Before closing `</body>` tag** - Add scripts:
```html
<script src="security.js"></script>
<script src="search.js"></script>
<script src="app.js"></script>
```

### Step 3: Add CSS for Search

Add this to your `<style>` section in `index.html`:

```css
/* Global Search Styles */
.global-search {
    position: relative;
    width: 400px;
}

.search-input {
    width: 100%;
    background: rgba(31, 41, 55, 0.6);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    color: var(--text-primary);
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: var(--text-muted);
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(17, 24, 39, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
    display: none;
    z-index: 1000;
}

.search-results.show {
    display: block;
}

.search-result-item {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-primary);
    cursor: pointer;
    transition: background 0.2s ease;
}

.search-result-item:hover {
    background: rgba(59, 130, 246, 0.1);
}
```

---

## 👤 User Roles & Permissions

### Pre-configured Accounts

The system comes with 4 demo accounts:

| Email | Password | Role | Can Access |
|-------|----------|------|------------|
| **admin@erp.com** | admin123 | Admin | All modules (full access) |
| **hr@erp.com** | hr123 | HR Manager | HR module only |
| **finance@erp.com** | fin123 | Finance Manager | Finance module only |
| **viewer@erp.com** | view123 | Viewer | All modules (read-only) |

### Permission Matrix

```
Module Access:
┌──────────┬─────┬─────────┬─────┬────────┐
│ Role     │ HR  │ Finance │ CRM │ Write  │
├──────────┼─────┼─────────┼─────┼────────┤
│ Admin    │ ✅  │ ✅      │ ✅  │ ✅     │
│ HR Mgr   │ ✅  │ ❌      │ ❌  │ ✅ HR  │
│ Fin Mgr  │ ❌  │ ✅      │ ❌  │ ✅ Fin │
│ Viewer   │ ✅  │ ✅      │ ✅  │ ❌     │
└──────────┴─────┴─────────┴─────┴────────┘
```

---

## 🔐 How Security Works

### 1. Login Flow

```
User visits site
    ↓
Redirected to login.html
    ↓
Enter credentials
    ↓
Security.js validates
    ↓
Creates session token (stored in localStorage)
    ↓
Redirects to index.html
    ↓
Security.js checks token on every page load
```

### 2. Session Token Structure

```javascript
{
    email: "admin@erp.com",
    role: "admin",
    permissions: ["hr.read", "hr.write", "finance.read", ...],
    name: "Admin User",
    exp: 1739303600000  // 8 hours from now
}
```

Stored in localStorage as base64-encoded string.

### 3. Permission Enforcement

When sidebar loads:
```javascript
// Check each module
if (!hasPermission('hr.read')) {
    // Lock HR module
    hrNavItem.classList.add('locked');
    hrNavItem.querySelector('.lock-icon').show();
}
```

User sees:
```
✅ HR          (if has permission)
🔒 HR          (if locked)
```

### 4. Audit Logging

Every action is logged:
```javascript
{
    timestamp: "2026-02-11T12:34:56Z",
    user: "admin@erp.com",
    role: "admin",
    action: "SEARCH",
    module: "global",
    details: { query: "Sarah Anderson" }
}
```

View logs:
```javascript
// In browser console
JSON.parse(localStorage.getItem('erp_audit_log'))
```

---

## 🔍 How Search Works

### 1. Search Algorithm

```
User types "sarah"
    ↓
Debounced (300ms wait)
    ↓
Search across:
  - Employees (name, ID, role, dept)
  - Invoices (ID, customer, amount)
  - Leads (name, company, stage)
    ↓
Calculate relevance scores
    ↓
Sort by score (highest first)
    ↓
Return top 10 results
```

### 2. Relevance Scoring

```javascript
Exact match in name      → +100 points
Starts with query        → +75 points
Contains query           → +50 points
Appears in any field     → +25 points
Shorter query (specific) → +bonus
```

Example:
```
Query: "sarah"

Results:
1. Sarah Anderson (100 pts) - exact name match
2. Sarah Johnson  (100 pts) - exact name match
3. INV-Sarah-Corp (50 pts)  - contains in customer
```

### 3. Keyboard Shortcuts

- **Ctrl+K** or **Cmd+K**: Focus search bar
- **Escape**: Close search results
- **Enter**: Navigate to first result

---

## 🎨 Customization Options

### Add New User Roles

Edit `login.html`:

```javascript
const USERS = {
    'newuser@erp.com': {
        password: 'newpass123',
        role: 'custom_role',
        permissions: ['hr.read', 'crm.write'],
        name: 'New User'
    }
};
```

### Add More Search Data

Edit `search.js`:

```javascript
const SEARCH_DATA = {
    employees: [...],
    invoices: [...],
    leads: [...],
    
    // Add new category
    projects: [
        { id: 'PROJ-001', name: 'Website Redesign', type: 'project', module: 'projects' }
    ]
};
```

### Change Session Timeout

Edit `login.html`:

```javascript
// Default: 8 hours
exp: Date.now() + (8 * 60 * 60 * 1000)

// Change to 4 hours
exp: Date.now() + (4 * 60 * 60 * 1000)

// Change to 24 hours
exp: Date.now() + (24 * 60 * 60 * 1000)
```

---

## 🧪 Testing the Security

### Test 1: Access Control
1. Log in as `hr@erp.com` / `hr123`
2. Try to click Finance module
3. Should see: "Access Denied" alert
4. ✅ Pass if locked

### Test 2: Session Timeout
1. Log in as any user
2. Open DevTools → Application → Local Storage
3. Find `erp_auth_token`
4. Change `exp` value to `1` (expired)
5. Refresh page
6. ✅ Pass if redirected to login

### Test 3: Audit Logging
1. Log in as `admin@erp.com`
2. Open DevTools Console
3. Run: `JSON.parse(localStorage.getItem('erp_audit_log'))`
4. ✅ Pass if shows login event

### Test 4: Global Search
1. Type "sarah" in search bar
2. Should see results within 300ms
3. Click a result
4. ✅ Pass if navigates to correct module

---

## 🚀 Production Deployment

### Security Hardening for Production:

1. **Move auth to backend**:
```javascript
// Instead of localStorage tokens
// Use httpOnly cookies set by backend

// login.html (send to backend API)
fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Send cookies
    body: JSON.stringify({ email, password })
});
```

2. **Use real JWT tokens**:
```javascript
// Backend generates proper JWT
const jwt = require('jsonwebtoken');
const token = jwt.sign(
    { email, role, permissions },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
);
```

3. **Hash passwords**:
```javascript
// Never store plain passwords!
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 10);
```

4. **Add HTTPS**:
```nginx
# Force HTTPS in nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

5. **Add rate limiting**:
```javascript
// Prevent brute force attacks
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts
});
```

---

## 📋 Deployment Checklist

- [ ] All files uploaded (login.html, security.js, search.js, index-secure.html)
- [ ] CSS added for search bar
- [ ] Scripts loaded in correct order
- [ ] Test all 4 user accounts
- [ ] Test module locking (login as hr@erp.com)
- [ ] Test search functionality
- [ ] Test session timeout
- [ ] Review audit logs
- [ ] Update user credentials (change default passwords!)
- [ ] Configure backend API (if using production setup)
- [ ] Enable HTTPS
- [ ] Set up monitoring/alerts

---

## 🆘 Troubleshooting

### Issue: "Redirect loop to login.html"
**Cause**: Token not being set properly.
**Fix**: Check browser console for errors. Clear localStorage and try again.

### Issue: "Search bar not showing"
**Cause**: CSS not loaded or conflicting styles.
**Fix**: Add `.global-search` styles to `<style>` section.

### Issue: "All modules locked"
**Cause**: Permissions not set correctly.
**Fix**: Check `data-permission` attributes match permissions in user object.

### Issue: "Search returns no results"
**Cause**: Module not loaded or `SEARCH_DATA` empty.
**Fix**: Verify `search.js` is loaded before `app.js`.

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify all files are loaded (DevTools → Network tab)
3. Check localStorage has `erp_auth_token`
4. Review audit logs for clues

---

**Ready to deploy!** 🚀
