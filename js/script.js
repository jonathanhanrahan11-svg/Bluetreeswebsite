document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const navLinks = document.querySelectorAll('.main-nav a');
  const sectionMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.slice(1));
      if (section) sectionMap.set(section, link);
    }
  });

  if ('IntersectionObserver' in window && sectionMap.size) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = sectionMap.get(entry.target);
          if (!link || !entry.isIntersecting) return;
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sectionMap.forEach((_, section) => observer.observe(section));
  }

  const revealTargets = document.querySelectorAll('.section, .cta-banner');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (form.action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        alert("This form isn't connected yet — add your Formspree endpoint in index.html to enable submissions.");
      }
      // Once a real Formspree endpoint is set, the form submits normally (no JS needed).
    });
  }

  document.querySelectorAll('.testimonial-slider').forEach((slider) => {
    const viewport = slider.querySelector('.testimonial-viewport');
    const track = slider.querySelector('.testimonial-track');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    const originalSlides = [...track.children];
    if (!viewport || originalSlides.length < 2) return;

    // Triplicate the slides so there's a buffer of real cards on either
    // side of the visible copy — scrolling into a buffer silently snaps
    // back by one set-width, which reads as an endless loop.
    const COPIES = 3;
    for (let c = 1; c < COPIES; c++) {
      originalSlides.forEach((slide) => track.appendChild(slide.cloneNode(true)));
    }

    let setWidth = 0;
    function measure() { setWidth = track.scrollWidth / COPIES; }
    // `.testimonial-viewport` has `scroll-behavior: smooth` in CSS, which
    // also governs plain `scrollLeft` assignment — so an instant repositioning
    // jump needs scroll-behavior forced to `auto` or it animates instead.
    function jumpTo(x) {
      const prevBehavior = viewport.style.scrollBehavior;
      viewport.style.scrollBehavior = 'auto';
      viewport.scrollLeft = x;
      viewport.style.scrollBehavior = prevBehavior;
    }
    measure();
    jumpTo(setWidth);

    viewport.addEventListener('scroll', () => {
      if (viewport.scrollLeft <= 1) {
        jumpTo(viewport.scrollLeft + setWidth);
      } else if (viewport.scrollLeft >= setWidth * (COPIES - 1) - 1) {
        jumpTo(viewport.scrollLeft - setWidth);
      }
    });

    window.addEventListener('resize', () => {
      const ratio = viewport.scrollLeft / (setWidth || 1);
      measure();
      jumpTo(setWidth * ratio);
    });

    function stepWidth() {
      const first = track.children[0];
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    nextBtn.addEventListener('click', () => viewport.scrollBy({ left: stepWidth(), behavior: 'smooth' }));
    prevBtn.addEventListener('click', () => viewport.scrollBy({ left: -stepWidth(), behavior: 'smooth' }));

    // Let a plain vertical mouse wheel drive the strip while hovered,
    // so trackpad-less mouse users can scroll it left/right too.
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        viewport.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    viewport.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add('dragging');
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      viewport.scrollLeft = startScroll - dx;
    });
    function endDrag() { dragging = false; viewport.classList.remove('dragging'); }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('pointerleave', endDrag);

    let autoTimer;
    function autoStep() { if (!dragging) viewport.scrollLeft += 0.4; }
    function startAuto() { autoTimer = setInterval(autoStep, 30); }
    function stopAuto() { clearInterval(autoTimer); }
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    startAuto();

    track.querySelectorAll('.testimonial-card').forEach((card) => {
      card.addEventListener('click', () => {
        if (moved) return;
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        window.open('https://www.facebook.com/p/Blue-Trees-100092457084441/', '_blank', 'noopener');
      });
    });
  });

  document.querySelectorAll('.hero-slideshow').forEach((slideshow) => {
    const track = slideshow.querySelector('.hero-slide-track');
    const slides = [...track.children];
    const dotsWrap = slideshow.parentElement.querySelector('.hero-slideshow-dots');
    if (slides.length < 2 || !dotsWrap) return;

    let index = 0;
    let timer;
    let dragging = false;
    let dragStartX = 0;
    let dragDeltaX = 0;
    let width = slideshow.getBoundingClientRect().width;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
    const dots = [...dotsWrap.children];

    function setTrackOffset(px, animate) {
      track.style.transition = animate ? 'transform 0.45s cubic-bezier(.4,0,.2,1)' : 'none';
      track.style.transform = `translateX(${px}px)`;
    }
    function goTo(i, animate = true) {
      index = (i + slides.length) % slides.length;
      setTrackOffset(-index * width, animate);
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    function next() { goTo(index + 1); }
    function startTimer() { timer = setInterval(next, 2000); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    window.addEventListener('resize', () => {
      width = slideshow.getBoundingClientRect().width;
      goTo(index, false);
    });

    slideshow.addEventListener('pointerdown', (e) => {
      dragging = true;
      dragStartX = e.clientX;
      dragDeltaX = 0;
      clearInterval(timer);
      slideshow.setPointerCapture(e.pointerId);
    });
    slideshow.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dragDeltaX = e.clientX - dragStartX;
      setTrackOffset(-index * width + dragDeltaX, false);
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      const threshold = width * 0.15;
      if (dragDeltaX < -threshold) goTo(index + 1);
      else if (dragDeltaX > threshold) goTo(index - 1);
      else goTo(index);
      resetTimer();
    }
    slideshow.addEventListener('pointerup', endDrag);
    slideshow.addEventListener('pointercancel', endDrag);
    slideshow.addEventListener('pointerleave', () => { if (dragging) endDrag(); });

    slideshow.addEventListener('mouseenter', () => clearInterval(timer));
    slideshow.addEventListener('mouseleave', () => { if (!dragging) startTimer(); });

    goTo(0, false);
    startTimer();
  });
});
