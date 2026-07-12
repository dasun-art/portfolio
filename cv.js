'use strict';

/* ══════════ IST / Colombo Clock ══════════ */
function updateClock() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Colombo' }));
  const h = ist.getHours(), m = ist.getMinutes();
  const hh = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const day = days[ist.getDay()];
  const el = document.getElementById('sidebar-clock');
  if (el) el.textContent = `${day} ${hh}:${mm} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ══════════ Scroll-reveal (AOS) ══════════ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('aos-animate'); });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}
initAOS();

/* ══════════ Animate skill & proficiency bars ══════════ */
function animateBars() {
  // Sidebar tool bars
  const trackEls = document.querySelectorAll('.tool-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animated');
      }
    });
  }, { threshold: 0.2 });
  trackEls.forEach(el => obs.observe(el));

  // Proficiency meter fills
  const profEls = document.querySelectorAll('.prof-meter-fill');
  const obs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('animated');
    });
  }, { threshold: 0.2 });
  profEls.forEach(el => obs2.observe(el));
}
animateBars();

/* ══════════ Dark / Light Theme Toggle ══════════ */
const themeBtn = document.getElementById('btn-theme');
let isDark = true;
themeBtn?.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  themeBtn.textContent = isDark ? '🌙 Dark' : '☀️ Light';
});

/* ══════════ Load profile photo from localStorage ══════════ */
function loadSavedPhoto() {
  const photoData = localStorage.getItem('portfolio_photo_url');
  const img = document.getElementById('cv-photo');
  if (img && photoData) {
    img.src = photoData;
    img.style.objectFit = 'cover';
  }
}
loadSavedPhoto();

/* ══════════ Load certificates from localStorage ══════════ */
function loadCerts() {
  const certs = JSON.parse(localStorage.getItem('portfolio_certs') || '[]');
  const grid = document.getElementById('cv-certs-grid');
  const placeholder = document.getElementById('cert-placeholder');
  if (!grid) return;

  if (certs.length === 0) {
    if (placeholder) placeholder.style.display = 'flex';
    return;
  }

  if (placeholder) placeholder.style.display = 'none';

  const certHTML = certs.map(c => `
    <div class="cv-cert-card">
      <div class="cvc-logo">${c.logo || '🏆'}</div>
      <div class="cvc-issuer">${c.issuer || 'Issuer'}</div>
      <div class="cvc-title">${c.title}</div>
      <div class="cvc-date">📅 ${c.date || '—'}</div>
    </div>
  `).join('');

  grid.innerHTML = certHTML;
}
loadCerts();

/* ══════════ Navbar highlight (scroll spy) ══════════ */
window.addEventListener('scroll', () => {
  const toolbar = document.getElementById('cv-toolbar');
  if (toolbar) toolbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ══════════ Scan line ══════════ */
// Re-trigger scan line animation on visibility
document.addEventListener('visibilitychange', () => {
  const sl = document.getElementById('scan-line');
  if (!document.hidden && sl) {
    sl.style.animation = 'none';
    sl.offsetHeight; // force reflow
    sl.style.animation = '';
  }
});

/* ══════════ Print prep ══════════ */
window.addEventListener('beforeprint', () => {
  // Force all bars to their target widths
  document.querySelectorAll('.tool-fill').forEach(el => el.classList.add('animated'));
  document.querySelectorAll('.prof-meter-fill').forEach(el => el.classList.add('animated'));
  document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
});
