/**
 * scheduleUI.js
 * --------------------------------------------------------------------------
 * Manages the Program Flow (The Running Order) inline view:
 * - Supports morning / afternoon / dual block filtering in the blueprint panel
 * - Keeps safe no-op modal controls for backward compatibility
 */

import { getLenis } from './smoothScroll.js';

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
    speakerIndices: [3, 4, 5]
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

/* ============================ Modal Controls (No-op Safe Stubs) ============================ */

export function openScheduleModal() {}
export function closeScheduleModal() {}

/* =============================== Setup ================================== */

export function initScheduleUI() {
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
