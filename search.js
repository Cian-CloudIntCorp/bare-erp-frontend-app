// ============================================
// SEARCH.JS - Global Search Functionality
// ============================================

// ============================================
// 1. SEARCH DATA (Mock Database)
// ============================================
const SEARCH_DATA = {
    employees: [
        { id: 'EMP-2847', name: 'Sarah Anderson', role: 'Senior Software Engineer', department: 'Engineering', type: 'employee', module: 'hr' },
        { id: 'EMP-9103', name: 'Marcus Bell', role: 'Product Manager', department: 'Product', type: 'employee', module: 'hr' },
        { id: 'EMP-5521', name: 'Jessica Chen', role: 'Lead UX Designer', department: 'Design', type: 'employee', module: 'hr' },
        { id: 'EMP-7834', name: 'David Martinez', role: 'DevOps Engineer', department: 'Engineering', type: 'employee', module: 'hr' },
        { id: 'EMP-2109', name: 'Emily Rodriguez', role: 'Finance Director', department: 'Finance', type: 'employee', module: 'hr' }
    ],
    invoices: [
        { id: 'INV-00123', customer: 'TechCorp', amount: '$15,000', status: 'Due', type: 'invoice', module: 'finance' },
        { id: 'INV-00124', customer: 'Innovate Solutions', amount: '$8,500', status: 'Paid', type: 'invoice', module: 'finance' },
        { id: 'INV-00125', customer: 'Global Dynamics', amount: '$22,000', status: 'Overdue', type: 'invoice', module: 'finance' },
        { id: 'INV-00126', customer: 'Enterprise Inc', amount: '$31,500', status: 'Due', type: 'invoice', module: 'finance' },
        { id: 'INV-00127', customer: 'Startup XYZ', amount: '$5,200', status: 'Paid', type: 'invoice', module: 'finance' }
    ],
    leads: [
        { id: 'LEAD-4521', name: 'Jennifer Martinez', company: 'TechCorp', value: '$125,000', stage: 'Proposal', type: 'lead', module: 'crm' },
        { id: 'LEAD-4522', name: 'David Kim', company: 'StartupXYZ', value: '$85,000', stage: 'Discovery', type: 'lead', module: 'crm' },
        { id: 'LEAD-4523', name: 'Sarah Johnson', company: 'Enterprise Co', value: '$240,000', stage: 'Negotiation', type: 'lead', module: 'crm' },
        { id: 'LEAD-4524', name: 'Michael Chen', company: 'InnovateLab', value: '$45,000', stage: 'Initial', type: 'lead', module: 'crm' },
        { id: 'LEAD-4525', name: 'Lisa Park', company: 'Digital Solutions', value: '$92,000', stage: 'Qualified', type: 'lead', module: 'crm' }
    ]
};

// ============================================
// 2. SEARCH ALGORITHM
// ============================================
function performSearch(query) {
    if (!query || query.length < 2) return [];
    
    query = query.toLowerCase();
    const results = [];
    
    // Search employees
    SEARCH_DATA.employees.forEach(emp => {
        const searchText = `${emp.id} ${emp.name} ${emp.role} ${emp.department}`.toLowerCase();
        if (searchText.includes(query)) {
            results.push({
                ...emp,
                score: calculateRelevance(query, searchText, emp.name.toLowerCase())
            });
        }
    });
    
    // Search invoices
    SEARCH_DATA.invoices.forEach(inv => {
        const searchText = `${inv.id} ${inv.customer} ${inv.amount}`.toLowerCase();
        if (searchText.includes(query)) {
            results.push({
                ...inv,
                score: calculateRelevance(query, searchText, inv.id.toLowerCase())
            });
        }
    });
    
    // Search leads
    SEARCH_DATA.leads.forEach(lead => {
        const searchText = `${lead.id} ${lead.name} ${lead.company} ${lead.stage}`.toLowerCase();
        if (searchText.includes(query)) {
            results.push({
                ...lead,
                score: calculateRelevance(query, searchText, lead.name.toLowerCase())
            });
        }
    });
    
    // Sort by relevance score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, 10); // Return top 10 results
}

