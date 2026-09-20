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
const roles=['Cyber Security Student','Full-Stack Developer','Aspiring Ethical Hacker','Linux Explorer 🐧','VAPT Practitioner'];
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
const FALLBACK=[
  {name:'My-Portfolio-Website',description:'Personal portfolio website showcasing cybersecurity projects and web development skills. Live GitHub API integration, typing animations, responsive design and dynamic project filtering.',language:'JavaScript',stargazers_count:1,forks_count:0,html_url:'https://github.com/sudoankit404/My-Portfolio-Website',homepage:'https://sudoankit404.github.io/My-Portfolio-Website/',topics:['portfolio','web']},
  {name:'Evolution-Dance-Centre-Website-',description:'Official website for Evolution Dance Centre — a bold, creative dance academy website with portfolio showcase, dance forms, services and contact info.',language:'HTML',stargazers_count:1,forks_count:0,html_url:'https://github.com/sudoankit404/Evolution-Dance-Centre-Website-',homepage:'',topics:['website','client']}
];
let repos=[],filter='all';

function classify(r){
  const t=((r.name||'')+' '+(r.description||'')+' '+(r.topics||[]).join(' ')).toLowerCase();
  if(/secur|hack|pentest|vapt|scan|exploit|ctf|crypt/.test(t))return 'security';
  if(/tool|script|automat|cli|bot|python|bash/.test(t))return 'tool';
  return 'web';
}
function esc(s){return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

function skeletons(n){
  document.getElementById('projGrid').innerHTML=Array.from({length:n}).map(()=>`
    <article class="card proj">
      <div class="proj-top"><div class="skeleton" style="width:42px;height:34px"></div><div class="skeleton" style="width:56px;height:18px"></div></div>
      <h3 class="skeleton" style="width:70%;height:20px"></h3>
      <p class="skeleton" style="height:58px;margin-top:.6rem"></p>
      <div class="proj-meta"><span class="skeleton" style="width:110px;height:14px"></span></div>
    </article>`).join('');
}
function render(){
  const grid=document.getElementById('projGrid');
  const list=repos.filter(r=>filter==='all'||classify(r)===filter);
  if(!list.length){grid.innerHTML='<p style="color:var(--muted)">No projects in this category yet — more coming soon.</p>';return;}
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
        <span>★ ${r.stargazers_count||0}</span>
        <span>⑂ ${r.forks_count||0}</span>
        <span style="color:var(--brand)">${classify(r)}</span>
      </div>
    </article>`).join('');
}
skeletons(4);
(async()=>{
  try{
    const r=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`).then(x=>x.ok?x.json():null);
    
    if(Array.isArray(r)&&r.length>0){
      repos=r.filter(x=>!x.fork&&!x.private).sort((a,b)=>(b.stargazers_count-a.stargazers_count)||(new Date(b.pushed_at)-new Date(a.pushed_at)));
    } else {
      repos=FALLBACK;
    }
  }catch(e){
    console.warn('GitHub API error:',e);
    repos=FALLBACK;
  }
  render();
})();
document.getElementById('filters').addEventListener('click',e=>{
  const b=e.target.closest('.filter');if(!b)return;
  document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');filter=b.dataset.f;render();
});

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
  window.location.href=`mailto:sudoankit404@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  showToast('Thanks, '+name.split(' ')[0]+'! Your email client is opening…');
  f.reset();
});

document.getElementById('yr').textContent=new Date().getFullYear();
