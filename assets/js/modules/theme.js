/**
 * Theme Module
 * Manages the light/dark mode and persistent storage.
 */

const STORAGE_KEY = 'scd-theme';

export function getTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { }
    return 'light';
}

export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { }

    document.querySelectorAll('[data-theme-toggle], #themeToggle').forEach(btn => {
        const isDark = theme === 'dark';
        const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
    });
}

export function toggleTheme(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
    document.querySelectorAll('[data-theme-toggle], #themeToggle').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
    setTheme(getTheme());
}

