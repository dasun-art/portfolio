/* =====================================================
   app.js — Portfolio Logic for Prasad Thilanka
   ===================================================== */
'use strict';

/* ══════════ DATA ══════════ */
const SKILLS_BARS = [
  { name: 'CrowdStrike Falcon',            pct: 85 },
  { name: 'Palo Alto Cortex XDR',          pct: 80 },
  { name: 'Kaspersky EDR Expert/Optimum',  pct: 92 },
  { name: 'Kaspersky XDR Optimum',         pct: 88 },
  { name: 'ManageEngine Endpoint Central', pct: 80 },
  { name: 'Trend Micro / AI Vision One',   pct: 75 },
  { name: 'Microsoft Defender for Endpoint', pct: 70 },
];

const SKILL_BADGES = [
  { icon: '🛡️', name: 'EDR/XDR',         level: 'Expert' },
  { icon: '🔍', name: 'Threat Hunting',   level: 'Advanced' },
  { icon: '📡', name: 'SIEM',             level: 'Advanced' },
  { icon: '☁️', name: 'Cloud Security',   level: 'Mid' },
  { icon: '🔬', name: 'Vuln. Mgmt',       level: 'Advanced' },
  { icon: '🐧', name: 'Linux Security',   level: 'Advanced' },
  { icon: '🔐', name: 'BitLocker / Enc.', level: 'Expert' },
  { icon: '🌐', name: 'Network Sec.',     level: 'Mid' },
  { icon: '📊', name: 'Dashboards',       level: 'Advanced' },
  { icon: '🚨', name: 'Incident Response',level: 'Advanced' },
  { icon: '💻', name: 'IT Operations',    level: 'Expert' },
  { icon: '📋', name: 'ITSM / ITIL',     level: 'Mid' },
];

const DEFAULT_PROJECTS = [
  {
    emoji: '🛡️', title: 'Enterprise EDR Deployment',
    tags: ['Kaspersky EDR', 'Endpoint Security', 'Enterprise'],
    desc: 'Led end-to-end deployment of Kaspersky EDR Expert/Optimum across 1,000+ endpoints. Implemented policy sets, exclusions, and threat response workflows.',
    link: '', filter: 'security'
  },
  {
    emoji: '🔍', title: 'Multi-Vector Threat Hunt',
    tags: ['Threat Hunting', 'CrowdStrike', 'SIEM'],
    desc: 'Performed proactive threat hunting using CrowdStrike Falcon telemetry and SIEM correlation to identify lateral movement and persistence indicators.',
    link: '', filter: 'security'
  },
  {
    emoji: '☁️', title: 'Cloud Security Deployment',
    tags: ['Cloud Security', 'AWS', 'Endpoint'],
    desc: 'Implemented on-premises to cloud security migration, including cloud endpoint coverage and integration with AWS Security Hub.',
    link: '', filter: 'cloud'
  },
  {
    emoji: '📊', title: 'Security Dashboard & Reporting',
    tags: ['SIEM', 'Dashboards', 'Reporting'],
    desc: 'Designed and implemented security operations dashboards and automated threat reports for management and SOC teams.',
    link: '', filter: 'soc'
  },
];

