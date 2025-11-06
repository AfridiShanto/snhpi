// ---------- Mobile Nav ----------
const navToggle = document.getElementById('nav-toggle');
const nav       = document.getElementById('nav');
const navClose  = document.getElementById('nav-close');

function closeNav(){
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded','false');
  navToggle.innerHTML = '<i class="bx bx-menu" aria-hidden="true"></i>';
}
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.innerHTML = isOpen ? '<i class="bx bx-x" aria-hidden="true"></i>' : '<i class="bx bx-menu" aria-hidden="true"></i>';
});
navClose?.addEventListener('click', closeNav);
nav.addEventListener('click', (e) => { if(e.target.classList.contains('nav-link')) closeNav(); });

// ---------- Header shrink ----------
const headerEl = document.querySelector('.header');
window.addEventListener('scroll', () => { headerEl.classList.toggle('shrink', window.scrollY > 80); });

// ---------- Active link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
function onScroll(){
  const scrollY = window.pageYOffset;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const top = rect.top + window.scrollY - 120;
    const bottom = top + sec.offsetHeight;
    if(scrollY >= top && scrollY < bottom){
      const id = sec.getAttribute('id');
      navLinks.forEach(a => a.classList.remove('active'));
      document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
    }
  });
}
window.addEventListener('scroll', onScroll);
onScroll();

// ---------- TypedJS ----------
if (window.Typed) {
  new Typed('.multiple-text', {
    strings: [
      'A center of excellence in technical education',
      'Empowering students for a brighter future.',
      'Learn, innovate, and succeed with us.',
      'Where knowledge meets creativity.'
    ],
    typeSpeed: 80, backSpeed: 60, backDelay: 1000, loop: true
  });
}

// ---------- ScrollReveal ----------
if (window.ScrollReveal) {
  const sr = ScrollReveal({ distance: '25px', duration: 800, delay: 80, easing: 'ease', reset: false });
  sr.reveal('.home-content', { origin: 'top' });
  sr.reveal('.about-img', { origin: 'left' });
  sr.reveal('.about-text', { origin: 'right' });
  sr.reveal('.about-card', { origin: 'bottom', interval: 80 });
  sr.reveal('.principal-photo', { origin: 'left' });
  sr.reveal('.principal-text', { origin: 'right' });
  sr.reveal('.service-card', { origin: 'top', interval: 80 });
  sr.reveal('.faculty-card', { origin: 'bottom', interval: 80 });
  sr.reveal('.gallery-item', { origin: 'top', interval: 60 });
  sr.reveal('.testi-card', { origin: 'bottom', interval: 80 });
}

