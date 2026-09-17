/**
 * Sponsors UI Module
 * AWS Student Community Day: South Summit 2026
 * Option 3: Hero Showcase (Spotlight Keystone Cards) + Infinite Marquee Stream
 */
import { sponsors } from '../data/sponsors.js';
import { isLowSpec } from './perfManager.js';

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
  const tierTagLabel = s.tier === 'quantum' ? 'QUANTUM SPONSOR' : 'VENUE PARTNER';

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
    <article class="sponsors-hero-card color-${color}" data-card-color="${color}" data-reveal>
      <div class="hero-card-spotlight" aria-hidden="true"></div>
      <div class="hero-card-top">
        <span class="hero-tier-tag ${s.tier}">${tierTagLabel}</span>
      </div>
      <div class="hero-card-media">
        <div class="hero-logo-frame ${s.tier === 'venue' ? 'emblem' : ''}">
${logoMarkup}
        </div>
      </div>
      <div class="hero-card-body">
        <h3 class="hero-card-title">${name}</h3>
      </div>
    </article>`;
}

function renderMarqueeChip(partner) {
  const name = escapeHTML(partner.name || '');
  const color = partner.color || 'blue';
  const logoSrc = escapeHTML(partner.imgUrl || 'assets/images/south-summit-logo.svg');
  const tier = partner.tier || 'pro';
  const tierLabel = tier === 'pro' ? 'PRO' : 'LITE';

  return `
    <div class="marquee-chip chip-${color} marquee-chip--${tier}" tabindex="0" role="listitem">
      <div class="marquee-chip-logo-wrap">
        <img class="marquee-chip-logo"
             src="${logoSrc}"
             alt="${name}"
             width="28"
             height="28"
             loading="lazy"
             decoding="async"
             onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
      </div>
      <div class="marquee-chip-meta">
        <span class="marquee-chip-name">${name}</span>
      </div>
      <span class="marquee-chip-badge marquee-chip-badge--${tier}">${tierLabel}</span>
    </div>`;
}

function initSpotlightEffect() {
  if (isLowSpec() || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.sponsors-hero-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
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
 * Builds seamless duplicate marquee HTML ensuring enough items to fill ultra-wide viewports
 */
function buildMarqueeLoopHTML(list, minCount = 10) {
  if (!list || list.length === 0) return '';
  let items = [...list];
  while (items.length < minCount) {
    items = items.concat(list);
  }
  const chunk = items.map(renderMarqueeChip).join('');
  return chunk + chunk;
}

export function initSponsors() {
  const heroGrid = document.getElementById('sponsorsHeroGrid');
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');

  const headlineSponsors = sponsors.filter(s => s.tier === 'quantum' || s.tier === 'venue');
  const proPartners = sponsors.filter(s => s.tier === 'pro');
  const litePartners = sponsors.filter(s => s.tier === 'lite');

  // 1. Render Hero Showcase Cards if container exists
  if (heroGrid && headlineSponsors.length > 0) {
    heroGrid.innerHTML = headlineSponsors.map(renderHeroCard).join('');
    wireLogoFallbacks(heroGrid);
    initSpotlightEffect();
  }

  // 2. Populate and duplicate Marquee tracks by category
  // Track 1: Pro Partners (Marquee Left)
  if (track1 && proPartners.length > 0) {
    track1.innerHTML = buildMarqueeLoopHTML(proPartners, 10);
    wireLogoFallbacks(track1);
  }

  // Track 2: Lite Partners (Marquee Right)
  if (track2 && litePartners.length > 0) {
    track2.innerHTML = buildMarqueeLoopHTML(litePartners, 10);
    wireLogoFallbacks(track2);
  }
}

