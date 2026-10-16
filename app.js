// AgentMoney frontend logic

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('use-case-grid');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const totalCasesEl = document.getElementById('total-cases');
  const newsletterForm = document.getElementById('newsletter-form');

  // Update total count
  if (totalCasesEl) {
    totalCasesEl.textContent = useCases.length;
  }

  // Render use cases
  function renderUseCases(list) {
    if (!grid) return;
    if (list.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; padding: 40px;">No use cases match your search. Try a different term.</p>';
      return;
    }
    grid.innerHTML = list.map(uc => `
      <article class="use-case-card" data-category="${uc.category}">
        <div class="use-case-meta">
          <span class="use-case-tag">${formatCategory(uc.category)}</span>
          <span>${uc.date}</span>
          <span>· ${uc.source}</span>
        </div>
        <h3>${uc.title}</h3>
        <p>${uc.description}</p>
        <div class="use-case-result"><strong>Result:</strong> ${uc.result}</div>
        <div class="use-case-footer">
          <span class="agent-badge">${uc.agent}</span>
          <a href="#" class="view-prompt" data-id="${uc.id}">View prompt →</a>
        </div>
      </article>
    `).join('');
  }

  function formatCategory(cat) {
    const map = {
      trading: 'Trading',
      'side-hustles': 'Side Hustle',
      bills: 'Bills & Savings',
      leads: 'Lead Gen',
      content: 'Content',
      unclaimed: 'Unclaimed $'
    };
    return map[cat] || cat;
  }

  // Initial render
  renderUseCases(useCases);

  // Search
  function doSearch() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    let filtered = useCases;
    if (q) {
      filtered = useCases.filter(uc =>
        uc.title.toLowerCase().includes(q) ||
        uc.description.toLowerCase().includes(q) ||
        uc.category.toLowerCase().includes(q) ||
        uc.agent.toLowerCase().includes(q) ||
        uc.result.toLowerCase().includes(q)
      );
    }
    // Also respect active filter
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter;
    if (activeFilter && activeFilter !== 'all') {
      filtered = filtered.filter(uc => uc.category === activeFilter);
    }
    renderUseCases(filtered);
  }

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let filtered = filter === 'all' ? useCases : useCases.filter(uc => uc.category === filter);
      const q = (searchInput?.value || '').toLowerCase().trim();
      if (q) {
        filtered = filtered.filter(uc =>
          uc.title.toLowerCase().includes(q) ||
          uc.description.toLowerCase().includes(q) ||
          uc.agent.toLowerCase().includes(q)
        );
      }
      renderUseCases(filtered);
    });
  });

  // Newsletter form (placeholder — replace with real service later)
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    alert(`Thanks! We'll add ${email} to the Daily 5 list.\n\n(Next step: connect this form to Resend, ConvertKit, or Buttondown.)`);
    newsletterForm.reset();
  });

  // View prompt placeholder
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-prompt')) {
      e.preventDefault();
      const id = e.target.dataset.id;
      const uc = useCases.find(u => u.id == id);
      if (uc) {
        alert(`Prompt for: ${uc.title}\n\n(Full prompt library coming in the next update. For now, check the original source or ask your agent to reverse-engineer a similar workflow.)`);
      }
    }
  });
});
