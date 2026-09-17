/**
 * scheduleUI.js
 * --------------------------------------------------------------------------
 * Manages the Program Flow (The Running Order) inline view switcher:
 * - Dual View / Morning / Afternoon block layout toggle in the blueprint track
 */

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
}

// Stubs for backwards compatibility
export function openScheduleModal() {}
export function closeScheduleModal() {}

window.openScheduleModal = openScheduleModal;
window.closeScheduleModal = closeScheduleModal;
