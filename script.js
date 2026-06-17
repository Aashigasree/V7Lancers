/* ── PARTICLE CANVAS ──────────────────────────────────── */
(function(){
  const canvas = document.getElementById('canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, mouse = {x:-999,y:-999};
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 120;
  const MOUSE_DIST = 130;
  let particles = [];

  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function rand(a,b){ return Math.random()*(b-a)+a; }

  class Particle{
    constructor(){ this.reset(true); }
    reset(init){
      this.x = rand(0,W); this.y = init ? rand(0,H) : -8;
      this.vx = rand(-.3,.3); this.vy = rand(.12,.4);
      this.r = rand(1,2.2); this.alpha = rand(.3,.65);
    }
    update(){
      const dx=this.x-mouse.x, dy=this.y-mouse.y, d=Math.hypot(dx,dy);
      if(d<MOUSE_DIST){ const f=(MOUSE_DIST-d)/MOUSE_DIST*.5; this.vx+=(dx/d)*f; this.vy+=(dy/d)*f; }
      this.vx*=.986; this.vy*=.986;
      this.x+=this.vx; this.y+=this.vy;
      if(this.y>H+8||this.x<-20||this.x>W+20) this.reset(false);
    }
    draw(){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(232,255,0,${this.alpha})`; ctx.fill();
    }
  }

  function init(){ resize(); particles=Array.from({length:PARTICLE_COUNT},()=>new Particle()); }

  function loop(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<particles.length;i++)
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.hypot(dx,dy);
        if(d<CONNECT_DIST){
          ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(232,255,0,${(.16*(1-d/CONNECT_DIST)).toFixed(3)})`; ctx.lineWidth=.6; ctx.stroke();
        }
      }
    particles.forEach(p=>{p.update();p.draw()});
    requestAnimationFrame(loop);
  }
  window.addEventListener('resize',resize);
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  window.addEventListener('touchmove',e=>{mouse.x=e.touches[0].clientX;mouse.y=e.touches[0].clientY;},{passive:true});
  init(); loop();
})();

/* ── DARK / LIGHT MODE ────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl      = document.documentElement;
function applyTheme(t){
  htmlEl.setAttribute('data-theme',t);
  localStorage.setItem('v7-theme',t);
}
const savedTheme = localStorage.getItem('v7-theme')||'dark';
applyTheme(savedTheme);
if(themeToggle) themeToggle.addEventListener('click',()=>applyTheme(htmlEl.getAttribute('data-theme')==='dark'?'light':'dark'));

/* ── NAV SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if(navbar) window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>40));

/* ── ACTIVE NAV LINK ──────────────────────────────────── */
(function(){
  const path = window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('/').pop();
    if(href===path || (path==='index.html' && href==='') || href===path.replace('.html',''))
      a.classList.add('active');
  });
})();

/* ── HAMBURGER ────────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if(hamburger && mobileMenu){
  hamburger.addEventListener('click',()=>{
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow=mobileMenu.classList.contains('open')?'hidden':'';
  });
}
function closeMobile(){
  if(hamburger) hamburger.classList.remove('open');
  if(mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow='';
}

/* ── SCROLL REVEAL ────────────────────────────────────── */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ── STAGGER GRID CHILDREN ────────────────────────────── */
document.querySelectorAll('.services-grid,.testi-grid,.awards-grid,.products-grid-home,.why-grid,.team-grid,.portfolio-grid,.gallery-grid,.blog-grid,.success-grid,.video-grid').forEach(grid=>{
  Array.from(grid.children).forEach((c,i)=>c.style.transitionDelay=(i*70)+'ms');
});

/* ── PORTFOLIO FILTER ─────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item=>{
      const show=f==='all'||item.dataset.cat===f;
      item.style.opacity=show?'1':'.18';
      item.style.transform=show?'':'scale(.97)';
      item.style.pointerEvents=show?'':'none';
    });
  });
});

/* ── GALLERY FILTER ───────────────────────────────────── */
document.querySelectorAll('.gallery-filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.gallery-filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.gfilter;
    document.querySelectorAll('.gallery-item').forEach(item=>{
      const show=f==='all'||item.dataset.gcat===f;
      item.style.opacity=show?'1':'.12';
      item.style.transform=show?'':'scale(.97)';
    });
  });
});

/* ── GALLERY LIGHTBOX ─────────────────────────────────── */
(function(){
  const lightbox = document.getElementById('galleryLightbox');
  const closeBtn = document.getElementById('galleryLightboxClose');
  if(!lightbox) return;
  const iconEl = document.getElementById('galleryLightboxIcon');
  const titleEl = document.getElementById('galleryLightboxTitle');
  const catEl = document.getElementById('galleryLightboxCat');
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow='';
  }
  document.querySelectorAll('.gallery-item').forEach(item=>{
    item.addEventListener('click',()=>{
      if(iconEl) iconEl.textContent = item.dataset.gicon||'';
      if(titleEl) titleEl.textContent = item.dataset.gtitle||'';
      if(catEl) catEl.textContent = (item.querySelector('.gallery-label')||{}).textContent||'';
      lightbox.classList.add('open');
      document.body.style.overflow='hidden';
    });
  });
  if(closeBtn) closeBtn.addEventListener('click',closeLightbox);
  lightbox.addEventListener('click',e=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox(); });
})();

/* ── CONTACT / QUOTE FORM ─────────────────────────────── */
document.querySelectorAll('[data-submit]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    btn.disabled=true; btn.textContent='Sending…';
    setTimeout(()=>{
      btn.textContent='✓ Sent! We\'ll respond soon.';
      btn.style.background='#22c55e';
      setTimeout(()=>{ btn.disabled=false; btn.textContent=btn.dataset.submit; btn.style.background=''; },3500);
    },1600);
  });
});

/* ── HERO TEXT CAROUSEL ──────────────────────────────── */
(function() {
  const carouselItems = document.querySelectorAll('.hero-carousel .carousel-item');
  if (carouselItems.length === 0) return;
  let currentIndex = 0;
  setInterval(() => {
    const current = carouselItems[currentIndex];
    currentIndex = (currentIndex + 1) % carouselItems.length;
    const next = carouselItems[currentIndex];
    
    current.classList.remove('active');
    current.classList.add('exit');
    
    next.classList.add('active');
    
    setTimeout(() => {
      current.classList.remove('exit');
    }, 500);
  }, 3500);
})();
