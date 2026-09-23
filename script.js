/* ---------------- Theme ---------------- */
(function(){
  const saved = localStorage.getItem('ak-theme');
  const prefLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if(saved === 'light' || (!saved && prefLight)) document.documentElement.setAttribute('data-theme','light');
  paintIcon();
})();
function paintIcon(){
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  document.getElementById('themeIcon').innerHTML = light
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}
document.getElementById('themeBtn').addEventListener('click',()=>{
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  if(light){document.documentElement.removeAttribute('data-theme');localStorage.setItem('ak-theme','dark');}
  else{document.documentElement.setAttribute('data-theme','light');localStorage.setItem('ak-theme','light');}
  paintIcon();
});

/* ---------------- Nav ---------------- */
const nav=document.getElementById('nav'),burger=document.getElementById('burger'),menu=document.getElementById('mobileMenu'),toTop=document.getElementById('toTop');
function toggleMenu(force){
  const open = force!==undefined?force:!menu.classList.contains('open');
  menu.classList.toggle('open',open);burger.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click',()=>toggleMenu());
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!menu.contains(e.target)&&!burger.contains(e.target))toggleMenu(false);});
window.addEventListener('resize',()=>{if(innerWidth>860)toggleMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false);});
document.getElementById('navResume').addEventListener('click',downloadResume);
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const sections=[...document.querySelectorAll('section[id]')];
const navA=[...document.querySelectorAll('.nav-links a')];
let ticking=false;
addEventListener('scroll',()=>{
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
    const y=scrollY;
    nav.classList.toggle('scrolled',y>20);
    toTop.classList.toggle('show',y>600);
    let cur='';
    sections.forEach(s=>{if(y>=s.offsetTop-120)cur=s.id;});
    navA.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
    ticking=false;
  });
},{passive:true});

/* ---------------- Typing ---------------- */
const roles=['Cyber Security Enthusiast','Full-Stack Developer','Aspiring Ethical Hacker','Linux Explorer 🐧','VAPT Practitioner'];
const typedEl=document.getElementById('typed');
let ri=0,ci=0,del=false;
(function type(){
  const w=roles[ri];
  typedEl.textContent = del ? w.slice(0,--ci) : w.slice(0,++ci);
  let t = del?45:85;
  if(!del&&ci===w.length){del=true;t=1700;}
  else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;t=320;}
  setTimeout(type,t);
})();

/* ---------------- Reveal + bars ---------------- */
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(i%4)*70+'ms';io.observe(el);});

const barIO=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('i[data-w]').forEach((b,i)=>setTimeout(()=>b.style.width=b.dataset.w+'%',i*130));
      barIO.unobserve(e.target);
    }
  });
},{threshold:.3});
barIO.observe(document.getElementById('bars'));

/* ---------------- GitHub API ---------------- */
const USER='sudoankit404';
let repos=[],sortBy='updated';

function esc(s){return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}


