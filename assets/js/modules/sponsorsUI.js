/**
 * Sponsors UI Module
 * AWS Student Community Day: South Summit 2026
 * Hero Showcase + Infinite Marquee Stream with Interactive 3D Tile Flipping Animation
 */
import { sponsors } from '../data/sponsors.js?v=20260921-partners-labels';
import { isLowSpec } from './perfManager.js';
import { updateMarqueeBounds } from './computeGrid.js';

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderHeroCard(s) {
  const name = escapeHTML(s.name || '');
  const color = s.color || 'purple';
  const logoSrc = escapeHTML(s.imgUrl || 'assets/images/south-summit-logo.svg');
  const darkLogoSrc = s.imgDarkUrl ? escapeHTML(s.imgDarkUrl) : null;
  const tierTagLabel = s.tier === 'quantum' 
    ? 'QUANTUM SPONSOR' 
    : (s.tier === 'cluster' ? 'CLUSTER SPONSOR' : 'VENUE PARTNER');
  const tagClass = (s.tier === 'quantum' && s.color === 'blue') ? 'learning' : s.tier;
  const role = escapeHTML(s.role || s.description || '');

  const logoMarkup = darkLogoSrc ? `
          <img class="hero-logo hero-logo--theme-light"
               src="${logoSrc}"
               alt="${name}"
               width="220"
               height="90"
               loading="lazy"
               decoding="async"
               onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
          <img class="hero-logo hero-logo--theme-dark"
               src="${darkLogoSrc}"
               alt="${name}"
               width="220"
               height="90"
               loading="lazy"
               decoding="async"
               onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
  ` : `
          <img class="hero-logo"
               src="${logoSrc}"
               alt="${name}"
               width="220"
               height="90"
               loading="lazy"
               decoding="async"
               onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
  `;

  return `
    <article class="sponsors-hero-card color-${color}" data-card-color="${color}" aria-label="${name} - ${tierTagLabel}. Click to flip card." tabindex="0" role="button" aria-expanded="false" data-reveal>
      <div class="sponsor-flipper">
        <!-- FRONT FACE: LOGO -->
        <div class="sponsor-flip-face sponsor-flip-front">
          <div class="hero-card-spotlight" aria-hidden="true"></div>
          <div class="hero-card-top">
            <span class="hero-tier-tag ${tagClass}">${tierTagLabel}</span>
          </div>
          <div class="hero-card-media">
            <div class="hero-logo-frame ${s.tier === 'venue' ? 'emblem' : ''}">
              ${logoMarkup}
            </div>
          </div>
          <div class="tile-flip-hint" aria-hidden="true">
            <span class="tile-flip-hint-icon">↺</span>
            <span>Click to flip</span>
          </div>
        </div>

        <!-- BACK FACE: ORGANIZATION NAME & ROLE -->
        <div class="sponsor-flip-face sponsor-flip-back">
          <div class="hero-card-top">
            <span class="hero-tier-tag ${tagClass}">${tierTagLabel}</span>
          </div>
          <div class="hero-back-body">
            <h3 class="hero-back-name">${name}</h3>
            ${role ? `<p class="hero-back-role">${role}</p>` : ''}
          </div>
          <div class="tile-flip-hint is-back" aria-hidden="true">
            <span class="tile-flip-hint-icon">↺</span>
            <span>Click to show logo</span>
          </div>
        </div>
      </div>
    </article>`;
}

function renderMarqueeChip(partner) {
  const name = escapeHTML(partner.name || '');
  const color = partner.color || 'blue';
  const logoSrc = escapeHTML(partner.imgUrl || 'assets/images/south-summit-logo.svg');
  const tier = partner.tier || 'pro';
  const tierLabel = tier === 'pro' ? 'PRO PARTNER' : 'LITE PARTNER';
  const subtitle = escapeHTML(partner.institution || partner.track || '');

  return `
    <div class="marquee-chip chip-${color} marquee-chip--${tier}" title="${name}" aria-label="${name} - ${tierLabel}. Click to flip card." tabindex="0" role="button" aria-expanded="false">
      <div class="chip-flipper">
        <!-- FRONT FACE: LOGO -->
        <div class="chip-flip-face chip-flip-front">
          <div class="marquee-chip-logo-wrap">
            <img class="marquee-chip-logo"
                 src="${logoSrc}"
                 alt="${name}"
                 loading="lazy"
                 decoding="async"
                 width="120"
                 height="120"
                 onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
          </div>
          <div class="chip-flip-cue" aria-hidden="true">
            <span>↺ Flip</span>
          </div>
        </div>

        <!-- BACK FACE: ORGANIZATION NAME -->
        <div class="chip-flip-face chip-flip-back">
          <div class="chip-back-top">
            <span class="marquee-chip-badge marquee-chip-badge--${tier}">${tierLabel}</span>
          </div>
          <div class="chip-back-content">
            <h4 class="marquee-back-name" title="${name}">${name}</h4>
            ${subtitle ? `<span class="marquee-back-sub">${subtitle}</span>` : ''}
          </div>
          <div class="chip-flip-cue is-back" aria-hidden="true">
            <span>↺ Logo</span>
          </div>
        </div>
      </div>
    </div>`;
}

function initSpotlightEffect() {
  if (isLowSpec() || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.sponsors-hero-card');
  cards.forEach(card => {
    let rect = null;
    let rafId = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    }, { passive: true });

    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rect = null;
      if (rafId) cancelAnimationFrame(rafId);
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    }, { passive: true });
  });
}

function wireLogoFallbacks(container) {
  if (!container) return;
  container.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.src = 'assets/images/south-summit-logo.svg';
    }, { once: true });
  });
}

