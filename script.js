/* ============================================================
   TANMAY JAIN — TOP 1% PORTFOLIO SCRIPT
   Architecture: Modular, RAF-based, GPU-accelerated
   ============================================================ */

'use strict';

/* ── GLOBAL STATE ──────────────────────────────────────── */
const State = {
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 },
  cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, ring: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
  scroll: { y: 0, velocity: 0, last: 0 },
  lenis: null,
  raf: null,
  loaded: false,
  sections: [],
};

/* ── UTILS ──────────────────────────────────────────────── */
const lerp = (a, b, n) => a + (b - a) * n;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const map = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ── LENIS SMOOTH SCROLL (native + performant) ─────────── */
class SmoothScroll {
  constructor() {
    this.target = 0;
    this.current = 0;
    this.ease = 0.085;
    this.rafId = null;
    this.listeners = [];
    this._init();
  }

  _init() {
    // Use CSS scroll-behavior: smooth as fallback, but override with JS for premium feel
    document.documentElement.style.scrollBehavior = 'auto';
    window.addEventListener('wheel', (e) => {
      // Allow native scroll, just track for velocity
      State.scroll.velocity = e.deltaY;
    }, { passive: true });
  }

  onScroll(fn) { this.listeners.push(fn); }

  tick() {
    const sy = window.scrollY;
    State.scroll.velocity = lerp(State.scroll.velocity, sy - State.scroll.last, 0.1);
    State.scroll.last = sy;
    State.scroll.y = sy;
    this.listeners.forEach(fn => fn(sy));
  }
}

/* ── LOADER SYSTEM ──────────────────────────────────────── */
class Loader {
  constructor() {
    this.el = qs('#loader');
    this.bar = qs('#loaderBar');
    this.pct = qs('#loaderPct');
    this.progress = 0;
  }

  run() {
    return new Promise(resolve => {
      const tick = () => {
        // Accelerate toward 100
        const target = this.progress < 70 ? this.progress + 2.2 :
                       this.progress < 90 ? this.progress + 1.1 :
                       this.progress < 98 ? this.progress + 0.4 : 100;

        this.progress = Math.min(target, 100);
        this.bar.style.width = this.progress + '%';
        this.pct.textContent = Math.floor(this.progress) + '%';

        if (this.progress < 100) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(() => {
            this.hide().then(resolve);
          }, 300);
        }
      };
      // Wait for fonts + a minimum show time
      Promise.all([
        document.fonts.ready,
        new Promise(r => setTimeout(r, 900))
      ]).then(() => { this.progress = this.progress || 0; requestAnimationFrame(tick); });
    });
  }

  hide() {
    return new Promise(resolve => {
      this.el.classList.add('hidden');
      setTimeout(resolve, 850);
    });
  }
}

/* ── CURSOR SYSTEM ──────────────────────────────────────── */
class Cursor {
  constructor() {
    this.dot = qs('#cursorDot');
    this.ring = qs('#cursorRing');
    this.label = qs('#cursorLabel');
    this.x = State.mouse.x;
    this.y = State.mouse.y;
    this.rx = State.mouse.x;
    this.ry = State.mouse.y;
    this.visible = false;
    this._bind();
  }

  _bind() {
    document.addEventListener('mousemove', (e) => {
      State.mouse.vx = e.clientX - State.mouse.x;
      State.mouse.vy = e.clientY - State.mouse.y;
      State.mouse.x = e.clientX;
      State.mouse.y = e.clientY;
      if (!this.visible) { this.dot.style.opacity = '1'; this.ring.style.opacity = '1'; this.visible = true; }
    });

    document.addEventListener('mouseleave', () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
      this.visible = false;
    });

    // Hover states
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button, .project-row, .cert-card, .skill-panel, .tech-chip, .nav-hire, .btn-main, .btn-outline, .btn-send, .social-btn, .c-link');
      if (el) {
        const label = el.dataset.cursor || '';
        this.label.textContent = label;
        document.body.classList.add('cursor-link');
        document.body.classList.remove('cursor-text');
      } else if (e.target.closest('p, h1, h2, h3')) {
        document.body.classList.add('cursor-text');
        document.body.classList.remove('cursor-link');
      } else {
        document.body.classList.remove('cursor-link', 'cursor-text');
      }
    });
  }

  tick() {
    this.x = lerp(this.x, State.mouse.x, 0.95);
    this.y = lerp(this.y, State.mouse.y, 0.95);
    this.rx = lerp(this.rx, State.mouse.x, 0.1);
    this.ry = lerp(this.ry, State.mouse.y, 0.1);

    this.dot.style.transform = `translate(${this.x}px, ${this.y}px) translate(-50%, -50%)`;
    this.ring.style.transform = `translate(${this.rx}px, ${this.ry}px) translate(-50%, -50%)`;
    this.label.style.transform = `translate(${this.rx + 28}px, ${this.ry - 12}px)`;

    // Squish ring on velocity
    const speed = Math.sqrt(State.mouse.vx ** 2 + State.mouse.vy ** 2);
    const squish = clamp(1 - speed * 0.01, 0.7, 1);
    const angle = Math.atan2(State.mouse.vy, State.mouse.vx) * (180 / Math.PI);
    this.ring.style.transform += ` rotate(${angle}deg) scaleY(${squish})`;
  }
}

