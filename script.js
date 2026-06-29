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
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
if(mobileThemeToggle) mobileThemeToggle.addEventListener('click',()=>applyTheme(htmlEl.getAttribute('data-theme')==='dark'?'light':'dark'));

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
/* ── VIDEO FILTER ─────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    document.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.remove('active')
    );

    btn.classList.add('active');

    const f = btn.dataset.filter;

  document.querySelectorAll('.video-card').forEach(item => {
  const show = f === 'all' || item.dataset.cat === f;
  item.style.display = show ? 'block' : 'none';
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

/* ── SERVICE CARD CLICK PREVENT ON DESKTOP ────────────── */
document.querySelectorAll('.services-grid a.service-card').forEach(card => {
  card.addEventListener('click', e => {
    if (window.innerWidth > 768) {
      e.preventDefault();
    }
  });
});




/* ================================================================
   V7LANCERS — MOBILE OPTIMIZATIONS (JavaScript)
   Add this block at the bottom of script.js, or load as a
   separate file after script.js.
   All logic is wrapped in a mobile-only guard (≤768px).
   Desktop behaviour is completely unchanged.
================================================================ */

(function () {

  /* Only run on mobile viewports */
  if (window.innerWidth > 768) return;

  /* ── PRODUCTS SECTION: disable cloning script side-effects ── */
  /*
   * The inline <script> in index.html clones ps-cards for the desktop
   * infinite-scroll track. It is guarded with `if (window.innerWidth > 768)`
   * so it already skips on mobile — no action needed here.
   *
   * What we do need: stop any residual animation and ensure the track
   * behaves as a vertical list (handled by CSS above).
   */
  var psTrack = document.getElementById('psTrack');
  if (psTrack) {
    /* Pause CSS animation just in case a resize fires */
    psTrack.style.animation = 'none';
    psTrack.style.transform = 'none';
  }

  /* ── MOBILE NAV: filter to Home, Products, Services, Contact ── */
  /*
   * Links to hide are already handled via CSS display:none above.
   * This JS layer provides a belt-and-braces approach and also
   * re-orders visible links so Contact appears last.
   */
  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    var HIDE_HREFS = ['portfolio.html', 'testimonials.html', 'gallery.html', 'about.html'];
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('/').pop();
      if (HIDE_HREFS.indexOf(href) !== -1) {
        a.style.display = 'none';
      }
    });
  }

  /* ── MANAGEMENT TEAM SECTION: ensure it is visible ──────── */
  /*
   * #management-team carries class "mobile-only-section".
   * CSS sets display:block for it on mobile; this JS removes any
   * inline display:none that might be set elsewhere at runtime.
   */
  var teamSection = document.getElementById('management-team');
  if (teamSection) {
    teamSection.style.removeProperty('display');
  }

  /* ── REDUCE PARTICLE COUNT ON MOBILE (performance) ──────── */
  /*
   * The particle canvas is already initialised by the time this runs.
   * We lower opacity via CSS (see mobile-optimizations.css) and stop
   * mouse-tracking which is irrelevant on touch screens.
   */
  window.addEventListener('mousemove', function () {}, { passive: true }); /* no-op replacement handled in CSS */

  /* ── SERVICE CARD LINKS: keep clickable on mobile ─────────── */
  /*
   * The existing script.js prevents clicks on service cards when
   * window.innerWidth > 768, which is correct. Nothing extra needed.
   */

  /* ── SCROLL REVEAL: lower threshold for smaller screens ───── */
  /*
   * Existing IntersectionObserver uses threshold:0.1.
   * On very small screens deeply nested cards may never fully cross
   * that threshold. We re-observe any not-yet-visible .reveal elements
   * with a more forgiving observer.
   */
  var mobileObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        mobileObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
    mobileObserver.observe(el);
  });

  /* ── STAGGER DELAY: reduce on mobile for snappier feel ────── */
  document.querySelectorAll(
    '.services-grid, .team-grid, .ps-track'
  ).forEach(function (grid) {
    Array.from(grid.children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 40) + 'ms'; /* 40ms vs 70ms desktop */
    });
  });

  /* ── MOBILE STICKY NAV ACTIVE HIGHLIGHT ────────────────── */
  var sections = [
    document.getElementById('home-hero'),
    document.getElementById('products-section'),
    document.getElementById('services'),
    document.getElementById('management-team'),
    document.getElementById('quote')
  ].filter(Boolean);

  var navLinks = document.querySelectorAll('.mobile-nav-item');

  if (sections.length > 0 && navLinks.length > 0) {
    var observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px',
      threshold: 0
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });

    /* Smooth Scrolling for bottom navigation on click */
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = link.getAttribute('href');
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

})();

const slider = document.getElementById("productSlider");
const tabs = document.querySelectorAll(".product-nav button");

tabs.forEach((tab,index)=>{

  tab.addEventListener("click",()=>{

    slider.scrollTo({
      left:index * slider.clientWidth,
      behavior:"smooth"
    });

    tabs.forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
  });

});

slider.addEventListener("scroll",()=>{

  const index = Math.round(
    slider.scrollLeft / slider.clientWidth
  );

  tabs.forEach(t=>t.classList.remove("active"));

  if(tabs[index]){
    tabs[index].classList.add("active");
  }

});
function openPanel(id) {
    scrollPosition = window.pageYOffset;

    document.getElementById(id).classList.add("active");
    document.body.classList.add("no-scroll");

    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
}

function closePanel(id) {
    document.getElementById(id).classList.remove("active");
    document.body.classList.remove("no-scroll");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";

    window.scrollTo(0, scrollPosition);
}