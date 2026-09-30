/**
 * AWS Student Community Day: South Summit 2026
 * In-Navbar Kinetic Navigation Engine (Character Roller & Signature Stagger)
 * Transforms nav text into mechanical rolling letter tickers with wave stagger,
 * executes 5-color prelayer sweep and editorial entrance roll.
 */

const GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';

let gsap = window.gsap || null;

async function ensureGSAP() {
  if (window.gsap) {
    gsap = window.gsap;
    return gsap;
  }
  try {
    const mod = await import(/* @vite-ignore */ GSAP_CDN);
    gsap = mod.gsap || mod.default || mod;
    window.gsap = gsap;
    return gsap;
  } catch (err) {
    console.warn('[NavbarEngine] Failed to load GSAP from CDN:', err);
    return null;
  }
}

export async function initStaggeredMenu(config = {}) {
  const navContainer = document.getElementById('navLinks');
  if (!navContainer) return;

  const navItems = Array.from(navContainer.querySelectorAll('.nav-item'));
  const prelayerBars = Array.from(document.querySelectorAll('.nav-prelayer-bar'));
  const prelayerTrack = document.getElementById('navPrelayerTrack');

  // Load GSAP
  await ensureGSAP();

  /**
   * Automatically split text into dual-layer character rollers for kinetic hover
   */
  function setupCharRollers() {
    navItems.forEach(item => {
      const labelEl = item.querySelector('.nav-item-label');
      if (!labelEl || labelEl.dataset.splitDone) return;

      const rawText = labelEl.textContent.trim();
      labelEl.setAttribute('aria-label', rawText);
      labelEl.dataset.splitDone = 'true';

      labelEl.innerHTML = `<span class="sr-only">${rawText}</span>` + rawText.split('').map((char, i) => {
        if (char === ' ') return '<span>&nbsp;</span>';
        return `<span class="char-roller" style="--char-idx: ${i};" aria-hidden="true"><span class="char-default">${char}</span><span class="char-hover">${char}</span></span>`;
      }).join('');
    });
  }

  setupCharRollers();

  /**
   * Signature 5-brand-color prelayer sweep & entrance reveal
   */
  function animateEntrance() {
    if (!gsap) {
      if (prelayerTrack) prelayerTrack.style.opacity = '1';
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Prelayer Bars spectral sweep
    if (prelayerBars.length) {
      gsap.set(prelayerBars, { scaleX: 0, opacity: 0.8, transformOrigin: 'left center' });
      tl.to(prelayerBars, {
        scaleX: 1,
        duration: 0.45,
        stagger: { each: 0.05, from: 'start' }
      }, 0);
    }

    // 2. Kinetic editorial entrance with signature tilt & roll
    const labels = navItems.map(item => item.querySelector('.nav-item-label'));
    const nums = navItems.map(item => item.querySelector('.nav-item-num'));

    gsap.set(labels, { y: 22, rotate: 6, opacity: 0 });
    gsap.set(nums, { scale: 0.4, opacity: 0 });

    tl.to(labels, {
      y: 0,
      rotate: 0,
      opacity: 1,
      duration: 0.7,
      stagger: { each: 0.08, from: 'start' }
    }, 0.1);

    tl.to(nums, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      stagger: { each: 0.08, from: 'start' }
    }, 0.16);
  }

  /**
   * Synchronize active class on nav items based on page and scroll position
   */
  function syncActiveNav() {
    const curPage = document.documentElement.getAttribute('data-page') || 'home';

    navItems.forEach(item => {
      const pageAttr = item.getAttribute('data-page');
      const secAttr = item.getAttribute('data-section');

      let isActive = false;

      if (curPage === 'about') {
        isActive = (pageAttr === 'about');
      } else if (curPage === 'home') {
        if (secAttr) {
          const secEl = document.getElementById(secAttr);
          if (secEl) {
            const rect = secEl.getBoundingClientRect();
            isActive = (rect.top <= 200 && rect.bottom >= 150);
          }
        } else if (pageAttr === 'home') {
          const progEl = document.getElementById('program');
          const venueEl = document.getElementById('venue');
          const isLowerSecActive = (progEl && progEl.getBoundingClientRect().top <= 200 && progEl.getBoundingClientRect().bottom >= 150) ||
                                   (venueEl && venueEl.getBoundingClientRect().top <= 200 && venueEl.getBoundingClientRect().bottom >= 150);
          isActive = !isLowerSecActive;
        }
      }

      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  // Click handling for in-navbar navigation links
  navContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;

    const page = item.getAttribute('data-page');
    const href = item.getAttribute('href');

    if (item.target === '_blank' || (href && href.startsWith('http'))) {
      return;
    }

    if (page) {
      e.preventDefault();
      if (window.showPage) {
        window.showPage(page);
      }
      setTimeout(syncActiveNav, 150);
    } else if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace(/^#/, '');
      const targetSelector = targetId === 'agenda' || targetId === 'schedule' ? '#program' : href;
      const curPage = document.documentElement.getAttribute('data-page') || 'home';

      if (curPage !== 'home') {
        if (window.showPage) {
          window.showPage('home', true, true, targetSelector);
        }
      } else {
        const el = document.querySelector(targetSelector);
        if (el) {
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
          const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH + 10);
          if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
            window.__lenis.scrollTo(targetY, {
              duration: 1.1,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
          history.pushState({ page: 'home', section: targetId }, '', href);
        }
      }
      setTimeout(syncActiveNav, 150);
    }
  });

  // Listen for scroll & route changes with rAF throttle to prevent layout thrashing
  let navScrollTicking = false;
  function onScrollNav() {
    if (!navScrollTicking) {
      navScrollTicking = true;
      requestAnimationFrame(() => {
        syncActiveNav();
        navScrollTicking = false;
      });
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  window.addEventListener('popstate', syncActiveNav);

  const origShowPage = window.showPage;
  if (origShowPage) {
    window.showPage = function() {
      const res = origShowPage.apply(this, arguments);
      setTimeout(() => {
        setupCharRollers();
        syncActiveNav();
        animateEntrance();
      }, 100);
      return res;
    };
  }

  // Trigger initial entrance & active sync
  setTimeout(animateEntrance, 60);
  setTimeout(syncActiveNav, 100);

  // Expose global methods
  window.updateNavLinks = syncActiveNav;
  window.animateNavbarEntrance = animateEntrance;
}