const DEFAULT_CERTS = [
  { title: "Endpoint Security and Management", issuer: "Kaspersky", date: "Completed" },
  { title: "Next EDR Foundations", issuer: "Kaspersky", date: "Completed" },
  { title: "Next EDR Optimum", issuer: "Kaspersky", date: "Completed" },
  { title: "KATA & EDR Administration", issuer: "Kaspersky", date: "Completed" },
  { title: "KATA Investigation", issuer: "Kaspersky", date: "Completed" },
  { title: "Hybrid Cloud Security Virtualization", issuer: "Kaspersky", date: "Completed" },
  { title: "Secure Mail Gateway", issuer: "Kaspersky", date: "Completed" },
  { title: "Automated Security Awareness Platform", issuer: "Kaspersky", date: "Completed" },
  { title: "Endpoint Security Cloud", issuer: "Kaspersky", date: "Completed" },
  { title: "Endpoint Security Encryption", issuer: "Kaspersky", date: "Completed" },
  { title: "FALCON 101: Platform Essentials", issuer: "CrowdStrike", date: "Completed" },
  { title: "FALCON 104: Getting Started with Endpoint Security", issuer: "CrowdStrike", date: "Completed" },
  { title: "FALCON 102: Platform Onboarding Configuration", issuer: "CrowdStrike", date: "Completed" },
  { title: "FALCON 100: Platform Architecture Overview", issuer: "CrowdStrike", date: "Completed" },
  { title: "FALCON 10h: Sensor Install & Troubleshooting", issuer: "CrowdStrike", date: "Completed" },
  { title: "PTT 0104pc: Endpoint Security Module", issuer: "CrowdStrike", date: "Completed" },
  { title: "PTT-UP-1102: Partner Technical Sales", issuer: "CrowdStrike", date: "Completed" },
  { title: "GEN 100: University Orientation", issuer: "CrowdStrike", date: "Completed" },
  { title: "IDP 170: Falcon Identity Protection", issuer: "CrowdStrike", date: "Completed" },
  { title: "CLOUD 100: Cloud Security Fundamentals", issuer: "CrowdStrike", date: "Completed" },
  { title: "CLOUD 173: Shifting Left with Cloud Security", issuer: "CrowdStrike", date: "Completed" },
  { title: "CLOUD 170: Runtime Security Fundamentals", issuer: "CrowdStrike", date: "Completed" },
  { title: "CLOUD 180: ASPM in Cloud Security", issuer: "CrowdStrike", date: "Completed" },
  { title: "PTT 0101pc: Platform Technical Fundamentals", issuer: "CrowdStrike", date: "Completed" },
  { title: "SIEM 100: Next-Gen SIEM Fundamentals", issuer: "CrowdStrike", date: "Completed" },
  { title: "CAO 100: Counter Adversary Operations", issuer: "CrowdStrike", date: "Completed" },
  { title: "CLOUD 125: Managing Cloud Assets", issuer: "CrowdStrike", date: "Completed" },
  { title: "SIEM 101: Workbench Fundamentals", issuer: "CrowdStrike", date: "Completed" },
  { title: "TrendAI Vision One™ Endpoint Security Practitioner", issuer: "TrendMicro", date: "Completed" },
  { title: "TrendAI Vision One™ AI Security", issuer: "TrendMicro", date: "Completed" },
  { title: "TrendAI Vision One™ Services", issuer: "TrendMicro", date: "Completed" },
  { title: "TrendAI Vision One™ Threat Intelligence", issuer: "TrendMicro", date: "Completed" },
  { title: "Trend Vision One™ Cyber Risk Exposure Management", issuer: "TrendMicro", date: "Completed" },
  { title: "Trend Vision One™ Platform", issuer: "TrendMicro", date: "Completed" },
  { title: "Trend Vision One™ Security Operations (SecOps)", issuer: "TrendMicro", date: "Completed" },
  { title: "Education Portal for Partners", issuer: "TrendMicro", date: "Completed" },
  { title: "Cortex Cloud-Focused Security", issuer: "Cortex", date: "Completed" },
  { title: "Cybersecurity Fundamentals", issuer: "Cortex", date: "Completed" },
  { title: "Introduction to SecOps", issuer: "Cortex", date: "Completed" },
  { title: "SOC Processes", issuer: "Cortex", date: "Completed" },
  { title: "Network-Focused Security", issuer: "Cortex", date: "Completed" },
  { title: "Endpoint Security", issuer: "Cortex", date: "Completed" },
  { title: "Threat Investigations", issuer: "Cortex", date: "Completed" },
  { title: "Automation & Orchestration", issuer: "Cortex", date: "Completed" },
  { title: "Cortex XDR: Features", issuer: "Cortex", date: "Completed" },
  { title: "Cloud Security Fundamentals", issuer: "Cortex", date: "Completed" },
  { title: "Security Operations Fundamentals", issuer: "Cortex", date: "Completed" },
  { title: "Cortex Foundations", issuer: "Cortex", date: "Completed" },
  { title: "Certified Cybersecurity Practitioner", issuer: "Cortex", date: "Completed" }
];

