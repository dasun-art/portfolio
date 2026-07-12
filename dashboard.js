'use strict';
/* ════════════════════════════════════
   dashboard.js — Visitor Analytics
   ════════════════════════════════════ */

const DB_KEY      = 'ptd_visitors';
const PASS_KEY    = 'ptd_admin_pass';
const BADGE_KEY   = 'ptd_badge_enabled';
const DEFAULT_PASS = 'prasad2026';

/* ══════ Helpers ══════ */
function getPass(){ return localStorage.getItem(PASS_KEY) || DEFAULT_PASS; }
function getVisitors(){ return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); }
function saveVisitors(v){ localStorage.setItem(DB_KEY, JSON.stringify(v)); }

function toIST(ts){
  return new Date(ts).toLocaleString('en-GB',{timeZone:'Asia/Colombo',
    day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
}

/* ══════ Clock ══════ */
function updateClock(){
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
  const h=ist.getHours(),m=ist.getMinutes();
  const hh=h%12||12, mm=String(m).padStart(2,'0'), ap=h>=12?'PM':'AM';
  const el=document.getElementById('dash-clock');
  if(el) el.textContent=`${hh}:${mm} ${ap}`;
}
setInterval(updateClock,1000); updateClock();

/* ══════ LOGIN ══════ */
const loginScreen = document.getElementById('login-screen');
const dashboard   = document.getElementById('dashboard');
const loginInput  = document.getElementById('login-pass');
const loginBtn    = document.getElementById('login-btn');
const loginError  = document.getElementById('login-error');

function tryLogin(){
  if(loginInput.value === getPass()){
    loginScreen.style.display='none';
    dashboard.style.display='grid';
    renderAll();
    loginError.style.display='none';
  } else {
    loginError.style.display='block';
    loginInput.value='';
    loginInput.classList.add('shake');
    setTimeout(()=>loginInput.classList.remove('shake'),400);
  }
}
loginBtn?.addEventListener('click', tryLogin);
loginInput?.addEventListener('keydown', e=>{ if(e.key==='Enter') tryLogin(); });

document.getElementById('dash-logout')?.addEventListener('click',()=>{
  dashboard.style.display='none';
  loginScreen.style.display='flex';
  loginInput.value='';
});

/* ══════ NAV ══════ */
const panels = { overview:'panel-overview', visitors:'panel-visitors', pages:'panel-pages', devices:'panel-devices', settings:'panel-settings' };
const titles  = { overview:'📊 Overview', visitors:'👥 Visitors', pages:'📄 Page Activity', devices:'💻 Devices', settings:'⚙️ Settings' };

document.querySelectorAll('.dash-nav-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.dash-nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.panel;
    document.getElementById(panels[key])?.classList.add('active');
    document.getElementById('panel-title').textContent = titles[key];
    if(key==='overview') renderAll();
    if(key==='visitors') renderAllVisitors();
    if(key==='pages')    renderPages();
    if(key==='devices')  renderDevices();
    if(key==='settings') renderSettings();
  });
});

/* ══════ RENDER ALL ══════ */
function renderAll(){
  const visitors = getVisitors();
  renderKPIs(visitors);
  renderDailyChart(visitors);
  renderSectionBars(visitors, 'section-bars');
  renderRecentTable(visitors);
}

