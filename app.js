(() => {
  const $ = (s) => document.querySelector(s);
  const db = window.golpokothaDb;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const bn = n => new Intl.NumberFormat('bn-BD').format(n);
  let stories = [];
  let activeFilter = 'সব গল্প';
  let searchTerm = '';

  $('#year').textContent = new Date().getFullYear();

  function render() {
    const filtered = stories.filter(s => {
      const matchesFilter = activeFilter === 'সব গল্প' || s.type === activeFilter;
      const haystack = `${s.title || ''} ${s.writer || ''} ${s.type || ''} ${s.part || ''} ${s.content || ''}`.toLowerCase();
      return matchesFilter && haystack.includes(searchTerm.toLowerCase());
    });
    $('#feedTitle').textContent = activeFilter === 'সব গল্প' ? 'সবার গল্প' : activeFilter;
    $('#storyCount').textContent = `${bn(filtered.length)}টি গল্প`;
    $('#storyFeed').innerHTML = filtered.map(s => `
      <article class="story-card" id="${esc(s.id)}">
        <div class="story-head">
          <div class="avatar">📖</div>
          <div class="story-meta"><strong>${esc(s.writer || 'অজানা লেখক')}</strong>
          <small>${esc(s.dateLabel || 'গল্পকথা')} ${s.part ? ' · ' + esc(s.part) : ''}</small></div>
          <span class="type-pill">${esc(s.type || 'অন্যান্য')}</span>
        </div>
        <h3 class="story-title">${esc(s.title)}</h3>
        ${s.part ? `<p class="story-subtitle">${esc(s.part)}</p>` : ''}
        <p class="story-content collapsed" data-story-content="${esc(s.id)}">${esc(s.content)}</p>
        <button class="see-more" data-expand="${esc(s.id)}" type="button">সম্পূর্ণ গল্প পড়ুন ↓</button>
      </article>`).join('');
    $('#emptyState').hidden = filtered.length > 0;
    $('#storyFeed').hidden = filtered.length === 0;
    if (!filtered.length) {
      $('#emptyTitle').textContent = searchTerm ? 'কোনো গল্প পাওয়া যায়নি' : 'এখনো কোনো গল্প প্রকাশিত হয়নি';
      $('#emptyText').textContent = searchTerm ? 'অন্য শব্দ দিয়ে খুঁজে দেখুন।' : 'অ্যাডমিন গল্প প্রকাশ করলে এখানে দেখা যাবে। আবার পরে ঘুরে আসুন!';
    }
  }

  db.collection('stories').where('published', '==', true).onSnapshot(snapshot => {
    stories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    stories.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    stories = stories.map(s => ({
      ...s,
      dateLabel: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString('bn-BD') : ''
    }));
    render();
  }, error => {
    console.error(error);
    $('#emptyState').hidden = false;
    $('#storyFeed').hidden = true;
    $('#emptyTitle').textContent = 'গল্প লোড করা যায়নি';
    $('#emptyText').textContent = 'Firebase config ও Firestore Rules ঠিক আছে কি না পরীক্ষা করুন।';
  });

  $('#searchInput').addEventListener('input', e => { searchTerm = e.target.value.trim(); render(); });
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
    render();
  }));
  $('#storyFeed').addEventListener('click', e => {
    const btn = e.target.closest('[data-expand]');
    if (!btn) return;
    const p = document.querySelector(`[data-story-content="${CSS.escape(btn.dataset.expand)}"]`);
    if (!p) return;
    const expanded = p.classList.toggle('collapsed');
    btn.textContent = expanded ? 'সম্পূর্ণ গল্প পড়ুন ↓' : 'সংক্ষিপ্ত করুন ↑';
  });
})();