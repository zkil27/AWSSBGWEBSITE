/**
 * AWS Student Community Day: South Summit 2026
 * Directors UI Module
 * Renders the organizing committee directors and handles department filtering.
 */

import { directors } from '../data/directors.js';
import { isLowSpec } from './perfManager.js';

/**
 * Generate 2-letter monogram initials from a person's full name.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  if (!name) return 'SCD';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  // First initial and last initial
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Renders a single director card markup.
 * @param {import('../data/directors.js').Director} d
 * @returns {string}
 */
function directorCardHTML(d) {
  const initials = getInitials(d.name);
  const deptLower = d.department.toLowerCase();
  const isAssoc = d.role.toLowerCase().includes('assoc');
  const isSecretary = d.role.toLowerCase().includes('secretary');
  const roleType = isAssoc ? 'ASSOCIATE' : isSecretary ? 'SECRETARY' : 'DIRECTOR';

  const avatarMarkup = d.avatar
    ? `<img class="director-avatar-img" src="${d.avatar}" alt="${d.name}" width="50" height="50" loading="lazy" decoding="async" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">
       <div class="director-monogram" aria-hidden="true" style="display:none; --dept-accent: var(${d.accentColor || '--blue'});">
         <span class="monogram-text">${initials}</span>
       </div>`
    : `<div class="director-monogram" aria-hidden="true" style="--dept-accent: var(${d.accentColor || '--blue'});">
         <span class="monogram-text">${initials}</span>
       </div>`;

  return `
    <article class="director-card dept-${deptLower}" data-id="${d.id}" data-dept="${deptLower}" aria-label="${d.name}, ${d.role}">
      <div class="director-card-top">
        <span class="director-badge dept-badge-${d.deptTag.toLowerCase()}">${d.deptTag}</span>
        <span class="director-role-badge ${roleType.toLowerCase()}">${roleType}</span>
      </div>

      <div class="director-header-block">
        <div class="director-avatar-frame">
          ${avatarMarkup}
        </div>
        <div class="director-identity">
          <h3 class="director-name" title="${d.name}">${d.name}</h3>
          <span class="director-role-title">${d.role}</span>
          <span class="director-dept-label">${d.department} Team</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Setup magnetic cursor gravity and 3D proximity tilt on cards.
 * When the user moves their cursor anywhere in the empty space, cards within
 * proximity tilt smoothly to "look" toward the cursor.
 */
function initMagneticTilt(container) {
  if (typeof window === 'undefined') return;
  if (isLowSpec()) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const section = container.closest('#about-directors') || container.parentElement;
  if (!section || section.dataset.magneticTiltActive) return;
  section.dataset.magneticTiltActive = 'true';

  let rafId = null;
  let mouse = { x: -1000, y: -1000, active: false };
  let cardCache = [];
  let cacheDirty = true;

  function refreshCardCache() {
    const cards = container.querySelectorAll('.director-card:not(.is-filtered-out)');
    cardCache = Array.from(cards).map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        card,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2
      };
    });
    cacheDirty = false;
  }

  function invalidateCache() {
    cacheDirty = true;
  }

  container.__invalidateTiltCache = invalidateCache;
  window.addEventListener('scroll', invalidateCache, { passive: true });
  window.addEventListener('resize', invalidateCache, { passive: true });

  function updateCardTilts() {
    rafId = null;
    if (!mouse.active) {
      const cards = container.querySelectorAll('.director-card');
      cards.forEach((c) => {
        if (c.style.transform) c.style.transform = '';
      });
      return;
    }

    if (cacheDirty) {
      refreshCardCache();
    }

    for (let i = 0; i < cardCache.length; i++) {
      const item = cardCache[i];
      const dx = mouse.x - item.cx;
      const dy = mouse.y - item.cy;
      const dist = Math.hypot(dx, dy);

      // Proximity threshold: 420px
      if (dist < 420) {
        const factor = 1 - dist / 420;
        const rotX = (-dy / 420) * 12 * factor;
        const rotY = (dx / 420) * 12 * factor;
        const lift = 3 * factor;
        item.card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-${lift.toFixed(1)}px)`;
      } else if (item.card.style.transform) {
        item.card.style.transform = '';
      }
    }
  }

  section.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    if (!rafId) {
      rafId = requestAnimationFrame(updateCardTilts);
    }
  }, { passive: true });

  section.addEventListener('mouseleave', () => {
    mouse.active = false;
    if (!rafId) {
      rafId = requestAnimationFrame(updateCardTilts);
    }
  });
}

/**
 * Initialize Directors section with 4x4 Balanced Hex Mesh,
 * magnetic 3D proximity tilt, and dynamic department filtering.
 */
