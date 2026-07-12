'use strict';
/* ════════════════════════════════════════════════════════════
   tracker.js — Visitor Tracking for Prasad Thilanka Portfolio

   HOW IT WORKS:
   ─────────────────────────────────────────────────────────
   ① localStorage  → stores YOUR OWN session detail on your device.
   ② CountAPI.xyz  → free public hit counter that INCREMENTS for
                     EVERY visitor on ANY device/browser when the
                     site is online. Works cross-device globally.
   ③ Public badge  → reads real count from CountAPI (cross-device).

   ⚠️  IMPORTANT: CountAPI cross-device tracking requires the site
       to be hosted online (GitHub Pages, Netlify, etc.).
       While running as a local file, CountAPI still records hits
       but they may be blocked by browser CORS policy for local files.
   ════════════════════════════════════════════════════════════ */

(function () {

  /* ─── Config ─── */
  const DB_KEY       = 'ptd_visitors';
  const BADGE_KEY    = 'ptd_badge_enabled';
  const COUNT_NS     = 'dasun-art-portfolio';  // Unique namespace for your site
  const COUNT_KEY    = 'pageviews';
  const COUNT_URL    = `https://api.countapi.xyz/hit/${COUNT_NS}/${COUNT_KEY}`;
  const COUNT_GET    = `https://api.countapi.xyz/get/${COUNT_NS}/${COUNT_KEY}`;

  /* ─── Parse User Agent ─── */
  function parseUA(ua) {
    const device = /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' :
                   /iPad|Tablet/i.test(ua) ? 'Tablet' : 'Desktop';
    const browser = /Edg/i.test(ua) ? 'Edge' :
                    /OPR|Opera/i.test(ua) ? 'Opera' :
                    /Chrome/i.test(ua) ? 'Chrome' :
                    /Firefox/i.test(ua) ? 'Firefox' :
                    /Safari/i.test(ua) ? 'Safari' : 'Other';
    const os = /Windows NT 10|Windows NT 11/i.test(ua) ? 'Windows 10/11' :
               /Windows/i.test(ua) ? 'Windows' :
               /Mac OS X/i.test(ua) ? 'macOS' :
               /Android/i.test(ua) ? 'Android' :
               /iPhone|iPad/i.test(ua) ? 'iOS' :
               /Linux/i.test(ua) ? 'Linux' : 'Unknown';
    return { device, browser, os };
  }

  /* ─── Session ID (unique per browser session) ─── */
  let sid = sessionStorage.getItem('ptd_sid');
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2);
    sessionStorage.setItem('ptd_sid', sid);
  }

  /* ─── Track which sections the visitor scrolled to ─── */
  const sectionsViewed = new Set();
  const sessionStart   = Date.now();

  function observeSections() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) sectionsViewed.add(e.target.id); });
    }, { threshold: 0.3 });
    sections.forEach(s => obs.observe(s));
  }
  observeSections();

  /* ─── Build visit record ─── */
  const { device, browser, os } = parseUA(navigator.userAgent);
  const visitRecord = {
    sid,
    ts:       Date.now(),
    device, browser, os,
    screen:   `${screen.width}×${screen.height}`,
    referrer: document.referrer
      ? (()=>{ try { return new URL(document.referrer).hostname; } catch(e) { return document.referrer; } })()
      : 'Direct',
    page:     location.pathname.split('/').pop() || 'index.html',
    sections: [],
    duration: 0,
  };

  /* ─── Save to localStorage (records on THIS device's dashboard) ─── */
  function saveVisit() {
    visitRecord.sections = Array.from(sectionsViewed);
    visitRecord.duration  = Math.round((Date.now() - sessionStart) / 1000);
    const visitors = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    // Avoid duplicate saves for same session
    if (!visitors.find(v => v.sid === visitRecord.sid && v.ts === visitRecord.ts)) {
      visitors.push({ ...visitRecord });
    }
    if (visitors.length > 2000) visitors.splice(0, visitors.length - 2000);
    localStorage.setItem(DB_KEY, JSON.stringify(visitors));
  }

  window.addEventListener('beforeunload', saveVisit);
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveVisit(); });

  /* ─── CountAPI: Increment global hit counter ─── */
  //  This call goes to countapi.xyz servers — works for ANY visitor
  //  on ANY device, globally. The count is stored on their servers.
  let globalCount = null;

  fetch(COUNT_URL)
    .then(r => r.json())
    .then(data => {
      globalCount = data.value || 0;
      // Store in localStorage so dashboard can read it
      localStorage.setItem('ptd_global_count', globalCount.toString());
      updateBadgeCount(globalCount);
    })
    .catch(() => {
      // Fallback to localStorage count if CountAPI unreachable (local file)
      const local = JSON.parse(localStorage.getItem(DB_KEY) || '[]').length;
      localStorage.setItem('ptd_global_count', local.toString());
      updateBadgeCount(local);
    });

  /* ─── Public Visitor Badge ─── */
  function updateBadgeCount(count) {
    const el = document.getElementById('visitor-badge-count');
    if (el) el.textContent = `${Number(count).toLocaleString()} visitor${count !== 1 ? 's' : ''}`;
  }

  function renderBadge() {
    const enabled = localStorage.getItem(BADGE_KEY) === 'true';
    if (!enabled) return;

    // Remove any existing badge
    document.getElementById('visitor-badge-wrap')?.remove();

    const count = localStorage.getItem('ptd_global_count') || '…';
    const wrap = document.createElement('div');
    wrap.id = 'visitor-badge-wrap';
    wrap.innerHTML = `
      <style>
        #visitor-badge-wrap { position:fixed; bottom:1.5rem; left:1.5rem; z-index:800; animation: badge-fadein 0.5s ease; }
        @keyframes badge-fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        #visitor-badge {
          display:flex; align-items:center; gap:0.5rem;
          background:rgba(8,14,28,0.95); backdrop-filter:blur(14px);
          border:1px solid rgba(0,212,255,0.35); border-radius:50px;
          padding:0.45rem 1rem; cursor:default;
          box-shadow:0 4px 24px rgba(0,212,255,0.12);
          font-family:'Outfit',sans-serif;
        }
        .badge-live-dot {
          width:8px; height:8px; border-radius:50%; background:#10b981; flex-shrink:0;
          animation: badge-pulse 1.5s infinite;
        }
        @keyframes badge-pulse {
          0%,100%{ box-shadow:0 0 0 0 rgba(16,185,129,0.5); }
          50%{ box-shadow:0 0 0 5px rgba(16,185,129,0); }
        }
        #visitor-badge-count { font-size:0.78rem; font-weight:600; color:#e2e8f0; }
      </style>
      <div id="visitor-badge">
        <span class="badge-live-dot"></span>
        <span id="visitor-badge-count">${count} visitors</span>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  setTimeout(renderBadge, 600);

})();
