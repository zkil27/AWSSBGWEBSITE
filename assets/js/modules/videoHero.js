/**
 * videoHero.js
 * --------------------------------------------------------------------------
 * Controls the hero motion poster video player (#heroVideoPlayer).
 * - Click / keyboard toggle for play/pause
 * - Auto-pauses offscreen via IntersectionObserver to save resources
 * - Respects prefers-reduced-motion
 * - Updates visual state classes (.is-playing, .is-paused)
 */

export function initVideoHero() {
  const card = document.getElementById('heroVideoCard');
  const video = document.getElementById('heroVideoPlayer');
  if (!card || !video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let userPaused = prefersReduced;

  const updateCardState = () => {
    if (video.paused) {
      card.classList.add('is-paused');
      card.classList.remove('is-playing');
      card.setAttribute('aria-label', 'Official Motion Poster Video (Paused — click to play)');
    } else {
      card.classList.add('is-playing');
      card.classList.remove('is-paused');
      card.setAttribute('aria-label', 'Official Motion Poster Video (Playing — click to pause)');
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

  card.addEventListener('click', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    togglePlayback();
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      togglePlayback();
    }
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

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          if (!video.paused) {
            video.pause();
          }
        } else if (!userPaused && !prefersReduced) {
          video.play().catch(() => {});
        }
      });
    }, { threshold: 0.15 });

    observer.observe(video);
  }
}