// Load from localStorage or use defaults
let certs = JSON.parse(localStorage.getItem('portfolio_certs'));
if (!certs || certs.length === 0) certs = DEFAULT_CERTS;
let projects = JSON.parse(localStorage.getItem('portfolio_projects') || 'null') || DEFAULT_PROJECTS;
const DEFAULT_LINKEDIN = 'https://www.linkedin.com/in/prasad-thilanaka-14213518b';
let socials  = JSON.parse(localStorage.getItem('portfolio_socials') || '{}');
if (!socials.linkedin) socials.linkedin = DEFAULT_LINKEDIN;
let contactInfo = JSON.parse(localStorage.getItem('portfolio_contact') || '{}');
let resumeData  = localStorage.getItem('portfolio_resume_url') || null;
let photoData   = localStorage.getItem('portfolio_photo_url') || null;

/* ══════════ ADMIN VISIBILITY CHECK ══════════ */

document.addEventListener('DOMContentLoaded', () => {
  const isAdmin = localStorage.getItem('ptd_admin_pass') !== null;
  if (!isAdmin) {
    document.getElementById('admin-toggle-btn')?.remove();
    document.getElementById('admin-panel')?.remove();
    document.querySelectorAll('button[onclick*="admin-toggle"]').forEach(b => b.remove());
  }
});

/* ══════════ DOM ELEMENTS ══════════ */
function updateClock() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Colombo' }));
  const h = ist.getHours(), m = ist.getMinutes(), s = ist.getSeconds();
  const hh = h % 12 || 12;
  const mm = String(m).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const el = document.getElementById('clock-time');
  if (el) el.textContent = `${hh}:${mm} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

/* ══════════ PARTICLE CANVAS ══════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.a  = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#6d28d9' : '#00d4ff';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(109,40,217,${0.08 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════ ROTATING TEXT ══════════ */
(function rotatingText() {
  const phrases = [
    'Endpoint Security Engineer',
    'EDR / XDR Specialist',
    'Threat Hunter',
    'SOC / SIEM Analyst',
    'Cloud Security Expert',
    'Malware Incident Handler',
  ];
  const el = document.getElementById('rotating-text');
  if (!el) return;
  let i = 0;
  function next() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      i = (i + 1) % phrases.length;
      el.textContent = phrases[i];
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400);
  }
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  setInterval(next, 2800);
})();

/* ══════════ NAVBAR ══════════ */
(function navbar() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  });

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => { ham.classList.remove('open'); links.classList.remove('open'); });
  });

  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════ AOS (scroll reveal) ══════════ */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
initAOS();

/* ══════════ SKILL BARS ══════════ */
function renderSkillBars() {
  const container = document.getElementById('skills-bars');
  if (!container) return;
  container.innerHTML = SKILLS_BARS.map(s => `
    <div class="skill-bar-item">
      <div class="skill-bar-header">
        <span class="skill-bar-name">${s.name}</span>
        <span class="skill-bar-pct">${s.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-width="${s.pct}"></div>
      </div>
    </div>
  `).join('');

  // Animate on scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(container);
}
renderSkillBars();

/* ══════════ SKILL BADGES ══════════ */
function renderSkillGrid() {
  const g = document.getElementById('skills-grid');
  if (!g) return;
  g.innerHTML = SKILL_BADGES.map(s => `
    <div class="skill-card">
      <span class="skill-icon">${s.icon}</span>
      <div class="skill-name">${s.name}</div>
      <div class="skill-level">${s.level}</div>
    </div>
  `).join('');
}
renderSkillGrid();

/* ══════════ PROJECTS ══════════ */
function renderProjects() {
  const g = document.getElementById('projects-grid');
  if (!g) return;
  g.innerHTML = projects.map((p, i) => `
    <div class="project-card" data-aos="fade-up">
      <div class="project-image">
        ${p.imgSrc ? `<img src="${p.imgSrc}" alt="${p.title}" />` : `<span>${p.emoji || '🔒'}</span>`}
        <div class="project-image-overlay">
          ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="project-link-btn">🔗 View</a>` : ''}
        </div>
      </div>
      <div class="project-body">
        <div class="project-tags">${(p.tags||[]).map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
      </div>
    </div>
  `).join('');
  initAOS();
}
renderProjects();

