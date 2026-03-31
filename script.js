/* ============================================================
   EBS TECH — Script v3
   Dark Editorial · Blueprint · 2025
============================================================ */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;

  // ── Custom Cursor ─────────────────────────────────────────
  if (canHover && !reduced) {
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');

    if (cursor && cursorRing) {
      let mx = -100, my = -100;
      let rx = -100, ry = -100;

      document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
      });

      // Ring lags behind cursor
      function animRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        requestAnimationFrame(animRing);
      }
      animRing();

      // Hover states
      const hoverEls = document.querySelectorAll('a, button, [tabindex="0"], .bp-layer, .bento-card');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('is-hovering');
          cursorRing.classList.add('is-hovering');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('is-hovering');
          cursorRing.classList.remove('is-hovering');
        });
      });
    }
  } else {
    // Hide cursor elements if no hover support
    const c = document.getElementById('cursor');
    const r = document.getElementById('cursorRing');
    if (c) c.style.display = 'none';
    if (r) r.style.display = 'none';
  }

  // ── Navbar ────────────────────────────────────────────────
  const nav = document.getElementById('nav');
  const handleScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile nav
  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger?.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Smooth scroll ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Intersection Observer (reveal) ───────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-card').forEach(el => revealObs.observe(el));

  // ── Counter Animation ─────────────────────────────────────
  function countUp(el) {
    if (reduced) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); return; }
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const start  = performance.now();

    const tick = now => {
      const p  = Math.min((now - start) / dur, 1);
      const e  = 1 - Math.pow(1 - p, 4);
      const v  = target * e;
      el.textContent = (String(target).includes('.') ? v.toFixed(1) : Math.round(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      counterObs.unobserve(e.target);
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

  // ── Blueprint Stack Diagram ───────────────────────────────
  const diagram   = document.getElementById('bpDiagram');
  const detail    = document.getElementById('bpDetail');
  const layers    = document.querySelectorAll('.bp-layer');

  const layerData = [
    {
      index: 'L6 / TOPO',
      name: 'Resultados & Escala',
      desc: 'O output de todo o sistema. Revenue crescente, KPIs claros e crescimento contínuo que se autofinancia. É aqui que o investimento vira retorno mensurável.'
    },
    {
      index: 'L5 / MARTECH',
      name: 'Martech & CRM',
      desc: 'A camada de captura e relacionamento. Funis inteligentes, automação de marketing e gestão de leads que alimenta o pipeline de vendas com qualidade.'
    },
    {
      index: 'L4 / INTELIGÊNCIA',
      name: 'Agentes de IA',
      desc: 'O cérebro do sistema. Agentes que qualificam leads, tomam decisões e atendem clientes 24/7 com qualidade humana — sem custo marginal por interação.'
    },
    {
      index: 'L3 / AUTOMAÇÃO',
      name: 'Automação Inteligente',
      desc: 'Os nervos da operação. Workflows que conectam sistemas, eliminam tarefas manuais e garantem que nada caia entre as rachaduras do processo.'
    },
    {
      index: 'L2 / SOFTWARE',
      name: 'Software Sob Medida',
      desc: 'A interface da empresa com a realidade. Plataformas, dashboards e sistemas construídos para o jeito único que seu negócio opera — sem compromissos genéricos.'
    },
    {
      index: 'L1 / BASE',
      name: 'Infraestrutura & Dados',
      desc: 'A fundação de tudo. APIs robustas, banco de dados bem modelado, integrações confiáveis. Um stack fraco aqui torna tudo acima frágil e caro de manter.'
    }
  ];

  // Animate layers in on scroll
  if (diagram) {
    const diagObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      layers.forEach((layer, i) => {
        setTimeout(() => {
          layer.classList.add('revealed');
        }, i * 100);
      });
      diagObs.unobserve(diagram);
    }, { threshold: 0.25 });

    diagObs.observe(diagram);
  }

  // Layer hover/focus → detail panel
  layers.forEach((layer, i) => {
    const idx = parseInt(layer.dataset.layer);
    const data = layerData[idx];

    const showDetail = () => {
      layers.forEach(l => l.classList.remove('active'));
      layer.classList.add('active');
      if (detail && data) {
        detail.classList.add('has-layer');
        detail.querySelector('.bpd-index').textContent = data.index;
        detail.querySelector('.bpd-name').textContent  = data.name;
        detail.querySelector('.bpd-desc').textContent  = data.desc;
      }
    };

    const hideDetail = () => {
      layer.classList.remove('active');
      if (detail) {
        detail.classList.remove('has-layer');
        detail.querySelector('.bpd-index').textContent = 'SELECIONE UMA CAMADA';
        detail.querySelector('.bpd-name').textContent  = 'Passe o mouse sobre as camadas';
        detail.querySelector('.bpd-desc').textContent  = 'Cada camada do stack representa um componente crítico do seu sistema de crescimento.';
      }
    };

    layer.addEventListener('mouseenter', showDetail);
    layer.addEventListener('mouseleave', hideDetail);
    layer.addEventListener('focus',      showDetail);
    layer.addEventListener('blur',       hideDetail);
  });

  // ── Terminal typewriter ───────────────────────────────────
  if (!reduced) {
    const tLines = document.querySelectorAll('#terminalBody .t-line');
    tLines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(4px)';
      line.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 800 + i * 110);
    });
  }

  // ── Active nav link ───────────────────────────────────────
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const mid = window.scrollY + window.innerHeight / 2;
    let activeId = '';
    sections.forEach(s => { if (mid >= s.offsetTop) activeId = s.id; });
    navAnchors.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '');
      a.style.color = href === activeId ? 'var(--fg)' : '';
    });
  }, { passive: true });

  // ── Bento card 3D tilt (desktop only) ────────────────────
  if (canHover && !reduced) {
    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r   = card.getBoundingClientRect();
        const rx  = ((e.clientY - r.top)  / r.height - 0.5) * -6;
        const ry  = ((e.clientX - r.left) / r.width  - 0.5) *  6;
        card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ── Case row hover pad fix ────────────────────────────────
  // Already handled in CSS via padding transition

  // ── Console branding ──────────────────────────────────────
  const s = 'background: linear-gradient(135deg,#C2A878,#8B5CF6); color:#fff; font-size:16px; font-weight:900; padding:8px 18px; border-radius:4px;';
  console.log('%c EBS Tech ', s);
  console.log('%c IA · Automação · Software | ebstech.com.br', 'color:#C2A878; font-size:12px; font-family:monospace;');
  console.log('%c wa.me/5565984193431', 'color:#FF5500; font-size:11px; font-family:monospace;');

})();
