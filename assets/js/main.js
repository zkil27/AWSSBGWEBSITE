/**
 * AWS Student Community Day: South Summit 2026
 * Main Application Entry Point
 */

import { initPerfManager } from './modules/perfManager.js';
import { initTheme } from './modules/theme.js';
import { initRouter } from './modules/routing.js';
import { initStaggeredMenu } from './modules/staggeredMenu.js';
import { initAssistiveTouch } from './modules/assistiveTouch.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { initCountdown } from './modules/countdown.js';
import { initSpeakers } from './modules/speakersUI.js?v=20260923-lineup-clean';
import { initScheduleUI } from './modules/scheduleUI.js';
import { initMerch } from './modules/merchUI.js';
import { initChapters } from './modules/chaptersUI.js?v=20260923-fb-only';
import { initDirectors } from './modules/directorsUI.js';
import { initSponsors } from './modules/sponsorsUI.js?v=20260923-perf-opt';
import { initComputeGrid } from './modules/computeGrid.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initBlueprintScroll } from './modules/blueprintScroll.js';
import { initBlueprintShader } from './modules/blueprintShader.js';
import { initVenueUI } from './modules/venueUI.js';
import { initStackedCards } from './modules/stackedCards.js';
import { initSplitText } from './modules/splitText.js';
import { initPixelTransition, initSplashPixelTransition } from './modules/pixelTransition.js';
import { initFooterLedger } from './modules/footerLedger.js';
import { initScrollExpand } from './modules/scrollExpand.js';
import { initHeroPosterUI } from './modules/heroPosterUI.js';

// Detect hardware & network constraints immediately
initPerfManager();

// Arm splash transition immediately so early clicks/timers are captured
initSplashPixelTransition();

document.addEventListener('DOMContentLoaded', () => {
    initPixelTransition();
    // 1. Initialize core system modules
    initTheme();
    initRouter();
    initStaggeredMenu();
    initAssistiveTouch();
    // Smooth scroll (Lenis) — before content/reveal so its showPage wrap and
    // scroll source are ready for the blueprint horizontal pan. No-ops on
    // touch / reduced-motion (native scroll).
    initSmoothScroll();
    initCountdown();
    initHeroPosterUI();
    initScrollExpand();

    // 2. Initialize UI views & dynamic content
    initSpeakers();
    initScheduleUI();
    initMerch();
    initChapters();
    initDirectors();
    initSponsors();
    initVenueUI();
    initFooterLedger();

    // 3. Reactive background animation (sits behind all content)
    initComputeGrid();
    initBlueprintShader();

    // 4. Stacked cards on About page
    initStackedCards();

    // 5. Scroll-triggered text animations (React Bits SplitText port)
    initSplitText();

    // 6. Scroll-triggered entrance motion — last, so the cards injected by the
    //    init*UI() calls above already exist to be tagged and observed.
    initScrollReveal();

    // 7. Blueprint horizontal-pan — after content injection (schedule speaker
    //    chips affect the track width) and after Lenis is set up, since the pan
    //    reads Lenis's smoothed scroll. No-ops on touch / reduced-motion.
    initBlueprintScroll();
});
