/**
 * heroPosterUI.js
 * --------------------------------------------------------------------------
 * Main Poster v3 Hero Controller
 * Handles scanline glitch wipe effects, theme transitions, partner tooltips,
 * and keyboard accessibility for the summit motion poster layout.
 */

import { isLowSpec } from './perfManager.js';

let isGlitching = false;

export function initHeroPosterUI() {
  const card = document.querySelector('.poster-card');
  const emblem = document.querySelector('.poster-emblem-core');
  const scanline = document.querySelector('.poster-scanline-overlay');

  if (!card) return;

  // 1. Emblem Click / Interaction Glitch Trigger
  if (emblem && scanline) {
    emblem.addEventListener('click', () => {
      triggerScanlineGlitch(scanline);
    });

    emblem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerScanlineGlitch(scanline);
      }
    });
  }

  // 2. React to Theme Changes with a Poster Glitch Wipe
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'data-theme') {
        if (scanline && !isLowSpec()) {
          triggerScanlineGlitch(scanline);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // 3. Setup Touch / Mouse Drag on Partner Ribbons
  initSwipeableRibbons();
}

/**
 * Trigger a brief cyber scanline wipe across the poster
 */
export function triggerScanlineGlitch(scanlineEl) {
  if (isGlitching || !scanlineEl) return;
  isGlitching = true;

  scanlineEl.classList.add('is-active');

  const card = document.querySelector('.poster-card');
  if (card) {
    card.classList.add('is-glitching');
  }

  setTimeout(() => {
    scanlineEl.classList.remove('is-active');
    if (card) {
      card.classList.remove('is-glitching');
    }
    isGlitching = false;
  }, 450);
}

/**
 * Enable smooth momentum touch / drag scrolling on partner badges
 */
function initSwipeableRibbons() {
  const tracks = document.querySelectorAll('.poster-marquee-track');
  tracks.forEach((track) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}
