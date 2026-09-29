/**
 * faqUI.js
 * --------------------------------------------------------------------------
 * Renders and handles the FAQ accordion from data/faq.js into #faqList.
 *
 * Impeccable Craft & Accessibility:
 *  - Semantic HTML: <button aria-expanded aria-controls> toggles its panel (role="region", aria-labelledby).
 *  - Keyboard support: Enter / Space to toggle, ArrowUp / ArrowDown roving focus, Home / End navigation.
 *  - Pending state: Confirmed facts are rendered cleanly; questions whose details are still being
 *    finalized with venue/organizers show an honest "Details being finalized" badge and note.
 *  - Smooth accordion motion with CSS grid-template-rows expansion.
 */

import { faqs } from '../data/faq.js';

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function renderItem(item, i) {
  const btnId = `${item.id}-q`;
  const panelId = `${item.id}-a`;
  const isPending = !!item.pending || !item.a;
  
  const statusBadge = isPending
    ? `<span class="faq-status-badge font-mono" aria-label="Details being finalized">Pending Confirmation</span>`
    : '';

  const answerHTML = isPending
    ? `<div class="faq-pending-notice">
         <p class="faq-answer-text faq-answer-pending">
           Details on certificates of participation are still being finalized by the organizing committee. We&rsquo;ll update this page and notify registered attendees once confirmed &mdash; expect an announcement before event day.
         </p>
       </div>`
    : `<p class="faq-answer-text">${escapeHTML(item.a)}</p>`;

  return `
    <article class="faq-item" data-faq-index="${i}">
      <h3 class="faq-q-heading">
        <button type="button" class="faq-q" id="${btnId}" aria-expanded="false" aria-controls="${panelId}">
          <span class="faq-q-left">
            <span class="faq-q-num font-mono">${String(i + 1).padStart(2, '0')}</span>
            <span class="faq-q-text">${escapeHTML(item.q)}</span>
            ${statusBadge}
          </span>
          <span class="faq-q-icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="faq-answer" id="${panelId}" role="region" aria-labelledby="${btnId}" hidden>
        <div class="faq-answer-inner">
          ${answerHTML}
        </div>
      </div>
    </article>`;
}

export function initFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;

  list.innerHTML = faqs.map(renderItem).join('');

  const buttons = Array.from(list.querySelectorAll('.faq-q'));

  function setOpen(btn, open) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const item = btn.closest('.faq-item');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) {
      panel.hidden = !open;
      if (item) item.classList.toggle('is-open', open);
    }
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const isCurrentlyOpen = btn.getAttribute('aria-expanded') === 'true';
    const willOpen = !isCurrentlyOpen;

    // Single-open accordion behavior keeps the view clean and easy to scan
    buttons.forEach(b => { if (b !== btn) setOpen(b, false); });
    setOpen(btn, willOpen);
  });

  // Keyboard navigation: Enter/Space natively click the button; ArrowUp/ArrowDown rove focus
  list.addEventListener('keydown', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const idx = buttons.indexOf(btn);
    if (idx === -1) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = e.key === 'ArrowDown'
        ? (idx + 1) % buttons.length
        : (idx - 1 + buttons.length) % buttons.length;
      buttons[nextIdx].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[buttons.length - 1].focus();
    }
  });
}
