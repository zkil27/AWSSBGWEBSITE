/**
 * AWS Student Community Day: South Summit 2026
 * Pure Data Layer — Frequently Asked Questions
 *
 * CONTENT RULES (locked with organizers):
 *  - Only publish CONFIRMED answers. Anything not yet confirmed is marked
 *    `pending: true` and rendered with a visible "Details being finalized" note
 *    instead of an invented answer. Fill these in and flip `pending` to false /
 *    remove the field once the organizing team confirms.
 *  - Confirmed facts below are sourced from docs/EVENT_GUIDELINES.md
 *    (free, beginner-friendly, students across South Luzon, Oct 7 2026 at the
 *    Biñan People's Center Auditorium, ~200–300 participants, online RSVP with
 *    host approval).
 *
 * Non-technical organizers can edit this file directly; faqUI.js renders it.
 */

export const faqs = [
  {
    id: 'faq-who-can-attend',
    q: 'Who can attend? Can students from other schools join?',
    a: 'Yes. South Summit 2026 is open to students, student leaders, and tech communities across South Luzon (CALABARZON) and beyond — including IT, Computer Science, and Engineering students, student leaders, women in tech communities, as well as educators and industry partners. You do not need to be from a partner school to register.',
    pending: false
  },
  {
    id: 'faq-beginners',
    q: 'Are beginners and non-technical students welcome?',
    a: 'Absolutely. The summit is intentionally beginner-friendly. Guided by the theme "Cloud x AI: BUILD. GROW. LEAD.", it balances technical exposure with human-centered experiences: inspiring keynotes, women-in-tech talks, career development sessions, and interactive community networking — so you can take part regardless of your background or skill level.',
    pending: false
  },
  {
    id: 'faq-admission-approval',
    q: 'Is admission free, and how does approval work?',
    a: 'Admission is free. Registration is handled online through Luma, and every request is subject to host approval — submitting a request does not immediately confirm your spot. With approximately 200 participants expected, you will receive a confirmation once your registration is approved.',
    pending: false
  },
  {
    id: 'faq-meals-certs-equipment',
    q: 'Are meals, certificates, or equipment provided or required?',
    // PENDING: confirm exactly what is provided (meals/snacks, certificates,
    // whether attendees must bring a laptop) before publishing a firm answer.
    a: '',
    pending: true
  },
  {
    id: 'faq-what-to-bring',
    q: 'What should I bring?',
    // PENDING: confirm the required/recommended items (e.g. valid school ID,
    // registration QR code, laptop, etc.).
    a: '',
    pending: true
  },
  {
    id: 'faq-getting-there-contact',
    q: 'How do I get there, and what spaces are in the venue?',
    a: 'The summit is held at the Biñan People’s Center Auditorium in Biñan City, Laguna. It utilizes two dedicated event spaces: the Summit Stage (4th Floor Auditorium) for keynote and technical sessions, and the SS Community Hub (2nd Floor) for sponsor booths, partner showcases, networking, and the interactive photobooth.',
    pending: false
  }
];
