/***
 * Countdown Timer Module — Powered by React Bits CountUp
 * Calculates time remaining til South Summit 2026 and animates digits on entry.
 */

import { countUp } from './countUp.js';

// Event date is October 7, 2026 at 08:00 AM (Philippine Time) — per official summit schedule
const target = new Date('2026-10-07T08:00:00+08:00').getTime();

function isSplashActive() {
    if (window.__splashDismissed) return false;
    const splash = document.getElementById('splashScreen');
    return splash && !splash.hidden && !splash.classList.contains('is-hidden') && splash.style.display !== 'none';
}

export function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function getTimeRemaining() {
        const diff = Math.max(target - Date.now(), 0);
        const totalSecs = Math.floor(diff / 1000);
        return {
            days: Math.floor(totalSecs / 86400),
            hours: Math.floor((totalSecs % 86400) / 3600),
            mins: Math.floor((totalSecs % 3600) / 60),
            secs: Math.floor(totalSecs % 60),
        };
    }

    let tickInterval = null;
    let started = false;

    function runEntranceAnimation() {
        if (started) return;
        started = true;

        if (tickInterval) clearInterval(tickInterval);
        const initial = getTimeRemaining();
        let hasCountedUp = false;

        // Animate digits from 00 up to target with staggered delays matching React Bits CountUp
        countUp(daysEl, { from: 0, to: initial.days, duration: 2.0, delay: 0.1, ease: 'power2.out' });
        countUp(hoursEl, { from: 0, to: initial.hours, duration: 2.0, delay: 0.25, ease: 'power2.out' });
        countUp(minsEl, { from: 0, to: initial.mins, duration: 2.0, delay: 0.4, ease: 'power2.out' });
        countUp(secsEl, {
            from: 0,
            to: initial.secs,
            duration: 2.0,
            delay: 0.55,
            ease: 'power2.out',
            onComplete: () => {
                hasCountedUp = true;
            }
        });

        // Regular ticking interval once count-up finishes
        function tick() {
            if (!hasCountedUp) return;
            const { days, hours, mins, secs } = getTimeRemaining();
            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minsEl.textContent = String(mins).padStart(2, '0');
            secsEl.textContent = String(secs).padStart(2, '0');
        }

        tickInterval = setInterval(tick, 1000);
    }

    // If splash screen is currently visible, wait until it dissolves to play the animation
    if (isSplashActive()) {
        window.addEventListener('splash:dismissed', () => {
            runEntranceAnimation();
        }, { once: true });

        // Safety fallback: if splash dismissal event is delayed or skipped
        setTimeout(() => {
            if (!started) runEntranceAnimation();
        }, 2200);
    } else {
        runEntranceAnimation();
    }
}