export function initDirectors() {
  const gridContainers = [
    {
      section: document.getElementById('about-directors') || document.getElementById('card-directors'),
      grid: document.getElementById('directorsGrid'),
      filterBar: document.getElementById('directorsFilterBar')
    },
    {
      section: document.getElementById('core-team'),
      grid: document.getElementById('homeDirectorsGrid'),
      filterBar: document.querySelector('#core-team .directors-filter-bar')
    }
  ];

  const rowsIndices = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]
  ];

  gridContainers.forEach(({ section, grid, filterBar }) => {
    if (!grid) return;

    if (section) {
      const existingField = section.querySelector('.ambient-particle-field');
      if (existingField) existingField.remove();
    }

    grid.classList.add('hive-container');
    grid.innerHTML = rowsIndices.map((rowArr, rowIndex) => {
      const cardsHTML = rowArr
        .map((idx) => (directors[idx] ? directorCardHTML(directors[idx]) : ''))
        .join('');
      return `<div class="hive-row" data-hive-row="${rowIndex + 1}">${cardsHTML}</div>`;
    }).join('');

    initMagneticTilt(grid);

    const lockGridHeight = () => {
      if (!grid) return;
      const measuredHeight = grid.scrollHeight || grid.offsetHeight;
      if (measuredHeight > 300) {
        grid.style.minHeight = `${Math.max(580, measuredHeight)}px`;
      }
    };

    requestAnimationFrame(lockGridHeight);

    window.addEventListener('resize', () => {
      const allPill = filterBar?.querySelector('.director-filter-pill[data-target="all"]');
      if (allPill && allPill.classList.contains('active')) {
        grid.style.minHeight = '';
        requestAnimationFrame(lockGridHeight);
      }
    });

    if (section && section.closest('#card-directors')) {
      const cardDirectors = section.closest('#card-directors');
      const cardTab = cardDirectors.querySelector('.sb-card-tab');
      if (cardTab) {
        cardTab.addEventListener('click', () => {
          setTimeout(lockGridHeight, 120);
        });
      }

      if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((m) => {
            if (m.attributeName === 'class' && cardDirectors.classList.contains('is-active')) {
              requestAnimationFrame(lockGridHeight);
            }
          });
        });
        observer.observe(cardDirectors, { attributes: true, attributeFilter: ['class'] });
      }
    }

    const pills = filterBar ? filterBar.querySelectorAll('.director-filter-pill') : [];
    if (pills.length > 0) {
      let isFiltering = false;

      pills.forEach((pill) => {
        pill.addEventListener('click', () => {
          if (isFiltering) return;
          const target = pill.getAttribute('data-target') || 'all';
          if (pill.classList.contains('active')) return;

          const currentH = grid.scrollHeight || grid.offsetHeight;
          if (currentH > 300 && (!grid.style.minHeight || parseInt(grid.style.minHeight, 10) < currentH)) {
            grid.style.minHeight = `${Math.max(580, currentH)}px`;
          }

          pills.forEach((p) => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');

          if (window.gsap) {
            window.gsap.fromTo(pill, { scale: 0.95 }, { scale: 1, duration: 0.22, ease: 'power2.out', clearProps: 'scale' });
          }

          const allCards = Array.from(grid.querySelectorAll('.director-card'));
          const currentlyVisible = allCards.filter(
            (c) => !c.classList.contains('is-filtered-out') && c.style.display !== 'none'
          );

          const applyDOMFilter = () => {
            allCards.forEach((card) => {
              const cardDept = card.getAttribute('data-dept');
              if (target === 'all' || cardDept === target) {
                card.classList.remove('is-filtered-out');
                card.style.display = '';
                card.removeAttribute('hidden');
              } else {
                card.classList.add('is-filtered-out');
                card.style.display = 'none';
                card.setAttribute('hidden', '');
              }
            });

            const rows = grid.querySelectorAll('.hive-row');
            if (target === 'all') {
              grid.classList.remove('is-filtered');
              rows.forEach((row) => {
                row.style.display = '';
              });
            } else {
              grid.classList.add('is-filtered');
              rows.forEach((row) => {
                const visibleCount = row.querySelectorAll('.director-card:not(.is-filtered-out)').length;
                row.style.display = visibleCount > 0 ? 'flex' : 'none';
              });
            }

            grid.__invalidateTiltCache?.();

            const incomingCards = allCards.filter((c) => !c.classList.contains('is-filtered-out'));

            if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !isLowSpec()) {
              window.gsap.fromTo(
                incomingCards,
                {
                  opacity: 0,
                  scale: 0.98,
                  y: 8,
                  filter: 'blur(5px)'
                },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  duration: 0.28,
                  stagger: 0.02,
                  ease: 'power3.out',
                  onComplete: () => {
                    isFiltering = false;
                    if (window.gsap) {
                      window.gsap.set(incomingCards, { clearProps: 'transform,opacity,scale,filter,y' });
                    }
                  }
                }
              );
            } else {
              isFiltering = false;
            }
          };

          if (
            currentlyVisible.length > 0 &&
            window.gsap &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
            !isLowSpec()
          ) {
            isFiltering = true;
            window.gsap.to(currentlyVisible, {
              opacity: 0,
              scale: 0.98,
              y: -6,
              filter: 'blur(4px)',
              duration: 0.14,
              stagger: 0.012,
              ease: 'power2.in',
              onComplete: applyDOMFilter
            });
          } else {
            applyDOMFilter();
          }
        });
      });
    }
  });
}