// ---------- Counter ----------
(function counterWhenVisible(){
  const counters = document.querySelectorAll('.counter');
  if(!counters.length) return;
  const runCounter = (el) => {
    const target = +el.getAttribute('data-target') || 0;
    const speed = 30, steps = 100, inc = Math.max(1, Math.ceil(target/steps));
    el.dataset.running = '1';
    (function tick(){
      const current = +el.innerText.replace(/\D/g,'') || 0;
      if(current < target){ el.innerText = String(Math.min(current+inc, target)); setTimeout(tick, speed); }
      else { el.innerText = target + '+'; delete el.dataset.running; }
    })();
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting && !entry.target.dataset.running){
        if(/\+$/.test(entry.target.textContent)) entry.target.textContent = '0';
        runCounter(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => io.observe(c));
})();

// ---------- Lightbox ----------
(() => {
  const thumbs   = Array.from(document.querySelectorAll('.gallery-item img'));
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lb-backdrop');
  const stage    = document.getElementById('lb-stage');
  const imgEl    = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');
  const loader   = document.getElementById('lb-loader');
  const counter  = document.getElementById('lb-count');

  if (!thumbs.length || !lightbox) return;

  let index = 0, open = false;
  const clamp = (i) => ((i % thumbs.length) + thumbs.length) % thumbs.length;

  function setCount(){ counter && (counter.textContent = `${index+1} / ${thumbs.length}`); }
  function showLoader(on){ loader?.classList.toggle('active', !!on); }
  function preloadAround(i){ [clamp(i+1), clamp(i-1)].forEach(k => { const t = new Image(); t.src = thumbs[k].src; }); }

  function load(i){
    index = clamp(i);
    const src = thumbs[index].src;
    setCount(); showLoader(true);
    imgEl.style.opacity = '0';
    const tmp = new Image();
    tmp.onload = () => {
      imgEl.src = src;
      imgEl.alt = thumbs[index].alt || 'Large View';
      imgEl.decode?.().finally(() => {
        showLoader(false);
        requestAnimationFrame(() => { imgEl.style.opacity = '1'; });
      });
      preloadAround(index);
    };
    tmp.onerror = () => { showLoader(false); imgEl.src = src; imgEl.style.opacity = '1'; };
    tmp.src = src;
  }
  function openAt(i){
    if (open) return; open = true;
    document.body.classList.add('menu-open'); lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    load(i);
    closeBtn?.focus();
  }
  function close(){
    if (!open) return; open = false;
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open'); imgEl.removeAttribute('src');
  }
  const next = () => load(index+1);
  const prev = () => load(index-1);

  thumbs.forEach((t,i) => {
    t.setAttribute('tabindex','0');
    t.addEventListener('click', () => openAt(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
    });
  });

  backdrop?.addEventListener('click', close);

  const stopAll = (e) => { e.stopPropagation(); };
  nextBtn?.addEventListener('pointerdown', stopAll);
  prevBtn?.addEventListener('pointerdown', stopAll);
  closeBtn?.addEventListener('pointerdown', stopAll);

  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  closeBtn?.addEventListener('click', (e) => { e.stopPropagation(); close(); });

  stage.addEventListener('click', (e) => {
    const n = e.target.closest('#lb-next');
    const p = e.target.closest('#lb-prev');
    if (n) { e.stopPropagation(); next(); }
    if (p) { e.stopPropagation(); prev(); }
  });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft')  prev();
  });

  let startX = 0, swiping = false;
  stage.addEventListener('pointerdown', (e) => {
    if (!open) return;
    if (e.target.closest('#lb-prev, #lb-next, #lightbox-close')) return;
    swiping = true;
    startX = e.clientX;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointerup', (e) => {
    if (!open || !swiping) return;
    const dx = e.clientX - startX;
    swiping = false;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
  });
})();