/* ── SPOTLIGHT ──────────────────────────────────────────── */
class Spotlight {
  constructor() {
    this.el = qs('#spotlight');
  }
  tick() {
    this.el.style.setProperty('--mx', State.mouse.x + 'px');
    this.el.style.setProperty('--my', State.mouse.y + 'px');
    if (State.mouse.x !== window.innerWidth / 2 || State.mouse.y !== window.innerHeight / 2) {
      document.body.classList.add('cursor-moved');
    }
  }
}

/* ── HERO CANVAS (Neural Particle Web) ──────────────────── */
class HeroCanvas {
  constructor() {
    this.canvas = qs('#heroCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.NODE_COUNT = 70;
    this.mouse = { x: -9999, y: -9999 };
    this._resize();
    this._initNodes();
    window.addEventListener('resize', () => this._resize(), { passive: true });
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });
  }

  _resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  _initNodes() {
    this.nodes = Array.from({ length: this.NODE_COUNT }, () => ({
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  tick() {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    // Move nodes
    this.nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > this.W) n.vx *= -1;
      if (n.y < 0 || n.y > this.H) n.vy *= -1;

      // Mouse repulsion
      const dx = n.x - this.mouse.x;
      const dy = n.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        n.x += (dx / dist) * 0.8;
        n.y += (dy / dist) * 0.8;
      }
    });

    // Draw connections
    const CONNECT_DIST = 130;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(200,169,110,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    this.nodes.forEach(n => {
      // Check proximity to mouse for glow effect
      const dx = n.x - this.mouse.x;
      const dy = n.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = dist < 180 ? map(dist, 0, 180, 1, 0) : 0;
      const opacity = n.opacity + glow * 0.5;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,169,110,${opacity})`;
      ctx.fill();
    });
  }
}

/* ── PARALLAX ───────────────────────────────────────────── */
class Parallax {
  constructor() {
    this.layers = qsa('[data-depth]');
    this.hero = qs('.hero');
  }

  tick() {
    if (!this.hero) return;
    const rect = this.hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const cx = (State.mouse.x / window.innerWidth - 0.5) * 2;
    const cy = (State.mouse.y / window.innerHeight - 0.5) * 2;

    this.layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0;
      const moveX = cx * depth * 40;
      const moveY = cy * depth * 40;
      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  }
}

/* ── 3D TILT ON HERO TITLE ──────────────────────────────── */
class HeroTilt {
  constructor() {
    this.title = qs('.hero-title');
    this.rx = 0; this.ry = 0;
  }

  tick() {
    if (!this.title) return;
    const rect = this.title.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const cx = ((State.mouse.x - (rect.left + rect.width / 2)) / rect.width) * 2;
    const cy = ((State.mouse.y - (rect.top + rect.height / 2)) / rect.height) * 2;

    this.rx = lerp(this.rx, cy * -4, 0.06);
    this.ry = lerp(this.ry, cx * 5, 0.06);

    this.title.style.transform = `perspective(1000px) rotateX(${this.rx}deg) rotateY(${this.ry}deg)`;
  }
}

/* ── MAGNETIC BUTTONS ───────────────────────────────────── */
class Magnetic {
  constructor() {
    this._bind();
  }

  _bind() {
    qsa('.magnetic').forEach(el => {
      let bx = 0, by = 0;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        bx = lerp(bx, dx * 9, 0.3);
        by = lerp(by, dy * 9, 0.3);
        el.style.transform = `translate(${bx}px, ${by}px)`;
      });

      el.addEventListener('mouseleave', () => {
        const release = () => {
          bx = lerp(bx, 0, 0.18);
          by = lerp(by, 0, 0.18);
          el.style.transform = `translate(${bx}px, ${by}px)`;
          if (Math.abs(bx) > 0.1 || Math.abs(by) > 0.1) requestAnimationFrame(release);
          else el.style.transform = '';
        };
        requestAnimationFrame(release);
      });
    });
  }
}

/* ── SCROLL REVEAL ──────────────────────────────────────── */
class ScrollReveal {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('revealed');
          if (el.classList.contains('reveal-split')) this._revealSplit(el);
        }, delay * 1000);
        this.observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    qsa('.reveal-up, .reveal-cinematic, .reveal-split').forEach(el => {
      this.observer.observe(el);
    });

    // Hero lines
    this._initHeroLines();
    this._initSkillBars();
  }

  _initHeroLines() {
    qsa('.line-reveal').forEach((el, i) => {
      const delay = parseFloat(el.dataset.delay || i * 0.1);
      setTimeout(() => el.classList.add('line-visible'), (delay * 1000) + 200);
    });
  }

  _revealSplit(el) {
    // Already split if .word-wrap exists
    if (el.querySelector('.word-wrap')) return;
    const text = el.innerHTML;
    // Split by words preserving HTML tags (em, br)
    const wrapped = text.replace(/([\w'',\.!?]+)/g, '<span class="word-wrap"><span class="word-inner">$1</span></span>');
    el.innerHTML = wrapped;
    // Stagger
    qsa('.word-inner', el).forEach((w, i) => {
      w.style.transitionDelay = (i * 0.04) + 's';
    });
    requestAnimationFrame(() => {
      qsa('.word-inner', el).forEach(w => w.style.transform = 'translateY(0)');
    });
  }

  _initSkillBars() {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        qsa('.sk-fill', entry.target).forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 120);
        });
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    qsa('.skill-panel').forEach(p => barObserver.observe(p));
  }
}

/* ── NAV ────────────────────────────────────────────────── */
class Nav {
  constructor() {
    this.nav = qs('#navbar');
    this.links = qsa('.nav-link');
    this.hamburger = qs('#hamburger');
    this.mobileMenu = qs('#mobileMenu');
    this._bind();
  }

  _bind() {
    this.hamburger?.addEventListener('click', () => {
      this.hamburger.classList.toggle('open');
      this.mobileMenu.classList.toggle('open');
    });

    qsa('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        this.hamburger.classList.remove('open');
        this.mobileMenu.classList.remove('open');
      });
    });
  }

  tick() {
    const scrolled = State.scroll.y > 60;
    this.nav.classList.toggle('solid', scrolled);

    // Active link highlight
    const sections = qsa('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) currentId = sec.id;
    });
    this.links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
}

/* ── COUNTER ANIMATION ──────────────────────────────────── */
class CounterAnimation {
  constructor() {
    this._init();
  }

  _init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        qsa('[data-count]', entry.target).forEach(el => this._animate(el));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    const heroStats = qs('.hero-stats');
    if (heroStats) observer.observe(heroStats);
  }

  _animate(el) {
    const target = parseInt(el.dataset.count);
    const sub = el.querySelector('sub') || '';
    const subHtml = sub ? sub.outerHTML : '';
    let current = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.innerHTML = current + subHtml;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

/* ── TYPING EFFECT (smooth, premium) ───────────────────── */
class TypeWriter {
  constructor() {
    this.el = qs('#typingText');
    if (!this.el) return;
    this.lines = [
      'AI Engineer',
      'ML Enthusiast',
      'Full Stack Dev',
      'Open Source Contributor',
      'Product Builder',
    ];
    this.lineIndex = 0;
    this.charIndex = 0;
    this.deleting = false;
    this.pause = false;
    this._tick();
  }

  _tick() {
    if (!this.el) return;
    const line = this.lines[this.lineIndex];

    if (!this.deleting) {
      this.charIndex++;
      this.el.textContent = line.slice(0, this.charIndex);
      if (this.charIndex === line.length) {
        this.pause = true;
        setTimeout(() => { this.pause = false; this.deleting = true; this._tick(); }, 2000);
        return;
      }
      setTimeout(() => this._tick(), 60 + Math.random() * 40);
    } else {
      this.charIndex--;
      this.el.textContent = line.slice(0, this.charIndex);
      if (this.charIndex === 0) {
        this.deleting = false;
        this.lineIndex = (this.lineIndex + 1) % this.lines.length;
        setTimeout(() => this._tick(), 400);
        return;
      }
      setTimeout(() => this._tick(), 35);
    }
  }
}

/* ── SCROLL PROGRESS LINE ───────────────────────────────── */
class ProgressLine {
  constructor() {
    this.line = qs('#progressLine');
  }
  tick() {
    if (!this.line) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (State.scroll.y / scrollable) * 100 : 0;
    this.line.style.width = pct + '%';
  }
}

/* ── SCROLL TOP BUTTON ──────────────────────────────────── */
class ScrollTopBtn {
  constructor() {
    this.btn = qs('#scrollTop');
    this.btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  tick() {
    this.btn?.classList.toggle('show', State.scroll.y > 500);
  }
}

/* ── PROJECT ROWS — Hover Preview ───────────────────────── */
class ProjectRows {
  constructor() {
    this._bind();
  }
  _bind() {
    qsa('.project-row').forEach(row => {
      row.addEventListener('mouseenter', () => {
        const title = row.querySelector('.proj-title');
        if (title) title.style.letterSpacing = '0.04em';
      });
      row.addEventListener('mouseleave', () => {
        const title = row.querySelector('.proj-title');
        if (title) title.style.letterSpacing = '';
      });
    });
  }
}

/* ── PROJECT MODAL ──────────────────────────────────────── */
class ProjectModal {
  constructor() {
    this.modal = qs('#projModal');
    this.modalBg = qs('#projModalBg');
    this.modalClose = qs('#projModalClose');
    this.modalBody = qs('#projModalBody');
    this.isOpen = false;

    this.data = [
      {
        title: 'CareVerse',
        org: 'Healthcare AI Platform',
        desc: [
          'CareVerse is an AI-powered healthcare dashboard engineered for real-world clinical workflows. It features predictive patient analytics, intelligent appointment management, and risk-based health insights.',
          'Built to scale, the system handles complex data pipelines and delivers actionable insights to medical professionals through an intuitive interface designed around clinical decision-making.',
        ],
        stack: ['HTML/CSS', 'JavaScript', 'Node.js', 'MongoDB', 'Express', 'Chart.js'],
        links: [{ label: 'Live Demo', icon: 'fas fa-arrow-up-right-from-square', href: '#' }, { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/tanmayyyyayyy' }],
      },
      {
        title: 'Loopin',
        org: 'Developer Productivity Tool',
        desc: [
          'Loopin is a coding streak tracker that gamifies developer consistency. Visual analytics dashboards show session patterns, progress toward goals, and momentum metrics that keep developers in flow.',
          'Inspired by GitHub contributions and habit-tracking apps, Loopin turns productive coding sessions into a visual story of growth.',
        ],
        stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage API', 'Chart.js'],
        links: [{ label: 'Live Demo', icon: 'fas fa-arrow-up-right-from-square', href: '#' }, { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/tanmayyyyayyy' }],
      },
      {
        title: 'TripPal',
        org: 'AI Travel Planner',
        desc: [
          'TripPal is a smart itinerary generator that creates personalized travel plans based on budget, trip duration, and user preferences. Structured daily schedules with destination insights make planning effortless.',
          'Powered by AI logic, TripPal understands travel context and generates coherent multi-day itineraries that feel human-planned, not algorithmic.',
        ],
        stack: ['HTML/CSS', 'JavaScript', 'Node.js', 'MongoDB', 'REST API'],
        links: [{ label: 'Live Demo', icon: 'fas fa-arrow-up-right-from-square', href: '#' }, { label: 'GitHub', icon: 'fab fa-github', href: 'https://github.com/tanmayyyyayyy' }],
      },
    ];

    this._bind();
  }

  _bind() {
    qsa('.project-row').forEach((row, i) => {
      row.addEventListener('click', () => this.open(i));
    });
    this.modalClose?.addEventListener('click', () => this.close());
    this.modalBg?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
  }

  open(i) {
    const d = this.data[i];
    if (!d || !this.modalBody) return;

    this.modalBody.innerHTML = `
      <h2>${d.title}</h2>
      <div class="modal-org">${d.org}</div>
      ${d.desc.map(p => `<p>${p}</p>`).join('')}
      <div class="modal-stack">${d.stack.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="proj-modal-links">${d.links.map(l => `<a href="${l.href}" target="_blank" class="btn-outline"><i class="${l.icon}"></i><span>${l.label}</span></a>`).join('')}</div>
    `;

    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  close() {
    if (!this.isOpen) return;
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
    this.isOpen = false;
  }
}

/* ── CONTACT FORM ───────────────────────────────────────── */
class ContactForm {
  constructor() {
    this.form = qs('#contactForm');
    this.success = qs('#formSuccess');
    this._bind();
  }

  _bind() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this._validate()) this._submit();
    });

    // Live validation clear
    qsa('.form-input', this.form).forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('err');
        const errId = input.id + 'Err';
        const errEl = qs('#' + errId);
        if (errEl) errEl.textContent = '';
      });
    });
  }

  _validate() {
    let valid = true;
    const name = qs('#name'), email = qs('#email'), message = qs('#message');

    if (!name.value.trim()) {
      this._setErr(name, 'NameErr', 'Name is required.');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      this._setErr(email, 'emailErr', 'Valid email is required.');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      this._setErr(message, 'messageErr', 'Message must be at least 10 characters.');
      valid = false;
    }
    return valid;
  }

  _setErr(input, errId, msg) {
    input.classList.add('err');
    const errEl = qs('#' + errId);
    if (errEl) errEl.textContent = msg;
  }

  _submit() {
    const btn = qs('.btn-send', this.form);
    if (btn) {
      btn.querySelector('span').textContent = 'Sending...';
      btn.disabled = true;
    }
    setTimeout(() => {
      this.form.reset();
      if (this.success) this.success.classList.add('show');
      if (btn) {
        btn.querySelector('span').textContent = 'Send Message';
        btn.disabled = false;
      }
      setTimeout(() => this.success?.classList.remove('show'), 5000);
    }, 1200);
  }
}

/* ── AMBIENT GLOW (section bg lighting) ────────────────── */
class AmbientGlow {
  constructor() {
    this.glowEl = this._create();
    this.tx = 0; this.ty = 0;
    this.cx = 0; this.cy = 0;
  }

  _create() {
    const el = document.createElement('div');
    el.className = 'ambient-glow';
    el.style.cssText = `
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background:radial-gradient(500px circle at 50% 50%, rgba(200,169,110,0.025) 0%, transparent 70%);
      will-change:background;
    `;
    document.body.appendChild(el);
    return el;
  }

  tick() {
    this.cx = lerp(this.cx, State.mouse.x, 0.04);
    this.cy = lerp(this.cy, State.mouse.y, 0.04);
    const x = (this.cx / window.innerWidth * 100).toFixed(1);
    const y = (this.cy / window.innerHeight * 100).toFixed(1);
    this.glowEl.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(200,169,110,0.03) 0%, transparent 70%)`;
  }
}

/* ── SECTION TRANSITIONS (scroll-based blur/scale) ──────── */
class SectionTransitions {
  constructor() {
    this._init();
  }

  _init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.filter = 'blur(0px)';
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.05 });

    qsa('.section').forEach(sec => {
      observer.observe(sec);
    });
  }
}

