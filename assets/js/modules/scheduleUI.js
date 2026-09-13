/**
 * scheduleUI.js
 * --------------------------------------------------------------------------
 * Manages the Program Flow (The Running Order) interactive focus mode:
 * - Opens the comprehensive #programFlowModal with full session details
 * - Coordinates with Lenis to freeze background scroll during focus
 * - Supports morning / afternoon block filtering
 * - Connects schedule speaker chips directly to the speaker modal
 */

import { speakers } from '../data/speakers.js';
import { getLenis } from './smoothScroll.js';
import { openSpeakerModal, closeSpeakerModal } from './speakersUI.js';

let isScheduleModalOpen = false;
let closeScheduleTimeout = null;

/* ============================ Schedule Data ============================= */

export const scheduleSessions = [
  // ==================== BLOCK 01: MORNING ====================
  {
    id: 'session-registration',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '9:30 AM – 10:00 AM',
    duration: '30 MIN',
    category: 'REGISTRATION',
    categoryTheme: 'theme-orange',
    title: 'Attendee Registration & Summit Check-In',
    location: 'Biñan People\'s Center · Registration Desk & 2nd Floor Hub',
    description: 'Attendee check-in, Summit ID kit & lanyard distribution, early sponsor booth tours, community hub setup, and interactive photobooth activation.',
    speakerIndices: []
  },
  {
    id: 'session-opening-ceremony',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:00 AM – 10:15 AM',
    duration: '15 MIN',
    category: 'OPENING CEREMONY',
    categoryTheme: 'theme-orange',
    title: 'Opening Ceremony: Invocation, National Anthem & Program',
    location: 'Main Auditorium · 4th Floor',
    description: 'Solemn Invocation, Philippine National Anthem, opening video showcase, and official event kickoff led by the South Summit 2026 hosts and organizing committee.',
    speakerIndices: []
  },
  {
    id: 'session-keynote',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:15 AM – 10:30 AM',
    duration: '15 MIN',
    category: 'OPENING KEYNOTE',
    categoryTheme: 'theme-orange',
    title: 'Opening Keynote: Cloud × AI: Building the Future Together',
    location: 'Main Auditorium · 4th Floor',
    description: 'Welcome Remarks and Opening Keynote by Sir Isaeus "Asi" Guiang (AWS User Groups Leader Philippines), exploring emerging trends in AWS Cloud architecture, developer communities, and applied AI in CALABARZON.',
    speakerIndices: [{ index: 0, role: 'Opening Remarks' }]
  },
  {
    id: 'session-icebreaker',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:30 AM – 11:40 AM',
    duration: '70 MIN',
    category: 'COMMUNITY & ICEBREAKER',
    categoryTheme: 'theme-blue',
    title: 'Community Icebreaker, Audience Engagement & Giveaways',
    location: 'Main Auditorium · 4th Floor',
    description: 'High-energy interactive icebreakers, audience mini-challenges, summit trivia, and partner giveaways led by host Cyphrey Madulid and the emcee team.',
    speakerIndices: []
  },
  {
    id: 'session-talk1',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '11:40 AM – 12:30 PM',
    duration: '50 MIN',
    category: 'BUILDER STORY & TALK #1',
    categoryTheme: 'theme-green',
    title: 'Talk #1: Built by Community: From Student Builder to Tech Professional',
    location: 'Main Auditorium · 4th Floor',
    description: 'Student story from being an AWS Student Builder Group Lead / Captain into a full-fledged technology professional. Includes 40-minute main talk (11:40 AM – 12:20 PM) and a 10-minute audience Q&A session (12:20 PM – 12:30 PM).',
    speakerIndices: [0]
  },

  // ==================== BLOCK 02: AFTERNOON ====================
  {
    id: 'session-lunch',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '12:30 PM – 2:00 PM',
    duration: '90 MIN',
    category: 'LUNCH BREAK',
    categoryTheme: 'theme-orange',
    title: 'Lunch Break, Networking & Hub Experience',
    location: '2nd Floor Hub & Exhibition Hall',
    description: 'Lunch, sponsor and partner booth exploration, hands-on developer challenges, speed mentoring with cloud architects, photobooth, and peer networking.',
    speakerIndices: []
  },
  {
    id: 'session-energizer',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:00 PM – 2:20 PM',
    duration: '20 MIN',
    category: 'ENERGIZER & SPONSOR TALK',
    categoryTheme: 'theme-blue',
    title: 'Afternoon Energizer & Partner Sponsor Spotlight',
    location: 'Main Auditorium · 4th Floor',
    description: 'Audience energizer games, booth challenge updates, sponsor lightning presentations (5 mins each), and exclusive partner swag giveaways.',
    speakerIndices: []
  },
  {
    id: 'session-talk2',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:20 PM – 3:10 PM',
    duration: '50 MIN',
    category: 'WOMEN IN TECH KEYNOTE & TALK #2',
    categoryTheme: 'theme-pink',
    title: 'Talk #2: Building Smarter Systems with AI and Cloud',
    location: 'Main Auditorium · 4th Floor',
    description: 'Flagship Women in Tech keynote on modern architectural patterns, generative AI integration, and scalable cloud solutions on AWS. Includes 40-minute presentation (2:20 PM – 3:00 PM) and 10-minute live Q&A (3:00 PM – 3:10 PM).',
    speakerIndices: [1]
  },
  {
    id: 'session-talk3',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:10 PM – 4:00 PM',
    duration: '50 MIN',
    category: 'AI ADOPTION & TALK #3',
    categoryTheme: 'theme-green',
    title: 'Talk #3: Human in the Loop: Preparing People for an AI-Driven Future',
    location: 'Main Auditorium · 4th Floor',
    description: 'In-depth exploration of organizational AI adoption, workforce readiness, and ethical AI deployment. Includes 40-minute main session (3:10 PM – 3:50 PM) and 10-minute live Q&A (3:50 PM – 4:00 PM).',
    speakerIndices: [2]
  },
  {
    id: 'session-panel',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:00 PM – 4:40 PM',
    duration: '40 MIN',
    category: 'FLAGSHIP PANEL DISCUSSION',
    categoryTheme: 'theme-purple',
    title: 'Panel Discussion: Build. Grow. Lead: How Community Shapes Careers in Tech',
    location: 'Main Auditorium · 4th Floor',
    description: 'Flagship panel featuring AWS Community Leaders, former Student Builder Group Captains, and student tech officers on community leadership and tech career acceleration. Includes 30-minute panel (4:00 PM – 4:30 PM) and 10-minute live Q&A (4:30 PM – 4:40 PM).',
    speakerIndices: [3, 4, 5, 6]
  },
  {
    id: 'session-raffle',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:40 PM – 4:55 PM',
    duration: '15 MIN',
    category: 'GRAND RAFFLE & RECOGNITION',
    categoryTheme: 'theme-pink',
    title: 'Grand Raffle, Sponsor & Partner Appreciation & Closing Remarks',
    location: 'Main Auditorium · 4th Floor',
    description: 'Major raffle prize draws, recognition of industry sponsors, partners, speakers, and volunteer teams, followed by official South Summit Event Director closing remarks.',
    speakerIndices: []
  },
  {
    id: 'session-finale',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:55 PM – 5:30 PM',
    duration: '35 MIN',
    category: 'FINALE & GROUP PHOTO',
    categoryTheme: 'theme-blue',
    title: 'Official Community Group Photo & Hall Egress',
    location: 'Main Auditorium & Grand Stage · 4th Floor',
    description: 'Official South Summit 2026 commemorative group photo with all attendees, speakers, directors, and organizers, followed by hall egress and final networking.',
    speakerIndices: []
  }
];

