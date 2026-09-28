/**
 * videoHero.js
 * --------------------------------------------------------------------------
 * Controls the hero motion poster video player (#heroVideoPlayer):
 * - Seamless cinematic/theatric zoom-in & zoom-out animation
 * - Top-left pause/play button in both normal and theatrical modes
 * - Top-right exit button in both normal and theatrical modes
 * - Hardware-accelerated 60fps FLIP transition with zero dropped video frames
 * - Backdrop blur scrim and background scroll-lock
 * - Full keyboard (Esc, Space, Enter) and responsive touch support
 */

import { getLenis } from './smoothScroll.js';

export function initVideoHero() {
  const card = document.getElementById('heroVideoCard');
  const video = document.getElementById('heroVideoPlayer');
  const placeholder = document.getElementById('heroVideoPlaceholder');
  const backdrop = document.getElementById('videoTheatricalBackdrop');
  const pauseBtn = document.getElementById('heroVideoPauseBtn');
  const exitBtn = document.getElementById('heroVideoExitBtn');

  if (!card || !video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let userPaused = prefersReduced;
  let isTheatrical = false;
  let isAnimating = false;

  const updateCardState = () => {
    if (video.paused) {
      card.classList.add('is-paused');
      card.classList.remove('is-playing');
      card.setAttribute('aria-label', isTheatrical 
        ? 'Official Motion Poster Video in Theatrical View (Paused — click to play)' 
        : 'Official Motion Poster Video (Paused — click to view in cinematic mode)');
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-label', 'Play video');
        pauseBtn.setAttribute('title', 'Play video (Space)');
      }
    } else {
      card.classList.add('is-playing');
      card.classList.remove('is-paused');
      card.setAttribute('aria-label', isTheatrical 
        ? 'Official Motion Poster Video in Theatrical View (Playing — click to pause)' 
        : 'Official Motion Poster Video (Playing — click to view in cinematic mode)');
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-label', 'Pause video');
        pauseBtn.setAttribute('title', 'Pause video (Space)');
      }
    }
  };

  const togglePlayback = () => {
    if (video.paused) {
      userPaused = false;
      video.play().catch(() => {});
    } else {
      userPaused = true;
      video.pause();
    }
    updateCardState();
  };

  function calcTheatricalRect() {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const maxW = Math.min(viewportW * 0.92, 1140);
    let w = maxW;
    let h = w * 0.5; // 2:1 widescreen motion poster ratio
    if (h > viewportH * 0.82) {
      h = viewportH * 0.82;
      w = h * 2;
    }
    if (w > viewportW * 0.92) {
      w = viewportW * 0.92;
      h = w * 0.5;
    }
    const left = Math.max(8, Math.round((viewportW - w) / 2));
    const top = Math.max(8, Math.round((viewportH - h) / 2));
    return { top, left, width: Math.round(w), height: Math.round(h) };
  }

  function enterTheatricalView() {
    if (isTheatrical || isAnimating) return;
    isAnimating = true;

    const startRect = card.getBoundingClientRect();

    // Set placeholder dimensions to reserve exact layout footprint
    if (placeholder) {
      placeholder.style.width = startRect.width + 'px';
      placeholder.style.height = startRect.height + 'px';
      placeholder.style.display = 'block';
    }

    // Stop Lenis background scrolling
    const lenis = getLenis();
    if (lenis) lenis.stop();

    document.body.classList.add('is-theater-active');

    // Anchor card to fixed viewport coordinates matching starting rect
    card.style.position = 'fixed';
    card.style.top = startRect.top + 'px';
    card.style.left = startRect.left + 'px';
    card.style.width = startRect.width + 'px';
    card.style.height = startRect.height + 'px';
    card.style.margin = '0';
    card.style.zIndex = '100000';
    card.classList.add('is-theater-animating');

    // Activate backdrop scrim
    if (backdrop) backdrop.classList.add('is-active');

    // Force style flush before transitioning
    void card.offsetWidth;

    const target = calcTheatricalRect();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    requestAnimationFrame(() => {
      card.style.transition = isReduced
        ? 'none'
        : 'top 0.42s cubic-bezier(0.16, 1, 0.3, 1), left 0.42s cubic-bezier(0.16, 1, 0.3, 1), width 0.42s cubic-bezier(0.16, 1, 0.3, 1), height 0.42s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.42s ease, box-shadow 0.42s ease';
      card.style.top = target.top + 'px';
      card.style.left = target.left + 'px';
      card.style.width = target.width + 'px';
      card.style.height = target.height + 'px';
      card.classList.add('is-theatrical-expanded');
      card.setAttribute('aria-expanded', 'true');
      isTheatrical = true;

      if (video.paused && !userPaused) {
        video.play().catch(() => {});
      }

      updateCardState();

      const onTransitionEnd = () => {
        isAnimating = false;
        card.removeEventListener('transitionend', onTransitionEnd);
      };

      if (isReduced) {
        isAnimating = false;
      } else {
        card.addEventListener('transitionend', onTransitionEnd, { once: true });
        setTimeout(() => { isAnimating = false; }, 480);
      }
    });
  }

  function exitTheatricalView() {
    if (!isTheatrical || isAnimating) return;
    isAnimating = true;

    const returnRect = placeholder ? placeholder.getBoundingClientRect() : null;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (backdrop) backdrop.classList.remove('is-active');

    // Resume Lenis smooth scroll
    const lenis = getLenis();
    if (lenis) lenis.start();

    requestAnimationFrame(() => {
      if (returnRect) {
        card.style.transition = isReduced
          ? 'none'
          : 'top 0.38s cubic-bezier(0.16, 1, 0.3, 1), left 0.38s cubic-bezier(0.16, 1, 0.3, 1), width 0.38s cubic-bezier(0.16, 1, 0.3, 1), height 0.38s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.38s ease, box-shadow 0.38s ease';
        card.style.top = returnRect.top + 'px';
        card.style.left = returnRect.left + 'px';
        card.style.width = returnRect.width + 'px';
        card.style.height = returnRect.height + 'px';
      }
      card.classList.remove('is-theatrical-expanded');

      const cleanup = () => {
        card.removeAttribute('style');
        card.classList.remove('is-theater-animating');
        card.setAttribute('aria-expanded', 'false');
        if (placeholder) placeholder.style.display = 'none';
        document.body.classList.remove('is-theater-active');
        isTheatrical = false;
        isAnimating = false;
        updateCardState();
      };

      if (isReduced) {
        cleanup();
      } else {
        card.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 420);
      }
    });
  }

  // Top-left Pause/Play button
  if (pauseBtn) {
    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlayback();
    });
  }

  // Top-right Exit button
  if (exitBtn) {
    exitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isTheatrical) {
        exitTheatricalView();
      } else {
        // In normal mode, exit resets video playback to the start and pauses
        video.currentTime = 0;
        video.pause();
        userPaused = true;
        updateCardState();
      }
    });
  }

  // Backdrop click exits theatrical mode
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (isTheatrical) exitTheatricalView();
    });
  }

  // Card click: In normal mode -> zoom in; in theatrical mode -> toggle play/pause
  card.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    if (!isTheatrical) {
      enterTheatricalView();
    } else {
      togglePlayback();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isTheatrical) {
      exitTheatricalView();
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === card) {
        e.preventDefault();
        if (!isTheatrical) {
          enterTheatricalView();
        } else {
          togglePlayback();
        }
      }
    }
  });

  // Handle window resizing while in theatrical view
  window.addEventListener('resize', () => {
    if (isTheatrical && !isAnimating) {
      const target = calcTheatricalRect();
      card.style.transition = 'none';
      card.style.top = target.top + 'px';
      card.style.left = target.left + 'px';
      card.style.width = target.width + 'px';
      card.style.height = target.height + 'px';
    }
  }, { passive: true });

  // Auto exit on page switch/hash change
  window.addEventListener('hashchange', () => {
    if (isTheatrical) exitTheatricalView();
  });

  video.addEventListener('play', updateCardState);
  video.addEventListener('pause', updateCardState);

  if (prefersReduced) {
    video.pause();
    updateCardState();
  } else {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(updateCardState).catch(() => {
        updateCardState();
      });
    }
  }

  // IntersectionObserver: auto-pause offscreen when in normal mode
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (!video.paused && !isTheatrical) {
            video.pause();
          }
        } else if (!userPaused && !prefersReduced && !isTheatrical) {
          video.play().catch(() => {});
        }
      });
    }, { threshold: 0.15 });

    observer.observe(video);
  }
}
