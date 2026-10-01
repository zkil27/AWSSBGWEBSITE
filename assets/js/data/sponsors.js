/**
 * AWS Student Community Day: South Summit 2026
 * Pure Data Layer — Sponsors & Partners Catalog
 * 
 * Tiers:
 * - Quantum (01): Keystone & Headline Partners
 * - Pro (02): Technology, Platform & Community Partners
 * - Lite (03): University Student Builder Chapters
 */

export const sponsors = [
  // ==========================================
  // 01 // QUANTUM TIER (Headline / Keystone)
  // ==========================================
  {
    id: 'sponsor-quantum-aws',
    name: 'Amazon Web Services',
    tier: 'quantum',
    role: 'Quantum Sponsor & Global Cloud Platform',
    description: 'The world\'s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.',
    imgUrl: 'assets/images/sponsors and partners/aws-logo-light.svg',
    imgDarkUrl: 'assets/images/sponsors and partners/aws-logo-dark.svg',
    featured: true,
    location: 'Global / Philippines',
    color: 'purple',
    url: 'https://aws.amazon.com/',
    meta: [
      { label: 'Role', value: 'Quantum Title Sponsor' },
      { label: 'Platform', value: 'Cloud & Generative AI Infrastructure' }
    ]
  },
  {
    id: 'sponsor-quantum-tutorialsdojo',
    name: 'Tutorials Dojo',
    tier: 'quantum',
    role: 'Quantum Sponsor & Official Cloud Learning Partner',
    description: 'Industry-leading cloud learning and certification platform empowering student builders with practical AWS architectural insights, practice exams, and career pathways.',
    imgUrl: 'assets/images/sponsors and partners/tutorialsdojo_transparent_background.webp',
    featured: true,
    location: 'Philippines / Global',
    color: 'blue',
    url: 'https://tutorialsdojo.com/',
    meta: [
      { label: 'Role', value: 'Quantum Learning Partner' },
      { label: 'Network', value: 'Global EdTech & Certification Hub' }
    ]
  },

  // ==========================================
  // 02 // CLUSTER TIER (Cluster Sponsor)
  // ==========================================
  {
    id: 'sponsor-cluster-cloudsensei',
    name: 'Cloud Sensei',
    tier: 'cluster',
    role: 'Cluster Sponsor',
    description: 'Cloud training, architecture consultancy, and community enablement empowering builders to master Amazon Web Services and modern cloud engineering.',
    imgUrl: 'assets/images/sponsors and partners/cloudsensei-light.webp',
    imgDarkUrl: 'assets/images/sponsors and partners/cloudsensei-dark.webp',
    featured: true,
    location: 'Philippines',
    color: 'teal',
    url: '#',
    meta: [
      { label: 'Role', value: 'Cluster Sponsor' }
    ]
  },

  // ==========================================
  // 03 // VENUE PARTNER (Official Venue Host)
  // ==========================================
  {
    id: 'partner-venue-binan-lgu',
    name: 'City Government of Biñan (Biñan LGU)',
    tier: 'venue',
    role: 'Official Venue Partner',
    description: 'The City Government of Biñan proudly hosts AWS Student Community Day: South Summit 2026 at the Biñan People\'s Center Auditorium, empowering students and the next generation of cloud builders across CALABARZON.',
    imgUrl: 'assets/images/sponsors and partners/city government of binan logo.webp',
    featured: true,
    location: 'Biñan City, Laguna',
    color: 'orange',
    url: 'https://binan.gov.ph',
    meta: [
      { label: 'Venue', value: 'Biñan People\'s Center Auditorium' },
      { label: 'Host LGU', value: 'City Government of Biñan, Laguna' }
    ]
  },

  // ==========================================
  // 03 // PRO PARTNERSHIP (Community & Tech Partners) - 12 Partners
  // ==========================================
  {
    id: 'partner-pro-colegio-de-muntinlupa',
    name: 'AWS SBG - Colegio de Muntinlupa',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Colegio de Muntinlupa',
    location: 'Muntinlupa City',
    track: 'Academic & Builder Partner',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWS FB PFP (7).png',
    url: '#'
  },
  {
    id: 'partner-pro-adamson',
    name: 'AWS SBG - Adamson University',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Adamson University',
    location: 'Manila',
    track: 'Academic Cloud Chapter',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWSSBG Adamson University.png',
    url: '#'
  },
  {
    id: 'partner-pro-ccc-dci',
    name: 'CCC - Department of Computing and Informatics',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'City College of Calamba',
    location: 'Calamba, Laguna',
    track: 'Academic Department Partner',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/CCC logo.png',
    url: '#'
  },
  {
    id: 'partner-pro-tempest',
    name: 'AWS SBG - Tempest',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'AWS Student Community',
    location: 'Philippines',
    track: 'Student Builder Community',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/AWS SBG - Tempest Logo.png',
    url: '#'
  },
  {
    id: 'partner-pro-aws-sug-ph',
    name: 'AWS Student User Group Philippines',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'AWS Student User Group',
    location: 'Philippines',
    track: 'Student User Group Network',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWSSUG.png',
    url: '#'
  },
  {
    id: 'partner-pro-acss',
    name: 'Association of Computer Science Students (ACSS)',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Student Organization',
    location: 'Philippines',
    track: 'CS Student Organization',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/ACSS logo.png',
    url: '#'
  },
  {
    id: 'partner-pro-nu-dasmarinas',
    name: 'Amazon Web Services Learning Club - NU Dasmariñas',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'National University Dasmariñas',
    location: 'Dasmariñas, Cavite',
    track: 'Academic Cloud Chapter',
    color: 'green',
    imgUrl: 'assets/images/sponsors and partners/AWSLC_NU Dasma.png',
    url: '#'
  },
  {
    id: 'partner-pro-beradove',
    name: 'AWS Student Builder Group Beredove',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Student Builder Community',
    location: 'Philippines',
    track: 'Student Builder Chapter',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/Beredove Regular.png',
    url: '#'
  },
  {
    id: 'partner-pro-feu-alabang-acm',
    name: 'FEU Alabang ACM Student Chapter',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'FEU Alabang',
    location: 'Alabang, Muntinlupa',
    track: 'ACM Student Chapter',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/FEUA-ACM_LOGO_.png',
    url: '#'
  },
  {
    id: 'partner-pro-slu-lc',
    name: 'SLU AWS Learning Club',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Saint Louis University',
    location: 'Baguio City',
    track: 'Student Learning Club',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/SLU AWS Learning Club.png',
    url: '#'
  },
  {
    id: 'partner-pro-access',
    name: 'ACCESS - Association of Committed Computer Science Students',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Student Organization',
    location: 'Philippines',
    track: 'CS Student Organization',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/ACCESS Logo.png',
    url: '#'
  },

  // ==========================================
  // 04 // LITE PARTNERSHIP (Student & Community Organizations) - 7 Partners
  // ==========================================
  {
    id: 'partner-lite-buildhers',
    name: 'AWS User Group BuildHers+ Philippines',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'AWS User Group BuildHers Philippines',
    location: 'Philippines',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/AWS User Group BuildHers Philippines.png'
  },
  {
    id: 'partner-lite-devcon-laguna',
    name: 'DEVCON Laguna Chapter',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Developer Connect Philippines',
    location: 'Laguna Chapter',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/DEVCON Laguna Chapter logo - Black.png'
  },
  {
    id: 'partner-lite-up-mindanao',
    name: 'AWS Student Builder Group – UP Mindanao',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'University of the Philippines Mindanao',
    location: 'Davao City, Mindanao',
    color: 'teal',
    imgUrl: 'assets/images/sponsors and partners/awscc-upmin-logo.png'
  },
  {
    id: 'partner-lite-itsoc',
    name: 'Mapúa MCL InfoTech Society',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Mapúa Malayan Colleges Laguna',
    location: 'Cabuyao, Laguna',
    color: 'green',
    imgUrl: 'assets/images/sponsors and partners/InfoTechSociety ITSOC Logo.png'
  },
  {
    id: 'partner-lite-alpha',
    name: 'AWS Student Builder Group - Alpha',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Student Builder Chapter',
    location: 'Philippines',
    color: 'teal',
    imgUrl: 'assets/images/sponsors and partners/AWS SBG Alpha.png'
  },
  {
    id: 'partner-lite-workflow-ph',
    name: 'WorkFlow Ph',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Tech & Workflow Community',
    location: 'Philippines',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/WorkFlow.png'
  },
  {
    id: 'partner-lite-enovators',
    name: 'AWS User Group e:Novators Philippines',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Professional User Group',
    location: 'Philippines',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWS User Group e_Novators Philippines.png'
  }
];

export const tierMeta = {
  quantum: {
    index: '01',
    name: 'Quantum',
    title: 'Quantum Sponsors'
  },
  cluster: {
    index: '02',
    name: 'Cluster & Venue',
    title: 'Cluster Sponsor & Venue Partner'
  },
  venue: {
    index: '02',
    name: 'Cluster & Venue',
    title: 'Cluster Sponsor & Venue Partner'
  },
  pro: {
    index: '03',
    name: 'Pro',
    title: 'Pro Partners'
  },
  lite: {
    index: '03',
    name: 'Lite',
    title: 'Lite Partners'
  }
};
