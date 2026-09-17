/**
 * AWS Student Community Day: South Summit 2026
 * Directors UI Module
 * Renders the organizing committee directors and handles department filtering.
 */

import { directors } from '../data/directors.js';

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
          <h4 class="director-name" title="${d.name}">${d.name}</h4>
          <span class="director-role-title">${d.role}</span>
          <span class="director-dept-label">${d.department} Directorate</span>
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
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const section = container.closest('#about-directors') || container.parentElement;
  if (!section || section.dataset.magneticTiltActive) return;
  section.dataset.magneticTiltActive = 'true';

  let rafId = null;
  let mouse = { x: -1000, y: -1000, active: false };

  function updateCardTilts() {
    rafId = null;
    const cards = container.querySelectorAll('.director-card:not(.is-filtered-out)');
    if (!mouse.active) {
      cards.forEach((c) => {
        if (c.style.transform) c.style.transform = '';
      });
      return;
    }

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const dx = mouse.x - cardCenterX;
      const dy = mouse.y - cardCenterY;
      const dist = Math.hypot(dx, dy);

      // Proximity threshold: 420px
      if (dist < 420) {
        const factor = 1 - dist / 420;
        const rotX = (-dy / 420) * 12 * factor;
        const rotY = (dx / 420) * 12 * factor;
        const lift = 3 * factor;
        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-${lift.toFixed(1)}px)`;
      } else if (card.style.transform) {
        card.style.transform = '';
      }
    });
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
  const directorsGrid = document.getElementById('directorsGrid');
  if (!directorsGrid) return;

  // Clean up any existing ambient particle field
  const parentSection = directorsGrid.closest('#about-directors') || directorsGrid.parentElement;
  if (parentSection) {
    const existingField = parentSection.querySelector('.ambient-particle-field');
    if (existingField) existingField.remove();
  }

  // 4 x 4 Balanced Hex Mesh Partition (16 directors)
  // Row 1: Executive 4 (JR, HT, AP, RB)
  // Row 2: Tech 2 + Creatives 2 (ET, AN, MS, AV)
  // Row 3: Ops 2 + Marketing 2 (SB, RC, JL, BB)
  // Row 4: Relations 2 + Finance 2 (QS, JLO, JM, CL)
  const rowsIndices = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15]
  ];

  directorsGrid.classList.add('hive-container');
  directorsGrid.innerHTML = rowsIndices.map((rowArr, rowIndex) => {
    const cardsHTML = rowArr
      .map((idx) => (directors[idx] ? directorCardHTML(directors[idx]) : ''))
      .join('');
    return `<div class="hive-row" data-hive-row="${rowIndex + 1}">${cardsHTML}</div>`;
  }).join('');

  // Initialize magnetic tilt physics
  initMagneticTilt(directorsGrid);

  // Lock grid minimum height to full 4-row height so switching filter tabs never shrinks container or pulls footer up
  const lockGridHeight = () => {
    if (!directorsGrid) return;
    const measuredHeight = directorsGrid.scrollHeight || directorsGrid.offsetHeight;
    if (measuredHeight > 300) {
      directorsGrid.style.minHeight = `${Math.max(580, measuredHeight)}px`;
    }
  };

  requestAnimationFrame(lockGridHeight);

  // Re-measure when window resizes and All is active
  window.addEventListener('resize', () => {
    const allPill = document.querySelector('.director-filter-pill[data-target="all"]');
    if (allPill && allPill.classList.contains('active')) {
      directorsGrid.style.minHeight = '';
      requestAnimationFrame(lockGridHeight);
    }
  });

  // Ensure grid height recalibrates accurately when Leadership accordion opens
  const cardDirectors = document.getElementById('card-directors');
  if (cardDirectors) {
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

  // Setup department filter tabs with tactile micro-press & Linear micro-depth card motion
  const filterPills = document.querySelectorAll('.director-filter-pill');
  if (filterPills.length > 0) {
    let isFiltering = false;

    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        if (isFiltering) return;
        const target = pill.getAttribute('data-target') || 'all';
        if (pill.classList.contains('active')) return;

        // Ensure grid min-height is locked before switching tabs so footer never jumps
        const currentH = directorsGrid.scrollHeight || directorsGrid.offsetHeight;
        if (currentH > 300 && (!directorsGrid.style.minHeight || parseInt(directorsGrid.style.minHeight, 10) < currentH)) {
          directorsGrid.style.minHeight = `${Math.max(580, currentH)}px`;
        }

        // Update active tab state
        filterPills.forEach((p) => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        // Tactile micro-press feedback on the clicked pill
        if (window.gsap) {
          window.gsap.fromTo(pill, { scale: 0.94 }, { scale: 1, duration: 0.2, ease: 'power2.out' });
        }

        const allCards = Array.from(directorsGrid.querySelectorAll('.director-card'));
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

          // Toggle hive rows and stagger offset depending on filter
          const rows = directorsGrid.querySelectorAll('.hive-row');
          if (target === 'all') {
            directorsGrid.classList.remove('is-filtered');
            rows.forEach((row) => {
              row.style.display = '';
            });
          } else {
            directorsGrid.classList.add('is-filtered');
            rows.forEach((row) => {
              const visibleCount = row.querySelectorAll('.director-card:not(.is-filtered-out)').length;
              row.style.display = visibleCount > 0 ? 'flex' : 'none';
            });
          }

          const incomingCards = allCards.filter((c) => !c.classList.contains('is-filtered-out'));

          if (window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Option 1: Linear Studio Switch - Calibrated micro-depth focus arrival
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
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          isFiltering = true;
          // Option 1: Linear Studio Switch - Swift aperture dissolve with micro-depth
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
}