/**
 * Builds lightweight, viewport-aware seamless duplicate marquee HTML.
 * Generates only enough elements to span screen width + safety buffer (4K ready),
 * preventing thousands of redundant DOM nodes and GPU compositor saturation.
 */
function buildMarqueeLoopHTML(list) {
  if (!list || list.length === 0) return '';
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
  // Each chip is 180px + 20px gap = 200px. Calculate target count capped at 22 for 4K.
  const minItemsNeeded = Math.ceil((screenWidth * 1.35) / 200);
  const targetHalfCount = Math.max(list.length, Math.min(minItemsNeeded, 22));

  let half = [];
  while (half.length < targetHalfCount) {
    half = half.concat(list);
  }
  const halfHTML = half.map(renderMarqueeChip).join('');
  return halfHTML + halfHTML;
}

/**
 * Coordinates interactive 3D tile flipping on cards and marquee chips
 */
function initFlipInteraction() {
  const marqueeShell = document.querySelector('.sponsors-marquee-shell');

  function updateMarqueePause() {
    if (!marqueeShell) return;
    const hasFlipped = marqueeShell.querySelector('.marquee-chip.is-flipped');
    if (hasFlipped) {
      marqueeShell.classList.add('is-paused');
    } else {
      marqueeShell.classList.remove('is-paused');
    }
  }

  function toggleFlip(card) {
    if (!card) return;
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
    updateMarqueePause();
  }

  function handleCardClick(e) {
    // If clicking an external link directly, allow native navigation
    if (e.target.closest('a')) return;
    const card = e.target.closest('.sponsors-hero-card, .marquee-chip');
    if (card) {
      toggleFlip(card);
    }
  }

  function handleCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target.tagName !== 'A' && !e.target.closest('a')) {
        const card = e.target.closest('.sponsors-hero-card, .marquee-chip');
        if (card) {
          e.preventDefault();
          toggleFlip(card);
        }
      }
    }
  }

  const containers = [
    document.getElementById('sponsorsQuantumGrid') || document.getElementById('sponsorsHeroGrid'),
    document.getElementById('sponsorsClusterVenueGrid') || document.getElementById('sponsorsClusterGrid'),
    document.getElementById('marqueeTrack1'),
    document.getElementById('marqueeTrack2')
  ];

  containers.forEach(container => {
    if (container) {
      container.addEventListener('click', handleCardClick);
      container.addEventListener('keydown', handleCardKeydown);
    }
  });

  // Escape key to reset all flipped cards and unpause marquee
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const flipped = document.querySelectorAll('.sponsors-hero-card.is-flipped, .marquee-chip.is-flipped');
      if (flipped.length > 0) {
        flipped.forEach(c => {
          c.classList.remove('is-flipped');
          c.setAttribute('aria-expanded', 'false');
        });
        updateMarqueePause();
      }
    }
  });

  // Click outside to reset flipped cards
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sponsors-hero-card, .marquee-chip')) {
      const flipped = document.querySelectorAll('.sponsors-hero-card.is-flipped, .marquee-chip.is-flipped');
      if (flipped.length > 0) {
        flipped.forEach(c => {
          c.classList.remove('is-flipped');
          c.setAttribute('aria-expanded', 'false');
        });
        updateMarqueePause();
      }
    }
  });
}

export function initSponsors() {
  const quantumGrid = document.getElementById('sponsorsQuantumGrid') || document.getElementById('sponsorsHeroGrid');
  const clusterVenueGrid = document.getElementById('sponsorsClusterVenueGrid') || document.getElementById('sponsorsClusterGrid');
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');

  const quantumSponsors = sponsors.filter(s => s.tier === 'quantum');
  const clusterVenueSponsors = sponsors.filter(s => s.tier === 'cluster' || s.tier === 'venue');
  const proPartners = sponsors.filter(s => s.tier === 'pro');
  const litePartners = sponsors.filter(s => s.tier === 'lite');

  // 1. Render Quantum Sponsors (Section 01)
  if (quantumGrid && quantumSponsors.length > 0) {
    quantumGrid.innerHTML = quantumSponsors.map(renderHeroCard).join('');
    wireLogoFallbacks(quantumGrid);
  }

  // 2. Render Cluster Sponsor & Venue Partner (Section 02)
  if (clusterVenueGrid && clusterVenueSponsors.length > 0) {
    clusterVenueGrid.innerHTML = clusterVenueSponsors.map(renderHeroCard).join('');
    wireLogoFallbacks(clusterVenueGrid);
  }

  // Initialize interactive spotlight on all cards
  initSpotlightEffect();

  // 3. Populate and duplicate Marquee tracks by category
  // Track 1: Pro Partners (Marquee Left)
  if (track1 && proPartners.length > 0) {
    track1.innerHTML = buildMarqueeLoopHTML(proPartners);
    wireLogoFallbacks(track1);
  }

  // Track 2: Lite Partners (Marquee Right)
  if (track2 && litePartners.length > 0) {
    track2.innerHTML = buildMarqueeLoopHTML(litePartners);
    wireLogoFallbacks(track2);
  }

  // Update cached grid bounds for ambient block culling
  if (typeof updateMarqueeBounds === 'function') {
    updateMarqueeBounds();
  }

  // 4. Off-screen intersection observer to pause marquee when not visible
  const marqueeShell = document.querySelector('.sponsors-marquee-shell');
  if (marqueeShell && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          marqueeShell.classList.remove('is-offscreen');
        } else {
          marqueeShell.classList.add('is-offscreen');
        }
      });
    }, { rootMargin: '300px 0px' });
    observer.observe(marqueeShell);
  }

  // 5. Initialize tile flipping interactive animation
  initFlipInteraction();
}