function sortRepos(list){
  if(sortBy==='stars')return [...list].sort((a,b)=>(b.stargazers_count-a.stargazers_count)||(new Date(b.pushed_at)-new Date(a.pushed_at)));
  if(sortBy==='updated')return [...list].sort((a,b)=>new Date(b.pushed_at)-new Date(a.pushed_at));
  if(sortBy==='name')return [...list].sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

function render(){
  const grid=document.getElementById('projGrid');
  let list=sortRepos(repos);
  
  console.log(`🎨 Rendering ${list.length} repositories (sorted by: ${sortBy})`);
  console.log('Repository names:', list.map(r=>r.name).join(', '));
  
  if(!list.length){
    console.warn('⚠️ No repositories to display!');
    grid.innerHTML='<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:2rem">No repositories found.</p>';
    return;
  }
  
  grid.innerHTML=list.map(r=>`
    <article class="card proj">
      <div class="proj-top">
        <span class="folder"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
        <span class="proj-links">
          ${r.homepage?`<a href="${esc(r.homepage)}" target="_blank" rel="noopener" aria-label="Live demo"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg></a>`:''}
          <a href="${esc(r.html_url)}" target="_blank" rel="noopener" aria-label="Source code"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg></a>
        </span>
      </div>
      <h3><a href="${esc(r.html_url)}" target="_blank" rel="noopener">${esc(r.name.replace(/-$/,'').replace(/-/g,' '))}</a></h3>
      <p>${esc(r.description||'No description provided for this repository yet.')}</p>
      <div class="proj-meta">
        ${r.language?`<span><span class="lang-dot"></span>${esc(r.language)}</span>`:''}
        <span title="Stars">★ ${r.stargazers_count||0}</span>
        <span title="Forks">⑂ ${r.forks_count||0}</span>
        ${r.pushed_at?`<span title="Last updated">🕐 ${timeAgo(r.pushed_at)}</span>`:''}
      </div>
    </article>`).join('');
}

function timeAgo(date){
  const seconds=Math.floor((new Date()-new Date(date))/1000);
  const intervals=[
    {label:'year',seconds:31536000},
    {label:'month',seconds:2592000},
    {label:'day',seconds:86400},
    {label:'hour',seconds:3600},
    {label:'minute',seconds:60}
  ];
  for(const interval of intervals){
    const count=Math.floor(seconds/interval.seconds);
    if(count>=1)return count===1?`1 ${interval.label} ago`:`${count} ${interval.label}s ago`;
  }
  return 'just now';
}
// Show loading state
const countEl=document.getElementById('repoCount');
if(countEl)countEl.innerHTML='<span style="opacity:.7">fetching repositories...</span>';
document.getElementById('projGrid').innerHTML=`
  <div style="grid-column:1/-1;text-align:center;padding:3rem 1rem">
    <div style="font-size:2rem;margin-bottom:1rem">📡</div>
    <p style="color:var(--muted);font-size:1rem">Loading repositories from GitHub...</p>
  </div>
`;

// Fetch ALL repositories from GitHub API
(async()=>{
  try{
    console.log('🔄 Fetching repositories from GitHub API...');
    const response=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`);
    
    if(!response.ok){
      throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
    }
    
    const data=await response.json();
    
    if(Array.isArray(data)&&data.length>0){
      // Get ALL repos - both public and private ones that are accessible
      const allRepos=data.filter(x=>!x.fork);
      repos=allRepos;
      
      console.log(`✅ Successfully loaded ${repos.length} repositories from GitHub API`);
      console.log('📦 All Repository Names:', repos.map(r=>r.name).join(', '));
      console.log('📊 Full Repository Data:', repos);
      console.table(repos.map(r=>({
        name:r.name,
        language:r.language,
        stars:r.stargazers_count,
        forks:r.forks_count,
        private:r.private,
        fork:r.fork
      })));
      
      // Update repo count with live data
      if(countEl){
        const now=new Date();
        const time=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
        countEl.innerHTML=`${repos.length} ${repos.length===1?'repository':'repositories'} <span style="opacity:.6;font-weight:400">· auto-synced at ${time}</span>`;
      }
      
      // Render all repositories
      render();
      
      // Show success message
      if(repos.length>0){
        console.log(`✨ Successfully displaying all ${repos.length} repositories!`);
      }else{
        console.warn('⚠️ No repositories found to display!');
      }
      
    } else {
      throw new Error('No repositories found');
    }
    
  }catch(error){
    console.error('❌ GitHub API Error:',error);
    
    // Show error state
    if(countEl){
      countEl.innerHTML='<span style="color:var(--danger)">Failed to fetch repositories</span>';
    }
    
    document.getElementById('projGrid').innerHTML=`
      <div style="grid-column:1/-1;text-align:center;padding:3rem 1rem">
        <div style="font-size:2rem;margin-bottom:1rem">⚠️</div>
        <p style="color:var(--muted);font-size:1rem;margin-bottom:.5rem">Unable to load repositories from GitHub</p>
        <p style="color:var(--dim);font-size:.85rem">Error: ${error.message}</p>
        <button class="btn btn-ghost" onclick="location.reload()" style="margin-top:1.5rem">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          Retry
        </button>
      </div>
    `;
  }
})();
document.getElementById('sortSelect').addEventListener('change',e=>{
  sortBy=e.target.value;
  render();
});

/* ========== Auto-Refresh Repositories ========== */
async function refreshRepos(){
  const countEl=document.getElementById('repoCount');
  const btn=event?.target?.closest('button');
  
  if(btn){
    btn.disabled=true;
    btn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Refreshing...';
  }
  
  if(countEl)countEl.innerHTML='<span style="opacity:.7">refreshing...</span>';
  
  try{
    const response=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated&_=${Date.now()}`);
    if(!response.ok)throw new Error('Failed to fetch');
    
    const data=await response.json();
    repos=data.filter(x=>!x.fork);
    
    const now=new Date();
    const time=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    if(countEl)countEl.innerHTML=`${repos.length} ${repos.length===1?'repository':'repositories'} <span style="opacity:.6;font-weight:400">· synced at ${time}</span>`;
    
    render();
    console.log(`✅ Refreshed: ${repos.length} repositories`);
    
    if(btn){
      btn.disabled=false;
      btn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Refresh Repositories';
    }
  }catch(error){
    console.error('Refresh failed:',error);
    if(countEl)countEl.innerHTML='<span style="color:var(--danger)">Refresh failed</span>';
    if(btn){
      btn.disabled=false;
      btn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> Retry';
    }
  }
}

/* ========== Auto-Refresh Every 5 Minutes ========== */
setInterval(async()=>{
  console.log('⏰ Auto-refreshing repositories...');
  try{
    const response=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated&_=${Date.now()}`);
    if(response.ok){
      const data=await response.json();
      const newCount=data.filter(x=>!x.fork).length;
      const oldCount=repos.length;
      
      repos=data.filter(x=>!x.fork);
      
      if(newCount!==oldCount){
        console.log(`🔔 Repository count changed: ${oldCount} → ${newCount}`);
        const now=new Date();
        const time=now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
        const countEl=document.getElementById('repoCount');
        if(countEl){
          countEl.innerHTML=`${repos.length} ${repos.length===1?'repository':'repositories'} <span style="opacity:.6;font-weight:400">· auto-updated at ${time}</span>`;
          // Flash effect to show update
          countEl.style.animation='flash 0.5s ease';
          setTimeout(()=>countEl.style.animation='',500);
        }
        render();
        showToast(newCount>oldCount?`🎉 New repository detected! Now showing ${newCount} repositories.`:`Repository count updated: ${newCount} repositories`);
      }else{
        console.log(`✓ No changes (${repos.length} repositories)`);
      }
    }
  }catch(e){
    console.warn('Auto-refresh failed:',e);
  }
},5*60*1000); // Every 5 minutes

// Add CSS for animations
const style=document.createElement('style');
style.textContent=`
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes flash{0%,100%{opacity:1}50%{opacity:.3;color:var(--brand)}}
`;
document.head.appendChild(style);

/* ========== Debug Panel ========== */
function toggleDebug(){
  const panel=document.getElementById('repoDebug');
  if(!panel)return;
  
  if(panel.style.display==='none'){
    panel.style.display='block';
    panel.innerHTML=`
      <h4 style="margin-bottom:1rem;color:var(--brand)">🔍 Debug Information</h4>
      <p><strong>Total repositories loaded:</strong> ${repos.length}</p>
      <p><strong>Current sort:</strong> ${sortBy}</p>
      <p><strong>Repository names:</strong></p>
      <ul style="margin-left:1.5rem;margin-top:.5rem">
        ${repos.map(r=>`<li>${r.name} (${r.language||'No language'}) - ⭐${r.stargazers_count} - ${r.private?'Private':'Public'}</li>`).join('')}
      </ul>
      <p style="margin-top:1rem"><strong>API Endpoint:</strong> https://api.github.com/users/${USER}/repos</p>
      <p><strong>Browser console:</strong> Press F12 to see detailed logs</p>
    `;
  }else{
    panel.style.display='none';
  }
}

/* ---------------- Resume download ---------------- */
function downloadResume(){
  toggleMenu(false);
  showToast('Opening print dialog — choose “Save as PDF”.');
  setTimeout(()=>window.print(),400);
}

/* ---------------- Contact form ---------------- */
const toastEl=document.getElementById('toast');let toastT;
function showToast(msg){
  toastEl.textContent=msg;toastEl.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),3800);
}
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.target;
  const name=f.name.value.trim(),email=f.email.value.trim(),subject=f.subject.value.trim()||'Portfolio enquiry',msg=f.message.value.trim();
  if(!name||!email||!msg){showToast('Please fill in your name, email and message.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast('That email address looks invalid.');return;}
  const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href=`mailto:ankitkumar24273@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  showToast('Thanks, '+name.split(' ')[0]+'! Your email client is opening…');
  f.reset();
});

document.getElementById('yr').textContent=new Date().getFullYear();
