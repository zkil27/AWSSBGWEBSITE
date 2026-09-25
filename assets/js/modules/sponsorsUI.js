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

  // Flat, legible card (QA fix): logo + always-visible name + role. No flip —
  // visitors shouldn't need an interaction to read a sponsor's name. Interactivity
  // is limited to a real destination: when a genuine url exists the whole card is
  // a link; otherwise it's a plain, non-interactive article.
  const hasUrl = s.url && s.url !== '#' && s.url.trim() !== '';
  const inner = `
      <div class="hero-card-top">
        <span class="hero-tier-tag ${tagClass}">${tierTagLabel}</span>
      </div>
      <div class="hero-card-media">
        <div class="hero-logo-frame ${s.tier === 'venue' ? 'emblem' : ''}">
          ${logoMarkup}
        </div>
      </div>
      <div class="hero-card-caption">
        <h3 class="hero-card-name">${name}</h3>
        ${role ? `<p class="hero-card-role">${role}</p>` : ''}
      </div>`;

  if (hasUrl) {
    const url = escapeHTML(s.url);
    return `
    <a class="sponsors-hero-card color-${color}" data-card-color="${color}" href="${url}" target="_blank" rel="noopener" aria-label="${name} — ${tierTagLabel} (opens in a new tab)" data-reveal>
      <div class="hero-card-spotlight" aria-hidden="true"></div>
      ${inner}
    </a>`;
  }

  return `
    <article class="sponsors-hero-card sponsors-hero-card--static color-${color}" data-card-color="${color}" aria-label="${name} — ${tierTagLabel}" data-reveal>
      <div class="hero-card-spotlight" aria-hidden="true"></div>
      ${inner}
    </article>`;
}

function renderMarqueeChip(partner) {
  const name = escapeHTML(partner.name || '');
  const color = partner.color || 'blue';
  const logoSrc = escapeHTML(partner.imgUrl || 'assets/images/south-summit-logo.svg');
  const tier = partner.tier || 'pro';
  const tierLabel = tier === 'pro' ? 'PRO PARTNER' : 'LITE PARTNER';
  const subtitle = escapeHTML(partner.institution || partner.track || '');

  // Flat chip (QA fix): logo + always-visible name/subtitle, no flip. The name
  // no longer hides behind an interaction. Clones for the marquee loop are marked
  // aria-hidden + inert in buildMarqueeLoopHTML (Task 11) so the a11y tree isn't
  // polluted with duplicates.
  return `
    <div class="marquee-chip chip-${color} marquee-chip--${tier}" title="${name}">
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
      <div class="marquee-chip-caption">
        <span class="marquee-chip-badge marquee-chip-badge--${tier}">${tierLabel}</span>
        <span class="marquee-chip-name">${name}</span>
        ${subtitle ? `<span class="marquee-chip-sub">${subtitle}</span>` : ''}
      </div>
    </div>`;
}

/**
 * Renders the compact top-of-page sponsor strip (#sponsorStrip): lead sponsors
 * shown as simple, non-interactive logos with visible names. Gives sponsors
 * early visibility without leading the page with the full partner wall.
 */
function renderSponsorStrip(container, leadSponsors) {
  if (!container || !leadSponsors.length) return;
  container.innerHTML = leadSponsors.map(s => {
    const name = escapeHTML(s.name || '');
    const logoSrc = escapeHTML(s.imgUrl || 'assets/images/south-summit-logo.svg');
    return `
      <span class="sponsor-strip-item" title="${name}">
        <img class="sponsor-strip-logo" src="${logoSrc}" alt="${name}" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
      </span>`;
  }).join('');
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

  // First `list.length` chips are the real, accessible set. Everything after is a
  // visual duplicate purely for the seamless loop — mark those clones aria-hidden
  // and inert so screen readers / keyboard users don't hit repeated entries
  // (QA a11y fix). markClones() tags every chip beyond the first `originalCount`.
  let half = [];
  while (half.length < targetHalfCount) {
    half = half.concat(list);
  }
  const originalCount = list.length;
  const halfHTML = half.map((p, i) => markClone(renderMarqueeChip(p), i >= originalCount)).join('');
  // The second identical half is entirely decorative duplication.
  const cloneHalfHTML = half.map(p => markClone(renderMarqueeChip(p), true)).join('');
  return halfHTML + cloneHalfHTML;
}

/**
 * Marks a marquee chip's outer element as a decorative clone: aria-hidden + not
 * focusable, so duplicated loop items are excluded from the accessibility tree
 * and keyboard sequence.
 */
function markClone(chipHTML, isClone) {
  if (!isClone) return chipHTML;
  return chipHTML.replace(
    /^(\s*)<div class="marquee-chip /,
    '$1<div aria-hidden="true" data-marquee-clone="true" class="marquee-chip is-clone '
  );
}

/**
 * Flip interaction removed (QA fix): sponsor cards and marquee chips are now flat
 * and show names without an interaction. Kept as a no-op export so any external
 * reference stays safe. Hero cards with a real URL are plain links (native
 * keyboard/activation), needing no extra JS.
 */
function initFlipInteraction() {}

export function initSponsors() {
  const quantumGrid = document.getElementById('sponsorsQuantumGrid') || document.getElementById('sponsorsHeroGrid');
  const clusterVenueGrid = document.getElementById('sponsorsClusterVenueGrid') || document.getElementById('sponsorsClusterGrid');
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');

  const quantumSponsors = sponsors.filter(s => s.tier === 'quantum');
  const clusterVenueSponsors = sponsors.filter(s => s.tier === 'cluster' || s.tier === 'venue');
  const proPartners = sponsors.filter(s => s.tier === 'pro');
  const litePartners = sponsors.filter(s => s.tier === 'lite');

  // Compact top-of-page sponsor strip (lead sponsors: quantum + cluster).
  renderSponsorStrip(
    document.getElementById('sponsorStrip'),
    sponsors.filter(s => s.tier === 'quantum' || s.tier === 'cluster')
  );

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


