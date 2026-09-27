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
  // ==================== BLOCK 01: MORNING (7:30 AM – 12:30 PM) ====================
  {
    id: 'session-registration',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '7:30 AM – 8:30 AM',
    duration: '60 MIN',
    category: 'REGISTRATION & COMMUNITY HUB',
    categoryTheme: 'theme-orange',
    title: 'Registration & Community Hub',
    location: 'SS Community Hub · 2nd Floor',
    description: 'Attendee check-in and registration, peer networking, sponsor booth exploration, partner community setups, and interactive photobooth activation.',
    speakerIndices: []
  },
  {
    id: 'session-opening-ceremony',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '8:30 AM – 8:45 AM',
    duration: '15 MIN',
    category: 'OPENING CEREMONY',
    categoryTheme: 'theme-orange',
    title: 'Opening Ceremony',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Solemn Invocation, Philippine National Anthem, and official Opening Program led by the summit organizers.',
    speakerIndices: []
  },
  {
    id: 'session-welcome-remarks',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '8:45 AM – 9:00 AM',
    duration: '15 MIN',
    category: 'WELCOME REMARKS',
    categoryTheme: 'theme-orange',
    title: 'Welcome Remarks & Event Overview',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Official welcome message and event overview delivered by University Representative and Lead Organizer.',
    speakerIndices: []
  },
  {
    id: 'session-opening-keynote',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '9:00 AM – 9:40 AM',
    duration: '40 MIN',
    category: 'OPENING KEYNOTE',
    categoryTheme: 'theme-orange',
    title: 'Opening Keynote: Cloud × AI: Building the Future Together',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Opening Keynote by AWS Philippines Representative / AWS Leader exploring emerging trends in AWS Cloud architecture, developer ecosystems, and applied AI in CALABARZON.',
    speakerIndices: [{ index: 0, role: 'Keynote Speaker' }]
  },
  {
    id: 'session-energizer-morning',
    type: 'break',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '9:40 AM – 9:50 AM',
    duration: '10 MIN',
    category: 'AUDIENCE ENERGIZER & Q&A',
    categoryTheme: 'theme-blue',
    title: 'Audience Energizer & Q&A',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Audience engagement, quick interaction, and event giveaways led by the summit hosts.',
    speakerIndices: []
  },
  {
    id: 'session-student-success',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '9:50 AM – 10:25 AM',
    duration: '35 MIN',
    category: 'STUDENT SUCCESS STORY',
    categoryTheme: 'theme-green',
    title: 'Student Success Story: From Student Builder to Tech Professional',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Inspiring personal journey from Former AWS Student Builder Group Lead / Former Captain on transitioning from a student community builder into a tech industry professional.',
    speakerIndices: []
  },
  {
    id: 'session-fireside-qa-1',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:25 AM – 10:35 AM',
    duration: '10 MIN',
    category: 'FIRESIDE Q&A',
    categoryTheme: 'theme-green',
    title: 'Fireside Q&A: Student Builder Journey',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Moderated audience questions and interactive fireside discussion with the speaker.',
    speakerIndices: []
  },
  {
    id: 'session-morning-break',
    type: 'break',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:35 AM – 10:50 AM',
    duration: '15 MIN',
    category: 'MORNING BREAK',
    categoryTheme: 'theme-blue',
    title: 'Morning Break & Community Hub',
    location: 'SS Community Hub · 2nd Floor',
    description: 'Morning break, community hub exploration, peer networking, and sponsor booth visits.',
    speakerIndices: []
  },
  {
    id: 'session-women-in-tech',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:50 AM – 11:30 AM',
    duration: '40 MIN',
    category: 'WOMEN IN TECH KEYNOTE',
    categoryTheme: 'theme-pink',
    title: 'Women in Tech Keynote: Building Inclusive Communities in Technology',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Keynote session highlighting representation, diversity, and building inclusive tech communities across CALABARZON and the cloud ecosystem.',
    speakerIndices: [{ index: 1, role: 'Keynote Speaker' }]
  },
  {
    id: 'session-community-giveaway',
    type: 'break',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '11:30 AM – 11:40 AM',
    duration: '10 MIN',
    category: 'COMMUNITY GIVEAWAY',
    categoryTheme: 'theme-blue',
    title: 'Community Giveaway & Audience Interaction',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Sponsor giveaways, summit trivia challenges, and interactive audience games led by hosts.',
    speakerIndices: []
  },
  {
    id: 'session-cloud-foundations',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '11:40 AM – 12:20 PM',
    duration: '40 MIN',
    category: 'CLOUD FOUNDATIONS',
    categoryTheme: 'theme-green',
    title: 'Cloud Foundations: Starting Your Journey with AWS and Cloud Computing',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Foundational session by AWS Community Builder / AWS User Group Leader on core AWS cloud concepts, architecture, and practical starting steps for students.',
    speakerIndices: [{ index: 2, role: 'Speaker' }]
  },
  {
    id: 'session-sponsor-recognition',
    type: 'session',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '12:20 PM – 12:30 PM',
    duration: '10 MIN',
    category: 'SPONSOR & COMMUNITY RECOGNITION',
    categoryTheme: 'theme-orange',
    title: 'Sponsor & Community Recognition',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Formal recognition and appreciation of summit sponsors, university partners, and participating student builder communities.',
    speakerIndices: []
  },

  // ==================== BLOCK 02: AFTERNOON (12:30 PM – 5:00 PM) ====================
  {
    id: 'session-lunch',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '12:30 PM – 2:00 PM',
    duration: '90 MIN',
    category: 'LUNCH BREAK',
    categoryTheme: 'theme-orange',
    title: 'Lunch, Networking & Community Hub Experience',
    location: 'SS Community Hub & Exhibition Hall · 2nd Floor',
    description: 'Lunch, sponsor and partner booth exploration, developer showcases, speed networking, photobooth, and community interaction.',
    speakerIndices: []
  },
  {
    id: 'session-afternoon-energizer',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:00 PM – 2:10 PM',
    duration: '10 MIN',
    category: 'AFTERNOON ENERGIZER',
    categoryTheme: 'theme-blue',
    title: 'Afternoon Energizer',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Icebreaker games, booth challenge updates, and attendee giveaways led by hosts.',
    speakerIndices: []
  },
  {
    id: 'session-ai-innovation',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:10 PM – 2:50 PM',
    duration: '40 MIN',
    category: 'AI INNOVATION SESSION',
    categoryTheme: 'theme-purple',
    title: 'AI Innovation: Building AI Products That People Actually Use: The Story Behind Tarsi',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Feature technical and venture session by target speaker Bryl Lim exploring the real-world engineering, design, and product decisions behind Tarsi.',
    speakerIndices: []
  },
  {
    id: 'session-fireside-qa-2',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:50 PM – 3:00 PM',
    duration: '10 MIN',
    category: 'FIRESIDE Q&A',
    categoryTheme: 'theme-purple',
    title: 'Fireside Q&A: AI Products in Practice',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Moderated audience Q&A session discussing practical AI product deployment and architecture.',
    speakerIndices: []
  },
  {
    id: 'session-career-dev',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:00 PM – 3:35 PM',
    duration: '35 MIN',
    category: 'CAREER DEVELOPMENT TALK',
    categoryTheme: 'theme-green',
    title: 'Career Development: How Students Can Stand Out in the Tech Industry',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Practical advice and insights from industry professional and hiring manager on resumes, portfolios, internships, and entering the tech job market.',
    speakerIndices: []
  },
  {
    id: 'session-afternoon-break',
    type: 'break',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:35 PM – 3:50 PM',
    duration: '15 MIN',
    category: 'AFTERNOON BREAK',
    categoryTheme: 'theme-blue',
    title: 'Afternoon Break & Community Hub',
    location: 'SS Community Hub · 2nd Floor',
    description: 'Coffee break, community hub networking, and final sponsor booth visits.',
    speakerIndices: []
  },
  {
    id: 'session-flagship-panel',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:50 PM – 4:30 PM',
    duration: '40 MIN',
    category: 'FLAGSHIP PANEL DISCUSSION',
    categoryTheme: 'theme-purple',
    title: 'Flagship Panel: Beyond the Hype: The Real Journey Into Tech',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Flagship panel discussion with Industry Professionals, AWS Community Leaders, and Women in Tech Advocates on navigating real challenges and career acceleration in tech.',
    speakerIndices: [3, 4, 5]
  },
  {
    id: 'session-grand-raffle',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:30 PM – 4:45 PM',
    duration: '15 MIN',
    category: 'GRAND RAFFLE & RECOGNITION',
    categoryTheme: 'theme-pink',
    title: 'Grand Raffle & Partner Appreciation',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Major raffle prize giveaways, recognition of industry sponsors and partner communities, and volunteer appreciation.',
    speakerIndices: []
  },
  {
    id: 'session-closing-keynote',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:45 PM – 4:55 PM',
    duration: '10 MIN',
    category: 'CLOSING KEYNOTE',
    categoryTheme: 'theme-orange',
    title: 'Closing Keynote: Building the Future Together',
    location: 'Summit Stage · 4th Floor Auditorium',
    description: 'Inspiring closing keynote delivered by South Summit Event Director on future builder initiatives and CALABARZON tech collaboration.',
    speakerIndices: []
  },
  {
    id: 'session-closing-remarks',
    type: 'session',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:55 PM – 5:00 PM',
    duration: '5 MIN',
    category: 'FINALE & GROUP PHOTO',
    categoryTheme: 'theme-blue',
    title: 'Closing Remarks & Official Group Photo',
    location: 'Summit Stage & Grand Stage · 4th Floor Auditorium',
    description: 'Closing acknowledgments and official commemorative group photo with attendees, organizers, and speakers, followed by hall egress.',
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