// ---------- Teachers Carousel ----------
(() => {
  const root = document.getElementById('teacherCarousel'); if(!root) return;
  const viewport = root.querySelector('.tc-viewport');
  const track    = root.querySelector('.tc-track');
  const slides   = Array.from(root.querySelectorAll('.tc-slide'));
  const prevBtn  = root.querySelector('.tc-prev');
  const nextBtn  = root.querySelector('.tc-next');
  const dotsWrap = root.querySelector('.tc-dots');

  let current = 0, slidesPerView = 4, slideW = 0, timer = null;
  const GAP = 16, AUTOPLAY = 4000;
  let starts = [];

  function maxIndex(){ return Math.max(0, slides.length - slidesPerView); }
  function buildStarts(){
    starts = [];
    const m = maxIndex();
    for (let i=0;i<=m;i+=slidesPerView) starts.push(i);
    if (starts[starts.length-1] !== m) starts.push(m);
  }
  function nearestStart(idx){
    let b=0, d=1e9; for (const s of starts){ const dd=Math.abs(s-idx); if(dd<d){ b=s; d=dd; } } return b;
  }
  function pageIndex(){
    const i=current;
    for(let p=0;p<starts.length;p++){ const s=starts[p], n=starts[p+1]??Infinity; if(i>=s && i<n) return p; }
    return Math.max(0, starts.length-1);
  }
  function buildDots(){
    dotsWrap.innerHTML=''; const pages = starts.length;
    for(let i=0;i<pages;i++){
      const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label',`Go to page ${i+1} of ${pages}`);
      if(i===pageIndex()) b.setAttribute('aria-current','true');
      b.addEventListener('click',()=>goToPage(i)); dotsWrap.appendChild(b);
    }
  }
  function updateDots(){
    const dots = dotsWrap.querySelectorAll('button'); const p=pageIndex();
    dots.forEach((d,i)=> i===p ? d.setAttribute('aria-current','true') : d.removeAttribute('aria-current'));
  }
  function clamp(i){ return Math.min(Math.max(i,0), maxIndex()); }
  function snap(i, anim=true){
    current = clamp(i);
    if(!anim) track.style.transition='none';
    const x = -(current * (slideW + GAP));
    track.style.transform = `translateX(${x}px)`;
    if(!anim){ track.offsetHeight; track.style.transition='transform .45s ease'; }
    updateDots();
  }
  function goToPage(p){
    const pages = starts.length; const safe = ((p%pages)+pages)%pages; snap(starts[safe]);
  }
  function next(){ goToPage(pageIndex()+1); }
  function prev(){ goToPage(pageIndex()-1); }

  function compute(){
    const vw = viewport.clientWidth;
    slidesPerView = vw>=1100?4: vw>=900?3: vw>=620?2: 1;
    slideW = (vw - (slidesPerView-1)*GAP)/slidesPerView;
    slides.forEach(s=> s.style.width = `${slideW}px`);
    buildStarts(); buildDots(); current = nearestStart(current); snap(current,false);
  }

  function play(){ stop(); timer=setInterval(next, AUTOPLAY); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }

  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  window.addEventListener('resize', compute, { passive:true });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (e)=>{ if(!root.contains(e.relatedTarget)) play(); });

  let startX=0, dragging=false, lastX=0;
  viewport.addEventListener('pointerdown', (e)=>{
    dragging=true; startX=e.clientX; lastX=0; track.style.transition='none'; viewport.setPointerCapture(e.pointerId); stop();
  });
  viewport.addEventListener('pointermove', (e)=>{
    if(!dragging) return; const dx=e.clientX-startX; lastX=dx;
    const x=-(current*(slideW+GAP))+dx; track.style.transform=`translateX(${x}px)`;
  });
  const end=()=>{ if(!dragging) return; dragging=false; track.style.transition='transform .45s ease';
    if(Math.abs(lastX)>slideW*0.25){ lastX<0?next():prev(); } else { snap(nearestStart(current)); } play();
  };
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
  viewport.addEventListener('pointerleave', end);

  root.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight' || e.key==='PageDown'){ e.preventDefault(); next(); }
    else if(e.key==='ArrowLeft' || e.key==='PageUp'){ e.preventDefault(); prev(); }
    else if(e.key==='Home'){ e.preventDefault(); goToPage(0); }
    else if(e.key==='End'){ e.preventDefault(); goToPage(starts.length-1); }
  });

  compute(); play();
})();

// ---------- Contact feedback ----------
document.querySelector('.contact-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const msg = document.getElementById('msg');
  msg.textContent = 'Thanks! Your message has been sent.';
  setTimeout(()=>{ msg.textContent=''; e.target.reset(); }, 2500);
});

// ---------- Admission dropdown toggle ----------
(() => {
  const dropdowns = Array.from(document.querySelectorAll('.dropdown'));
  if (!dropdowns.length) return;

  function closeAll(except){
    dropdowns.forEach(d => { if (d !== except) { d.classList.remove('open'); d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false'); } });
  }

  dropdowns.forEach(d => {
    const toggle = d.querySelector('.dropdown-toggle');
    const menu   = d.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !d.classList.contains('open');
      closeAll(d);
      d.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
    });

    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        d.classList.add('open');
        toggle.setAttribute('aria-expanded','true');
        menu.querySelector('.dropdown-item')?.focus();
      }
      if (e.key === 'Escape') {
        d.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.focus();
      }
    });

    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        d.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.focus();
      }
    });
  });

  document.addEventListener('click', () => closeAll());
  document.getElementById('nav-close')?.addEventListener('click', () => closeAll());
})();

