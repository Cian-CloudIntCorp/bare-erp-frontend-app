// ============================================
// SEARCH.JS - Enterprise Global Search
// ============================================

const SEARCH_DATA = [
    { id: 'EMP-2847', title: 'Sarah Anderson', subtitle: 'Engineering • Active', type: 'hr' },
    { id: 'EMP-2891', title: 'Marcus Chen', subtitle: 'Product • Active', type: 'hr' },
    { id: 'INV-2847', title: 'Invoice #2847', subtitle: 'Acme Corp • $12,450', type: 'finance' },
    { id: 'LEAD-001', title: 'Jennifer Martinez', subtitle: 'TechCorp • Hot Lead', type: 'crm' }
];

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('search-results');

    if (!input || !resultsContainer) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.classList.remove('show'); // CSS class toggle
            resultsContainer.innerHTML = '';
            return;
        }

        const results = SEARCH_DATA.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.id.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            resultsContainer.classList.add('show'); // Show the results
            resultsContainer.innerHTML = results.map(item => `
                <div class="search-result-item" 
                     onclick="window.loadModule('${item.type}'); document.getElementById('search-results').classList.remove('show');">
                    <div style="font-weight: 600; color: #e5e7eb;">${item.title}</div>
                    <div style="font-size: 0.75rem; color: #9ca3af;">${item.id} • ${item.subtitle}</div>
                </div>
            `).join('');
        } else {
            resultsContainer.classList.add('show');
            resultsContainer.innerHTML = `<div class="p-4 text-sm text-gray-500">No results found</div>`;
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            resultsContainer.classList.remove('show');
        }
    });
});
