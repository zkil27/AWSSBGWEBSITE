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
  // ==================== BLOCK 01: MORNING ====================
  // NOTE: Reconciled to canonical docs/EVENT_GUIDELINES.md — the day now ends at
  // 5:00 PM (was 5:30 PM). Every entry declares an explicit `type`
  // ('session' | 'break') so breaks/interstitials render with a clear label
  // instead of reading as an unexplained gap. Blocks are contiguous: each entry's
  // end time equals the next entry's start time (validated at render time in
  // initScheduleUI via assertScheduleContiguity).
  {
    id: 'session-registration',
    type: 'session',
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
    type: 'session',
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
    type: 'session',
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
    // Previously an untyped 70-min "session" that the QA review read as an
    // unexplained gap between the 15-min keynote and Talk #1. Now explicitly a
    // typed `break`/interstitial so the running order is unambiguous.
    id: 'session-icebreaker',
    type: 'break',
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
    type: 'session',
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
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '12:30 PM – 2:00 PM',
    duration: '90 MIN',
    category: 'LUNCH BREAK',
    categoryTheme: 'theme-orange',
    title: 'Lunch Break, Networking & Hub Experience',
    location: '2nd Floor Hub & Exhibition Hall',
    description: 'Lunch, sponsor and partner booth exploration, developer showcases, speed mentoring with cloud architects, photobooth, and peer networking.',
    speakerIndices: []
  },
  {
    id: 'session-energizer',
    type: 'break',
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
    type: 'session',
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
    type: 'session',
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
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:00 PM – 4:40 PM',
    duration: '40 MIN',
    category: 'FLAGSHIP PANEL DISCUSSION',
    categoryTheme: 'theme-purple',
    title: 'Panel Discussion: Build. Grow. Lead: How Community Shapes Careers in Tech',
    location: 'Main Auditorium · 4th Floor',
    description: 'Flagship panel featuring AWS Community Leaders, former Student Builder Group Captains, and student tech officers on community leadership and tech career acceleration. Includes 30-minute panel (4:00 PM – 4:30 PM) and 10-minute live Q&A (4:30 PM – 4:40 PM).',
    speakerIndices: [3, 4, 5]
  },
  {
    id: 'session-raffle',
    type: 'session',
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
    // Reconciled finale: was 4:55 PM – 5:30 PM (35 MIN). Canonical
    // EVENT_GUIDELINES.md ends the day at 5:00 PM, so the closing group photo &
    // egress is now the 4:55 PM – 5:00 PM slot. This is the single time change
    // that brings the site's end time in line with the doc and Luma.
    id: 'session-finale',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:55 PM – 5:00 PM',
    duration: '5 MIN',
    category: 'FINALE & GROUP PHOTO',
    categoryTheme: 'theme-blue',
    title: 'Official Community Group Photo & Hall Egress',
    location: 'Main Auditorium & Grand Stage · 4th Floor',
    description: 'Official South Summit 2026 commemorative group photo with all attendees, speakers, directors, and organizers, followed by hall egress and final networking.',
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
 * 5:00 PM (17:00). Warnings only — never throws, so production rendering is never
 * blocked. Runs against the exported scheduleSessions.
 */
export function assertScheduleContiguity(sessions = scheduleSessions) {
  const problems = [];
  const EXPECTED_END_MIN = 17 * 60; // 5:00 PM

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
    problems.push(`Last session ends at ${prevEnd / 60}:00-ish, expected 5:00 PM (17:00).`);
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
    const roleNote = (typeof entry === 'object' && entry !== null && entry.role)
      ? ` · ${escapeHTML(entry.role)}`
      : '';
    return `<span class="sched-speaker-chip">${escapeHTML(sp.name)}${roleNote}</span>`;
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
