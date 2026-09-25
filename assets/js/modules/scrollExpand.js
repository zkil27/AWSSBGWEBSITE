/**
 * scrollExpand.js
 * --------------------------------------------------------------------------
 * Reverse Scroll-Expand (Scroll-Shrink) Module
 * Ported & adapted from ReactBits Scroll-Expand for SCD South Summit 2026.
 *
 * Implements a reverse scroll-driven expansion:
 * - At scroll = 0: Fullscreen encapsulation (100vw, 100dvh, 0px radius).
 *   - Desktop & Landscape: 2:1 widescreen Main Poster v3.mp4
 *   - Mobile Portrait: 9:16 vertical Main Poster v3 - Mobile.mp4
 * - On scroll: Smoothly shrinks into a framed, elevated cyber-poster card (scale ~0.86, radius 24px)
 *   with an ambient cyber-glow shadow.
 * - Synchronized with Lenis smooth scroll and GSAP ScrollTrigger.
 * - Hardware-adaptive: Automatically pauses video playback when scrolled out of view
 *   via IntersectionObserver, saving 100% CPU/GPU and mobile battery.
 */

import { isLowSpec } from './perfManager.js';
import { shouldEnhance } from './smoothScroll.js';

let scrollTriggerInstance = null;
let heroObserver = null;
let userPausedVideo = false;

function getDesiredVideoSrc() {
  const isPortraitMobile = window.innerWidth <= 768 && window.matchMedia('(orientation: portrait)').matches;
  return isPortraitMobile
    ? 'assets/images/main-poster-v3-mobile.mp4'
    : 'assets/images/main-poster-v3.mp4';
}

function syncVideoSource(video) {
  if (!video) return;
  const targetSrc = getDesiredVideoSrc();
  const currentSrc = video.currentSrc || video.src || '';

  if (!currentSrc.includes(targetSrc)) {
    const wasPlaying = !video.paused;
    const time = video.currentTime || 0;

    video.src = targetSrc;
    video.load();
    if (time > 0) {
      video.currentTime = time;
    }
    if (wasPlaying && !userPausedVideo) {
      video.play().catch(() => {});
    }
  }
}

