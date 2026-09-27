/* ---------- PAGE ROUTING ---------- */
const PAGES = ['home', 'about', 'merch'];

let nav;

/**
 * Apply the "scrolled" visual state.
 */
export function updateNavSolid() {
    if (!nav) return;
    const page = document.documentElement.getAttribute('data-page') || 'home';
    const isScrolled = window.scrollY > 40;

    /* About/Merch open on light surfaces — keep solid nav so brand + links stay visible */
    const needsSolid = page !== 'home' || isScrolled;
    nav.classList.toggle('scrolled', needsSolid);
}

/**
 * Determine if the viewport is currently within the Hero section.
 */
export function isHeroActive() {
    const page = document.documentElement.getAttribute('data-page') || 'home';
    if (page === 'home') {
        const hero = document.querySelector('#page-home .hero-stage') || document.querySelector('#page-home #hero') || document.querySelector('#page-home .hero');
        if (!hero) return window.scrollY < 600;
        const rect = hero.getBoundingClientRect();
        return rect.bottom > 70;
    }
    return window.scrollY < 60;
}

export function updateHeroNavState() {
    // Dynamic reveal and auto-hide are managed by initNavAutoHide
}

export function updateNavState() {
    updateNavSolid();
}

let isNavigating = false;
let currentTransition = null;

/**
 * Calculate the static top position of an element relative to the document,
 * unaffected by current window.scrollY or layout shifts.
 */
function getElementDocTop(el) {
    let top = 0;
    let curr = el;
    while (curr) {
        top += curr.offsetTop || 0;
        curr = curr.offsetParent;
    }
    return top;
}

/**
 * Perform the synchronous DOM update for a page switch.
 */