/* ══════════ CERTIFICATES — HYBRID SHOWCASE ══════════ */
function renderCerts() {
  const grid = document.getElementById('certs-grid');
  const empty = document.getElementById('certs-empty');
  if (!grid) return;

  if (certs.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }
  if (empty) empty.style.display = 'none';

  const isAdmin = localStorage.getItem('ptd_admin_pass') !== null;
  const visualCerts = certs.filter(c => c.imgSrc || c.img);
  const badgeCerts = certs.filter(c => !c.imgSrc && !c.img);

  let html = '';

  // 1. VISUAL 3D FLIP CARDS
  if (visualCerts.length > 0) {
    html += '<div class="certs-visual-grid" style="display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin-bottom:2rem">';
    html += visualCerts.map(c => {
      const i = certs.indexOf(c);
      return `
      <div class="cert-flip-card" data-cert-idx="${i}" tabindex="0" role="button" aria-label="View certificate: ${c.title}">
        <div class="cert-flip-inner">
          <div class="cert-flip-front">
            ${c.ribbon ? `<div class="cert-ribbon">${c.ribbon}</div>` : ''}
            <div class="cert-front-content">
              <div class="cert-front-header">
                <div class="cert-front-logo">${c.logo || '🏆'}</div>
                <div class="cert-verified-badge">Certified</div>
              </div>
              <div class="cert-front-body">
                <div class="cert-issuer-name">${c.issuer || 'Unknown Issuer'}</div>
                <div class="cert-title-text">${c.title}</div>
              </div>
              <div class="cert-front-footer">
                <span class="cert-date-text">📅 ${c.date || 'N/A'}</span>
                <span class="cert-hover-hint">Hover to flip →</span>
              </div>
            </div>
            <div class="cert-seal">🛡️</div>
          </div>
          <div class="cert-flip-back">
            <div class="cert-back-content">
              <div class="cert-back-title">${c.title}</div>
              <div class="cert-back-row">
                <span class="cert-back-label">Issued by</span>
                <span class="cert-back-value">${c.issuer || '—'}</span>
              </div>
              <div class="cert-back-row">
                <span class="cert-back-label">Date</span>
                <span class="cert-back-value">${c.date || '—'}</span>
              </div>
              <button class="cert-view-btn" data-index="${i}">View Credential</button>
              ${isAdmin ? `<button class="admin-del-btn" onclick="deleteCert(${i})" style="margin-top:10px;width:100%">Delete</button>` : ''}
            </div>
          </div>
        </div>
      </div>
      `;
    }).join('');
    html += '</div>';
  }

    // 2. VENDOR TEXT BADGES
  if (badgeCerts.length > 0) {
    const grouped = {};
    badgeCerts.forEach(c => {
      const issuer = c.issuer || 'Other';
      if (!grouped[issuer]) grouped[issuer] = [];
      grouped[issuer].push(c);
    });

    html += '<div class="certs-vendor-groups" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:2rem;">';
    for (const [vendor, list] of Object.entries(grouped)) {
      html += `
        <div class="vendor-group" style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:1.5rem;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
          <h4 class="vendor-title" style="margin-bottom:1rem;color:var(--text-1);font-family:var(--font-mono);font-size:1.2rem;display:flex;align-items:center;gap:0.5rem;"><span class="vendor-icon">🛡️</span> ${vendor} Certified</h4>
          <div class="vendor-badges" style="display:flex;flex-wrap:wrap;gap:0.75rem;">
            ${list.map(c => {
              const i = certs.indexOf(c);
              return `
              <div class="vendor-badge" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);padding:0.4rem 0.8rem;border-radius:20px;font-size:0.85rem;color:var(--text-2);display:flex;align-items:center;gap:0.4rem;">
                <span class="vb-dot" style="width:6px;height:6px;background:var(--accent-1);border-radius:50%;display:inline-block;box-shadow:0 0 5px var(--accent-1)"></span>
                <span class="vb-title">${c.title}</span>
                ${isAdmin ? `<button class="admin-del-btn mini-del" onclick="deleteCert(${i})" style="background:none;border:none;color:var(--danger);cursor:pointer;margin-left:5px">&times;</button>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
      `;
    }
    html += '</div>';
  }

  // Override parent CSS grid that was squishing the layout
  grid.style.display = 'block';
  grid.innerHTML = html;

  // Click to open modal (keyboard too)
  grid.querySelectorAll('.cert-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = e.target.dataset.index;
      openCertModal(idx);
    });
  });
  grid.querySelectorAll('.cert-flip-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.tagName==='BUTTON') return;
      const idx = parseInt(card.dataset.certIdx);
      openCertModal(idx);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openCertModal(parseInt(card.dataset.certIdx));
    });
  });
}

