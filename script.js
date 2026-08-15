/* =========================================================
   FAISAL SHAH — PORTFOLIO JS (Vanilla JavaScript)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADING SCREEN ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 500);
  });
  // Fallback if 'load' has already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2200);

  /* ---------- 2. NAVBAR: STICKY + MOBILE MENU + ACTIVE LINK ---------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll(){
    // Sticky navbar background
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Active section highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
    // Scroll to top button
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  if (hamburger && navMenu){
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // Close mobile menu on link click + smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(target);
        if (el){
          window.scrollTo({
            top: el.offsetTop - 70,
            behavior: 'smooth'
          });
        }
      }
      hamburger && hamburger.classList.remove('active');
      navMenu && navMenu.classList.remove('open');
    });
  });

  // Also smooth-scroll for any other in-page anchor
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.classList.contains('nav-link')) return;
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('href');
      if (target && target.length > 1 && target.startsWith('#')){
        const el = document.querySelector(target);
        if (el){
          e.preventDefault();
          window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- 3. TYPING ANIMATION ---------- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'Shopify Developer',
    'React.js Developer',
    'Blog Posting Specialist',
    'SEO Specialist'
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function typeLoop(){
    if (!typedEl) return;
    const current = phrases[pIdx];
    if (!deleting){
      typedEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length){
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0){
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  if (typedEl) typeLoop();

  /* ---------- 4. SCROLL REVEAL (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting){
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 5. SKILL BAR ANIMATION ---------- */
  const skillItems = document.querySelectorAll('.skill-item');
  if ('IntersectionObserver' in window){
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const item = entry.target;
          const percent = parseInt(item.dataset.percent, 10) || 0;
          const fill = item.querySelector('.skill-fill');
          const label = item.querySelector('.skill-percent');
          if (fill) fill.style.width = percent + '%';
          animateNumber(label, percent, 1300, v => v + '%');
          skillObserver.unobserve(item);
        }
      });
    }, { threshold: 0.3 });
    skillItems.forEach(el => skillObserver.observe(el));
  }

  /* ---------- 6. COUNTER ANIMATION (Hero floating stats) ---------- */
  function animateNumber(el, target, duration, formatter){
    if (!el) return;
    const start = performance.now();
    function step(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = formatter ? formatter(val) : val;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = formatter ? formatter(target) : target;
    }
    requestAnimationFrame(step);
  }

  /* ---------- 7. SCROLL TO TOP ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn){
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 8. THEME TOGGLE (Dark / Light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('fs-theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggle){
      const icon = themeToggle.querySelector('i');
      if (icon){
        icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    }
  }

  if (themeToggle){
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('fs-theme', next);
    });
  }

  /* ---------- 9. HIDE EMPTY-URL LINKS ---------- */
  // Any element with data-role="live" or "github" and empty href is hidden
  document.querySelectorAll('[data-role]').forEach(el => {
    const href = el.getAttribute('href');
    if (href === '' || href === '#' || href == null){
      // For social buttons — only hide when URL truly empty
      el.style.display = 'none';
    }
  });

  /* ---------- 10. CONTACT FORM VALIDATION ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setError(field, msg){
    const input = form.querySelector('[name="' + field + '"]');
    const err = form.querySelector('.form-error[data-for="' + field + '"]');
    if (input) input.classList.add('error');
    if (err) err.textContent = msg;
  }

  function clearError(field){
    const input = form.querySelector('[name="' + field + '"]');
    const err = form.querySelector('.form-error[data-for="' + field + '"]');
    if (input) input.classList.remove('error');
    if (err) err.textContent = '';
  }

  function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form){
    // Real-time clearing of errors on input
    form.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => clearError(el.name));
      el.addEventListener('change', () => clearError(el.name));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        service: form.service.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
      };

      let valid = true;

      if (!data.name){ setError('name', 'Please enter your name.'); valid = false; }
      else if (data.name.length < 2){ setError('name', 'Name is too short.'); valid = false; }

      if (!data.email){ setError('email', 'Please enter your email.'); valid = false; }
      else if (!isValidEmail(data.email)){ setError('email', 'Please enter a valid email.'); valid = false; }

      if (!data.service){ setError('service', 'Please select a service.'); valid = false; }

      if (!data.subject){ setError('subject', 'Please enter a subject.'); valid = false; }
      else if (data.subject.length < 3){ setError('subject', 'Subject is too short.'); valid = false; }

      if (!data.message){ setError('message', 'Please enter your message.'); valid = false; }
      else if (data.message.length < 10){ setError('message', 'Message must be at least 10 characters.'); valid = false; }

      if (!valid) return;

      // Simulated submission (replace with real endpoint later)
      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const original = btnText.textContent;

      btnText.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        btnText.textContent = original;
        submitBtn.disabled = false;
        if (formSuccess) formSuccess.classList.add('show');
        setTimeout(() => formSuccess && formSuccess.classList.remove('show'), 5000);
      }, 900);
    });
  }

  // Initial scroll check
  onScroll();

});
