/**
 * AWS Student Community Day: South Summit 2026
 * Pure Data Layer — Participating Student Builder Chapters Catalog
 * 
 * @typedef {Object} Chapter
 * @property {string} name - Official name of the AWS Student Builder Group chapter
 * @property {string} university - University campus name or location
 * @property {string} facebookUrl - Official Facebook page link (or '#' for fallback)
 * @property {string} linkedInUrl - Official LinkedIn organization link (or '#' for fallback)
 * @property {string} email - Contact email for the chapter (optional)
 * @property {string | null} imgUrl - Relative path to chapter badge/logo (optional)
 */

/** @type {Chapter[]} */
export const chapters = [
  {
    name: 'AWS SBG – Philippine Christian University Cavite',
    university: 'PCU Cavite Campus',
    facebookUrl: 'https://www.facebook.com/AWSSBGPCUCavite',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - PCU Cavite.png'
  },
  {
    name: 'AWS SBG – Mapúa Malayan Digital College',
    university: 'Mapúa Malayan Digital College',
    facebookUrl: 'https://www.facebook.com/aws.sbg.mmdc',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - MMDC.png'
  },
  {
    name: 'AWS SBG – University of Perpetual Help System Laguna – Biñan',
    university: 'UPHSL Biñan Campus',
    facebookUrl: 'https://www.facebook.com/awssbg',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - UPHSL.png'
  },
  {
    name: 'AWS SBG – Cavite State University – Main',
    university: 'CvSU Indang Main Campus',
    facebookUrl: 'https://www.facebook.com/awsccspade',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - Spade.png'
  },
  {
    name: 'AWS SBG – Pamantasan ng Cabuyao',
    university: 'University of Cabuyao',
    facebookUrl: 'https://www.facebook.com/awsccpnc',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - UC.png'
  },
  {
    name: 'AWS SBG – Polytechnic University of the Philippines – Biñan',
    university: 'PUP Biñan Campus',
    facebookUrl: 'https://www.facebook.com/share/1F7y2K5yxg/',
    linkedInUrl: '#',
    email: 'sbg.pupbinan@gmail.com',
    imgUrl: 'assets/images/organizations/AWS SBG - PUP Biñan.svg'
  },
  {
    name: 'AWS Learning Club – Polar',
    university: 'PUP Santa Rosa Campus',
    facebookUrl: 'https://www.facebook.com/profile.php?id=6158289347062',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWSLC - Polar.png'
  },
  {
    name: 'AWS SBG – Aeris',
    university: 'City College of Calamba',
    facebookUrl: 'https://www.facebook.com/awssbg.aeris',
    linkedInUrl: '#',
    email: '',
    imgUrl: 'assets/images/organizations/AWS SBG - Aeris.png'
  }
];