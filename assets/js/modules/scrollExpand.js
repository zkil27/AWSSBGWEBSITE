/**
 * scrollExpand.js
 * --------------------------------------------------------------------------
 * Hero Video Stage Controller for SCD South Summit 2026.
 *
 * Implements a static, centered motion poster card layout:
 * - Title & Subtitle sit cleanly above the video.
 * - Video is centered in its framed cyber-card container (2:1 aspect ratio).
 * - Action dock (Schedule, Countdown, Register) sits cleanly below the video.
 * - No zooming, scaling, or pinning on scroll ("no more zooming in").
 * - Hardware-adaptive: Automatically pauses video playback when scrolled out of view
 *   via IntersectionObserver, saving 100% CPU/GPU and mobile battery.
 * - Accessible Play/Pause toggle controls.
 */

let heroObserver = null;
let userPausedVideo = false;

export function initScrollExpand() {
  const stage = document.querySelector('.hero-stage');
  const card = document.querySelector('.video-hero-card');
  const video = document.getElementById('heroVideoPlayer');
  const videoBtn = document.getElementById('heroVideoBtn');
  const videoBtnIcon = document.getElementById('heroVideoBtnIcon');

  if (!stage || !card) return;

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

  // Ensure card has static, unscaled styles (no zooming in)
  card.style.transform = 'none';

  // Setup IntersectionObserver to sleep video when scrolled off-screen
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
