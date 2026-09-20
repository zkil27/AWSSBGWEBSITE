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
  // 03 // PRO PARTNERSHIP (Community & Tech Partners)
  // ==========================================
  {
    id: 'partner-pro-tempest',
    name: 'AWS Student Builder Group – Tempest',
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
    id: 'partner-pro-ccc-dci',
    name: 'CCC - Department of Computing and Informatics',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'City College of Calamba',
    location: 'Calamba, Laguna',
    track: 'Academic Department Partner',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/ccc-dci.svg',
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
    id: 'partner-pro-cvsu-elits',
    name: 'CvSU Elite Leage of Information Technology Students',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Cavite State University',
    location: 'Indang, Cavite',
    track: 'IT Student Organization',
    color: 'green',
    imgUrl: 'assets/images/sponsors and partners/ELITS.jpg',
    url: '#'
  },
  {
    id: 'partner-pro-colegio-de-abogados',
    name: 'AWS Cloud Club - Colegio de abogados',
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
    name: 'AWS Student Builder Group - Adamson University',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Adamson University',
    location: 'Manila',
    track: 'Academic Cloud Chapter',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWSSBG Adamson University.jpg',
    url: '#'
  },
  {
    id: 'partner-pro-hugo',
    name: 'AWS Student Builder Group - HUGO',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Technological University of the Philippines Manila',
    location: 'Manila',
    track: 'Student Builder Chapter',
    color: 'teal',
    imgUrl: 'assets/images/sponsors and partners/AWSSBG - Hugo Logo.png',
    url: '#'
  },
  {
    id: 'partner-pro-aeris',
    name: 'AWS Student Builder Group - Aeris',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'City College of Calamba',
    location: 'Calamba, Laguna',
    track: 'Student Builder Chapter',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/Aeris-Logo.png',
    url: '#'
  },
  {
    id: 'partner-pro-pcu-cavite',
    name: 'AWS Student Builder Group - PCU Cavite',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Philippine Christian University - Cavite',
    location: 'Dasmariñas, Cavite',
    track: 'Academic Cloud Chapter',
    color: 'green',
    imgUrl: 'assets/images/sponsors and partners/AWS SBG - PCU Cavite.jpg',
    url: '#'
  },
  {
    id: 'partner-pro-enovators',
    name: 'AWS User Group e:Novators Philippines',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Professional User Group',
    location: 'Philippines',
    track: 'Enterprise & Innovation Network',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWS User Group e_Novators Philippines.png',
    url: '#'
  },
  {
    id: 'partner-pro-polar',
    name: 'AWS Learning Club – Polar',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'AWS Learning Community',
    location: 'Philippines',
    track: 'Student Learning Community',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/AWSLC-Polar-Logo (1).png',
    url: '#'
  },
  {
    id: 'partner-pro-uc',
    name: 'AWS Student Builder Group - University of Cabuyao',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'University of Cabuyao',
    location: 'Cabuyao, Laguna',
    track: 'Academic Cloud Chapter',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWSSBG UC Profile (1).png',
    url: '#'
  },
  {
    id: 'partner-pro-devcon-laguna',
    name: 'DEVCON Laguna Chapter',
    tier: 'pro',
    role: 'Pro Partner',
    institution: 'Developer Connect Philippines',
    location: 'Laguna Chapter',
    track: 'Developer Ecosystem & Community',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/DEVCON Laguna Chapter logo - Black.png',
    url: 'https://devcon.ph'
  },

  // ==========================================
  // 04 // LITE PARTNERSHIP (Student Organizations)
  // ==========================================
  {
    id: 'partner-lite-bulsu',
    name: 'AWS Student Builder Group - BULSU',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Bulacan State University',
    location: 'Bulacan',
    color: 'green',
    imgUrl: 'assets/images/sponsors and partners/Bulacan State University.png'
  },
  {
    id: 'partner-lite-acss-2',
    name: 'Association of Computer Science Students (ACSS)',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Student Organization',
    location: 'Philippines',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/ACSS logo.png'
  },
  {
    id: 'partner-lite-beradove',
    name: 'AWS Student Builder Group Beredove',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Student Builder Community',
    location: 'Philippines',
    color: 'purple',
    imgUrl: 'assets/images/sponsors and partners/Beredove Regular.png'
  },
  {
    id: 'partner-lite-feu-alabang-acm',
    name: 'FEU Alabang ACM Student Chapter',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'FEU Alabang',
    location: 'Alabang, Muntinlupa',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/FEUA-ACM_LOGO_.png'
  },
  {
    id: 'partner-lite-slu-lc',
    name: 'SLU AWS Learning Club',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Saint Louis University',
    location: 'Baguio City',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/SLU AWS Learning Club.png'
  },
  {
    id: 'partner-lite-accss-1',
    name: 'ACCESS - Association of Committed Computer Science',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'Student Organization',
    location: 'Philippines',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/ACCESS Logo.png'
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
    id: 'partner-lite-nu-cebu',
    name: 'AWS Student Builder Group - NU Cebu',
    tier: 'lite',
    role: 'Lite Partner',
    institution: 'National University Cebu',
    location: 'Cebu',
    color: 'blue',
    imgUrl: 'assets/images/sponsors and partners/AWS Student Builder Group - NU Cebu.png'
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
