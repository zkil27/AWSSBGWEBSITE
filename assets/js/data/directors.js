/**
 * AWS Student Community Day: South Summit 2026
 * Pure Data Layer — Organizing Committee Directorate & Leadership
 * 
 * @typedef {Object} Director
 * @property {string} id - Unique identifier
 * @property {string} name - Full name of the director / lead
 * @property {string} role - Official summit title / role
 * @property {string} department - Functional department (Executive, Technology, Creatives, Operations, Marketing, Relations, Finance)
 * @property {string} deptTag - Short department tag (EXEC, TECH, CREA, OPS, MKTG, RELS, FIN)
 * @property {string} focus - Brief description of scope and responsibilities
 * @property {string | null} avatar - Relative path to image if available, else null
 * @property {string} [accentColor] - Brand accent token name for visual styling
 */

/** @type {Director[]} */
export const directors = [
  // 1. Executive (4)
  {
    id: 'dir-exec-1',
    name: 'John Lexter Reyes',
    role: 'Event Director',
    department: 'Executive',
    deptTag: 'EXECUTIVE',
    focus: 'Overall summit direction, master timeline orchestration, institutional permits, and inter-departmental governance.',
    avatar: 'assets/images/directors/Event Director - John Lexter Reyes.webp',
    accentColor: '--orange'
  },
  {
    id: 'dir-exec-2',
    name: 'Helena Tantoco',
    role: 'Associate Director',
    department: 'Executive',
    deptTag: 'EXECUTIVE',
    focus: 'Cross-functional operations oversight, department KPI alignment, risk management, and ground execution management.',
    avatar: 'assets/images/directors/Event Associate Director - Helena Tantoco.webp',
    accentColor: '--orange'
  },
  {
    id: 'dir-exec-3',
    name: 'Althea Peria',
    role: 'Executive Secretary',
    department: 'Executive',
    deptTag: 'EXECUTIVE',
    focus: 'Executive correspondence, official summit documentation, inter-chapter minutes, and administrative compliance.',
    avatar: 'assets/images/directors/Executive Secretary - Althea Kim Peria.webp',
    accentColor: '--orange'
  },
  {
    id: 'dir-exec-4',
    name: 'Renae Chloe Bautista',
    role: 'Executive Secretary',
    department: 'Executive',
    deptTag: 'EXECUTIVE',
    focus: 'Administrative management, records upkeep, volunteer roster collation, and communications tracking.',
    avatar: 'assets/images/directors/Executive Secretary - Renae Chloe O. Bautista.webp',
    accentColor: '--orange'
  },

  // 2. Finance (2)
  {
    id: 'dir-fin-1',
    name: 'John Cyphrey Madulid',
    role: 'Finance Director',
    department: 'Finance',
    deptTag: 'FINANCE',
    focus: 'Fiscal budgeting, sponsorship fund allocation, procurement audit trails, merchandise costing, and financial transparency.',
    avatar: 'assets/images/directors/Finance Director - John Cyphrey D. Madulid.webp',
    accentColor: '--green'
  },
  {
    id: 'dir-fin-2',
    name: 'Coleen Legaspi',
    role: 'Finance Associate Director',
    department: 'Finance',
    deptTag: 'FINANCE',
    focus: 'Purchase requests verification, expense reconciliation, receipts accounting, and post-summit liquidation.',
    avatar: 'assets/images/directors/Finance Assoc. Director - Coleen Legaspi.webp',
    accentColor: '--green'
  },

  // 3. Creatives (2)
  {
    id: 'dir-crea-1',
    name: 'Maja Samaniego',
    role: 'Creatives Director',
    department: 'Creatives',
    deptTag: 'CREATIVES',
    focus: 'Visual identity direction, Cyber-Grid aesthetic design systems, multimedia assets, stage graphics, and branding.',
    avatar: 'assets/images/directors/Creatives Director - Maja Samaniego.webp',
    accentColor: '--purple'
  },
  {
    id: 'dir-crea-2',
    name: 'Alyssa Marie T. Valera',
    role: 'Creatives Associate Director',
    department: 'Creatives',
    deptTag: 'CREATIVES',
    focus: 'Design production workflow, summit digital collaterals, visual design review, and brand consistency.',
    avatar: null,
    accentColor: '--purple'
  },

  // 4. Marketing (2)
  {
    id: 'dir-mktg-1',
    name: 'Jana Lumbreras',
    role: 'Marketing Director',
    department: 'Marketing',
    deptTag: 'MARKETING',
    focus: 'Audience growth across CALABARZON, public relations outreach, social media campaigns, and registration marketing.',
    avatar: 'assets/images/directors/Marketing Director - Jana Lei Lumbreras.webp',
    accentColor: '--purple'
  },
  {
    id: 'dir-mktg-2',
    name: 'Beatrice Blando',
    role: 'Marketing Associate Director',
    department: 'Marketing',
    deptTag: 'MARKETING',
    focus: 'Multi-platform content scheduling, student community engagement, attendee interaction, and promotional copy.',
    avatar: 'assets/images/directors/Marketing Associate Director - Beatrice Danica Blando.webp',
    accentColor: '--purple'
  },

  // 5. Technology (2)
  {
    id: 'dir-tech-1',
    name: 'Elijah Tamayo',
    role: 'Technology Director',
    department: 'Technology',
    deptTag: 'TECHNOLOGY',
    focus: 'Summit digital infrastructure, official web platform engineering, interactive attendee tools, and technical delivery.',
    avatar: 'assets/images/directors/Technology Director - Elijah Job R. Tamayo.webp',
    accentColor: '--purple'
  },
  {
    id: 'dir-tech-2',
    name: 'Anthony Navarro',
    role: 'Technology Associate Director',
    department: 'Technology',
    deptTag: 'TECHNOLOGY',
    focus: 'Front-end web implementations, modular architecture maintenance, digital asset optimization, and live technical operations.',
    avatar: 'assets/images/directors/Technology Assoc. Director - Franz Anthony Navarro .webp',
    accentColor: '--purple'
  },

  // 6. Relations (2)
  {
    id: 'dir-rels-1',
    name: 'Queency Santos',
    role: 'Relations Director',
    department: 'Relations',
    deptTag: 'RELATIONS',
    focus: 'Strategic industry partnerships, sponsor package management, VIP speaker hospitality, and institutional linkages.',
    avatar: 'assets/images/directors/Relations Director - Queency Zyrel Santos_.webp',
    accentColor: '--blue'
  },
  {
    id: 'dir-rels-2',
    name: 'Joseph Lontok',
    role: 'Relations Associate Director',
    department: 'Relations',
    deptTag: 'RELATIONS',
    focus: 'Sponsor deliverable fulfillment, partner liaison communications, and university community relations.',
    avatar: 'assets/images/directors/Relations Associate Director - Patrick Dohn Joseph A. Lontok.webp',
    accentColor: '--blue'
  },

  // 7. Operations (2)
  {
    id: 'dir-ops-1',
    name: 'Sebastian Rafael Belando',
    role: 'Operations Director',
    department: 'Operations',
    deptTag: 'OPERATIONS',
    focus: 'Physical event logistics, Biñan People Center venue staging, technical audio-visual setups, safety, and attendee ingress.',
    avatar: 'assets/images/directors/Operations Director - Sebastian Rafael Belando_.webp',
    accentColor: '--green'
  },
  {
    id: 'dir-ops-2',
    name: 'Rain Jade De Castro',
    role: 'Operations Associate Director',
    department: 'Operations',
    deptTag: 'OPERATIONS',
    focus: 'Floor flow management, registration check-in logistics, marshaling coordination, and technical audio-visual backup.',
    avatar: 'assets/images/directors/Operations Associate Director - Rain Jade C. De Castro.webp',
    accentColor: '--green'
  }
];