// ---------- Gallery "Explore more" reveal (batch) ----------
(() => {
  const btn = document.getElementById('gallery-more-btn');
  if (!btn) return;

  const pools = [
    ...document.querySelectorAll('.gallery-more .gallery-item.is-hidden'),
    ...document.querySelectorAll('.gallery-grid .gallery-item.is-hidden')
  ];
  if (!pools.length) {
    btn.closest('.gallery-actions')?.remove();
    return;
  }

  const BATCH = 3;
  function revealBatch(){
    let shown = 0;
    for (const item of pools) {
      if (item.classList.contains('is-hidden')) {
        item.classList.remove('is-hidden');
        item.style.animation = 'fadeIn .35s ease';
        shown++;
        if (shown >= BATCH) break;
      }
    }
    const anyHidden = pools.some(i => i.classList.contains('is-hidden'));
    if (!anyHidden) {
      btn.setAttribute('aria-expanded','true');
      btn.innerHTML = '<i class="bx bx-check-circle" aria-hidden="true"></i> All photos loaded';
      btn.disabled = true;
      setTimeout(()=> btn.closest('.gallery-actions')?.remove(), 1300);
    } else {
      btn.setAttribute('aria-expanded','true');
    }
  }

  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn{from{opacity:.2; transform:translateY(6px)}to{opacity:1; transform:none}}';
  document.head.appendChild(style);

  btn.addEventListener('click', revealBatch);
})();

// ===== Consolidated Page JS (auto-generated) =====

// --- Begin: about.js ---
// FAQ toggle (accessible)
(() => {
  const qs = Array.from(document.querySelectorAll('.faq-q'));
  if (!qs.length) return;

  function closeAll(exceptBtn){
    qs.forEach(btn => {
      if (btn !== exceptBtn) {
        btn.setAttribute('aria-expanded','false');
        const pid = btn.getAttribute('aria-controls');
        const panel = document.getElementById(pid);
        panel?.classList.remove('open');
      }
    });
  }

  qs.forEach(btn => {
    if (btn.dataset.faqBound === '1') return; // double-bind guard
    btn.dataset.faqBound = '1';

    const pid = btn.getAttribute('aria-controls');
    const panel = document.getElementById(pid);

    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(willOpen ? btn : null);
      btn.setAttribute('aria-expanded', String(willOpen));
      panel?.classList.toggle('open', willOpen);
      if (willOpen) panel?.setAttribute('tabindex','-1'), panel?.focus?.();
    });

    btn.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); qs[(qs.indexOf(btn)+1)%qs.length]?.focus(); }
      if (k === 'ArrowUp')   { e.preventDefault(); qs[(qs.indexOf(btn)-1+qs.length)%qs.length]?.focus(); }
      if (k === 'Home')      { e.preventDefault(); qs[0]?.focus(); }
      if (k === 'End')       { e.preventDefault(); qs[qs.length-1]?.focus(); }
    });
  });
})();


// Light ScrollReveal for this page (if available)
if (window.ScrollReveal) {
  const sr = ScrollReveal({ distance: '24px', duration: 800, delay: 80, easing: 'ease', reset: false });
  sr.reveal('.kv', { origin: 'bottom', interval: 80 });
  sr.reveal('.stat-box', { origin: 'top', interval: 80 });
  sr.reveal('.timeline li', { origin: 'left', interval: 80 });
  sr.reveal('.people-card', { origin: 'bottom', interval: 80 });
  sr.reveal('.faq-q', { origin: 'top', interval: 60 });
}

// --- End: about.js ---

// --- Begin: apply.js ---
(() => {
  const form = document.getElementById('apply-form');
  const statusEl = document.getElementById('af-status');
  const submitBtn = document.getElementById('af-submit');
  const consent = document.getElementById('af-consent');
  const hp = document.getElementById('hp_token');

  // ★ Apps Script Web App URL বসাও
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbx57hn_QHI9wJs5Jt9g-2U8v6fSfIYEP2YYMjUdmmA-UPdOsdFmekCdqNiLxHTYVlQv-g/exec";

  // tiny spinner
  (()=>{ const s=document.createElement('style'); s.textContent='@keyframes spin{to{transform:rotate(360deg)}}'; document.head.appendChild(s); })();

  const setStatus = (t, err=false) => {
    if (!statusEl) return;
    statusEl.textContent = t || "";
    statusEl.classList.toggle('error', !!err);
  };
  const setLoading = (on) => {
    if (!submitBtn) return;
    submitBtn.disabled = !!on;
    submitBtn.innerHTML = on
      ? '<i class="bx bx-loader-alt" style="animation:spin .9s linear infinite;"></i> Submitting...'
      : '<i class="bx bx-paper-plane"></i> Submit Application';
  };
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus("");

    if (hp && hp.value.trim() !== "") return; // spam bot

    const data = new FormData(form);
    const required = ['Program','Intake','Name','DOB','Mobile','Email','Address'];
    for (const key of required) {
      if (!(data.get(key) || '').toString().trim()) { setStatus("Please complete required fields.", true); return; }
    }
    if (!validEmail(data.get('Email'))) { setStatus("Enter a valid email address.", true); return; }
    if (consent && !consent.checked) { setStatus("Please accept the declaration to proceed.", true); return; }

    setLoading(true); setStatus("Submitting…");

    try {
      data.append('FormType','ApplyNow');
      data.append('Source', location.href);

      const body = new URLSearchParams(data);

      await fetch(ENDPOINT, { method: 'POST', body }); // simple POST → CORS OK with Apps Script

      setStatus("Thanks! Your application has been submitted.");
      form.reset();
      setTimeout(()=> setStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setStatus("Sorry, something went wrong. Please try again.", true);
    } finally {
      setLoading(false);
    }
  });
})();

