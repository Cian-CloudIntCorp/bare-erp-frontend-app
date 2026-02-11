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

    // Force style on container to ensure visibility
    resultsContainer.style.position = 'absolute';
    resultsContainer.style.zIndex = '9999';
    resultsContainer.style.width = '100%';
    resultsContainer.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
    resultsContainer.style.border = '1px solid rgba(59, 130, 246, 0.3)';
    resultsContainer.style.backdropFilter = 'blur(10px)';

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = '';
            return;
        }

        const results = SEARCH_DATA.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.id.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = results.map(item => `
                <div class="p-3 hover:bg-blue-600/20 cursor-pointer border-b border-slate-700/50 transition-colors" 
                     onclick="window.loadModule('${item.type}'); document.getElementById('search-results').classList.add('hidden');">
                    <div class="font-semibold text-gray-100">${item.title}</div>
                    <div class="text-xs text-gray-400">${item.id} • ${item.subtitle}</div>
                </div>
            `).join('');
        } else {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `<div class="p-3 text-sm text-gray-500">No results found</div>`;
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.global-search')) {
            resultsContainer.classList.add('hidden');
        }
    });
});
