/**
 * scheduleUI.js
 * --------------------------------------------------------------------------
 * Manages the Program Flow (The Running Order) inline view:
 * - Supports morning / afternoon / dual block filtering in the blueprint panel
 * - Keeps safe no-op modal controls for backward compatibility
 */

import { getLenis } from './smoothScroll.js';
import { speakers } from '../data/speakers.js';

/* ============================ Schedule Data ============================= */

export const scheduleSessions = [
  // ==================== BLOCK 01: MORNING (9:30 AM – 12:30 PM) ====================
  {
    id: 'session-registration',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '9:30 AM – 10:00 AM',
    duration: '30 MIN',
    category: 'REGISTRATION',
    categoryTheme: 'theme-orange',
    title: 'Registration',
    location: 'Summit Registration Desk · Biñan People\'s Center',
    description: 'Attendee check-in and registration, Summit kit distribution, peer networking, and sponsor booth exploration.',
    speakerIndices: []
  },
  {
    id: 'session-opening-ceremony',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:00 AM – 10:15 AM',
    duration: '15 MIN',
    category: 'OPENING CEREMONY',
    categoryTheme: 'theme-orange',
    title: 'Opening Ceremony',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Solemn Invocation, Philippine National Anthem, and official Opening Program led by summit hosts and organizers.',
    speakerIndices: []
  },
  {
    id: 'session-opening-keynote',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:15 AM – 10:30 AM',
    duration: '15 MIN',
    category: 'OPENING KEYNOTE',
    categoryTheme: 'theme-orange',
    title: 'Opening Keynote: Cloud × AI: Building the Future Together',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Welcome Remarks & Opening Keynote on Cloud × AI: Building the Future Together by AWS Philippines Representative / AWS Leader (Backup: Sir Isaeus "Asi" Guiang).',
    speakerIndices: []
  },
  {
    id: 'session-icebreaker',
    type: 'break',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:30 AM – 11:40 AM',
    duration: '70 MIN',
    category: 'AUDIENCE ENGAGEMENT & GIVEAWAYS',
    categoryTheme: 'theme-blue',
    title: 'Icebreaker: Audience Engagement & Giveaways',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'High-energy community icebreaker, audience engagement challenges, and summit giveaways led by hosts (Cyphrey Madulid).',
    speakerIndices: []
  },
  {
    id: 'session-talk1',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '11:40 AM – 12:30 PM',
    duration: '50 MIN',
    category: 'STUDENT SUCCESS STORY & TALK #1',
    categoryTheme: 'theme-green',
    title: 'Talk #1: Built by Community: From Student Builder to Tech Professional',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Student story from being an AWS Student Builder Group Lead / Former Captain into a Tech Professional delivered by Sir Isaeus "Asi" Guiang (Backup: Sir Mark Achiles Flores Jr., Sir Mark Anthony Hernandez). Main talk: 11:40 AM – 12:20 PM (40m), Live Q&A: 12:20 PM – 12:30 PM (10m).',
    speakerIndices: [0]
  },

  // ==================== BLOCK 02: AFTERNOON (12:30 PM – 6:00 PM) ====================
  {
    id: 'session-lunch',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '12:30 PM – 2:00 PM',
    duration: '90 MIN',
    category: 'LUNCH & COMMUNITY HUB',
    categoryTheme: 'theme-orange',
    title: 'Lunch, Networking & Community Hub Experience',
    location: 'South Summit Community Hub & Exhibition Hall',
    description: 'Lunch, partner & sponsor booth exploration, developer showcases, speed networking, photobooth, and community interaction.',
    speakerIndices: []
  },
  {
    id: 'session-afternoon-energizer',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:00 PM – 2:20 PM',
    duration: '20 MIN',
    category: 'AFTERNOON ENERGIZER & SPONSOR TALK',
    categoryTheme: 'theme-blue',
    title: 'Afternoon Energizer / Sponsor’s Talk Slot',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Icebreaker, booth challenge updates, and giveaways (2:00 PM – 2:10 PM). Followed by sponsor presentations (up to 2 sponsors, 5 mins each; 2:10 PM – 2:20 PM).',
    speakerIndices: []
  },
  {
    id: 'session-talk2',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:20 PM – 3:10 PM',
    duration: '50 MIN',
    category: 'WOMEN IN TECH KEYNOTE & TALK #2',
    categoryTheme: 'theme-pink',
    title: 'Talk #2: Building Smarter Systems with AI and Cloud',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Women in Tech Keynote delivered by Ms. Trisha Pelagio (Solutions Architect, AWS; Backup: Ms. Jen Arroyo, Ms. Uriel Alonso). Main talk: 2:20 PM – 3:00 PM (40m), Live Q&A: 3:00 PM – 3:10 PM (10m).',
    speakerIndices: [1]
  },
  {
    id: 'session-talk3',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:10 PM – 4:00 PM',
    duration: '50 MIN',
    category: 'AI ADOPTION SESSION & TALK #3',
    categoryTheme: 'theme-purple',
    title: 'Talk #3: Human in the Loop: Preparing People for an AI-Driven Future',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'AI Adoption Session delivered by Sir Kevin Ventura (Senior Engineering Manager, Stratpoint; Backup: Ms. Joanne De Guzman, Mr. David Marquez). Main talk: 3:10 PM – 3:50 PM (40m), Live Q&A: 3:50 PM – 4:00 PM (10m).',
    speakerIndices: [2]
  },
  {
    id: 'session-flagship-panel',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:00 PM – 4:40 PM',
    duration: '40 MIN',
    category: 'FLAGSHIP PANEL DISCUSSION',
    categoryTheme: 'theme-purple',
    title: 'Panel Discussion: Build. Grow. Lead: How Community Shapes Careers in Tech',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Flagship panel discussion with AWS Community Leaders and former AWS Student Builder Group Captains: Ms. Gaile Espinosa, Ms. Nina Comia, Mr. Jared Remulta (Backup: Ms. Kimi Villareal, Sir Mark Anthony Hernandez, Sir Danmel Laranga). Main talk: 4:00 PM – 4:30 PM (30m), Live Q&A: 4:30 PM – 4:40 PM (10m).',
    speakerIndices: [4, 5, 3]
  },
  {
    id: 'session-grand-raffle',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:40 PM – 4:50 PM',
    duration: '10 MIN',
    category: 'GRAND RAFFLE & APPRECIATION',
    categoryTheme: 'theme-pink',
    title: 'Grand Raffle + Sponsor & Partner Appreciation',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Major raffle prize giveaways, sponsor and partner recognition, and community volunteer appreciation led by hosts.',
    speakerIndices: []
  },
  {
    id: 'session-closing-remarks',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:50 PM – 4:55 PM',
    duration: '5 MIN',
    category: 'CLOSING REMARKS',
    categoryTheme: 'theme-orange',
    title: 'Closing Remarks',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Official summit closing remarks delivered by South Summit Event Director, celebrating speakers, volunteers, and guest community members.',
    speakerIndices: []
  },
  {
    id: 'session-egress',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:55 PM – 5:00 PM',
    duration: '5 MIN',
    category: 'STAGE EGRESS',
    categoryTheme: 'theme-blue',
    title: 'Egress',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Stage transition, attendee guidance, and preparations for the official group photo.',
    speakerIndices: []
  },
  {
    id: 'session-group-photo',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '5:00 PM – 5:30 PM',
    duration: '30 MIN',
    category: 'GROUP PHOTO & FINALE',
    categoryTheme: 'theme-blue',
    title: 'Group Photo',
    location: 'Summit Stage · Biñan People\'s Center',
    description: 'Closing acknowledgments and official summit group photo with attendees, organizers, speakers, and community partners.',
    speakerIndices: []
  },
  {
    id: 'session-venue-cleanup',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '5:30 PM – 6:00 PM',
    duration: '30 MIN',
    category: 'VENUE CLEANUP',
    categoryTheme: 'theme-orange',
    title: 'Venue Cleanup',
    location: 'Summit Stage & South Summit Community Hub',
    description: 'Organizer and volunteer packdown, equipment egress, and venue turnover across Summit Stage and South Summit Community Hub.',
    speakerIndices: []
  }
];

