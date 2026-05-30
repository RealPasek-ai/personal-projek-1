/**
 * main.js
 * Interaksi umum: scroll reveal, animasi bar, efek navbar, dll.
 */

// ==============================
// SCROLL REVEAL
// ==============================
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.skill-card, .timeline-item, .contact-box, .section-title'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay berdasarkan index dalam parent
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(el => observer.observe(el));
}

// ==============================
// SKILL BAR ANIMASI
// ==============================
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width = target.style.width;
          target.style.width = '0%';
          // Trigger reflow
          void target.offsetWidth;
          target.style.width = width;
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => {
    const originalWidth = bar.style.width;
    bar.style.width = '0%';
    observer.observe(bar);
    bar._targetWidth = originalWidth;
  });
}

// ==============================
// NAVBAR ACTIVE LINK ON SCROLL
// ==============================
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

// ==============================
// NAVBAR SCROLL SHADOW
// ==============================
function initNavShadow() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 24px rgba(57,255,143,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// ==============================
// TYPING EFFECT pada hero desc
// ==============================
function initTypingEffect() {
  const desc = document.querySelector('.hero-desc');
  if (!desc) return;

  const fullText = desc.innerHTML;
  desc.innerHTML = '';
  desc.style.opacity = '1';

  let i = 0;
  const speed = 18; // ms per karakter

  function type() {
    if (i < fullText.length) {
      desc.innerHTML = fullText.slice(0, i + 1);
      i++;
      setTimeout(type, speed);
    }
  }

  // Mulai setelah delay singkat
  setTimeout(type, 600);
}

// ==============================
// RANDOM FLICKER pada rank badge
// ==============================
function initFlicker() {
  const badge = document.querySelector('.rank-badge');
  if (!badge) return;

  function flicker() {
    badge.style.opacity = Math.random() > 0.05 ? '1' : '0.4';
    setTimeout(flicker, Math.random() * 4000 + 2000);
  }

  flicker();
}

// ==============================
// CURSOR CUSTOM (opsional)
// ==============================
function initCursor() {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 10px; height: 10px;
    background: #39ff8f;
    border-radius: 0;
    pointer-events: none;
    z-index: 99999;
    mix-blend-mode: screen;
    transition: transform 0.1s;
    transform: translate(-50%, -50%);
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
}

// ==============================
// INIT ALL
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSkillBars();
  initNavHighlight();
  initNavShadow();
  initTypingEffect();
  initFlicker();
  initCursor();
});