/* ── RIPPLE EFFECT ON BUTTONS ───────────────────────────── */
class RippleEffect {
  constructor() {
    qsa('.btn-main, .btn-send, .nav-hire').forEach(btn => {
      btn.addEventListener('click', (e) => this._create(e, btn));
    });
  }

  _create(e, btn) {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;border-radius:50%;
      background:rgba(255,255,255,0.15);pointer-events:none;
      transform:scale(0);animation:rippleAnim 0.6s ease-out forwards;z-index:2;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
}

/* ── RAF LOOP ───────────────────────────────────────────── */
class RafLoop {
  constructor(systems) {
    this.systems = systems;
    this._tick = this._tick.bind(this);
  }

  start() {
    this._tick();
  }

  _tick() {
    this.systems.forEach(sys => sys.tick && sys.tick());
    requestAnimationFrame(this._tick);
  }
}

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
function initSmoothAnchors() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── INIT ───────────────────────────────────────────────── */
async function init() {
  // Step 1: Run loader
  const loader = new Loader();
  await loader.run();

  // Step 2: Boot all systems
  const scroller = new SmoothScroll();
  const cursor = new Cursor();
  const spotlight = new Spotlight();
  const heroCanvas = new HeroCanvas();
  const parallax = new Parallax();
  const heroTilt = new HeroTilt();
  const nav = new Nav();
  const progressLine = new ProgressLine();
  const scrollTopBtn = new ScrollTopBtn();
  const ambientGlow = new AmbientGlow();

  // Non-RAF systems
  new Magnetic();
  new ScrollReveal();
  new CounterAnimation();
  new TypeWriter();
  new ProjectRows();
  new ProjectModal();
  new ContactForm();
  new RippleEffect();
  new SectionTransitions();
  initSmoothAnchors();

  // Scroll listener
  scroller.onScroll(() => {
    nav.tick();
    progressLine.tick();
    scrollTopBtn.tick();
  });

  // Run initial scroll tick
  window.addEventListener('scroll', () => scroller.tick(), { passive: true });
  scroller.tick();

  // RAF loop for smooth, per-frame systems
  const rafLoop = new RafLoop([
    cursor,
    spotlight,
    heroCanvas,
    parallax,
    heroTilt,
    ambientGlow,
  ]);
  rafLoop.start();

  State.loaded = true;
}

/* Inject ripple keyframe */
const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);