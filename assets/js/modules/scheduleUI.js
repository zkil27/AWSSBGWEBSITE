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
    title: 'Registration',
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
    title: 'Opening Ceremony',
    location: 'Summit Stage · 4th Floor',
    description: 'Invocation, National Anthem, Opening Program · Led by Hosts/Organizers.',
    speakerIndices: []
  },
  {
    id: 'session-keynote',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:15 AM – 10:37 AM',
    duration: '22 MIN',
    category: 'OPENING KEYNOTE',
    categoryTheme: 'theme-orange',
    title: 'Opening Keynote / Welcome Remarks',
    location: 'Summit Stage · 4th Floor',
    description: 'Welcome Remarks and Opening Keynote exploring emerging trends in AWS Cloud architecture, developer communities, and applied AI in CALABARZON.',
    speakerIndices: [{ index: 0, role: 'Opening Remarks' }]
  },
  {
    id: 'session-icebreaker',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:37 AM – 10:47 AM',
    duration: '10 MIN',
    category: 'COMMUNITY & ICEBREAKER',
    categoryTheme: 'theme-blue',
    title: 'Icebreaker',
    location: 'Summit Stage · 4th Floor',
    description: 'High-energy community icebreaker, audience engagement, mini-challenges, and giveaways led by hosts and the emcee team.',
    speakerIndices: []
  },
  {
    id: 'session-talk1',
    block: 'morning',
    blockName: 'BLOCK 01 // MORNING',
    time: '10:47 AM – 11:44 AM',
    duration: '57 MIN',
    category: 'BUILDER STORY & TALK #1',
    categoryTheme: 'theme-green',
    title: 'Talk #1: Built by Community: From Student Builder to Tech Professional',
    location: 'Summit Stage · 4th Floor',
    description: 'Student story from being an AWS Student Builder Group Lead / Captain into a full-fledged technology professional. Includes main talk and audience Q&A session.',
    speakerIndices: [1]
  },

  // ==================== BLOCK 02: AFTERNOON ====================
  {
    id: 'session-lunch',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '11:44 AM – 1:14 PM',
    duration: '90 MIN',
    category: 'LUNCH BREAK',
    categoryTheme: 'theme-orange',
    title: 'Lunch Break, Networking & Community Hub (2F)',
    location: 'SS Community Hub · 2nd Floor',
    description: 'Lunch break, sponsor and partner booth exploration, partner showcases, speed mentoring with cloud architects, photobooth, and peer networking in the SS Community Hub.',
    speakerIndices: []
  },
  {
    id: 'session-energizer',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '1:14 PM – 1:36 PM',
    duration: '22 MIN',
    category: 'ENERGIZER',
    categoryTheme: 'theme-blue',
    title: 'Re-convening & Afternoon Energizer',
    location: 'Summit Stage · 4th Floor',
    description: 'Audience energizer games, summit check-in, and attendee re-convening for the afternoon sessions.',
    speakerIndices: []
  },
  {
    id: 'session-sponsor-spotlight',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '1:36 PM – 1:46 PM',
    duration: '10 MIN',
    category: 'SPONSOR SPOTLIGHT',
    categoryTheme: 'theme-teal',
    title: 'Sponsor Spotlight',
    location: 'Summit Stage · 4th Floor',
    description: 'Partner showcase updates, sponsor lightning presentations, and partner highlights.',
    speakerIndices: []
  },
  {
    id: 'session-talk2',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '1:46 PM – 2:43 PM',
    duration: '57 MIN',
    category: 'WOMEN IN TECH KEYNOTE & TALK #2',
    categoryTheme: 'theme-pink',
    title: 'Talk #2: Building Smarter Systems with AI and Cloud',
    location: 'Summit Stage · 4th Floor',
    description: 'Flagship Women in Tech keynote on modern architectural patterns, generative AI integration, and scalable cloud solutions on AWS. Includes main presentation and live Q&A.',
    speakerIndices: [2]
  },
  {
    id: 'session-talk3',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '2:43 PM – 3:40 PM',
    duration: '57 MIN',
    category: 'AI ADOPTION & TALK #3',
    categoryTheme: 'theme-green',
    title: 'Talk #3: Human in the Loop: Preparing People for an AI-Driven Future',
    location: 'Summit Stage · 4th Floor',
    description: 'In-depth exploration of organizational AI adoption, workforce readiness, and ethical AI deployment. Includes main presentation and live Q&A.',
    speakerIndices: [3]
  },
  {
    id: 'session-panel',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '3:40 PM – 4:40 PM',
    duration: '60 MIN',
    category: 'FLAGSHIP PANEL DISCUSSION',
    categoryTheme: 'theme-purple',
    title: 'Panel Discussion: Build. Grow. Lead: How Community Shapes Careers in Tech',
    location: 'Summit Stage · 4th Floor',
    description: 'Flagship panel featuring AWS Community Leaders, former Student Builder Group Captains, and student tech officers on community leadership and tech career acceleration. Includes panel session and live Q&A.',
    speakerIndices: [4, 5, 6]
  },
  {
    id: 'session-raffle',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:40 PM – 4:46 PM',
    duration: '6 MIN',
    category: 'GRAND RAFFLE',
    categoryTheme: 'theme-pink',
    title: 'Grand Raffle',
    location: 'Summit Stage · 4th Floor',
    description: 'Major raffle prize giveaways for summit participants, hosted by Cyphrey Madulid and Althea Perla.',
    speakerIndices: []
  },
  {
    id: 'session-sponsor-appreciation',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:46 PM – 4:50 PM',
    duration: '4 MIN',
    category: 'SPONSOR & PARTNER APPRECIATION',
    categoryTheme: 'theme-teal',
    title: 'Sponsor & Partner Appreciation',
    location: 'Summit Stage · 4th Floor',
    description: 'Official recognition and token presentation to industry sponsors, community partners, and university supporters.',
    speakerIndices: []
  },
  {
    id: 'session-closing',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:50 PM – 4:55 PM',
    duration: '5 MIN',
    category: 'CLOSING REMARKS',
    categoryTheme: 'theme-teal',
    title: 'Closing Remarks',
    location: 'Summit Stage · 4th Floor',
    description: 'Official closing address and appreciation for speakers, volunteers, and guests delivered by South Summit Event Director John Lexter Reyes.',
    speakerIndices: []
  },
  {
    id: 'session-egress',
    block: 'afternoon',
    blockName: 'BLOCK 02 // AFTERNOON',
    time: '4:55 PM – 5:00 PM',
    duration: '5 MIN',
    category: 'EGRESS',
    categoryTheme: 'theme-blue',
    title: 'Egress',
    location: 'Summit Stage · 4th Floor',
    description: 'Official hall egress, venue turnover, and closing of the auditorium.',
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