/* ============================ HTML Builders ============================= */

function renderSpeakerChipHTML(speaker, originalIndex, roleOverride = '') {
  if (!speaker) return '';
  const avatar = speaker.picUrl || 'assets/images/south-summit-logo.svg';
  const name = speaker.name || 'Speaker';
  const isComingSoon = speaker.isComingSoon || name === 'Coming Soon';
  const role = isComingSoon ? '' : (roleOverride || (speaker.role ? speaker.role.split('·')[0].trim() : ''));

  return `
    <div class="pf-speaker-chip${isComingSoon ? ' pf-chip-coming-soon' : ''}" data-speaker-index="${originalIndex}" role="${isComingSoon ? 'presentation' : 'button'}" ${isComingSoon ? '' : 'tabindex="0" '}title="${isComingSoon ? 'Coming Soon' : 'View bio for ' + name}">
      <img src="${avatar}" alt="${name}" class="pf-speaker-chip-avatar${isComingSoon ? ' is-silhouette' : ''}" loading="lazy">
      <div class="pf-speaker-chip-info">
        <span class="pf-speaker-chip-name">${name}</span>
        ${role ? `<span class="pf-speaker-chip-role">${role}</span>` : ''}
      </div>
    </div>
  `;
}

function renderSessionCardHTML(session) {
  const sessionSpeakers = (session.speakerIndices || [])
    .map(item => {
      const idx = (typeof item === 'object' && item !== null) ? item.index : item;
      const roleOverride = (typeof item === 'object' && item !== null) ? item.role : '';
      const spk = speakers[idx];
      return spk ? renderSpeakerChipHTML(spk, idx, roleOverride) : '';
    })
    .filter(Boolean)
    .join('');

  const hasSpeakers = sessionSpeakers.length > 0;
  const shortBlock = session.block === 'morning' ? '01 // MORNING' : '02 // AFTERNOON';

  return `
    <article class="pf-session-card ${session.categoryTheme}" data-block="${session.block}" id="${session.id}">
      <div class="pf-card-content">
        <div class="pf-card-meta-row">
          <div class="pf-card-tags">
            <span class="pf-card-cat-pill">${session.category}</span>
            <span class="pf-card-block-sub">${shortBlock}</span>
          </div>
          <div class="pf-card-time-pill">
            <svg class="pf-time-clock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span class="pf-time-text">${session.time}</span>
            <span class="pf-card-dur">${session.duration}</span>
          </div>
        </div>

        <h4 class="pf-card-title">${session.title}</h4>
        <p class="pf-card-desc">${session.description}</p>

        <div class="pf-card-loc">
          <svg class="pf-loc-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${session.location}</span>
        </div>

        ${hasSpeakers ? `
          <div class="pf-card-speakers-section">
            <span class="pf-speakers-label">Featured Speakers (${session.speakerIndices.length})</span>
            <div class="pf-card-speakers-grid">
              ${sessionSpeakers}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `;
}

/* ============================ Modal Controls ============================ */

export function openScheduleModal(initialFilter = 'all') {
  const modal = document.getElementById('programFlowModal');
  if (!modal) return;

  if (closeScheduleTimeout) {
    clearTimeout(closeScheduleTimeout);
    closeScheduleTimeout = null;
  }
  modal.classList.remove('is-closing', 'closing');

  // Align background pan to show schedule panel in blueprint section
  const section = document.getElementById('program');
  const panel = document.getElementById('blueprintSchedulePanel');
  if (section && panel && document.documentElement.classList.contains('bp-active')) {
    const extra = parseFloat(section.style.getPropertyValue('--bp-extra')) || 0;
    if (extra > 0) {
      let top = 0;
      let node = section;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent;
      }
      const targetScroll = top + extra;
      const lenis = getLenis();
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo({ top: targetScroll });
      }
    }
  }

  isScheduleModalOpen = true;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  // Freeze smooth scroll without jumping
  const lenis = getLenis();
  if (lenis && typeof lenis.stop === 'function') {
    lenis.stop();
  }
  document.documentElement.classList.add('modal-scroll-lock');

  // Set filter
  filterSchedule(initialFilter);

  // Focus close button for accessibility
  requestAnimationFrame(() => {
    const closeBtn = document.getElementById('pfModalClose');
    if (closeBtn) closeBtn.focus();
  });
}

export function closeScheduleModal(options = {}) {
  const modal = document.getElementById('programFlowModal');
  if (!modal || !modal.classList.contains('open') || modal.classList.contains('is-closing')) return;

  isScheduleModalOpen = false;

  const speakerModal = document.getElementById('speakerModal');
  if (speakerModal && speakerModal.classList.contains('open')) {
    closeSpeakerModal(options);
  }

  const finalize = () => {
    if (closeScheduleTimeout) {
      clearTimeout(closeScheduleTimeout);
      closeScheduleTimeout = null;
    }
    modal.classList.remove('open', 'is-closing', 'closing');
    modal.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('modal-scroll-lock');

    const lenis = getLenis();
    if (lenis && typeof lenis.start === 'function') {
      lenis.start();
    }
  };

  if (options.instant || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    finalize();
    return;
  }

  modal.classList.add('is-closing');
  closeScheduleTimeout = setTimeout(finalize, 260);
}

function filterSchedule(filterKey) {
  const modal = document.getElementById('programFlowModal');
  if (!modal) return;

  const filterBtns = modal.querySelectorAll('.pf-filter-btn');
  filterBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-filter') === filterKey;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
  });

  const cards = modal.querySelectorAll('.pf-session-card');
  cards.forEach(card => {
    const cardBlock = card.getAttribute('data-block');
    if (filterKey === 'all' || cardBlock === filterKey) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/* =============================== Setup ================================== */

export function initScheduleUI() {
  const modal = document.getElementById('programFlowModal');
  const modalBody = document.getElementById('pfModalBody');
  const btnFocus = document.getElementById('btnFocusSchedule');
  const triggerContainer = document.getElementById('schedInteractiveTrigger');
  const btnClose = document.getElementById('pfModalClose');
  const btnDone = document.getElementById('pfBtnDone');

  // 1. Populate modal body with rich session cards
  if (modalBody) {
    modalBody.innerHTML = scheduleSessions.map(renderSessionCardHTML).join('');
  }

  // 2. Wire up open triggers
  if (btnFocus) {
    btnFocus.addEventListener('click', (e) => {
      e.stopPropagation();
      openScheduleModal('all');
    });
  }

  if (triggerContainer) {
    triggerContainer.addEventListener('click', (e) => {
      // Allow speaker chips to be clicked without opening schedule modal
      if (e.target.closest('.speaker-inline-card') || e.target.closest('a')) {
        return;
      }
      openScheduleModal('all');
    });

    triggerContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.speaker-inline-card') && !e.target.closest('a')) {
          e.preventDefault();
          openScheduleModal('all');
        }
      }
    });
  }

  // 3. Wire up filter buttons
  if (modal) {
    const filterBtns = modal.querySelectorAll('.pf-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterKey = btn.getAttribute('data-filter') || 'all';
        filterSchedule(filterKey);
      });
    });

    // Wire up speaker chips inside modal
    modal.addEventListener('click', (e) => {
      const chip = e.target.closest('.pf-speaker-chip');
      if (!chip) return;

      const idx = Number(chip.getAttribute('data-speaker-index'));
      if (!Number.isNaN(idx) && speakers[idx]) {
        const spk = speakers[idx];
        if (spk.isComingSoon || spk.name === 'Coming Soon') {
          return;
        }
        // Find parent card theme for matching tile color
        const parentCard = chip.closest('.pf-session-card');
        const themeMatch = parentCard ? parentCard.className.match(/theme-(orange|purple|green|blue|pink)/) : null;
        const theme = themeMatch ? themeMatch[0] : '';
        openSpeakerModal(spk, theme);
      }
    });

    // Close on overlay backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeScheduleModal();
      }
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', closeScheduleModal);
  }

  if (btnDone) {
    btnDone.addEventListener('click', closeScheduleModal);
  }

  // 4. Global keyboard ESC listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isScheduleModalOpen) {
      // Only close schedule modal if speaker modal is not open (or closing) on top of it
      const speakerModal = document.getElementById('speakerModal');
      if (!speakerModal || (!speakerModal.classList.contains('open') && !speakerModal.classList.contains('is-closing'))) {
        closeScheduleModal();
      }
    }
  });

  // 5. Wire up inline block layout switcher (Dual Block / Morning / Afternoon)
  const switcher = document.querySelector('.sched-view-switcher');
  const blocksContainer = document.getElementById('schedBlocksContainer');
  if (switcher && blocksContainer) {
    const tabs = switcher.querySelectorAll('.sched-view-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const view = tab.getAttribute('data-view') || 'both';

        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        blocksContainer.classList.remove('view-morning', 'view-afternoon');
        if (view === 'morning') {
          blocksContainer.classList.add('view-morning');
        } else if (view === 'afternoon') {
          blocksContainer.classList.add('view-afternoon');
        }

        // Notify blueprintScroll to re-measure track width
        window.dispatchEvent(new Event('resize'));
      });
    });
  }

  // Expose helpers globally
  window.openScheduleModal = openScheduleModal;
  window.closeScheduleModal = closeScheduleModal;
  window.getLenis = getLenis;
}