export function initScrollExpand() {
  const stage = document.querySelector('.hero-stage');
  const card = document.querySelector('.video-hero-card') || document.querySelector('.poster-card');
  const video = document.getElementById('heroVideoPlayer');
  const videoBtn = document.getElementById('heroVideoBtn');
  const videoBtnIcon = document.getElementById('heroVideoBtnIcon');
  const dock = document.getElementById('heroDock');
  const hint = document.querySelector('.hero-scroll-hint');

  if (!stage || !card) return;

  // Responsive video source synchronizer
  if (video) {
    syncVideoSource(video);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        syncVideoSource(video);
      }, 150);
    }, { passive: true });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        syncVideoSource(video);
      }, 200);
    }, { passive: true });
  }

  // Setup Video Controls
  const toggleVideoPlayback = () => {
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      userPausedVideo = false;
      if (videoBtnIcon) videoBtnIcon.innerHTML = '&#10074;&#10074;';
      if (videoBtn) videoBtn.setAttribute('aria-label', 'Pause motion poster video');
    } else {
      video.pause();
      userPausedVideo = true;
      if (videoBtnIcon) videoBtnIcon.innerHTML = '&#9654;';
      if (videoBtn) videoBtn.setAttribute('aria-label', 'Play motion poster video');
    }
  };

  if (video && videoBtn) {
    videoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleVideoPlayback();
    });

    // Ensure playback starts if autoplay was permitted
    if (video.paused && !userPausedVideo) {
      video.play().catch(() => {});
    }
  }

  // Tap/click anywhere on video card to toggle playback
  if (card && video) {
    card.addEventListener('click', (e) => {
      if (e.target.closest('#heroDock') || e.target.closest('.hero-dock') || e.target.closest('.hero-lockup')) return;
      toggleVideoPlayback();
    });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

  // 1. Accessibility & Low-Spec Guard
  if (reducedMotion || isLowSpec()) {
    card.style.transform = 'none';
    card.style.borderRadius = '0px';
    card.style.borderColor = 'transparent';
    card.style.setProperty('--poster-shadow-opacity', '0');
    if (hint) hint.style.display = 'none';
    setupObserver(stage, video);
    return;
  }

  // 2. Wait for GSAP and ScrollTrigger
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    console.warn('[ScrollExpand] GSAP or ScrollTrigger not loaded; falling back to native scroll.');
    setupObserver(stage, video);
    return;
  }

  // 3. Desktop / Enhanced Mode: Pinned Scrubbed Reverse Expansion
  if (shouldEnhance() && !isMobile) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1
          card.style.setProperty('--poster-shadow-opacity', String(Math.min(1, p * 1.5)));
          if (hint) {
            hint.style.opacity = String(Math.max(0, 1 - p * 3.5));
          }
          const navEl = document.getElementById('siteNav');
          if (navEl) {
            if (p > 0.08) {
              navEl.classList.add('nav-visible');
            } else if ((window.scrollY || 0) < 40) {
              navEl.classList.remove('nav-visible');
            }
          }
        }
      }
    });

    scrollTriggerInstance = tl.scrollTrigger;

    // Encapsulate Whole Screen (1.0 scale, 0px radius) -> Shrunk Framed Poster Card (0.86 scale, 24px radius)
    tl.fromTo(
      card,
      {
        scale: 1.0,
        borderRadius: 0,
        borderColor: 'transparent'
      },
      {
        scale: 0.86,
        borderRadius: 24,
        borderColor: 'rgba(255, 255, 255, 0.22)',
        ease: 'power2.out'
      }
    );

    if (dock) {
      tl.to(
        dock,
        {
          opacity: 0,
          y: 20,
          ease: 'power2.out'
        },
        0 // synchronize with card scale
      );
    }
  } else {
    // 4. Mobile / Touch Mode: Lightweight Non-Locking Scrub
    // Scales smoothly over the first 180px of scroll without trapping the thumb swipe
    const onMobileScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = Math.min(1, Math.max(0, scrollY / 180));
      const targetScale = 1.0 - progress * 0.08; // 1.0 -> 0.92
      const targetRadius = progress * 22;        // 0px -> 22px

      card.style.transform = `scale(${targetScale.toFixed(3)})`;
      card.style.borderRadius = `${targetRadius.toFixed(1)}px`;
      card.style.setProperty('--poster-shadow-opacity', String(progress));
      if (progress > 0.04) {
        card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      } else {
        card.style.borderColor = 'transparent';
      }
      if (dock) {
        dock.style.opacity = String(Math.max(0, 1 - progress * 2));
        dock.style.transform = `translateX(-50%) translateY(${(progress * 16).toFixed(1)}px)`;
      }
      if (hint) {
        hint.style.opacity = String(Math.max(0, 1 - progress * 3));
      }
      const navEl = document.getElementById('siteNav');
      if (navEl) {
        if (progress > 0.1) {
          navEl.classList.add('nav-visible');
        } else if (scrollY < 30) {
          navEl.classList.remove('nav-visible');
        }
      }
    };

    window.addEventListener('scroll', onMobileScroll, { passive: true });
    onMobileScroll();
  }

  // 5. Setup IntersectionObserver to sleep video and animations off-screen
  setupObserver(stage, video);
}

function setupObserver(stage, video) {
  if (heroObserver) heroObserver.disconnect();
  if (!('IntersectionObserver' in window)) return;

  heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          stage.classList.add('is-paused');
          if (video && !video.paused) {
            video.pause();
          }
        } else {
          stage.classList.remove('is-paused');
          if (video && !userPausedVideo && video.paused) {
            video.play().catch(() => {});
          }
        }
      });
    },
    { threshold: 0.05 }
  );

  heroObserver.observe(stage);
}