/* ══════════ CERTIFICATE MODAL ══════════ */
function openCertModal(idx) {
  const c = certs[idx];
  if (!c) return;

  const overlay = document.getElementById('cert-modal');
  const content = document.getElementById('cert-modal-content');
  if (!overlay || !content) return;

  const imgHTML = c.imgSrc
    ? `<img src="${c.imgSrc}" alt="${c.title}" class="cert-modal-cert-img" />`
    : `<div class="cert-modal-no-img">
         <span class="cert-modal-no-img-icon">🏆</span>
         <span>No image uploaded</span>
         <small>Add one via the Edit panel</small>
       </div>`;

  content.innerHTML = `
    <div class="cert-modal-inner">
      <!-- LEFT: Image panel -->
      <div class="cert-modal-image-panel">
        <div class="cert-modal-watermark">CERT</div>
        <div class="cert-modal-img-wrapper">
          <div class="cert-modal-logo-big">${c.logo || '🏆'}</div>
          ${imgHTML}
        </div>
      </div>

      <!-- RIGHT: Details panel -->
      <div class="cert-modal-details-panel">
        <div class="cert-modal-issuer-chip">🏛️ ${c.issuer || 'Unknown Issuer'}</div>
        <div class="cert-modal-title">${c.title}</div>
        <div class="cert-modal-desc">${c.desc || 'Professional certification demonstrating expertise and competency in the specified domain.'}</div>

        <div class="cert-modal-meta">
          <div class="cert-meta-item">
            <span class="cert-meta-icon">📅</span>
            <div class="cert-meta-content">
              <div class="cert-meta-label">Issue Date</div>
              <div class="cert-meta-value">${c.date || 'N/A'}</div>
            </div>
          </div>
          ${c.expiry ? `<div class="cert-meta-item">
            <span class="cert-meta-icon">⏳</span>
            <div class="cert-meta-content">
              <div class="cert-meta-label">Expiry Date</div>
              <div class="cert-meta-value">${c.expiry}</div>
            </div>
          </div>` : ''}
          <div class="cert-meta-item">
            <span class="cert-meta-icon">📂</span>
            <div class="cert-meta-content">
              <div class="cert-meta-label">Category</div>
              <div class="cert-meta-value">${c.category || 'Cybersecurity'}</div>
            </div>
          </div>
          <div class="cert-meta-item">
            <span class="cert-meta-icon">✅</span>
            <div class="cert-meta-content">
              <div class="cert-meta-label">Status</div>
              <div class="cert-meta-value" style="color:var(--accent-2)">Verified &amp; Active</div>
            </div>
          </div>
        </div>

        ${c.credId ? `
        <div class="cert-modal-credential-id">
          <div class="cert-credential-label">Credential ID</div>
          <div class="cert-credential-id-text">${c.credId}</div>
        </div>` : ''}

        <div class="cert-modal-actions">
          ${c.verifyUrl ? `<button class="cert-modal-btn primary" onclick="window.open('${c.verifyUrl}','_blank')">🔗 Verify Online</button>` : ''}
          ${c.imgSrc ? `<button class="cert-modal-btn secondary" onclick="downloadCertImage(${idx})">⬇️ Download</button>` : ''}
          <button class="cert-modal-btn secondary" onclick="closeCertModal()">✕ Close</button>
        </div>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  document.getElementById('cert-modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

function downloadCertImage(idx) {
  const c = certs[idx];
  if (!c?.imgSrc) return;
  const a = document.createElement('a');
  a.href = c.imgSrc;
  a.download = `${c.title.replace(/\s+/g, '_')}_Certificate.jpg`;
  a.click();
}

document.getElementById('cert-modal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeCertModal();
});
document.getElementById('cert-modal-close')?.addEventListener('click', closeCertModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

/* ══════════ RESUME / CV ══════════ */
function applyResumeLink() {
  const url = resumeData;
  ['cta-resume', 'download-cv-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (url) {
      el.href = url;
      el.setAttribute('download', 'Prasad_Thilanka_CV.pdf');
    } else {
      el.href = '#contact';
      el.removeAttribute('download');
    }
  });
}
applyResumeLink();

/* ══════════ PROFILE PHOTO ══════════ */
function applyProfilePhoto() {
  const img = document.getElementById('profile-img');
  if (img && photoData) { img.src = photoData; img.style.objectFit = 'cover'; }
}
applyProfilePhoto();

/* ══════════ SOCIAL LINKS ══════════ */
const LINKEDIN_URL = socials.linkedin || DEFAULT_LINKEDIN;
function applySocials() {
  // LinkedIn always shown with real URL
  ['hs-linkedin', 'fs-linkedin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.href = socials.linkedin || DEFAULT_LINKEDIN; el.style.display = 'flex'; }
  });
  // Optional socials
  const optional = {
    'hs-github':  socials.github,
    'hs-twitter': socials.twitter,
    'hs-thm':     socials.tryhackme,
    'hs-htb':     socials.htb,
  };
  Object.entries(optional).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (url) { el.href = url; el.style.display = 'flex'; }
    else { el.style.display = 'none'; }
  });
}
applySocials();

/* ══════════ CONTACT INFO ══════════ */
function applyContactInfo() {
  const email = contactInfo.email || 'thilanka.prasad@outlook.com';
  const phone = contactInfo.phone || '';
  ['contact-email-display','contact-email-card'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = email;
  });
  const phoneCard = document.getElementById('phone-card');
  const phoneEl   = document.getElementById('contact-phone-card');
  if (phoneCard && phoneEl) {
    if (phone) { phoneEl.textContent = phone; phoneCard.style.display = 'flex'; }
    else phoneCard.style.display = 'none';
  }
}
applyContactInfo();

/* ══════════ ADMIN PANEL ══════════ */
(function adminPanel() {
  const panel   = document.getElementById('admin-panel');
  const overlay = document.getElementById('admin-overlay');
  const toggleBtn = document.getElementById('admin-toggle-btn');
  const closeBtn  = document.getElementById('admin-close');

  function openPanel()  { panel.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closePanel() { panel.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  toggleBtn?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  overlay?.addEventListener('click', closePanel);

  /* ── Photo upload ── */
  const photoInput   = document.getElementById('photo-input');
  const photoZone    = document.getElementById('photo-upload-zone');
  const photoBtn     = document.getElementById('photo-upload-btn');
  const photoPreview = document.getElementById('photo-preview');
  const photoContent = document.getElementById('photo-upload-content');

  photoBtn?.addEventListener('click', () => photoInput?.click());
  photoZone?.addEventListener('click', () => photoInput?.click());
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      photoData = e.target.result;
      localStorage.setItem('portfolio_photo_url', photoData);
      photoPreview.src = photoData;
      photoPreview.style.display = 'block';
      photoContent.style.display = 'none';
      applyProfilePhoto();
      showToast('✅ Profile photo updated!');
    };
    reader.readAsDataURL(file);
  });

  /* ── Resume upload ── */
  const resumeInput   = document.getElementById('resume-input');
  const resumeBtn     = document.getElementById('resume-upload-btn');
  const resumeContent = document.getElementById('resume-upload-content');

  resumeBtn?.addEventListener('click', () => resumeInput?.click());
  document.getElementById('resume-upload-zone')?.addEventListener('click', () => resumeInput?.click());
  resumeInput?.addEventListener('change', () => {
    const file = resumeInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      resumeData = e.target.result;
      localStorage.setItem('portfolio_resume_url', resumeData);
      resumeContent.innerHTML = `<div class="upload-icon">✅</div><p class="upload-filename">${file.name}</p><small>Resume ready to download</small>`;
      applyResumeLink();
      showToast('✅ Resume uploaded!');
    };
    reader.readAsDataURL(file);
  });

  /* ── Add Certificate ── */
  const certInput   = document.getElementById('cert-input');
  const certZone    = document.getElementById('cert-upload-zone');
  const certContent = document.getElementById('cert-upload-content');

  certZone?.addEventListener('click', () => certInput?.click());
  let pendingCertImg = null;
  certInput?.addEventListener('change', () => {
    const file = certInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      pendingCertImg = e.target.result;
      certContent.innerHTML = `<div class="upload-icon">🖼️</div><p class="upload-filename">${file.name}</p>`;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('cert-add-btn')?.addEventListener('click', () => {
    const title  = document.getElementById('cert-name-input')?.value.trim();
    const issuer = document.getElementById('cert-issuer-input')?.value.trim();
    const date   = document.getElementById('cert-date-input')?.value.trim();

    if (!title) { showToast('⚠️ Please enter a certificate name', 'warn'); return; }

    const cert = {
      title, issuer, date,
      imgSrc: pendingCertImg || null,
      logo: getCertLogo(issuer),
      category: 'Cybersecurity',
      credId: null, verifyUrl: null, desc: '',
    };
    certs.push(cert);
    localStorage.setItem('portfolio_certs', JSON.stringify(certs));
    renderCerts();

    // Reset form
    ['cert-name-input','cert-issuer-input','cert-date-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    pendingCertImg = null;
    if (certContent) certContent.innerHTML = `<div class="upload-icon">🏅</div><p>Upload Certificate Image/PDF</p>`;
    showToast('🏆 Certificate added!');
  });

  /* ── Add Project ── */
  const projImgInput = document.getElementById('proj-img-input');
  const projImgZone  = document.getElementById('proj-img-zone');
  const projImgCont  = document.getElementById('proj-img-content');

  projImgZone?.addEventListener('click', () => projImgInput?.click());
  let pendingProjImg = null;
  projImgInput?.addEventListener('change', () => {
    const file = projImgInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      pendingProjImg = e.target.result;
      projImgCont.innerHTML = `<div class="upload-icon">🖼️</div><p class="upload-filename">${file.name}</p>`;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('proj-add-btn')?.addEventListener('click', () => {
    const title = document.getElementById('proj-title-input')?.value.trim();
    const tags  = document.getElementById('proj-tags-input')?.value.trim();
    const desc  = document.getElementById('proj-desc-input')?.value.trim();
    const link  = document.getElementById('proj-link-input')?.value.trim();

    if (!title) { showToast('⚠️ Please enter a project title', 'warn'); return; }

    projects.push({
      emoji: '🔒', title, tags: tags ? tags.split(',').map(t=>t.trim()) : [],
      desc, link, imgSrc: pendingProjImg, filter: 'security'
    });
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    renderProjects();

    ['proj-title-input','proj-tags-input','proj-desc-input','proj-link-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    pendingProjImg = null;
    if (projImgCont) projImgCont.innerHTML = `<div class="upload-icon">🖼️</div><p>Upload screenshot</p>`;
    showToast('💼 Project added!');
  });

  /* ── Social links ── */
  // Restore saved values
  const socialFields = {
    'social-linkedin-url':  'linkedin',
    'social-github-url':    'github',
    'social-twitter-url':   'twitter',
    'social-tryhackme-url': 'tryhackme',
    'social-htb-url':       'htb',
  };
  Object.entries(socialFields).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && socials[key]) el.value = socials[key];
  });

  document.getElementById('social-save-btn')?.addEventListener('click', () => {
    Object.entries(socialFields).forEach(([id, key]) => {
      const val = document.getElementById(id)?.value.trim();
      if (val) socials[key] = val; else delete socials[key];
    });
    localStorage.setItem('portfolio_socials', JSON.stringify(socials));
    applySocials();
    showToast('🔗 Social links saved!');
  });

  /* ── Contact info ── */
  const editEmail = document.getElementById('edit-email');
  const editPhone = document.getElementById('edit-phone');
  if (editEmail && contactInfo.email) editEmail.value = contactInfo.email;
  if (editPhone && contactInfo.phone) editPhone.value = contactInfo.phone;

  document.getElementById('contact-save-btn')?.addEventListener('click', () => {
    contactInfo.email = editEmail?.value.trim() || contactInfo.email;
    contactInfo.phone = editPhone?.value.trim() || '';
    localStorage.setItem('portfolio_contact', JSON.stringify(contactInfo));
    applyContactInfo();
    showToast('✅ Contact info saved!');
  });

  /* ── Reset ── */
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (!confirm('Reset all customizations? This cannot be undone.')) return;
    ['portfolio_certs','portfolio_projects','portfolio_socials','portfolio_contact','portfolio_resume_url','portfolio_photo_url']
      .forEach(k => localStorage.removeItem(k));
    location.reload();
  });
})();

/* ══════════ CONTACT FORM ══════════ */
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('#contact-submit');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';
  setTimeout(() => {
    document.getElementById('form-success').style.display = 'block';
    this.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
  }, 1200);
});

/* ══════════ HELPERS ══════════ */
function getCertLogo(issuer) {
  if (!issuer) return '🏆';
  const s = issuer.toLowerCase();
  if (s.includes('google')) return '🔵';
  if (s.includes('microsoft') || s.includes('azure')) return '🪟';
  if (s.includes('comptia')) return '🔒';
  if (s.includes('ec-council') || s.includes('ceh')) return '🎯';
  if (s.includes('cisco')) return '🌐';
  if (s.includes('aws') || s.includes('amazon')) return '☁️';
  if (s.includes('isc2') || s.includes('cissp')) return '🛡️';
  if (s.includes('kaspersky')) return '🛡️';
  if (s.includes('coursera')) return '📚';
  if (s.includes('udemy')) return '🎓';
  if (s.includes('linkedin')) return '💼';
  return '🏆';
}

let toastTimer;
function showToast(msg, type = 'success') {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.style.cssText = `
      position:fixed;bottom:7rem;left:50%;transform:translateX(-50%) translateY(20px);
      background:rgba(8,14,28,0.97);border:1px solid rgba(109,40,217,0.4);
      color:#e2e8f0;padding:0.75rem 1.5rem;border-radius:50px;
      font-family:'Outfit',sans-serif;font-size:0.88rem;font-weight:600;
      z-index:9999;opacity:0;transition:all 0.3s ease;
      backdrop-filter:blur(10px);box-shadow:0 8px 30px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  clearTimeout(toastTimer);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3000);
}

// Initial render
renderCerts();

// Expose for inline handlers
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;
window.downloadCertImage = downloadCertImage;
