(() => {
  const $ = s => document.querySelector(s);
  const auth = window.golpokothaAuth;
  const db = window.golpokothaDb;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const bn = n => new Intl.NumberFormat('bn-BD').format(n);
  let unsubscribe = null;

  function showError(message) { $('#loginError').textContent = message; }
  function showDashboard(user) {
    $('#loginPanel').hidden = true;
    $('#dashboard').hidden = false;
    $('#dashboard').dataset.uid = user.uid;
    if (unsubscribe) unsubscribe();
    unsubscribe = db.collection('stories').orderBy('createdAt','desc').onSnapshot(snapshot => {
      const docs = snapshot.docs;
      $('#adminStoryCount').textContent = `${bn(docs.length)}টি`;
      $('#adminStoryList').innerHTML = docs.length ? docs.map(doc => {
        const s = doc.data();
        return `<div class="admin-story-item"><div class="info"><strong>${esc(s.title)}</strong><small>${esc(s.writer)} · ${esc(s.type)} ${s.part ? '· ' + esc(s.part) : ''}</small></div><button class="danger-button" data-delete-story="${esc(doc.id)}">ডিলিট</button></div>`;
      }).join('') : '<p class="admin-empty">এখনো কোনো গল্প প্রকাশ করেননি। প্রথম গল্পটি লিখে প্রকাশ করুন।</p>';
    }, err => {
      $('#publishMessage').className = 'error';
      $('#publishMessage').textContent = 'গল্পের তালিকা লোড হয়নি: ' + err.message;
    });
  }

  auth.onAuthStateChanged(user => {
    if (user) showDashboard(user);
    else {
      if (unsubscribe) unsubscribe();
      $('#dashboard').hidden = true;
      $('#loginPanel').hidden = false;
    }
  });

  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    showError('');
    try {
      await auth.signInWithEmailAndPassword($('#adminEmail').value.trim(), $('#adminPassword').value);
    } catch (err) {
      showError(err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
        ? 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'
        : 'লগইন করা যায়নি: ' + err.message);
    }
  });

  $('#logoutBtn').addEventListener('click', async () => {
    try { await auth.signOut(); } catch (err) { alert('লগআউট করা যায়নি: ' + err.message); }
  });

  $('#storyForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = $('#storyTitle').value.trim();
    const writer = $('#writerName').value.trim();
    const type = $('#storyType').value;
    const part = $('#partNumber').value.trim();
    const content = $('#storyContent').value.trim();
    if (!title || !writer || !type || !content) return;
    const button = e.target.querySelector('button[type="submit"]');
    button.disabled = true;
    $('#publishMessage').className = '';
    $('#publishMessage').textContent = 'প্রকাশ করা হচ্ছে...';
    try {
      await db.collection('stories').add({
        title, writer, type, part, content, published: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: auth.currentUser.uid
      });
      e.target.reset();
      $('#publishMessage').className = 'success';
      $('#publishMessage').textContent = '🎉 গল্পটি অনলাইনে প্রকাশ হয়েছে! সব ডিভাইসে দেখা যাবে।';
    } catch (err) {
      $('#publishMessage').className = 'error';
      $('#publishMessage').textContent = 'প্রকাশ করা যায়নি: ' + err.message + ' — Firestore Rules-এ Admin UID ঠিক আছে কি না দেখুন।';
    } finally {
      button.disabled = false;
    }
  });

  $('#adminStoryList').addEventListener('click', async e => {
    const btn = e.target.closest('[data-delete-story]');
    if (!btn || !confirm('এই গল্পটি সবার ওয়েবসাইট থেকে মুছে ফেলবেন?')) return;
    try {
      await db.collection('stories').doc(btn.dataset.deleteStory).delete();
    } catch (err) {
      alert('ডিলিট করা যায়নি: ' + err.message);
    }
  });
})();