// --- End: apply.js ---

// --- Begin: appointment.js ---
// /asset/js/appointment.js
(() => {
  // === SET THIS: তোমার Apps Script Web App URL বসাও ===
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzdzixxvXgCsGoBu6RU3T9nVsW7OZRjzwa-k9hj_0U0iGh2eBTMxgFMx0ZSl3dD37WH/exec";

  const form   = document.getElementById('appointment-form');
  const status = document.getElementById('appt-status');
  const dateEl = document.getElementById('date');

  // Min date = today
  if (dateEl) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth()+1).padStart(2,'0');
    const d = String(today.getDate()).padStart(2,'0');
    dateEl.min = `${y}-${m}-${d}`;
  }

  function setStatus(msg, ok = true){
    status.textContent = msg;
    status.style.color = ok ? 'var(--brand)' : '#ffb3b3';
  }

  function serializeForm(fd){
    // Convert FormData to URLSearchParams (x-www-form-urlencoded)
    const params = new URLSearchParams();
    for (const [k,v] of fd.entries()) params.append(k, v);
    return params;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot check
    if (form.website && form.website.value.trim() !== '') {
      setStatus('Spam detected.', false);
      return;
    }

    // basic validation
    if (!form.name.value.trim() || !form.email.value.trim() || !form.department.value || !form.date.value) {
      setStatus('Please fill all required fields (*).', false);
      return;
    }

    setStatus('Sending…');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    const fd = new FormData(form);

    try {
      // Send as x-www-form-urlencoded to avoid preflight & keep CORS simple
      const body = serializeForm(fd);
      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      });

      // Try to parse JSON; if CORS blocks readable body, still show success fallback
      let ok = false;
      try {
        const json = await res.json();
        ok = !!(json && json.ok);
      } catch (_) {
        // fallback: assume success if 200-299
        ok = res.ok;
      }

      if (ok) {
        setStatus('✅ Appointment request sent successfully!');
        form.reset();
      } else {
        setStatus('❌ Failed to send. Please try again.', false);
      }
    } catch (err) {
      console.error(err);
      setStatus('⚠️ Network error. Please try again.', false);
    } finally {
      btn.disabled = false;
    }
  });
})();

// --- End: appointment.js ---

// --- Begin: contact.js ---
// /asset/js/contact.js
(() => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('cf-status');
  const hp = document.getElementById('hp_token');

  // ★ Replace with your deployed Apps Script Web App URL
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbzO4jNaBOm3zO5e83dbOObqpho2OXlNsbmSo6GvPsrfiPBmG_2x4-m8tTyH3U7kwqs4kA/exec";

  function setStatus(text, isError=false){
    if(!statusEl) return;
    statusEl.textContent = text || "";
    statusEl.classList.toggle('error', !!isError);
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus("");

    // Honeypot check
    if (hp && hp.value.trim() !== "") { return; }

    const data = new URLSearchParams(new FormData(form));
    // Optional: add page source
    data.append('Source', location.href);

    setStatus("Sending…");

    try {
      // Simple POST (no custom headers) keeps it CORS-simple for Apps Script
      await fetch(ENDPOINT, { method: 'POST', body: data });

      setStatus("Thanks! Your message has been sent.");
      form.reset();
      // Optional UX
      setTimeout(() => setStatus(""), 3500);
    } catch (err) {
      console.error(err);
      setStatus("Sorry, something went wrong. Please try again.", true);
    }
  });
})();