// ============================================
// 3. RELEVANCE SCORING
// ============================================
function calculateRelevance(query, fullText, primaryField) {
    let score = 0;
    
    // Exact match in primary field gets highest score
    if (primaryField === query) score += 100;
    
    // Starts with query in primary field
    else if (primaryField.startsWith(query)) score += 75;
    
    // Contains query in primary field
    else if (primaryField.includes(query)) score += 50;
    
    // Appears anywhere in full text
    else if (fullText.includes(query)) score += 25;
    
    // Bonus for shorter query (more specific)
    score += Math.max(0, 10 - query.length);
    
    return score;
}

// ============================================
// 4. RENDER SEARCH RESULTS
// ============================================
function renderSearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <p>No results found</p>
            </div>
        `;
        resultsContainer.classList.add('show');
        return;
    }
    
    const html = results.map(result => {
        const icon = getTypeIcon(result.type);
        const badge = getTypeBadge(result.type);
        
        return `
            <div class="search-result-item" data-module="${result.module}" data-id="${result.id}">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    ${icon}
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <span style="font-weight: 600; color: var(--text-primary);">${getDisplayName(result)}</span>
                            ${badge}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">
                            ${getSubtext(result)}
                        </div>
                    </div>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
        `;
    }).join('');
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('show');
    
    // Add click handlers
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const module = item.dataset.module;
            const id = item.dataset.id;
            
            // Log search action
            window.SecurityService.logAction('SEARCH_CLICK', module, { id, query: document.getElementById('global-search-input').value });
            
            // Navigate to module
            loadModule(module);
            
            // Close search results
            closeSearchResults();
        });
    });
}

// ============================================
// 5. HELPER FUNCTIONS
// ============================================
function getTypeIcon(type) {
    const icons = {
        employee: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
        invoice: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
        lead: '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
    };
    return icons[type] || '';
}

function getTypeBadge(type) {
    const badges = {
        employee: '<span style="background: rgba(59, 130, 246, 0.1); color: var(--primary-blue); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; text-transform: uppercase; font-weight: 600;">Employee</span>',
        invoice: '<span style="background: rgba(234, 179, 8, 0.1); color: var(--primary-yellow); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; text-transform: uppercase; font-weight: 600;">Invoice</span>',
        lead: '<span style="background: rgba(147, 51, 234, 0.1); color: var(--primary-purple); padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; text-transform: uppercase; font-weight: 600;">Lead</span>'
    };
    return badges[type] || '';
}

function getDisplayName(result) {
    if (result.type === 'employee') return result.name;
    if (result.type === 'invoice') return result.id;
    if (result.type === 'lead') return result.name;
    return '';
}

function getSubtext(result) {
    if (result.type === 'employee') return `${result.id} • ${result.role} • ${result.department}`;
    if (result.type === 'invoice') return `${result.customer} • ${result.amount} • ${result.status}`;
    if (result.type === 'lead') return `${result.company} • ${result.value} • ${result.stage}`;
    return '';
}

function closeSearchResults() {
    document.getElementById('search-results').classList.remove('show');
    document.getElementById('global-search-input').value = '';
}

// ============================================
// 6. DEBOUNCE FOR PERFORMANCE
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// 7. INITIALIZE SEARCH
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('global-search-input');
    
    if (!searchInput) return;
    
    // Search on input (debounced for performance)
    const debouncedSearch = debounce((query) => {
        if (query.length < 2) {
            closeSearchResults();
            return;
        }
        
        const results = performSearch(query);
        renderSearchResults(results);
        
        // Log search
        window.SecurityService.logAction('SEARCH', 'global', { query, resultCount: results.length });
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            closeSearchResults();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Escape to close search
        if (e.key === 'Escape') {
            closeSearchResults();
            searchInput.blur();
        }
    });
});

// ============================================
// 8. EXPORT FOR EXTERNAL USE
// ============================================
window.SearchService = {
    performSearch,
    closeSearchResults
};
