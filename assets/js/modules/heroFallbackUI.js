/**
 * heroFallbackUI.js
 * --------------------------------------------------------------------------
 * Hardens the video hero's first impression. The motion poster (#heroVideoPlayer)
 * carries the event artwork, but the permanent #heroLockup (title/date/venue/CTA,
 * and the single home <h1>) must read clearly even when the video never loads or
 * play() is blocked.
 *
 * Responsibility: if the video errors out (or has no playable source), drop the
 * `.hero-has-video` class on #hero so CSS promotes the lockup to a solid,
 * high-contrast panel over the poster image. The lockup is always in the DOM, so
 * SEO/screen-reader/no-JS users already get the content regardless.
 */

export function initHeroFallbackUI() {
  const hero = document.getElementById('hero');
  const video = document.getElementById('heroVideoPlayer');
  if (!hero || !video) return;

  let fellBack = false;
  const fallback = () => {
    if (fellBack) return;
    fellBack = true;
    hero.classList.remove('hero-has-video');
  };

  // Native <video> error (e.g. all sources failed to load).
  video.addEventListener('error', fallback, { once: true });

  // A <source> failing bubbles as an error event on the source element.
  video.querySelectorAll('source').forEach(src => {
    src.addEventListener('error', () => {
      // Only fall back if the media element has truly found nothing to play.
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fallback();
    });
  });

  // Autoplay can be blocked without an error firing. Give playback a brief grace
  // window; if the video is still not advancing and hasn't buffered a frame,
  // reveal the fallback so the hero never sits blank.
  window.setTimeout(() => {
    const hasFrame = video.readyState >= 2; // HAVE_CURRENT_DATA
    if (!hasFrame && (video.paused || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      fallback();
    }
  }, 2600);
}