function switchPageDOM(name, record = true, targetSection = null) {
    // toggle active page container
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById('page-' + name);
    if (targetPage) targetPage.classList.add('active');

    // update data-page attribute
    document.documentElement.setAttribute('data-page', name);

    // update active nav button indicators
    document.querySelectorAll('.navbtn, .dock-tab, .assistive-hud-item, .sm-panel-item').forEach(b => {
        const on = b.dataset.page === name;
        b.classList.toggle('active', on);
        if (on) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
    });

    // keep the Android back button inside the site
    if (record) {
        if (targetSection) {
            const sec = String(targetSection).replace(/^#/, '');
            history.pushState({ page: name, section: sec }, '', '#' + sec);
        } else {
            history.pushState({ page: name }, '', name === 'home' ? location.pathname + location.search : '#' + name);
        }
    }

    // merch came back stuck on the last opened card
    if (window.clearMerchFocus) window.clearMerchFocus();

    // If switching to home, ensure blueprint is reconciled and measured first
    if (name === 'home') {
        if (window.__reconcileBlueprint) window.__reconcileBlueprint();
        else if (window.__measureBlueprint) window.__measureBlueprint();
    }

    // Crucial: resize Lenis immediately after DOM is switched and layout heights updated
    // so that Lenis's limit is refreshed and does NOT clamp targetY to an old page's height!
    if (window.__lenis) {
        window.__lenis.resize();
    }
    if (window.__updateComputeGridBounds) {
        window.__updateComputeGridBounds();
    }

    let targetY = 0;
    if (targetSection) {
        const el = typeof targetSection === 'string' ? document.querySelector(targetSection) : targetSection;
        if (el) {
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
            const docTop = getElementDocTop(el);
            targetY = Math.max(0, docTop - navH + 10);
        }
    }

    // Scroll instantly inside the transition update callback so incoming snapshot is already at the target
    if (window.__lenis) {
        window.__lenis.resize();
        window.__lenis.scrollTo(targetY, { immediate: true });
    }
    window.scrollTo({ top: targetY, behavior: 'instant' });
    updateNavState();
}

export function showPage(name, record = true, animate = true, targetSection = null) {
    if (isNavigating) return currentTransition;

    const currentPage = document.documentElement.getAttribute('data-page') || 'home';
    if (name === currentPage) {
        if (targetSection) {
            const el = typeof targetSection === 'string' ? document.querySelector(targetSection) : targetSection;
            if (el) {
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
                const docTop = getElementDocTop(el);
                const targetY = Math.max(0, docTop - navH + 10);
                if (window.__lenis) {
                    window.__lenis.scrollTo(targetY, {
                        duration: 1.1,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
                const sec = String(targetSection).replace(/^#/, '');
                history.pushState({ page: name, section: sec }, '', '#' + sec);
                return null;
            }
        }
        if (window.__lenis) {
            window.__lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return null;
    }

    const supportsVT = typeof document.startViewTransition === 'function';
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsVT || prefersReducedMotion || !animate) {
        switchPageDOM(name, record, targetSection);
        return null;
    }

    isNavigating = true;
    document.documentElement.classList.add('in-page-transition');

    try {
        currentTransition = document.startViewTransition(() => {
            switchPageDOM(name, record, targetSection);
        });

        const cleanup = () => {
            isNavigating = false;
            currentTransition = null;
            document.documentElement.classList.remove('in-page-transition');
            if (targetSection) {
                const el = typeof targetSection === 'string' ? document.querySelector(targetSection) : targetSection;
                if (el) {
                    if (window.__measureBlueprint) window.__measureBlueprint();
                    if (window.__lenis) window.__lenis.resize();
                    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
                    const finalY = Math.max(0, getElementDocTop(el) - navH + 10);
                    if (window.__lenis) {
                        window.__lenis.scrollTo(finalY, { immediate: true });
                    }
                    window.scrollTo({ top: finalY, behavior: 'instant' });
                }
            }
        };

        currentTransition.finished.then(cleanup, cleanup);
        return currentTransition;
    } catch (e) {
        console.warn('[routing] View Transition failed; falling back to instant switch.', e);
        isNavigating = false;
        currentTransition = null;
        document.documentElement.classList.remove('in-page-transition');
        switchPageDOM(name, record, targetSection);
        return null;
    }
}

export function initRouter() {
    //assign variables
    nav = document.getElementById('siteNav');

    function parseRoute() {
        const raw = (location.hash || '').replace(/^#/, '').toLowerCase();
        if (raw.startsWith('about')) return 'about';
        if (raw.startsWith('merch')) return 'merch';
        return PAGES.includes(raw) ? raw : 'home';
    }

    const initial = parseRoute();

    window.addEventListener('popstate', (e) => {
        const page = (e.state && e.state.page) || parseRoute();
        if (window.closeSpeakerModal) window.closeSpeakerModal();
        if (window.showPage) window.showPage(page, false);
        else showPage(page, false);
    });

    window.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState, { passive: true });
    updateNavState();
    initNavAutoHide();

    // Delegated click handler for all interactive [data-page], [data-section], and section anchor links
    document.addEventListener('click', (e) => {
        // Never intercept external links or target=_blank links
        const extLink = e.target.closest('a[target="_blank"], a[href^="http"], a[href^="mailto:"]');
        if (extLink) return;

        // 1. Page navigation ([data-page])
        const pageTarget = e.target.closest('button[data-page], a[data-page], [role="button"][data-page]');
        if (pageTarget && pageTarget !== document.documentElement && pageTarget !== document.body) {
            const page = pageTarget.getAttribute('data-page');
            if (page && PAGES.includes(page)) {
                e.preventDefault();
                if (window.showPage) window.showPage(page);
                else showPage(page);
                return;
            }
        }

        // 2. Section navigation ([data-section] or in-page hash links like href="#venue", href="#sponsors")
        const sectionTarget = e.target.closest('[data-section], a[href^="#"]');
        if (sectionTarget && sectionTarget !== document.documentElement && sectionTarget !== document.body) {
            const href = sectionTarget.getAttribute('href');
            const dataSec = sectionTarget.getAttribute('data-section');
            let rawSec = dataSec || (href && href.startsWith('#') ? href.slice(1) : null);
            if (!rawSec || rawSec === '' || rawSec === '!') return;

            // If it matches a standalone page route like #about, let page handler deal with it
            if (PAGES.includes(rawSec)) return;

            // Map aliases to element IDs
            let sectionId = rawSec;
            // "Schedule"/"agenda" resolve to the #program section, but should land
            // directly on the timetable panel — tracked via wantsSchedule so we can
            // call __scrollToSchedule() instead of stopping at the intro panels.
            const wantsSchedule = (sectionId === 'agenda' || sectionId === 'schedule');
            if (wantsSchedule) sectionId = 'program';
            if (sectionId === 'venues') sectionId = 'venue';
            if (sectionId === 'chapters' || sectionId === 'network') sectionId = 'organizers';
            if (sectionId === 'directors' || sectionId === 'leadership' || sectionId === 'team' || sectionId === 'coreteam') sectionId = 'core-team';

            const targetSelector = '#' + sectionId;
            const el = document.querySelector(targetSelector);
            if (!el) return;

            e.preventDefault();

            const curPage = document.documentElement.getAttribute('data-page') || 'home';
            if (curPage !== 'home') {
                if (window.showPage) {
                    window.showPage('home', true, true, targetSelector);
                } else {
                    showPage('home', true, true, targetSelector);
                }
                // After the page transition settles, jump to the actual timetable.
                if (wantsSchedule && window.__scrollToSchedule) {
                    setTimeout(() => { window.__scrollToSchedule(); }, 220);
                }
            } else if (wantsSchedule && window.__scrollToSchedule && window.__scrollToSchedule()) {
                // Handled directly by blueprintScroll (desktop pan end or mobile panel).
                history.pushState({ page: 'home', section: 'schedule' }, '', '#schedule');
            } else {
                if (window.__measureBlueprint) window.__measureBlueprint();
                if (window.__lenis) window.__lenis.resize();

                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
                const docTop = getElementDocTop(el);
                const targetY = Math.max(0, docTop - navH + 10);

                if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
                    window.__lenis.scrollTo(targetY, {
                        duration: 1.1,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
                history.pushState({ page: 'home', section: sectionId }, '', targetSelector);
            }
        }
    });

    history.replaceState({ page: initial }, '', location.href);
    if (initial !== 'home') {
        switchPageDOM(initial, false);
    } else {
        document.documentElement.setAttribute('data-page', 'home');
        const hashTarget = (location.hash || '').replace(/^#/, '');
        if (hashTarget && !PAGES.includes(hashTarget)) {
            let sectionId = hashTarget;
            if (sectionId === 'agenda' || sectionId === 'schedule') sectionId = 'program';
            if (sectionId === 'venues') sectionId = 'venue';
            if (sectionId === 'chapters' || sectionId === 'network') sectionId = 'organizers';
            if (sectionId === 'directors' || sectionId === 'leadership' || sectionId === 'team' || sectionId === 'coreteam') sectionId = 'core-team';
            const targetSelector = '#' + sectionId;
            setTimeout(() => {
                const el = document.querySelector(targetSelector);
                if (el) {
                    if (window.__measureBlueprint) window.__measureBlueprint();
                    if (window.__lenis) window.__lenis.resize();
                    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
                    const docTop = getElementDocTop(el);
                    const targetY = Math.max(0, docTop - navH + 10);
                    if (window.__lenis) {
                        window.__lenis.scrollTo(targetY, { immediate: true });
                    } else {
                        window.scrollTo({ top: targetY, behavior: 'instant' });
                    }
                }
            }, 100);
        }
    }

    window.showPage = showPage;
}

/**
 * Auto-hide navbar when not in hover, and reveal on scroll-up / hover / focus.
 */
function initNavAutoHide() {
    if (!nav) return;

    let isNavHovered = false;
    let hideTimer = null;
    let lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    let isScrollingUp = false;
    let scrollEndTimer = null;
    const SCROLL_THRESHOLD = 8;
    const isTouchDevice = window.matchMedia && window.matchMedia('(hover: none)').matches;

    function showNav() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        nav.classList.add('nav-visible');
    }

    function hideNav() {
        if (isNavHovered || nav.contains(document.activeElement)) return;
        if (document.body.classList.contains('staggered-menu-open')) return;
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        nav.classList.remove('nav-visible');
    }

    function scheduleHide(delay = 250) {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            hideNav();
        }, delay);
    }

    if (!isTouchDevice) {
        nav.addEventListener('mouseenter', () => {
            isNavHovered = true;
            showNav();
        });

        nav.addEventListener('mouseleave', () => {
            isNavHovered = false;
            scheduleHide(260);
        });

        // Intent detection: cursor close to top edge reveals
        window.addEventListener('mousemove', (e) => {
            if (e.clientY <= 45) {
                showNav();
            } else if (!isNavHovered && e.clientY > 85 && !nav.contains(document.activeElement)) {
                if (!isScrollingUp) {
                    scheduleHide(220);
                }
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            isNavHovered = false;
            if (!isScrollingUp) {
                scheduleHide(200);
            }
        });
    }

    // Accessible focus management: maintain visibility while focused
    nav.addEventListener('focusin', () => {
        showNav();
    });

    nav.addEventListener('focusout', (e) => {
        if (!nav.contains(e.relatedTarget)) {
            if (!isNavHovered) scheduleHide(250);
        }
    });

    // Scroll listener: scroll up reveals, scroll down hides
    function onScrollNav() {
        const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
        const diff = currentScrollY - lastScrollY;

        if (Math.abs(diff) >= SCROLL_THRESHOLD) {
            if (diff > 0 && currentScrollY > 40) {
                // Scrolling down -> hide navbar immediately (unless hovered or focused)
                isScrollingUp = false;
                if (!isNavHovered && !nav.contains(document.activeElement)) {
                    hideNav();
                }
            } else if (diff < 0) {
                // Scrolling up -> reveal navbar immediately
                isScrollingUp = true;
                showNav();

                // When user stops scrolling up, if not hovering, schedule a graceful auto-hide
                if (scrollEndTimer) clearTimeout(scrollEndTimer);
                scrollEndTimer = setTimeout(() => {
                    isScrollingUp = false;
                    if (!isNavHovered && !nav.contains(document.activeElement)) {
                        scheduleHide(1200);
                    }
                }, 2000);
            }
            lastScrollY = currentScrollY;
        }
    }

    window.addEventListener('scroll', onScrollNav, { passive: true });

    // Initial settle: if mouse is not hovering, tuck away after brief greeting period
    if (!isTouchDevice) {
        scheduleHide(2200);
    }
}
