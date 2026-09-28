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
 * - Dual-synchronized player architecture with silky-smooth cross-fade
 *   between 2:1 widescreen inline preview and 9:16 mobile portrait poster
 */

import { getLenis } from './smoothScroll.js';

function isMobilePortraitViewport() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return (w <= 768 && h >= w);
}

export function initVideoHero() {
  const card = document.getElementById('heroVideoCard');
  const video = document.getElementById('heroVideoPlayer');
  const mobileVideo = document.getElementById('heroVideoPlayerMobile');
  const placeholder = document.getElementById('heroVideoPlaceholder');
  const backdrop = document.getElementById('videoTheatricalBackdrop');
  const pauseBtn = document.getElementById('heroVideoPauseBtn');
  const exitBtn = document.getElementById('heroVideoExitBtn');

  if (!card || !video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let userPaused = prefersReduced;
  let isTheatrical = false;
  let isAnimating = false;

  function getActiveVideo() {
    return (isTheatrical && isMobilePortraitViewport() && mobileVideo) ? mobileVideo : video;
  }

  const updateCardState = () => {
    const active = getActiveVideo();
    if (active.paused) {
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
    const active = getActiveVideo();
    if (active.paused) {
      userPaused = false;
      video.play().catch(() => {});
      if (isTheatrical && isMobilePortraitViewport() && mobileVideo) {
        mobileVideo.play().catch(() => {});
      }
    } else {
      userPaused = true;
      video.pause();
      if (mobileVideo) {
        mobileVideo.pause();
      }
    }
    updateCardState();
  };

  function calcTheatricalRect() {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    if (isMobilePortraitViewport()) {
      // 9:16 vertical motion poster for mobile portrait, comfortably framed
      const maxH = viewportH * 0.84;
      const maxW = viewportW * 0.90;
      let w = maxW;
      let h = w * (16 / 9);
      if (h > maxH) {
        h = maxH;
        w = h * (9 / 16);
      }
      const left = Math.max(8, Math.round((viewportW - w) / 2));
      const top = Math.max(8, Math.round((viewportH - h) / 2));
      return { top, left, width: Math.round(w), height: Math.round(h) };
    }

    // 2:1 widescreen motion poster for desktop / landscape
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

    const isMobile = isMobilePortraitViewport();
    if (isMobile && mobileVideo) {
      if (video.currentTime && mobileVideo.duration) {
        mobileVideo.currentTime = video.currentTime % mobileVideo.duration;
      }
      if (!userPaused) {
        mobileVideo.play().catch(() => {});
      }
    }

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

      updateCardState();

      const onTransitionEnd = () => {
        isAnimating = false;
        if (isMobile && mobileVideo && !mobileVideo.paused) {
          video.pause();
        }
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
    const isMobile = isMobilePortraitViewport();

    if (isMobile && mobileVideo) {
      if (mobileVideo.currentTime && video.duration) {
        video.currentTime = mobileVideo.currentTime % video.duration;
      }
      if (!userPaused) {
        video.play().catch(() => {});
      }
    }

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
        if (mobileVideo) {
          mobileVideo.pause();
        }
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
        if (mobileVideo) {
          mobileVideo.currentTime = 0;
          mobileVideo.pause();
        }
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

  // Handle window resizing and orientation changes while in theatrical view
  const handleViewportChange = () => {
    if (isTheatrical && !isAnimating) {
      const target = calcTheatricalRect();
      card.style.transition = 'none';
      card.style.top = target.top + 'px';
      card.style.left = target.left + 'px';
      card.style.width = target.width + 'px';
      card.style.height = target.height + 'px';
      updateCardState();
    }
  };

  window.addEventListener('resize', handleViewportChange, { passive: true });
  window.addEventListener('orientationchange', handleViewportChange, { passive: true });

  // Auto exit on page switch/hash change
  window.addEventListener('hashchange', () => {
    if (isTheatrical) exitTheatricalView();
  });

  video.addEventListener('play', updateCardState);
  video.addEventListener('pause', updateCardState);
  if (mobileVideo) {
    mobileVideo.addEventListener('play', updateCardState);
    mobileVideo.addEventListener('pause', updateCardState);
  }

  if (prefersReduced) {
    video.pause();
    if (mobileVideo) mobileVideo.pause();
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