/* ── KPIs ── */
function renderKPIs(visitors){
  // Global count (from CountAPI — works cross-device when hosted online)
  const globalCount = parseInt(localStorage.getItem('ptd_global_count') || '0', 10);
  const displayTotal = globalCount > visitors.length ? globalCount : visitors.length;
  document.getElementById('kpi-total-views').textContent = displayTotal.toLocaleString();
  document.getElementById('kpi-views-trend').textContent = globalCount > 0 ? '🌐 Cross-device (CountAPI)' : '📋 Local sessions only';

  // Unique sessions
  const uids = new Set(visitors.map(v=>v.sid));
  document.getElementById('kpi-unique-visitors').textContent = uids.size;
  // Avg time
  const timed = visitors.filter(v=>v.duration>0);
  const avg = timed.length ? Math.round(timed.reduce((a,v)=>a+v.duration,0)/timed.length) : 0;
  document.getElementById('kpi-avg-time').textContent = avg<60 ? avg+'s' : Math.floor(avg/60)+'m '+(avg%60)+'s';
  // Today (IST)
  const nowIST = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
  const todayStr = nowIST.toDateString();
  const todayViews = visitors.filter(v=>{
    const d=new Date(new Date(v.ts).toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
    return d.toDateString()===todayStr;
  }).length;
  document.getElementById('kpi-today').textContent = todayViews;
}

/* ── Daily Bar Chart ── */
function renderDailyChart(visitors){
  const container = document.getElementById('daily-chart');
  if(!container) return;
  // Last 14 days
  const days = [];
  for(let i=13;i>=0;i--){
    const d = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
    d.setDate(d.getDate()-i);
    days.push({ label: d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}), dateStr: d.toDateString(), count:0 });
  }
  visitors.forEach(v=>{
    const d=new Date(new Date(v.ts).toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
    const ds=d.toDateString();
    const day=days.find(x=>x.dateStr===ds);
    if(day) day.count++;
  });
  const maxCount = Math.max(...days.map(d=>d.count),1);
  container.innerHTML = days.map(d=>`
    <div class="bar-col">
      <div class="bar-fill" style="height:${Math.max(d.count/maxCount*100,d.count?4:2)}%;background:${d.count?'var(--grad)':'rgba(255,255,255,0.07)'}">
        <div class="bar-tooltip">${d.count} views</div>
      </div>
      <div class="bar-label">${d.label.split(' ')[0]}<br/>${d.label.split(' ')[1]}</div>
    </div>
  `).join('');
}

/* ── Section Bars ── */
const SECTION_NAMES = {hero:'Home',about:'About',skills:'Skills',projects:'Works',certificates:'Certificates',contact:'Contact'};
function renderSectionBars(visitors, containerId){
  const container = document.getElementById(containerId);
  if(!container) return;
  const counts = {};
  visitors.forEach(v=>{ (v.sections||[]).forEach(s=>{ counts[s]=(counts[s]||0)+1; }); });
  const entries = Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const max = entries[0]?.[1]||1;
  if(!entries.length){ container.innerHTML='<p style="font-size:0.8rem;color:var(--muted);text-align:center;padding:1rem">No section data yet</p>'; return; }
  container.innerHTML = entries.map(([s,c])=>`
    <div class="h-bar-item">
      <div class="h-bar-header">
        <span class="h-bar-name">${SECTION_NAMES[s]||s}</span>
        <span class="h-bar-count">${c}</span>
      </div>
      <div class="h-bar-track"><div class="h-bar-fill" style="width:${c/max*100}%"></div></div>
    </div>
  `).join('');
}

/* ── Recent Table ── */
function renderRecentTable(visitors){
  const tbody = document.getElementById('recent-tbody');
  if(!tbody) return;
  const recent = [...visitors].sort((a,b)=>b.ts-a.ts).slice(0,10);
  if(!recent.length){ tbody.innerHTML=`<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:2rem">No visits yet</td></tr>`; return; }
  tbody.innerHTML = recent.map((v,i)=>`
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td>${toIST(v.ts)}</td>
      <td><span class="badge badge-device">${deviceIcon(v.device)} ${v.device||'Unknown'}</span></td>
      <td><span class="badge badge-browser">${v.browser||'Unknown'}</span></td>
      <td style="font-family:var(--mono);font-size:0.7rem;color:var(--muted)">${v.screen||'—'}</td>
      <td style="font-size:0.72rem">${(v.sections||[]).map(s=>SECTION_NAMES[s]||s).join(' → ')||'—'}</td>
      <td style="font-family:var(--mono);color:var(--accent)">${v.duration?v.duration+'s':'—'}</td>
    </tr>
  `).join('');
}

