/**
 * Chapters UI Module
 * Renders the participating AWS Student Builder Group chapter cards
 * in collectible player/trading card style with name on top, picture in middle,
 * and social media links at the bottom.
 */
import { chapters } from '../data/chapters.js';

function escapeHTML(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function chapterCardHTML(c) {
    const rawName = c.name || 'AWS Student Builder Group';
    const name = escapeHTML(rawName);
    const university = escapeHTML(c.university || c.uni || 'CALABARZON Campus');
    const logoSrc = escapeHTML(c.imgUrl || 'assets/images/south-summit-logo.svg');

    // '#' + target=_blank opened a duplicate tab, so leave those as plain icons
    const social = (url, label, icon) => {
        const live = url && url !== '#';
        return live
            ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener" aria-label="${label}" class="chapter-social-btn" title="${label}">
          <svg width="15" height="15"><use href="#${icon}"></use></svg>
        </a>`
            : `<span class="chapter-social-soon" aria-label="${label} — coming soon" title="Coming soon">
          <svg width="15" height="15"><use href="#${icon}"></use></svg>
        </span>`;
    };

    return `
    <div class="chapter-card" data-no-split="true">
      <!-- 1. Top Header: Name of the Org on Top (Player Plate) -->
      <div class="chapter-card-header">
        <div class="chapter-header-bevel" aria-hidden="true"></div>
        <h4 class="chapter-org-name" title="${name}">${name}</h4>
      </div>

      <!-- 2. Middle: Picture / Media Frame -->
      <div class="chapter-card-viewport">
        <div class="chapter-media-frame">
          <img class="chapter-media-logo"
               src="${logoSrc}"
               alt="${name} Logo"
               loading="lazy"
               decoding="async"
               onerror="this.onerror=null;this.src='assets/images/south-summit-logo.svg';">
        </div>
        <!-- Decorative notch pips matching reference card divider -->
        <div class="chapter-deco-notch" aria-hidden="true">
          <span class="notch-pip"></span>
          <span class="notch-pip"></span>
          <span class="notch-pip notch-pip--center"></span>
          <span class="notch-pip"></span>
          <span class="notch-pip"></span>
        </div>
      </div>

      <!-- 3. Bottom: University Info & Facebook Link -->
      <div class="chapter-card-footer">
        <div class="chapter-meta-tag">
          <span class="chapter-uni-label">${university}</span>
        </div>
        <div class="chapter-socials" aria-label="${name} social links">
          ${social(c.facebookUrl, `${rawName} Facebook`, 'fb-icon')}
        </div>
      </div>
    </div>
  `;
}

export function initChapters() {
    const chapterGrid = document.getElementById('chapterGrid');
    if (!chapterGrid) return;

    chapterGrid.innerHTML = chapters.map(chapterCardHTML).join('');
}