/* ============================ Schedule Integrity Validation ============================ */

/**
 * Parse a "9:30 AM – 10:00 AM" style range into { startMin, endMin } minutes-from-midnight.
 * Returns null when the range can't be parsed so validation can flag it.
 */
function parseTimeRange(range) {
  if (typeof range !== 'string') return null;
  // Normalise the en dash / hyphen separators.
  const parts = range.split(/–|—|-/).map(s => s.trim());
  if (parts.length !== 2) return null;
  const toMinutes = (t) => {
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    let hour = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const mer = m[3].toUpperCase();
    if (mer === 'PM' && hour !== 12) hour += 12;
    if (mer === 'AM' && hour === 12) hour = 0;
    return hour * 60 + min;
  };
  const startMin = toMinutes(parts[0]);
  const endMin = toMinutes(parts[1]);
  if (startMin == null || endMin == null) return null;
  return { startMin, endMin };
}

/**
 * Dev-only sanity check: every session's end time must equal the next session's
 * start time (no unexplained gaps or overlaps) and the last session must end at
 * 6:00 PM (18:00). Warnings only — never throws, so production rendering is never
 * blocked. Runs against the exported scheduleSessions.
 */
export function assertScheduleContiguity(sessions = scheduleSessions) {
  const problems = [];
  const EXPECTED_END_MIN = 18 * 60; // 6:00 PM

  let prevEnd = null;
  sessions.forEach((s, i) => {
    const parsed = parseTimeRange(s.time);
    if (!parsed) {
      problems.push(`[${i}] "${s.id}" has an unparseable time: "${s.time}"`);
      return;
    }
    if (prevEnd != null && parsed.startMin !== prevEnd) {
      const gap = parsed.startMin - prevEnd;
      problems.push(
        `[${i}] "${s.id}" starts at ${s.time.split(/–|—|-/)[0].trim()} but previous session ended ${gap > 0 ? gap + ' min earlier (gap)' : Math.abs(gap) + ' min later (overlap)'}`
      );
    }
    prevEnd = parsed.endMin;
  });

  if (prevEnd != null && prevEnd !== EXPECTED_END_MIN) {
    problems.push(`Last session ends at ${prevEnd / 60}:00-ish, expected 6:00 PM (18:00).`);
  }

  if (problems.length) {
    console.warn('[scheduleUI] Schedule integrity check found issues:\n' + problems.join('\n'));
    return false;
  }
  return true;
}

