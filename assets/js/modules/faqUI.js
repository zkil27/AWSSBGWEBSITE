/**
 * faqUI.js
 * --------------------------------------------------------------------------
 * Renders the FAQ accordion from data/faq.js into #faqList.
 *
 * Accessibility: each question is a <button aria-expanded aria-controls> that
 * toggles its answer panel (role="region", aria-labelledby). Full keyboard
 * support (Enter/Space to toggle; the button is natively focusable). Answers
 * that are not yet confirmed (`pending`) render a visible "being finalized"
 * note rather than fabricated content.
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
  const answerHTML = isPending
    ? `<p class="faq-answer-text faq-answer-pending">Details for this question are being finalized. Please check back closer to the event.</p>`
    : `<p class="faq-answer-text">${escapeHTML(item.a)}</p>`;

  return `
    <div class="faq-item" data-faq-index="${i}">
      <h3 class="faq-q-heading">
        <button type="button" class="faq-q" id="${btnId}" aria-expanded="false" aria-controls="${panelId}">
          <span class="faq-q-text">${escapeHTML(item.q)}</span>
          <span class="faq-q-icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="faq-answer" id="${panelId}" role="region" aria-labelledby="${btnId}" hidden>
        <div class="faq-answer-inner">
          ${answerHTML}
        </div>
      </div>
    </div>`;
}

export function initFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;

  list.innerHTML = faqs.map(renderItem).join('');

  const buttons = Array.from(list.querySelectorAll('.faq-q'));

  function setOpen(btn, open) {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) {
      panel.hidden = !open;
      panel.closest('.faq-item')?.classList.toggle('is-open', open);
    }
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const willOpen = btn.getAttribute('aria-expanded') !== 'true';
    // Single-open behavior keeps the section calm and scannable.
    buttons.forEach(b => { if (b !== btn) setOpen(b, false); });
    setOpen(btn, willOpen);
  });

  // Keyboard: the native <button> handles Enter/Space. Add arrow-key roving
  // between questions for quicker navigation.
  list.addEventListener('keydown', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const idx = buttons.indexOf(btn);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? buttons[(idx + 1) % buttons.length]
        : buttons[(idx - 1 + buttons.length) % buttons.length];
      next.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[buttons.length - 1].focus();
    }
  });
}
