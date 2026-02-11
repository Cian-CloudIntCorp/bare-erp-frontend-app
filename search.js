// ============================================
// SEARCH.JS - Enterprise Global Search
// ============================================

const SEARCH_DATA = [
    { id: 'EMP-2847', title: 'Sarah Anderson', subtitle: 'Engineering • Active', type: 'hr' },
    { id: 'EMP-2891', title: 'Marcus Chen', subtitle: 'Product • Active', type: 'hr' },
    { id: 'INV-2024', title: 'Invoice #2024', subtitle: 'Acme Corp • $12,450', type: 'finance' },
    { id: 'LEAD-001', title: 'Jennifer Martinez', subtitle: 'TechCorp • Hot Lead', type: 'crm' }
];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('search-results');

    if (!input || !resultsContainer) return;

    // Force styles to ensure visibility over other elements
    resultsContainer.style.position = 'absolute';
    resultsContainer.style.zIndex = '9999';
    resultsContainer.style.width = '100%';
    resultsContainer.style.backgroundColor = '#0f172a'; // Match sidebar dark blue
    resultsContainer.style.border = '1px solid rgba(59, 130, 246, 0.3)';
    resultsContainer.style.borderRadius = '0.5rem';
    resultsContainer.style.marginTop = '0.5rem';
    resultsContainer.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            resultsContainer.innerHTML = '';
            return;
        }

        const results = SEARCH_DATA.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.id.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = results.map(item => `
                <div class="p-3 hover:bg-blue-900/30 cursor-pointer border-b border-slate-700/50 transition-colors" 
                     onclick="window.loadModule('${item.type}'); document.getElementById('search-results').style.display='none';">
                    <div class="font-semibold text-gray-100">${item.title}</div>
                    <div class="text-xs text-gray-400">${item.id} • ${item.subtitle}</div>
                </div>
            `).join('');
        } else {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `<div class="p-3 text-sm text-gray-500">No results found</div>`;
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            resultsContainer.style.display = 'none';
        }
    });
});
