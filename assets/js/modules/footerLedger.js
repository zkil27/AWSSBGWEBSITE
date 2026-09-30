/**
 * AWS Student Community Day: South Summit 2026
 * Module: footerLedger.js
 * 
 * Implements interactive features for the Kinetic Marquee and Architectural Footer:
 * 1. Scroll-accelerated dual-track kinetic marquee (React Bits ScrollVelocity port)
 * 2. Cyberpunk matrix character decryption on footer navigation hover
 * 3. Real-time telemetry countdown timer for the footer telemetry block
 * 4. Smooth back-to-top scroll integration
 */

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$%&*/+';
const EVENT_DATE = new Date('2026-10-07T09:30:00+08:00');

/**
 * Initialize Matrix character decryption scramble on footer navigation items.
 */
function initMatrixDecryption() {
    const decryptButtons = document.querySelectorAll('[data-decrypt]');
    if (!decryptButtons.length) return;

    decryptButtons.forEach((btn) => {
        const textSpan = btn.querySelector('.decrypt-text');
        if (!textSpan) return;

        const originalText = textSpan.textContent.trim();
        let animationTimer = null;
        let iteration = 0;

        btn.addEventListener('mouseenter', () => {
            clearInterval(animationTimer);
            iteration = 0;

            animationTimer = setInterval(() => {
                textSpan.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(animationTimer);
                    textSpan.textContent = originalText;
                }

                iteration += 1 / 2;
            }, 30);
        });

        btn.addEventListener('mouseleave', () => {
            clearInterval(animationTimer);
            textSpan.textContent = originalText;
        });
    });
}

/**
 * Initialize dynamic telemetry countdown display inside the footer ledger.
 */
function initTelemetryCountdown() {
    const display = document.getElementById('telemetryCountdown');
    if (!display) return;

    function update() {
        const now = new Date().getTime();
        const diff = EVENT_DATE.getTime() - now;

        if (diff <= 0) {
            display.textContent = 'EVENT LIVE TODAY';
            display.classList.add('text-green');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        display.textContent = `T-${days}D ${String(hours).padStart(2, '0')}H ${String(mins).padStart(2, '0')}M`;
    }

    update();
    setInterval(update, 30000);
}

/**
 * Initialize smooth Back to Top trigger.
 */
function initBackToTop() {
    const btn = document.getElementById('btnBackToTop');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lenis = window.__lenis || window.lenis;
        if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(0, { duration: 1.1 });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Handle special footer navigation targets (Organizers, Core Team, Merch).
 */
function initFooterNavInteractions() {
    const footer = document.getElementById('siteFooter');
    if (!footer) return;

    footer.addEventListener('click', (e) => {
        const item = e.target.closest('.foot-nav-item');
        if (!item) return;

        const page = item.getAttribute('data-page');
        const target = item.getAttribute('data-target');

        if (page === 'merch') {
            e.preventDefault();
            showMerchNotice();
            return;
        }

        if (page === 'about' && target) {
            e.preventDefault();
            if (window.showPage) {
                window.showPage('about', true, true);
            }
            setTimeout(() => {
                const cardId = target === 'chapters' ? 'card-chapters' : 'card-directors';
                const card = document.getElementById(cardId);
                if (card) {
                    const tab = card.querySelector('.sb-card-tab');
                    if (tab && !card.classList.contains('is-active')) {
                        tab.click();
                    }
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 350);
        }
    });
}

function showMerchNotice() {
    let toast = document.getElementById('footerMerchToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'footerMerchToast';
        toast.className = 'footer-merch-toast font-mono';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.textContent = 'Official summit merch drops closer to October 7!';
    toast.classList.add('visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('visible');
    }, 3200);
}

/**
 * Bootstraps all footer ledger & kinetic marquee interactions.
 */
export function initFooterLedger() {
    initMatrixDecryption();
    initTelemetryCountdown();
    initBackToTop();
    initFooterNavInteractions();
}
