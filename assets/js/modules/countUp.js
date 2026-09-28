/**
 * React Bits CountUp Component Port
 * Source: https://reactbits.dev/c/text-animations/count-up
 *
 * Smoothly animates numbers from a start value to a target value using
 * easing, with support for tabular digits and custom formatting.
 */

export function countUp(element, {
    from = 0,
    to = 0,
    duration = 2.0,
    delay = 0,
    padDigits = 2,
    ease = 'power2.out',
    onComplete = null
} = {}) {
    if (!element) return;

    // Immediately set starting text value
    element.textContent = padDigits ? String(from).padStart(padDigits, '0') : String(from);

    if (typeof gsap !== 'undefined') {
        const proxy = { val: from };
        return gsap.to(proxy, {
            val: to,
            duration: duration,
            delay: delay,
            ease: ease,
            onUpdate: () => {
                const rounded = Math.round(proxy.val);
                element.textContent = padDigits ? String(rounded).padStart(padDigits, '0') : String(rounded);
            },
            onComplete: () => {
                element.textContent = padDigits ? String(to).padStart(padDigits, '0') : String(to);
                if (onComplete) onComplete();
            }
        });
    } else {
        // Fallback RAF cubic ease-out
        const startTime = performance.now() + delay * 1000;
        const durMs = duration * 1000;

        function frame(now) {
            if (now < startTime) {
                requestAnimationFrame(frame);
                return;
            }
            const progress = Math.min((now - startTime) / durMs, 1);
            // Cubic ease out (Framer Motion spring approximation)
            const factor = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (to - from) * factor);
            element.textContent = padDigits ? String(current).padStart(padDigits, '0') : String(current);
            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                element.textContent = padDigits ? String(to).padStart(padDigits, '0') : String(to);
                if (onComplete) onComplete();
            }
        }
        requestAnimationFrame(frame);
    }
}
