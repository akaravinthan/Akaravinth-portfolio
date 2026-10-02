/* ==========================================================================
   ARAVINTHAN A. — PORTFOLIO SCRIPT
   Vanilla JavaScript. No frameworks, no dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     1. MOBILE HAMBURGER MENU
     ------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ------------------------------------------------------------
     2. STICKY NAVBAR — background change on scroll
     ------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ------------------------------------------------------------
     3. SMOOTH SCROLL (native scroll-behavior handles most,
        this ensures older browsers and offset accuracy)
     ------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------
     4. ACTIVE NAVIGATION SECTION (scroll spy)
     ------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;
    let currentId = '';

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }
  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ------------------------------------------------------------
     5. TYPING ANIMATION FOR ROLE
     ------------------------------------------------------------ */
  const roles = ['UI/UX DESIGNER', 'DIGITAL MARKETING ENTHUSIAST', 'FULL STACK DEVELOPER'];
  const typedEl = document.getElementById('typedRole');

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 35 : 70;
    setTimeout(typeLoop, speed);
  }

  if (typedEl) typeLoop();

  /* ------------------------------------------------------------
     6. SCROLL REVEAL ANIMATION
     ------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------
     7. PROJECT FILTERING
     ------------------------------------------------------------ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noProjectsMsg = document.getElementById('noProjects');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      let visibleCount = 0;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const matches = filter === 'all' || categories.includes(filter);
        card.classList.toggle('filtered-out', !matches);
        if (matches) visibleCount++;
      });

      noProjectsMsg.hidden = visibleCount !== 0;
    });
  });

  /* ------------------------------------------------------------
     8. CONTACT FORM VALIDATION
     ------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = '';

    if (!value) {
      message = 'This field is required.';
    } else if (key === 'email' && !isValidEmail(value)) {
      message = 'Please enter a valid email address.';
    }

    el.classList.toggle('invalid', Boolean(message));
    error.textContent = message;
    return !message;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.hidden = true;

      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);

      if (allValid) {
        formSuccess.hidden = false;
        form.reset();
        Object.values(fields).forEach(({ el }) => el.classList.remove('invalid'));
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ------------------------------------------------------------
     9. BACK TO TOP BUTTON
     ------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
