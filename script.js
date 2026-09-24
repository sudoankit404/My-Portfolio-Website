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

/* ---------------- Projects - Hardcoded ---------------- */
const projects = [
  {
    name: 'URLScanner Pro',
    description: 'Advanced URL security scanner with comprehensive threat detection, malware analysis, and real-time safety reports. Built with modern web technologies for fast and accurate scanning.',
    url: 'https://github.com/sudoankit404/URLScanner-Pro',
    demo: null,
    language: 'Python',
    tags: ['Security', 'Web Scanner', 'Threat Detection']
  },
  {
    name: 'Evolution Dance Centre Website',
    description: 'Multi-page responsive website for a dance academy featuring portfolio showcase, class listings, services and contact sections. Built with vanilla HTML, CSS, and JavaScript.',
    url: 'https://github.com/sudoankit404/Evolution-Dance-Centre-Website-',
    demo: 'https://sudoankit404.github.io/Evolution-Dance-Centre-Website-/',
    language: 'HTML',
    tags: ['Web Development', 'Responsive Design', 'Portfolio']
  },
  {
    name: 'My Portfolio Website',
    description: 'Personal portfolio website showcasing cybersecurity projects and web development skills. Features live GitHub API integration, typing animations, responsive design, and dynamic project filtering.',
    url: 'https://github.com/sudoankit404/My-Portfolio-Website',
    demo: 'https://sudoankit404.github.io/My-Portfolio-Website/',
    language: 'JavaScript',
    tags: ['Portfolio', 'Web Development', 'Responsive']
  }
];

function renderProjects(){
  const grid=document.getElementById('projGrid');
  const countEl=document.getElementById('repoCount');
  
  if(countEl) {
    countEl.innerHTML = `<span style="color:var(--brand)">${projects.length} featured projects</span> showcasing my work`;
  }
  
  grid.innerHTML = projects.map(project => `
    <article class="card proj">
      <div class="proj-top">
        <span class="folder"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></span>
        <span class="proj-links">
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener" aria-label="Live demo"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg></a>` : ''}
          <a href="${project.url}" target="_blank" rel="noopener" aria-label="Source code"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg></a>
        </span>
      </div>
      <h3><a href="${project.url}" target="_blank" rel="noopener">${project.name}</a></h3>
      <p>${project.description}</p>
      <div class="proj-meta">
        ${project.language ? `<span><span class="lang-dot"></span>${project.language}</span>` : ''}
        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
      </div>
    </article>
  `).join('');
  
  console.log(`✅ Rendered ${projects.length} projects`);
}

// Initialize - render projects immediately
renderProjects();
/* ---------------- Resume Download ---------------- */
// Download Resume
document.getElementById('downloadBtn').addEventListener('click', downloadResume);
document.getElementById('navResume').addEventListener('click', downloadResume);

function downloadResume() {
  
  const resumeURL = 'Ankit resume.pdf'; 
  
  if (resumeURL && resumeURL !== 'Ankit resume.pdf') {
    // Download from URL
    const link = document.createElement('a');
    link.href = resumeURL;
    link.download = 'Ankit resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Generate a text resume as fallback
    generateDefaultResume();
  }
}

function generateDefaultResume() {
  const resumeContent = `
ANKIT KUMAR
Cyber Security Enthusiast · Full-Stack Developer
sudoankit404@gmail.com | github.com/sudoankit404 | linkedin.com/in/sudoankit404 | India

PROFESSIONAL SUMMARY
BCA (Cyber Security) student and full-stack developer with hands-on experience in Vulnerability Assessment & Penetration Testing (VAPT), web application security and responsive front-end development. Comfortable in Linux environments, skilled with industry-standard security tooling, and experienced in delivering production websites for real clients. Seeking an internship or junior role in cyber security or web development.

EDUCATION
Bachelor of Computer Applications (BCA) — Cyber Security
2023 – 2026
• Core coursework: computer networks, operating systems, DBMS, programming fundamentals, cryptography and information security.
• Continuous practical lab work in ethical hacking, Linux administration and secure application development.

EXPERIENCE
Freelance Web Developer — Self-employed
Remote · Present
• Designed and delivered responsive, mobile-first websites for small businesses using vanilla HTML, CSS and JavaScript.
• Built and deployed the Evolution Dance Centre website (multi-page, portfolio showcase, services and contact modules).
• Optimised page performance, accessibility and cross-device compatibility; deployed via GitHub Pages.

Independent Security Researcher
Personal labs & CTF platforms · Present
• Perform end-to-end VAPT on intentionally vulnerable web applications: reconnaissance, enumeration, exploitation and remediation reporting.
• Test against the OWASP Top 10 including injection, broken authentication, XSS and access-control flaws.
• Develop Python and Bash utilities that automate reconnaissance and reporting workflows.

TECHNICAL SKILLS
Programming Languages: C, C++, C#, Python, JavaScript, Java, PHP
Web Technologies: HTML5, CSS3, Bootstrap, jQuery, Ajax, React.js, Express.js
Version Control: Git, GitHub
Operating Systems: Kali Linux, Ubuntu, Parrot OS, BlackArch, Windows, macOS
Security Tools: Burp Suite, Nmap, Wireshark, Metasploit, Nikto, Hydra, John the Ripper
Specializations: VAPT, OWASP Top 10, Web Application Security, Network Scanning, Penetration Testing

SELECTED PROJECTS
• Personal Portfolio Website — Responsive portfolio with live GitHub API integration, dynamic project filtering, dark/light theming and typing animations. Vanilla HTML/CSS/JS.
• Evolution Dance Centre Website — Multi-page website for a dance academy featuring portfolio showcase, class listings, services and contact sections. HTML, CSS, JavaScript.
• Security Tooling & Lab Work — Python/Bash scripts for automated reconnaissance, scanning and structured vulnerability reporting.

LICENSES & CERTIFICATIONS
• Ethical Hacker Essentials (EHE) — EC-Council
• CompTIA Security+ — CompTIA
• OWASP Top 10 Certification — OWASP Foundation
• Linux Professional Institute (LPIC-1) — LPI
• Full-Stack Web Development — Udemy
• Python for Everybody Specialization — Coursera
• Penetration Testing & Bug Bounty Hunting — TCM Security
• Introduction to Cyber Security — Cisco Networking Academy
• JavaScript Algorithms and Data Structures — freeCodeCamp
• Networking Basics — Cisco
• Cryptography and Network Security — NPTEL
• Git & GitHub Complete Course — Udemy
• SQL for Data Science — Coursera
• Responsive Web Design — freeCodeCamp
• API Development and Security — Postman

STRENGTHS
Attacker mindset paired with builder discipline · clear technical documentation · fast self-learner · strong command-line fluency · committed to responsible, ethical security practice.
  `;

  const blob = new Blob([resumeContent], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Ankit resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
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