/* ── All Visitors ── */
function renderAllVisitors(filter='', sort='newest'){
  const allTbody=document.getElementById('all-visitors-tbody');
  const emptyEl=document.getElementById('visitors-empty');
  if(!allTbody) return;
  let visitors = getVisitors();
  if(!visitors.length){ allTbody.innerHTML=''; emptyEl.style.display='block'; return; }
  emptyEl.style.display='none';
  if(filter) visitors=visitors.filter(v=>JSON.stringify(v).toLowerCase().includes(filter.toLowerCase()));
  if(sort==='newest') visitors=[...visitors].sort((a,b)=>b.ts-a.ts);
  if(sort==='oldest') visitors=[...visitors].sort((a,b)=>a.ts-b.ts);
  if(sort==='longest') visitors=[...visitors].sort((a,b)=>(b.duration||0)-(a.duration||0));
  allTbody.innerHTML = visitors.map((v,i)=>`
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td>${toIST(v.ts)}</td>
      <td><span class="badge badge-device">${deviceIcon(v.device)} ${v.device||'Unknown'}</span></td>
      <td style="font-size:0.75rem">${v.os||'—'}</td>
      <td><span class="badge badge-browser">${v.browser||'Unknown'}</span></td>
      <td style="font-family:var(--mono);font-size:0.7rem;color:var(--muted)">${v.screen||'—'}</td>
      <td style="font-size:0.72rem">${(v.sections||[]).map(s=>SECTION_NAMES[s]||s).join(', ')||'—'}</td>
      <td style="font-family:var(--mono);color:var(--accent)">${v.duration?v.duration+'s':'—'}</td>
      <td style="font-size:0.7rem;color:var(--muted)">${v.referrer||'Direct'}</td>
    </tr>
  `).join('');
}

document.getElementById('visitor-search')?.addEventListener('input',function(){ renderAllVisitors(this.value, document.getElementById('visitor-sort')?.value); });
document.getElementById('visitor-sort')?.addEventListener('change',function(){ renderAllVisitors(document.getElementById('visitor-search')?.value, this.value); });

/* ── Pages Panel ── */
function renderPages(){
  const visitors = getVisitors();
  renderSectionBars(visitors, 'section-detail-bars');
  // Referrers
  const refContainer = document.getElementById('referrer-bars');
  if(refContainer){
    const refs={};
    visitors.forEach(v=>{ const r=v.referrer||'Direct'; refs[r]=(refs[r]||0)+1; });
    const entries=Object.entries(refs).sort((a,b)=>b[1]-a[1]);
    const max=entries[0]?.[1]||1;
    refContainer.innerHTML = entries.length ? entries.map(([r,c])=>`
      <div class="h-bar-item">
        <div class="h-bar-header"><span class="h-bar-name">${r}</span><span class="h-bar-count">${c}</span></div>
        <div class="h-bar-track"><div class="h-bar-fill" style="width:${c/max*100}%"></div></div>
      </div>`).join('') : '<p style="font-size:0.8rem;color:var(--muted)">No referrer data yet</p>';
  }
  // Heatmap (24 hours)
  const heatmap = document.getElementById('heatmap');
  if(heatmap){
    const hours = new Array(24).fill(0);
    visitors.forEach(v=>{
      const d=new Date(new Date(v.ts).toLocaleString('en-US',{timeZone:'Asia/Colombo'}));
      hours[d.getHours()]++;
    });
    const max=Math.max(...hours,1);
    heatmap.innerHTML = hours.map((c,h)=>{
      const intensity = c/max;
      const bg = c===0?'rgba(109,40,217,0.07)':
        intensity<0.3?'rgba(109,40,217,0.3)':
        intensity<0.6?'rgba(109,40,217,0.6)':
        intensity<0.8?'rgba(0,212,255,0.6)':'rgba(0,212,255,0.9)';
      const label=`${h.toString().padStart(2,'0')}:00 — ${c} visit${c!==1?'s':''}`;
      return `<div class="heatmap-cell" style="background:${bg}" title="${label}"></div>`;
    }).join('');
  }
}

