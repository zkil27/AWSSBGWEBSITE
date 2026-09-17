/**
 * perfManager.js — SCD South Summit 2026
 * --------------------------------------------------------------------------
 * Hardware & Network Adaptive Performance Engine.
 * Detects device memory, CPU concurrency, network speed, and touch constraints
 * to provide adaptive degradation for low-spec phones and slow connections.
 */

let lowSpec = false;
let dataSaver = false;
let deviceTier = 'high'; // 'low' | 'mid' | 'high'

export function initPerfManager() {
  if (typeof window === 'undefined') return;

  const docEl = document.documentElement;

  // 1. Hardware Concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // 2. Device Memory (approximate RAM in GB)
  const memory = navigator.deviceMemory || 8;

  // 3. Network Information
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowNet = conn && (conn.saveData || /(slow-2g|2g|3g)/.test(conn.effectiveType || ''));
  const isSaveData = Boolean(conn && conn.saveData);

  // 4. Input & Viewport
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isMobileViewport = window.innerWidth <= 768;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Classify Device Tier
  if (memory <= 2 || cores <= 2 || isSlowNet) {
    deviceTier = 'low';
    lowSpec = true;
  } else if (memory <= 4 || cores <= 4 || (isCoarse && isMobileViewport)) {
    deviceTier = 'mid';
    lowSpec = true;
  } else {
    deviceTier = 'high';
    lowSpec = false;
  }

  dataSaver = isSaveData || isSlowNet;

  // Decorate root document element
  if (lowSpec) {
    docEl.classList.add('is-low-spec');
  }
  if (dataSaver) {
    docEl.classList.add('is-data-saver');
  }
  if (isReducedMotion) {
    docEl.classList.add('is-reduced-motion');
  }

  console.info(`[PerfManager] Initialized: Tier=${deviceTier}, Cores=${cores}, RAM=~${memory}GB, LowSpec=${lowSpec}, DataSaver=${dataSaver}`);
}

/** Whether the current device is classified as low-spec or constrained */
export function isLowSpec() {
  return lowSpec;
}

/** Whether the user requested data saving or is on a 2G/3G network */
export function isDataSaver() {
  return dataSaver;
}

/** Whether expensive rAF loops, procedural shaders, and heavy tweens should be throttled or bypassed */
export function shouldThrottleAnimations() {
  return lowSpec || dataSaver;
}

/** Returns the active tier */
export function getDeviceTier() {
  return deviceTier;
}
