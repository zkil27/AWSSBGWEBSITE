/**
 * keyboardNav.js
 * --------------------------------------------------------------------------
 * Complete keyboard accessibility & interaction engine for SCD South Summit 2026.
 *
 * Capabilities:
 *  1. Smooth scrolling via Arrow keys (Up, Down, Left, Right), PageUp, PageDown,
 *     Home, End, and Space — synchronized with Lenis when active and native smooth
 *     scroll fallback.
 *  2. Horizontal pan steering: ArrowRight and ArrowLeft smoothly pan the Blueprint
 *     track while viewing #program.
 *  3. Quick Access Keys (single-key shortcuts):
 *     - [M] Toggle Navigation Menu drawer
 *     - [R] Register Now
 *     - [A] Explore About page
 *     - [H] Go to Home page
 *     - [S] Jump to Schedule / Program Flow
 *     - [V] Jump to Twin Venues section
 *     - [T] Toggle Theme (Light / Dark mode)
 *     - [P] Play / Pause Hero Video
 *     - [B] Back to Top
 *     - [?] Toggle Keyboard Shortcuts Guide dialog
 *     - [Esc] Close any active modal, drawer, or dialog
 *  4. Staggered Menu Drawer traversal:
 *     - [1]-[5] Direct access to menu items
 *     - [ArrowDown] / [ArrowUp] Cycle through menu items
 *  5. Keyboard Feedback Toast:
 *     - Accessible live HUD toast confirming keypress activations.
 *  6. Skip-to-content focus routing.
 */

import { getLenis } from './smoothScroll.js';
import { setTheme, getTheme } from './theme.js';

let modalOverlay = null;
let toastEl = null;
let toastTimeout = null;

/**
 * Display a brief, accessible toast notification confirming a key shortcut action.
 */
export function showKeyActionToast(msg) {
  if (!toastEl) {
    toastEl = document.getElementById('kbdActionToast');
  }
  if (!toastEl) return;

  toastEl.textContent = msg;
  toastEl.classList.add('visible');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 1400);
}

/**
 * Toggle the Keyboard Shortcuts Help Modal.
 */
