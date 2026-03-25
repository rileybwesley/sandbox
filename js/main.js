/* ============================================
   PAPA BEAR POWER — Main JavaScript
   Shared across all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initStickyHeader();
  initScrollAnimations();
  initCounterAnimation();
  initContactForm();
  setActiveNavLink();
});

/* --- Mobile Navigation --- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-overlay__link');

  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.contains('hamburger--active');
    toggleNav(!isActive);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) toggleNav(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('nav-overlay--active')) {
      toggleNav(false);
    }
  });

  function toggleNav(open) {
    hamburger.classList.toggle('hamburger--active', open);
    overlay.classList.toggle('nav-overlay--active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

/* --- Sticky Header with hide/show on scroll --- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        // Add shadow when scrolled
        header.classList.toggle('header--scrolled', currentScroll > 20);

        // Hide/show on scroll direction (only on mobile, and only after scrolling a bit)
        if (window.innerWidth < 1024 && currentScroll > 200) {
          if (currentScroll > lastScroll + 10) {
            header.classList.add('header--hidden');
          } else if (currentScroll < lastScroll - 5) {
            header.classList.remove('header--hidden');
          }
        } else {
          header.classList.remove('header--hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- Scroll Animations (IntersectionObserver) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.count + (counter.dataset.suffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('estimate-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Show success state
    form.style.display = 'none';
    const success = document.querySelector('.form-success');
    if (success) {
      success.classList.add('form-success--visible');
    }
  });
}

/* --- Active Nav Link --- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Mobile overlay links
  document.querySelectorAll('.nav-overlay__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav-overlay__link--active');
    }
  });

  // Desktop nav links
  document.querySelectorAll('.nav-desktop__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav-desktop__link--active');
    }
  });
}