// --- End: contact.js ---

// --- Begin: course.js ---
// Semester tabs (accessible)
(() => {
  const tabs = Array.from(document.querySelectorAll('.sem-tab'));
  const panels = Array.from(document.querySelectorAll('.sem-panel'));

  function openTab(i){
    tabs.forEach((t,idx)=>{
      const sel = idx===i;
      t.setAttribute('aria-selected', String(sel));
      panels[idx]?.classList.toggle('open', sel);
      if(sel) panels[idx]?.setAttribute('tabindex','-1');
    });
    panels[i]?.focus?.();
  }

  tabs.forEach((t, i)=>{
    if (t?.dataset?.tabBound === '1') { return; }
    t.dataset.tabBound = '1';

    t.addEventListener('click', ()=> openTab(i));
    t.addEventListener('keydown', (e)=>{
      const k = e.key;
      if (k==='ArrowRight' || k==='ArrowDown'){ e.preventDefault(); openTab((i+1)%tabs.length); tabs[(i+1)%tabs.length].focus(); }
      if (k==='ArrowLeft'  || k==='ArrowUp'){   e.preventDefault(); openTab((i-1+tabs.length)%tabs.length); tabs[(i-1+tabs.length)%tabs.length].focus(); }
      if (k==='Home'){ e.preventDefault(); openTab(0); tabs[0].focus(); }
      if (k==='End'){  e.preventDefault(); openTab(tabs.length-1); tabs[tabs.length-1].focus(); }
    });
  });
})();

// FAQ toggle
(() => {
  const qs = Array.from(document.querySelectorAll('.faq-q'));
  const as = Array.from(document.querySelectorAll('.faq-a'));

  function closeAll(except){
    qs.forEach((b, i)=>{
      if (b!==except){
        b.setAttribute('aria-expanded','false');
        as[i]?.classList.remove('open');
      }
    });
  }

  qs.forEach((btn, i)=>{
    const ans = as[i];
    btn.addEventListener('click', ()=>{
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(willOpen ? btn : null);
      btn.setAttribute('aria-expanded', String(willOpen));
      ans?.classList.toggle('open', willOpen);
    });
  });
})();

// Light scroll animations if ScrollReveal present
if (window.ScrollReveal) {
  const sr = ScrollReveal({ distance: '24px', duration: 800, delay: 80, easing: 'ease', reset: false });
  sr.reveal('.el-grid .el-copy', { origin: 'left' });
  sr.reveal('.el-grid .el-photo', { origin: 'right' });
  sr.reveal('.pill', { origin: 'bottom', interval: 60 });
  sr.reveal('.sem-tabs', { origin: 'top' });
  sr.reveal('.sem-panel.open .table-wrap', { origin: 'bottom' });
  sr.reveal('.lab-card', { origin: 'bottom', interval: 80 });
  sr.reveal('.career-box', { origin: 'bottom', interval: 80 });
  sr.reveal('.faq-q', { origin: 'top', interval: 60 });
}

// --- End: course.js ---

// --- Begin: gallery.js ---
// --- Filters ---
(() => {
  const filters = Array.from(document.querySelectorAll('.gp-filter'));
  const items = Array.from(document.querySelectorAll('.gp-item'));
  if (!filters.length || !items.length) return;

  function setActive(btn){
    filters.forEach(b => b.classList.toggle('is-active', b === btn));
  }
  function apply(filter){
    items.forEach(it => {
      const ok = (filter === 'all') || it.dataset.cat === filter;
      it.style.display = ok ? '' : 'none';
    });
  }
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      apply(btn.dataset.filter);
    });
  });
})();