export function toggleShortcutsModal(forceState) {
  if (!modalOverlay) {
    modalOverlay = document.getElementById('kbdShortcutsModal');
  }
  if (!modalOverlay) return;

  const isOpen = modalOverlay.classList.contains('open');
  const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;

  if (shouldOpen) {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    const closeBtn = document.getElementById('kbdCloseBtn');
    if (closeBtn) closeBtn.focus();
    showKeyActionToast('Keyboard Shortcuts [?]');
  } else {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Determines whether focus is currently inside an editable form element.
 */
function isUserTyping() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

/**
 * Perform smooth scrolling with boundary clamping and Lenis integration.
 */
function smoothScrollByDelta(deltaY) {
  const lenis = getLenis();
  if (lenis && window.__lenis) {
    const current = lenis.scroll;
    const max = lenis.limit;
    const target = Math.max(0, Math.min(max, current + deltaY));
    lenis.scrollTo(target, {
      duration: 0.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  } else {
    window.scrollBy({ top: deltaY, behavior: 'smooth' });
  }
}

/**
 * Smoothly scroll to an absolute Y position.
 */
function smoothScrollToTop(targetY) {
  const lenis = getLenis();
  if (lenis && window.__lenis) {
    lenis.scrollTo(targetY, {
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  } else {
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }
}

/**
 * Check if the user is currently within the horizontal Blueprint pinned section on home page.
 */
function isInsideBlueprintSection() {
  const page = document.documentElement.getAttribute('data-page') || 'home';
  if (page !== 'home') return false;
  const prog = document.getElementById('program');
  if (!prog) return false;
  const rect = prog.getBoundingClientRect();
  return rect.top <= 80 && rect.bottom >= window.innerHeight * 0.5;
}

/**
 * Initialize all keyboard navigation listeners.
 */
export function initKeyboardNav() {
  modalOverlay = document.getElementById('kbdShortcutsModal');
  toastEl = document.getElementById('kbdActionToast');

  // Wire close buttons for Shortcuts modal
  const closeBtn = document.getElementById('kbdCloseBtn');
  const backdrop = document.getElementById('kbdModalBackdrop');
  if (closeBtn) closeBtn.addEventListener('click', () => toggleShortcutsModal(false));
  if (backdrop) backdrop.addEventListener('click', () => toggleShortcutsModal(false));

  const kbdHelpTrigger = document.getElementById('btnKbdHelp');
  if (kbdHelpTrigger) {
    kbdHelpTrigger.addEventListener('click', () => toggleShortcutsModal(true));
  }

  // Wire Skip to Content link
  const skipLink = document.getElementById('skipLink');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const page = document.documentElement.getAttribute('data-page') || 'home';
      const targetPage = document.getElementById('page-' + page) || document.body;
      const firstInteractive = targetPage.querySelector('a, button, [tabindex="0"]');
      if (firstInteractive) {
        firstInteractive.focus();
        firstInteractive.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Global keydown handler
  window.addEventListener('keydown', (e) => {
    // Never intercept typing in forms
    if (isUserTyping()) return;

    // Never intercept browser accelerator combos (Ctrl, Alt, Meta)
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;
    const keyUpper = key.toUpperCase();

    // 1. ESCAPE: Close topmost open overlay
    if (key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('open')) {
        e.preventDefault();
        toggleShortcutsModal(false);
        return;
      }
      // If staggered menu open, staggeredMenu.js handles it.
      // If speaker modal open, speakersUI.js handles it.
      return;
    }

    // 2. SHORTCUTS MODAL TOGGLE: [?] or [/]
    if (key === '?' || (key === '/' && !e.shiftKey)) {
      e.preventDefault();
      toggleShortcutsModal();
      return;
    }

    // If shortcuts modal is currently open, don't trigger other hotkeys
    if (modalOverlay && modalOverlay.classList.contains('open')) return;

    // Check if other modals are open
    const speakerModal = document.getElementById('speakerModal');
    if (speakerModal && speakerModal.classList.contains('open')) return;

    // 3. STAGGERED MENU OPEN TRAVERSAL: [1]-[5], ArrowUp/Down
    const isMenuOpen = document.documentElement.getAttribute('data-staggered-menu-open') === 'true';
    if (isMenuOpen) {
      if (['1', '2', '3', '4', '5'].includes(key)) {
        e.preventDefault();
        const item = document.querySelector(`.sm-panel-item[data-index="${key}"]`);
        if (item) item.click();
        return;
      }
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll('.sm-panel-item'));
        if (items.length > 0) {
          const idx = items.indexOf(document.activeElement);
          const nextIdx = key === 'ArrowDown'
            ? (idx + 1) % items.length
            : (idx - 1 + items.length) % items.length;
          items[nextIdx].focus();
        }
        return;
      }
    }

    // 4. SCROLL KEYS: ArrowDown, ArrowUp, ArrowLeft, ArrowRight, PageDown, PageUp, Space, Home, End
    const isInteractiveFocused = document.activeElement &&
      (document.activeElement.tagName === 'BUTTON' ||
       document.activeElement.tagName === 'A' ||
       document.activeElement.getAttribute('role') === 'button' ||
       document.activeElement.getAttribute('role') === 'tab');

    if (key === 'ArrowDown') {
      // If focused inside a tablist with roving tabindex, allow default/component handling
      if (document.activeElement?.getAttribute('role') === 'tab') return;
      e.preventDefault();
      smoothScrollByDelta(130);
      return;
    }

    if (key === 'ArrowUp') {
      if (document.activeElement?.getAttribute('role') === 'tab') return;
      e.preventDefault();
      smoothScrollByDelta(-130);
      return;
    }

    if (key === 'ArrowRight') {
      // If focused on venue gallery, allow venueUI to handle slide change
      if (document.activeElement?.closest('#venueGallery')) return;
      // If focused on schedule tabs, allow tab switching
      if (document.activeElement?.getAttribute('role') === 'tab') return;

      e.preventDefault();
      // If inside Blueprint section, scroll forward to pan track right
      const inBlueprint = isInsideBlueprintSection();
      smoothScrollByDelta(inBlueprint ? 150 : 130);
      return;
    }

    if (key === 'ArrowLeft') {
      if (document.activeElement?.closest('#venueGallery')) return;
      if (document.activeElement?.getAttribute('role') === 'tab') return;

      e.preventDefault();
      const inBlueprint = isInsideBlueprintSection();
      smoothScrollByDelta(inBlueprint ? -150 : -130);
      return;
    }

    if (key === 'PageDown') {
      e.preventDefault();
      smoothScrollByDelta(window.innerHeight * 0.82);
      return;
    }

    if (key === 'PageUp') {
      e.preventDefault();
      smoothScrollByDelta(-window.innerHeight * 0.82);
      return;
    }

    if (key === 'Home') {
      e.preventDefault();
      smoothScrollToTop(0);
      return;
    }

    if (key === 'End') {
      e.preventDefault();
      smoothScrollToTop(document.documentElement.scrollHeight);
      return;
    }

    if (key === ' ' || key === 'Spacebar') {
      // If focused on an interactive button or card, allow native space activation
      if (isInteractiveFocused) return;
      e.preventDefault();
      const dir = e.shiftKey ? -1 : 1;
      smoothScrollByDelta(dir * window.innerHeight * 0.82);
      return;
    }

    // 5. QUICK ACCESS BUTTON SHORTCUTS (Single Key)

    // [M]: Toggle Navigation Menu Drawer
    if (keyUpper === 'M') {
      e.preventDefault();
      const smToggle = document.querySelector('.sm-toggle');
      if (smToggle) smToggle.click();
      showKeyActionToast('Navigation Menu [M]');
      return;
    }

    // [R]: Register Now
    if (keyUpper === 'R') {
      e.preventDefault();
      const regBtn = document.querySelector('.nav-cta-btn') ||
                     document.querySelector('.hero-actions .btn-primary') ||
                     document.querySelector('a[href*="lu.ma"]');
      if (regBtn) {
        regBtn.focus();
        showKeyActionToast('Register Now [R]');
        if (regBtn.href) {
          window.open(regBtn.href, '_blank', 'noopener');
        }
      }
      return;
    }

    // [A]: Explore About Page
    if (keyUpper === 'A') {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('about');
        showKeyActionToast('Explore About [A]');
        const heroAbout = document.getElementById('heroAboutBtn');
        if (heroAbout) heroAbout.focus();
      }
      return;
    }

    // [H]: Home Page
    if (keyUpper === 'H') {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('home');
        showKeyActionToast('Home Page [H]');
      }
      return;
    }

    // [S]: Schedule / Program Section
    if (keyUpper === 'S') {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('home', true, true, '#program');
        showKeyActionToast('Schedule / Program Flow [S]');
      }
      return;
    }

    // [V]: Twin Venues Section
    if (keyUpper === 'V') {
      e.preventDefault();
      if (window.showPage) {
        window.showPage('home', true, true, '#venue');
        showKeyActionToast('Twin Venues [V]');
      }
      return;
    }

    // [T]: Toggle Light / Dark Theme
    if (keyUpper === 'T') {
      e.preventDefault();
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      showKeyActionToast(`Theme: ${next === 'dark' ? 'Dark' : 'Light'} Mode [T]`);
      return;
    }

    // [P]: Hero Video Play / Pause
    if (keyUpper === 'P') {
      const playBtn = document.getElementById('videoHeroPlayBtn');
      if (playBtn) {
        e.preventDefault();
        playBtn.click();
        showKeyActionToast('Video Play / Pause [P]');
      }
      return;
    }

    // [B]: Back to Top
    if (keyUpper === 'B') {
      const backTop = document.getElementById('btnBackToTop');
      if (backTop) {
        e.preventDefault();
        backTop.click();
        showKeyActionToast('Back to Top [B]');
      }
      return;
    }
  });
}