/* ── Devices Panel ── */
function renderDevices(){
  const visitors = getVisitors();
  // Browser bars
  renderCategoryBars(visitors,'browser', v=>v.browser||'Unknown', document.getElementById('browser-bars'));
  renderCategoryBars(visitors,'os', v=>v.os||'Unknown', document.getElementById('os-bars'));
  // Donut
  const canvas=document.getElementById('device-donut');
  const legend=document.getElementById('device-legend');
  if(!canvas||!visitors.length){ if(legend) legend.innerHTML='<p style="font-size:0.8rem;color:var(--muted)">No data yet</p>'; return; }
  const counts={};
  visitors.forEach(v=>{ const d=v.device||'Unknown'; counts[d]=(counts[d]||0)+1; });
  const colors=['#6d28d9','#00d4ff','#10b981','#f59e0b','#ec4899'];
  const entries=Object.entries(counts);
  const total=entries.reduce((a,[,c])=>a+c,0);
  const ctx=canvas.getContext('2d');
  const cx=110,cy=110,r=80,ri=50;
  ctx.clearRect(0,0,220,220);
  let start=-Math.PI/2;
  entries.forEach(([name,count],i)=>{
    const slice=(count/total)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+slice);ctx.closePath();
    ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,ri,0,Math.PI*2);ctx.fillStyle='#080e1c';ctx.fill();
    start+=slice;
  });
  ctx.fillStyle='#e2e8f0';ctx.font='bold 18px Outfit';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(total,cx,cy-6);
  ctx.font='11px Outfit';ctx.fillStyle='#94a3b8';ctx.fillText('visits',cx,cy+10);
  if(legend) legend.innerHTML=entries.map(([n,c],i)=>`
    <div class="legend-item">
      <div class="legend-dot" style="background:${colors[i%colors.length]}"></div>
      <span>${n}</span><span style="margin-left:auto;font-family:var(--mono);color:var(--accent);font-size:0.72rem">${c}</span>
    </div>`).join('');
}
function renderCategoryBars(visitors, field, getter, container){
  if(!container) return;
  const counts={};
  visitors.forEach(v=>{ const k=getter(v); counts[k]=(counts[k]||0)+1; });
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const max=entries[0]?.[1]||1;
  container.innerHTML=entries.length?entries.map(([k,c])=>`
    <div class="h-bar-item">
      <div class="h-bar-header"><span class="h-bar-name">${k}</span><span class="h-bar-count">${c}</span></div>
      <div class="h-bar-track"><div class="h-bar-fill" style="width:${c/max*100}%"></div></div>
    </div>`).join(''):'<p style="font-size:0.8rem;color:var(--muted)">No data yet</p>';
}

/* ── Settings ── */
function renderSettings(){
  const badge=localStorage.getItem(BADGE_KEY)==='true';
  const toggle=document.getElementById('public-badge-toggle');
  if(toggle) toggle.checked=badge;
  toggle?.addEventListener('change',function(){
    localStorage.setItem(BADGE_KEY,this.checked?'true':'false');
  });
}

document.getElementById('change-pass-btn')?.addEventListener('click',()=>{
  const p1=document.getElementById('new-pass-1')?.value.trim();
  const p2=document.getElementById('new-pass-2')?.value.trim();
  const msg=document.getElementById('pass-msg');
  if(!p1){ showMsg(msg,'⚠️ Enter a password','err'); return; }
  if(p1!==p2){ showMsg(msg,'❌ Passwords do not match','err'); return; }
  if(p1.length<6){ showMsg(msg,'⚠️ Min 6 characters','err'); return; }
  localStorage.setItem(PASS_KEY,p1);
  document.getElementById('new-pass-1').value='';
  document.getElementById('new-pass-2').value='';
  showMsg(msg,'✅ Password updated!','ok');
});
function showMsg(el,text,type){
  if(!el) return;
  el.textContent=text;el.className='setting-msg '+type;el.style.display='block';
  setTimeout(()=>{ el.style.display='none'; },3000);
}

document.getElementById('export-json-btn')?.addEventListener('click',()=>{
  const data=getVisitors();
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='visitors.json';a.click();
});
document.getElementById('export-csv-btn')?.addEventListener('click',()=>{
  const data=getVisitors();
  if(!data.length) return;
  const headers=['Timestamp','Device','OS','Browser','Screen','Sections','Duration','Referrer'];
  const rows=data.map(v=>[
    toIST(v.ts),v.device||'',v.os||'',v.browser||'',v.screen||'',
    (v.sections||[]).join('|'),v.duration||0,v.referrer||'Direct'
  ].map(x=>`"${x}"`).join(','));
  const csv=[headers.join(','),...rows].join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='visitors.csv';a.click();
});

function clearAll(){
  if(!confirm('Clear all visitor data? This cannot be undone.')) return;
  localStorage.removeItem(DB_KEY); renderAll();
  alert('✅ All visitor data cleared.');
}
document.getElementById('clear-data-btn')?.addEventListener('click', clearAll);
document.getElementById('clear-all-btn')?.addEventListener('click', clearAll);

/* ── Device icon helper ── */
function deviceIcon(d){
  if(!d) return '❓';
  if(d.toLowerCase().includes('mobile')||d.toLowerCase().includes('phone')) return '📱';
  if(d.toLowerCase().includes('tablet')) return '📟';
  return '🖥️';
}