// --- Lightbox (reused pattern) ---
(() => {
  const thumbs   = Array.from(document.querySelectorAll('.gp-item img'));
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lb-backdrop');
  const stage    = document.getElementById('lb-stage');
  const imgEl    = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lb-prev');
  const nextBtn  = document.getElementById('lb-next');
  const loader   = document.getElementById('lb-loader');
  const counter  = document.getElementById('lb-count');

  if (!thumbs.length || !lightbox) return;

  let index = 0, open = false;
  const clamp = (i) => ((i % thumbs.length) + thumbs.length) % thumbs.length;

  function setCount(){ counter && (counter.textContent = `${index+1} / ${thumbs.length}`); }
  function showLoader(on){ loader?.classList.toggle('active', !!on); }
  function preloadAround(i){ [clamp(i+1), clamp(i-1)].forEach(k => { const t = new Image(); t.src = thumbs[k].src; }); }

  function load(i){
    index = clamp(i);
    const src = thumbs[index].src;
    setCount(); showLoader(true);
    imgEl.style.opacity = '0';
    const tmp = new Image();
    tmp.onload = () => {
      imgEl.src = src;
      imgEl.alt = thumbs[index].alt || 'Large View';
      imgEl.decode?.().finally(() => {
        showLoader(false);
        requestAnimationFrame(() => { imgEl.style.opacity = '1'; });
      });
      preloadAround(index);
    };
    tmp.onerror = () => { showLoader(false); imgEl.src = src; imgEl.style.opacity = '1'; };
    tmp.src = src;
  }
  function openAt(i){
    if (open) return; open = true;
    document.body.classList.add('menu-open'); lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    load(i);
    closeBtn?.focus();
  }
  function close(){
    if (!open) return; open = false;
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('menu-open'); imgEl.removeAttribute('src');
  }
  const next = () => load(index+1);
  const prev = () => load(index-1);

  thumbs.forEach((t,i) => {
    t.setAttribute('tabindex','0');
    t.addEventListener('click', () => openAt(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
    });
  });

  backdrop?.addEventListener('click', close);
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  closeBtn?.addEventListener('click', (e) => { e.stopPropagation(); close(); });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft')  prev();
  });

  // simple swipe
  let startX = 0, swiping = false;
  stage.addEventListener('pointerdown', (e) => {
    if (!open) return;
    if (e.target.closest('#lb-prev, #lb-next, #lightbox-close')) return;
    swiping = true; startX = e.clientX; stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointerup', (e) => {
    if (!open || !swiping) return;
    const dx = e.clientX - startX; swiping = false;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
  });
})();

// --- End: gallery.js ---

// --- Begin: principal.js ---
// Light scroll animations if ScrollReveal is present
if (window.ScrollReveal) {
  const sr = ScrollReveal({ distance: '24px', duration: 800, delay: 80, easing: 'ease', reset: false });
  sr.reveal('.pm-photo', { origin: 'left' });
  sr.reveal('.pm-card', { origin: 'left', delay: 140 });
  sr.reveal('.pm-content p, .pm-quote', { origin: 'right', interval: 80 });
  sr.reveal('.hl', { origin: 'bottom', interval: 80 });
}

// --- End: principal.js ---

/* ===== FAQ FIX (Universal, Conflict-safe) ===== */
document.addEventListener('DOMContentLoaded', () => {
  // সব FAQ question বাটন বের করি
  const faqButtons = document.querySelectorAll('.faq-q');

  faqButtons.forEach((btn) => {
    const answerId = btn.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);

    // যদি ID না পাওয়া যায়, তাহলে fallback নিই
    if (!answer) {
      const next = btn.nextElementSibling;
      if (next && next.classList.contains('faq-a')) next.id = `auto-${Math.random().toString(36).slice(2, 7)}`;
    }

    // ক্লিক ইভেন্ট
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      
      // অন্যগুলো বন্ধ করে দিই
      faqButtons.forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        const aId = b.getAttribute('aria-controls');
        const a = document.getElementById(aId);
        if (a) a.classList.remove('open');
      });

      // যেটায় ক্লিক করা হয়েছে সেটি খুলে দিই
      btn.setAttribute('aria-expanded', String(!isOpen));
      const answerId2 = btn.getAttribute('aria-controls');
      const ans = document.getElementById(answerId2);
      if (ans) ans.classList.toggle('open', !isOpen);
    });
  });
});