/* ============================ Modal Controls (No-op Safe Stubs) ============================ */

export function openScheduleModal() {}
export function closeScheduleModal() {}

/* =============================== Setup ================================== */

/* ============================ Timetable Rendering ============================ */

/**
 * Escape a string for safe insertion as HTML text content.
 */
function escapeHTML(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Resolve the speaker chip markup for a session's speakerIndices.
 * Supports both plain indices ([0]) and objects ([{ index: 0, role: '...' }]).
 * Returns '' when there are no speakers so the placeholder div stays empty.
 */
function renderSpeakerChips(speakerIndices) {
  if (!Array.isArray(speakerIndices) || !speakerIndices.length) return '';
  return speakerIndices.map(entry => {
    const idx = typeof entry === 'object' && entry !== null ? entry.index : entry;
    const sp = speakers[idx];
    if (!sp) return '';
    const fallback = 'assets/images/south-summit-logo.svg';
    const pic = sp.picUrl || fallback;
    // Reuse the established .speaker-inline-card chip design (avatar + name).
    return `<span class="speaker-inline-card" title="${escapeHTML(sp.name)}">
      <img class="speaker-inline-avatar" src="${escapeHTML(pic)}" alt="" width="20" height="20" loading="lazy" decoding="async" onerror="this.src='${fallback}'">
      <span class="speaker-inline-name">${escapeHTML(sp.name)}</span>
    </span>`;
  }).join('');
}

/**
 * Split "9:30 AM – 10:00 AM" into just the start label ("9:30 AM") for the
 * compact time column, matching the previous hardcoded markup.
 */
function startLabel(time) {
  if (typeof time !== 'string') return '';
  return time.split(/–|—|-/)[0].trim();
}

/**
 * Build a single .sched-row from a session object, preserving the exact DOM
 * shape the CSS and blueprintScroll.js depend on:
 *   .sched-row > .time(.t-val + .t-dur) + .what(.what-header>b, span, .sched-speakers-inline)
 * Breaks get an explicit "BREAK" marker so they never read as unexplained gaps.
 */
function renderRow(session) {
  const isBreak = session.type === 'break';
  const chips = renderSpeakerChips(session.speakerIndices);
  const breakTag = isBreak
    ? '<span class="sched-break-tag" aria-label="Scheduled break">BREAK</span> '
    : '';
  // Prefer a concise headline; fall back to the category.
  const headline = escapeHTML(session.title || session.category || '');
  const subline = session.category && session.title
    ? escapeHTML(session.category)
    : escapeHTML(session.description || '');

  return `
    <div class="sched-row${isBreak ? ' is-break' : ''}" data-session-id="${escapeHTML(session.id)}" data-type="${escapeHTML(session.type || 'session')}">
      <div class="time">
        <span class="t-val">${escapeHTML(startLabel(session.time))}</span>
        <span class="t-dur">${escapeHTML(session.duration || '')}</span>
      </div>
      <div class="what">
        <div class="what-header"><b>${breakTag}${headline}</b></div>
        <span>${subline}</span>
        ${chips ? `<div class="sched-speakers-inline">${chips}</div>` : ''}
      </div>
    </div>`;
}

/**
 * Render the full timetable from scheduleSessions into the morning/afternoon
 * block containers. Idempotent — safe to call more than once.
 */
export function renderSchedule() {
  const morningRows = document.querySelector('#schedBlocksContainer .block-morning .sched-block-rows');
  const afternoonRows = document.querySelector('#schedBlocksContainer .block-afternoon .sched-block-rows');
  if (!morningRows || !afternoonRows) return false;

  const morning = scheduleSessions.filter(s => s.block === 'morning');
  const afternoon = scheduleSessions.filter(s => s.block === 'afternoon');

  morningRows.innerHTML = morning.map(renderRow).join('');
  afternoonRows.innerHTML = afternoon.map(renderRow).join('');

  // Keep the block time-range headers in sync with the reconciled data.
  const morningRange = document.querySelector('#schedBlocksContainer .block-morning .sched-block-time-range');
  const afternoonRange = document.querySelector('#schedBlocksContainer .block-afternoon .sched-block-time-range');
  if (morningRange && morning.length) {
    morningRange.textContent = `${startLabel(morning[0].time)} – ${morning[morning.length - 1].time.split(/–|—|-/)[1].trim()}`;
  }
  if (afternoonRange && afternoon.length) {
    afternoonRange.textContent = `${startLabel(afternoon[0].time)} – ${afternoon[afternoon.length - 1].time.split(/–|—|-/)[1].trim()}`;
  }

  return true;
}

/* =============================== Setup ================================== */

export function initScheduleUI() {
  // Render the visible timetable from the single-source-of-truth data BEFORE
  // wiring the switcher, so blueprintScroll.js measures the real track width.
  renderSchedule();

  // Dev-only integrity check (warns in console, never throws).
  assertScheduleContiguity();

  // Wire up inline block layout switcher (Dual Block / Morning / Afternoon)
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
