/* ============================================================
   EBS TECH — Main Script
   Premium Dark Futuristic · Software · IA · Martech
============================================================ */

(() => {
  'use strict';

  // ── Navbar: scroll effect ─────────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ── Mobile nav toggle ──────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link inside it is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Smooth scroll for hash links ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Scroll Reveal ─────────────────────────────────────────
  const revealElements = document.querySelectorAll(
    '.solution-card, .impact-step, .product-feature, .case-card, .process-step, .authority-card, .stack-badge, .hero-stat, .section-header, .press-card, .press-outlet-badge'
  );

  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid items
    const delay = (i % 4) * 80;
    el.style.transitionDelay = `${delay}ms`;
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Active nav link on scroll ──────────────────────────────
  const sections  = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;
    let activeId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      if (scrollMid >= top) {
        activeId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.style.color = href === activeId ? 'var(--text-primary)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── Float cards subtle parallax ────────────────────────────
  const floatCards = document.querySelectorAll('.float-card');

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy; // -1 to 1

      floatCards.forEach((card, i) => {
        const depth = (i % 2 === 0) ? 6 : 10;
        const tx = dx * depth;
        const ty = dy * depth;
        card.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
  }

  // ── Animated counter for stats ─────────────────────────────
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start    = performance.now();
    const isFloat  = target.toString().includes('.');
    const numTarget = parseFloat(target);

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current  = numTarget * ease;
      el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.dataset.count;
        if (!raw) return;
        const suffix = el.dataset.suffix || '';
        animateCounter(el, raw, suffix);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.7 }
  );

  document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));

  // ── Card tilt effect on hover (desktop only) ───────────────
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.solution-card, .case-card, .process-step, .authority-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -4;
        const rotY = ((x - cx) / cx) * 4;
        card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── Mock "typing" animation for pipeline cards ─────────────
  const pipelineCards = document.querySelectorAll('.pipeline-card');
  let   cardIndex = 0;

  function cycleCardHighlight() {
    pipelineCards.forEach(c => c.style.opacity = '0.85');
    if (pipelineCards[cardIndex]) {
      pipelineCards[cardIndex].style.opacity = '1';
      pipelineCards[cardIndex].style.transform = 'scale(1.03)';
      setTimeout(() => {
        if (pipelineCards[cardIndex]) pipelineCards[cardIndex].style.transform = '';
      }, 600);
    }
    cardIndex = (cardIndex + 1) % pipelineCards.length;
  }

  setInterval(cycleCardHighlight, 2200);

  // ── Status dot blinking ────────────────────────────────────
  // Already handled via CSS animation

  // ── Console easter egg ─────────────────────────────────────
  console.log(
    '%c EBS Tech ',
    'background: linear-gradient(135deg,#7C3AED,#22D3EE); color:#fff; font-size:20px; font-weight:900; padding:8px 18px; border-radius:8px;'
  );
  console.log(
    '%c Software · IA · Martech | Sistemas inteligentes para empresas que querem escalar.',
    'color: #A855F7; font-size: 13px;'
  );
  console.log('%c https://wa.me/5565984193431', 'color:#22D3EE; font-size:12px;');

})();
