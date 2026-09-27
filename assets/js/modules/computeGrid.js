/**
 * Compute Grid Module
 * --------------------------------------------------------------------------
 * A reactive, grid-aligned canvas background that turns the static 52px line
 * grid painted on <body> (see theme.css) into a live "compute fabric".
 *
 * Two composed behaviors, both driven by ONE requestAnimationFrame loop and
 * sharing ONE lit-cell map + color palette:
 *
 *   1. Reactive Compute Grid (primary) — cells near the cursor light up in
 *      brand colors and fade out behind it.
 *   2. Boot-up Sweep (first load) — a one-shot wavefront lights cells across
 *      the grid on entry, then settles.
 *
 * The canvas sits at z-index 0, position:fixed, pointer-events:none — above
 * the body's painted grid but behind all page content (.page/footer are
 * z-index:1). It reads the exact grid size + brand colors from the live CSS
 * custom properties, so it stays perfectly grid-aligned and theme-driven.
 *
 * Accessibility & performance: honors prefers-reduced-motion, disables hover
 * effects on coarse pointers, pauses when the tab is hidden, caps DPR, and
 * degrades to a no-op (leaving the static CSS grid intact) if the
 * canvas/context is unavailable. The reactive glow follows the cursor at any
 * scroll position, across the full length of every page.
 */

import { isLowSpec } from './perfManager.js';

/* ============================ Tuning constants ============================ */
const CFG = {
  fallbackGridSize: 52,       // matches --grid-size in theme.css
  dprCap: 2,                  // cap devicePixelRatio for perf on hi-dpi/mobile

  // Lit cells
  cellInset: 1,               // px inset so lit squares sit inside grid lines
  cellDecayPerSec: 0.6,       // brightness units lost per second (higher = faster fade)
  cursorRadius: 0,            // Chebyshev radius (in cells) lit around the cursor (0 = single 1x1 cell)
  cursorCoreBrightness: 0.9,  // brightness at the hovered cell
  maxLitCells: 900,           // safety cap on the lit-cell map
  pointerMoveThrottleMs: 16,  // ~60fps pointer sampling

  // Boot-up sweep
  bootSweepMs: 1300,          // duration of the one-shot power-on sweep
  bootSweepBrightness: 0.8,   // brightness of freshly-swept cells
  bootSweepBandCells: 4,      // thickness (in cells) of the moving wavefront
  bootSweepDensity: 0.34,     // fraction of cells in the band that light up (higher = more boxes)

  // Ambient Blocks (Animated background boxes)
  blockOpacity: 1.0,          // High opacity for persistent boxes on desktop gutters
  mobileBlockOpacity: 0.85,   // Vibrant calibrated opacity for mobile edge accents
  blockRepeatY: 42,           // Vertical repeat interval (in rows)
  blockAnimIntervalMs: 2400,  // How often blocks decide to shift/recolor

  // Per-theme alpha multipliers (kept subtle so content stays dominant)
  alpha: {
    light: { cell: 0.30 },
    dark: { cell: 0.42 },
  },
};

const COLOR_VARS = ['--blue', '--purple', '--orange', '--green', '--pink'];

/* ================================ State ================================== */
let canvas = null;
let ctx = null;
let dpr = 1;
let viewW = 0;
let viewH = 0;
let gridSize = CFG.fallbackGridSize;

let colors = ['#44b3fe', '#a759ff', '#fc9907', '#07e383', '#fe57ea'];
let themeAlpha = CFG.alpha.light;

/** Lit cells: key "col,row" -> { b: brightness 0..1, c: colorIndex } */
const litCells = new Map();

let running = false;
let rafId = 0;
let lastTs = 0;
let startTs = 0;

let hasHover = true;         // false on coarse-pointer devices
let reducedMotion = false;
let pageVisible = true;

let pointerCell = null;      // { col, row } of last pointer position, or null
let lastPointerSampleTs = 0;

/* ============================== Utilities =============================== */
function readCssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function refreshColors() {
  colors = COLOR_VARS.map((v, i) => readCssVar(v, colors[i]));
  const theme = document.documentElement.getAttribute('data-theme');
  themeAlpha = theme === 'dark' ? CFG.alpha.dark : CFG.alpha.light;
}

function refreshGridSize() {
  const raw = readCssVar('--grid-size', `${CFG.fallbackGridSize}px`);
  const n = parseFloat(raw);
  gridSize = Number.isFinite(n) && n > 0 ? n : CFG.fallbackGridSize;
}

function getGridOffsetX() {
  const currentW = viewW || window.innerWidth;
  const offset = ((currentW - gridSize) * 0.5) % gridSize;
  return offset < 0 ? offset + gridSize : offset;
}

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (!Number.isFinite(n)) return { r: 68, g: 179, b: 254 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function cellKey(col, row) {
  return col + ',' + row;
}

/** Boost (or set) a lit cell's brightness, keeping the strongest value. */
function lightCell(col, row, brightness, colorIndex) {
  if (litCells.size >= CFG.maxLitCells && !litCells.has(cellKey(col, row))) return;
  const key = cellKey(col, row);
  const existing = litCells.get(key);
  if (existing) {
    existing.b = Math.min(1, Math.max(existing.b, brightness));
  } else {
    litCells.set(key, {
      b: Math.min(1, brightness),
      c: colorIndex != null ? colorIndex : (Math.random() * colors.length) | 0,
    });
  }
}

/* ============================== Sizing & Occlusion ====================== */
let exclusionZones = [];

let gutterBounds = {
  maxLeftCol: -1,
  minRightCol: 9999,
  hasGutters: false,
};

export function updateGutterBounds() {
  const currentW = viewW || window.innerWidth;
  const bodyW = document.body.clientWidth || currentW;
  const offsetX = getGridOffsetX();
  const totalCols = Math.max(1, Math.floor((bodyW - offsetX) / gridSize));

  // Determine safe gutter columns outside the central content column (--container: 1240px).
  // On widescreen (>= 1400px), tiles can move up to the 6th grid (columns 0..5 on left, -6..-1 on right).
  // On medium desktop (1200px - 1400px), up to 4 columns (0..3).
  // On small desktop (980px - 1200px), up to 2 columns (0..1).
  // Below 980px or when totalCols < 14, mobile edge columns only.
  let safeCols;
  if (bodyW >= 1400) {
    safeCols = 5; // 6 columns (0, 1, 2, 3, 4, 5) on left and right
  } else if (bodyW >= 1200) {
    safeCols = 3; // 4 columns (0, 1, 2, 3) on left and right
  } else if (bodyW >= 980) {
    safeCols = 1; // 2 columns (0, 1) on left and right
  } else {
    safeCols = 0;
  }

  const maxLeftCol = Math.max(0, safeCols);
  const minRightCol = Math.max(maxLeftCol + 1, totalCols - 1 - safeCols);

  gutterBounds = {
    maxLeftCol,
    minRightCol,
    hasGutters: totalCols >= 10,
    totalCols,
  };
}

export function updateExclusionBounds() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  exclusionZones = [];
  updateGutterBounds();

  // Full-span sections: sections where NO ambient blocks should appear across their vertical height
  // - footer.site-footer: Full-bleed architectural sign-off and site ledger
  const fullSpanSelectors = ['footer.site-footer'];
  for (const sel of fullSpanSelectors) {
    const el = document.querySelector(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.height > 0) {
        exclusionZones.push({
          fullWidth: true,
          top: r.top + scrollY - 24,
          bottom: Math.max(r.bottom + scrollY + 2000, (document.documentElement.scrollHeight || 0) + 2000),
        });
      }
    }
  }
}

export function updateVenueGridAnchor() {
  // Safe no-op retained for backwards compatibility
}

export function updateMarqueeBounds() {
  updateExclusionBounds();
}

function isCellOccluded(col, row) {
  const currentW = viewW || window.innerWidth;
  const bodyW = document.body.clientWidth || currentW;
  const offsetX = getGridOffsetX();
  const totalCols = Math.max(1, Math.floor((bodyW - offsetX) / gridSize));
  const isMobile = currentW < 768 || totalCols < 14;

  if (!isMobile) {
    // 1. INVISIBLE BORDER GUARD: The middle of the screen is strictly off-limits for tiles
    if (col > gutterBounds.maxLeftCol && col < gutterBounds.minRightCol) {
      return true;
    }
  }

  // 2. Full-span exclusion zones (#program, footer)
  const docY = row * gridSize;
  const docBottom = docY + gridSize;

  for (let i = 0; i < exclusionZones.length; i++) {
    const z = exclusionZones[i];
    if (docBottom > z.top && docY < z.bottom) {
      if (z.fullWidth) return true;
      const docX = offsetX + col * gridSize;
      const docRight = docX + gridSize;
      if (docRight > z.left && docX < z.right) return true;
    }
  }
  return false;
}

function resize() {
  if (!canvas || !ctx) return;
  viewW = window.innerWidth;
  viewH = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, isLowSpec() ? 1 : CFG.dprCap);
  canvas.width = Math.round(viewW * dpr);
  canvas.height = Math.round(viewH * dpr);
  canvas.style.width = viewW + 'px';
  canvas.style.height = viewH + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  refreshGridSize();
  updateExclusionBounds();
}

/* ============================ Lit cells ================================= */
function updateLitCells(dt) {
  const decay = CFG.cellDecayPerSec * dt;
  for (const [key, cell] of litCells) {
    cell.b -= decay;
    if (cell.b <= 0) litCells.delete(key);
  }
}

function drawLitCells() {
  const size = gridSize - CFG.cellInset * 2;
  // Cells are stored in DOCUMENT space; subtract scroll to place them on the
  // fixed canvas so they stay locked to the CSS grid painted on <body>.
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const offsetX = getGridOffsetX();
  for (const [key, cell] of litCells) {
    const comma = key.indexOf(',');
    const col = +key.slice(0, comma);
    const row = +key.slice(comma + 1);
    const x = offsetX + col * gridSize - scrollX + CFG.cellInset;
    const y = row * gridSize - scrollY + CFG.cellInset;
    if (x > viewW || y > viewH || x < -gridSize || y < -gridSize) continue;
    const a = themeAlpha.cell * cell.b;
    ctx.fillStyle = rgba(colors[cell.c % colors.length], a);
    ctx.fillRect(x, y, size, size);
  }
}

/* ============================ Boot sweep ================================ */
function runBootSweep(elapsed) {
  if (reducedMotion) return;
  const t = elapsed / CFG.bootSweepMs; // 0..1
  if (t >= 1) return;
  const currentW = viewW || window.innerWidth;
  const isMobile = currentW < 1024;
  const cols = Math.ceil(viewW / gridSize);
  const rows = Math.ceil(viewH / gridSize);
  const maxDiag = cols + rows;
  // Diagonal wavefront position (in col+row units).
  const front = t * maxDiag;
  const band = CFG.bootSweepBandCells;

  // On mobile, use softer density and brightness so initial entry is a smooth cyber accent
  const density = isMobile ? 0.16 : CFG.bootSweepDensity;
  const brightness = isMobile ? 0.40 : CFG.bootSweepBrightness;

  for (let col = 0; col <= cols; col++) {
    for (let row = 0; row <= rows; row++) {
      const d = col + row;
      if (d <= front && d > front - band) {
        // Only light a subset so it reads as cells, not a solid fill.
        if (Math.random() < density) {
          lightCell(col, row, brightness, (col + row) % colors.length);
        }
      }
    }
  }
}

/* ========================== Ambient Blocks ============================== */
/* Desktop ambient blocks:
   Scattered, airy nodes flanking the landing page down the full document height.
   Moves freely outside the central content column up to the 6th grid (columns 0..5 on left, -6..-1 on right).
   Color map: 0: Blue (#44b3fe), 1: Purple (#a759ff), 2: Orange (#fc9907), 3: Green (#07e383), 4: Pink (#fe57ea)
*/
const ambientBlocks = [
  // === Left Gutter Flow (Columns 0 to 5 — moving until the 6th grid, continuous coverage) ===
  { c: 2, r: 0, color: 0, alpha: 0.85 },
  { c: 0, r: 1, color: 2, alpha: 0.90 },
  { c: 4, r: 2, color: 1, alpha: 0.85 },
  { c: 1, r: 3, color: 3, alpha: 0.90 },
  { c: 5, r: 4, color: 0, alpha: 0.85 },
  { c: 3, r: 6, color: 4, alpha: 0.85 },
  { c: 0, r: 7, color: 2, alpha: 0.90 },
  { c: 4, r: 8, color: 1, alpha: 0.85 },
  { c: 2, r: 9, color: 3, alpha: 0.90 },
  { c: 5, r: 11, color: 0, alpha: 0.85 },
  { c: 1, r: 12, color: 4, alpha: 0.90 },
  { c: 3, r: 13, color: 2, alpha: 0.85 },
  { c: 0, r: 15, color: 1, alpha: 0.90 },
  { c: 4, r: 16, color: 3, alpha: 0.85 },
  { c: 2, r: 17, color: 0, alpha: 0.90 },
  { c: 5, r: 19, color: 2, alpha: 0.85 },
  { c: 1, r: 20, color: 4, alpha: 0.90 },
  { c: 3, r: 21, color: 1, alpha: 0.85 },
  { c: 0, r: 23, color: 3, alpha: 0.90 },
  { c: 4, r: 24, color: 0, alpha: 0.85 },
  { c: 2, r: 26, color: 2, alpha: 0.90 },
  { c: 5, r: 27, color: 4, alpha: 0.85 },
  { c: 1, r: 28, color: 1, alpha: 0.85 },
  { c: 3, r: 30, color: 3, alpha: 0.90 },
  { c: 0, r: 31, color: 0, alpha: 0.85 },
  { c: 4, r: 33, color: 2, alpha: 0.90 },
  { c: 2, r: 34, color: 4, alpha: 0.85 },
  { c: 5, r: 36, color: 1, alpha: 0.90 },
  { c: 1, r: 37, color: 3, alpha: 0.85 },
  { c: 3, r: 38, color: 0, alpha: 0.90 },
  { c: 0, r: 40, color: 2, alpha: 0.85 },
  { c: 4, r: 41, color: 4, alpha: 0.90 },

  // === Right Gutter Flow (Columns -6 to -1 — moving until the 6th grid from right, continuous coverage) ===
  { c: -4, r: 0, color: 3, alpha: 0.90 },
  { c: -1, r: 1, color: 1, alpha: 0.85 },
  { c: -5, r: 2, color: 4, alpha: 0.90 },
  { c: -2, r: 3, color: 0, alpha: 0.85 },
  { c: -6, r: 5, color: 2, alpha: 0.90 },
  { c: -3, r: 6, color: 1, alpha: 0.85 },
  { c: -1, r: 7, color: 3, alpha: 0.90 },
  { c: -5, r: 8, color: 0, alpha: 0.85 },
  { c: -2, r: 10, color: 4, alpha: 0.90 },
  { c: -6, r: 11, color: 2, alpha: 0.85 },
  { c: -4, r: 12, color: 1, alpha: 0.90 },
  { c: -1, r: 14, color: 0, alpha: 0.85 },
  { c: -5, r: 15, color: 3, alpha: 0.90 },
  { c: -3, r: 16, color: 2, alpha: 0.85 },
  { c: -6, r: 18, color: 4, alpha: 0.90 },
  { c: -2, r: 19, color: 1, alpha: 0.85 },
  { c: -4, r: 20, color: 0, alpha: 0.90 },
  { c: -1, r: 22, color: 2, alpha: 0.85 },
  { c: -5, r: 23, color: 3, alpha: 0.90 },
  { c: -3, r: 25, color: 4, alpha: 0.85 },
  { c: -6, r: 26, color: 1, alpha: 0.90 },
  { c: -2, r: 27, color: 0, alpha: 0.85 },
  { c: -4, r: 29, color: 2, alpha: 0.90 },
  { c: -1, r: 30, color: 4, alpha: 0.85 },
  { c: -5, r: 32, color: 1, alpha: 0.90 },
  { c: -3, r: 33, color: 3, alpha: 0.85 },
  { c: -6, r: 35, color: 0, alpha: 0.90 },
  { c: -2, r: 36, color: 2, alpha: 0.85 },
  { c: -4, r: 38, color: 4, alpha: 0.90 },
  { c: -1, r: 39, color: 1, alpha: 0.85 },
  { c: -5, r: 40, color: 3, alpha: 0.90 },
  { c: -3, r: 41, color: 0, alpha: 0.85 },
].map(b => ({
  ...b,
  currentC: b.c, currentR: b.r,
  targetC: b.c, targetR: b.r,
  lastAnimTs: Math.random() * 2000
}));

/* Mobile ambient blocks: strictly edge-anchored to col 0 (left edge) and col -1 (right edge).
   Continuous alternating edge accents across all 42 rows without blank gaps. */
const mobileAmbientBlocks = [
  // Left edge (col 0) — even rows
  { c: 0, r: 0, color: 0, alpha: 0.85 },
  { c: 0, r: 2, color: 3, alpha: 0.90 },
  { c: 0, r: 4, color: 1, alpha: 0.85 },
  { c: 0, r: 6, color: 2, alpha: 0.85 },
  { c: 0, r: 8, color: 4, alpha: 0.90 },
  { c: 0, r: 10, color: 0, alpha: 0.80 },
  { c: 0, r: 12, color: 3, alpha: 0.85 },
  { c: 0, r: 14, color: 1, alpha: 0.90 },
  { c: 0, r: 16, color: 2, alpha: 0.80 },
  { c: 0, r: 18, color: 4, alpha: 0.85 },
  { c: 0, r: 20, color: 0, alpha: 0.85 },
  { c: 0, r: 22, color: 3, alpha: 0.90 },
  { c: 0, r: 24, color: 1, alpha: 0.85 },
  { c: 0, r: 26, color: 2, alpha: 0.80 },
  { c: 0, r: 28, color: 4, alpha: 0.85 },
  { c: 0, r: 30, color: 0, alpha: 0.90 },
  { c: 0, r: 32, color: 3, alpha: 0.85 },
  { c: 0, r: 34, color: 1, alpha: 0.80 },
  { c: 0, r: 36, color: 2, alpha: 0.85 },
  { c: 0, r: 38, color: 4, alpha: 0.90 },
  { c: 0, r: 40, color: 0, alpha: 0.85 },
  // Right edge (col -1) — odd rows
  { c: -1, r: 1, color: 1, alpha: 0.85 },
  { c: -1, r: 3, color: 2, alpha: 0.85 },
  { c: -1, r: 5, color: 0, alpha: 0.80 },
  { c: -1, r: 7, color: 4, alpha: 0.90 },
  { c: -1, r: 9, color: 3, alpha: 0.85 },
  { c: -1, r: 11, color: 1, alpha: 0.85 },
  { c: -1, r: 13, color: 2, alpha: 0.80 },
  { c: -1, r: 15, color: 0, alpha: 0.85 },
  { c: -1, r: 17, color: 4, alpha: 0.90 },
  { c: -1, r: 19, color: 3, alpha: 0.85 },
  { c: -1, r: 21, color: 1, alpha: 0.80 },
  { c: -1, r: 23, color: 2, alpha: 0.85 },
  { c: -1, r: 25, color: 0, alpha: 0.85 },
  { c: -1, r: 27, color: 4, alpha: 0.90 },
  { c: -1, r: 29, color: 3, alpha: 0.85 },
  { c: -1, r: 31, color: 1, alpha: 0.80 },
  { c: -1, r: 33, color: 2, alpha: 0.85 },
  { c: -1, r: 35, color: 0, alpha: 0.85 },
  { c: -1, r: 37, color: 4, alpha: 0.90 },
  { c: -1, r: 39, color: 3, alpha: 0.85 },
  { c: -1, r: 41, color: 1, alpha: 0.85 },
].map(b => ({
  ...b,
  currentC: b.c, currentR: b.r,
  targetC: b.c, targetR: b.r,
  lastAnimTs: Math.random() * 2000
}));

let ambientTimerId = 0;

function scheduleNextAmbientStep() {
  if (ambientTimerId) clearTimeout(ambientTimerId);
  if (!pageVisible || reducedMotion || isLowSpec()) return;
  ambientTimerId = setTimeout(() => {
    ambientTimerId = 0;
    if (pageVisible && !running) {
      start();
    }
  }, CFG.blockAnimIntervalMs);
}

function updateAmbientBlocks(ts, dt) {
  if (reducedMotion) return false;
  const currentW = viewW || window.innerWidth;
  const bodyW = document.body.clientWidth;
  const offsetX = getGridOffsetX();
  const totalCols = Math.floor((bodyW - offsetX) / gridSize);
  const isMobile = currentW < 768 || totalCols < 14;
  const blocks = isMobile ? mobileAmbientBlocks : ambientBlocks;

  let anyMoving = false;

  for (const b of blocks) {
    if (ts - b.lastAnimTs > CFG.blockAnimIntervalMs) {
      b.lastAnimTs = ts + Math.random() * 800;
      // 60% chance to step, 40% chance to recolor
      if (Math.random() < 0.60) {
        if (isMobile) {
          // On mobile, keep column locked strictly to edge (0 or -1); step ±1 tile vertically
          if (b.targetR === b.r) {
            b.targetR = b.r + (Math.random() < 0.5 ? -1 : 1);
          } else {
            b.targetR = b.r;
          }
        } else {
          // Desktop stepping: strictly bounded outside the invisible border
          if (!gutterBounds.hasGutters) continue;

          let tc, tr;
          if (b.targetC === b.c && b.targetR === b.r) {
            const rand = Math.random();

            if (b.c >= 0) {
              // Left gutter block: can ONLY move between 0 and gutterBounds.maxLeftCol
              const baseC = Math.min(b.c, gutterBounds.maxLeftCol);
              if (rand < 0.35) {
                tc = baseC + (Math.random() < 0.5 ? -1 : 1);
                tc = Math.max(0, Math.min(gutterBounds.maxLeftCol, tc));
                tr = b.r;
              } else if (rand < 0.70) {
                tc = baseC;
                tr = b.r + (Math.random() < 0.5 ? -1 : 1);
              } else {
                tc = baseC + (Math.random() < 0.5 ? -1 : 1);
                tc = Math.max(0, Math.min(gutterBounds.maxLeftCol, tc));
                tr = b.r + (Math.random() < 0.5 ? -1 : 1);
              }
            } else {
              // Right gutter block: can ONLY move within right gutter
              const maxInward = Math.max(1, totalCols - gutterBounds.minRightCol);
              const baseC = Math.max(b.c, -maxInward);
              if (rand < 0.35) {
                tc = baseC + (Math.random() < 0.5 ? -1 : 1);
                tc = Math.min(-1, Math.max(-maxInward, tc));
                tr = b.r;
              } else if (rand < 0.70) {
                tc = baseC;
                tr = b.r + (Math.random() < 0.5 ? -1 : 1);
              } else {
                tc = baseC + (Math.random() < 0.5 ? -1 : 1);
                tc = Math.min(-1, Math.max(-maxInward, tc));
                tr = b.r + (Math.random() < 0.5 ? -1 : 1);
              }
            }
          } else {
            // Step back to home position
            tc = b.c >= 0 ? Math.min(b.c, gutterBounds.maxLeftCol) : Math.max(b.c, -Math.max(1, totalCols - gutterBounds.minRightCol));
            tr = b.r;
          }

          const actualTc = tc < 0 ? totalCols + tc : tc;
          let blocked = isCellOccluded(actualTc, tr);
          if (!blocked) {
            for (const other of blocks) {
              if (other !== b && other.targetC === tc && other.targetR === tr) {
                blocked = true;
                break;
              }
            }
          }

          if (!blocked) {
            b.targetC = tc;
            b.targetR = tr;
          } else {
            b.color = (b.color + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
          }
        }
      } else {
        b.color = (b.color + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
      }
    }

    // Smoothly interpolate current to target position
    const diffC = Math.abs(b.targetC - b.currentC);
    const diffR = Math.abs(b.targetR - b.currentR);
    if (diffC > 0.005 || diffR > 0.005) {
      b.currentC += (b.targetC - b.currentC) * 12 * dt;
      b.currentR += (b.targetR - b.currentR) * 12 * dt;
      anyMoving = true;
    } else {
      b.currentC = b.targetC;
      b.currentR = b.targetR;
    }
  }

  return anyMoving;
}

function drawAmbientBlocks() {
  const currentW = viewW || window.innerWidth;
  const bodyW = document.body.clientWidth || currentW;
  const offsetX = getGridOffsetX();
  const totalCols = Math.max(1, Math.floor((bodyW - offsetX) / gridSize));
  const isMobile = currentW < 768 || totalCols < 14;

  if (!isMobile && !gutterBounds.hasGutters) {
    return;
  }

  const blocks = isMobile ? mobileAmbientBlocks : ambientBlocks;
  const opacity = isMobile ? CFG.mobileBlockOpacity : CFG.blockOpacity;

  const size = gridSize - CFG.cellInset * 2;
  const inset = CFG.cellInset;
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  
  const visRows = Math.ceil(viewH / gridSize) + 2;
  const startVisRow = Math.floor(scrollY / gridSize) - 1;

  for (const b of blocks) {
    // Resolve column, clamping within safe gutter bounds so tiles never get culled on smaller desktop widths
    let col = b.currentC;
    if (!isMobile) {
      if (b.c >= 0) {
        col = Math.min(col, gutterBounds.maxLeftCol);
      } else {
        const maxInward = Math.max(1, totalCols - gutterBounds.minRightCol);
        col = Math.max(col, -maxInward);
      }
    }
    const actualCol = col < 0 ? totalCols + col : col;

    // Invisible border guard: never render in the middle
    if (!isMobile && actualCol > gutterBounds.maxLeftCol && actualCol < gutterBounds.minRightCol) {
      continue;
    }

    const blockAlpha = (b.alpha != null ? b.alpha : 1.0) * opacity;
    ctx.fillStyle = rgba(colors[b.color % colors.length], blockAlpha);
    
    // Repeat vertically so the pattern covers the whole page seamlessly at any scroll depth
    const minRep = Math.floor(startVisRow / CFG.blockRepeatY) - 1;
    const maxRep = Math.ceil((startVisRow + visRows) / CFG.blockRepeatY) + 1;
    for (let rep = minRep; rep <= maxRep; rep++) {
      const actualRow = b.currentR + rep * CFG.blockRepeatY;
      
      // Viewport culling
      if (actualRow < startVisRow || actualRow > startVisRow + visRows) continue;

      // Full-span section exclusion (footer)
      if (isCellOccluded(Math.round(actualCol), actualRow)) continue;

      // Snap to full integers to eliminate sub-pixel jitter/blur during movement, adding cellInset for visible grid lines
      const x = Math.round(offsetX + actualCol * gridSize - scrollX) + inset;
      const y = Math.round(actualRow * gridSize - scrollY) + inset;

      // Wrap-around bounds guard for rendering
      if (x > viewW || x < -gridSize) continue;

      ctx.fillRect(x, y, size, size);
    }
  }
}

/* ============================== Pointer ================================= */
function onPointerMove(e) {
  if (!hasHover) return;
  const now = performance.now();
  
  if (now - lastPointerSampleTs < CFG.pointerMoveThrottleMs) return;
  lastPointerSampleTs = now;

  const offsetX = getGridOffsetX();
  const docX = e.clientX + (window.scrollX || window.pageXOffset || 0);
  const docY = e.clientY + (window.scrollY || window.pageYOffset || 0);
  const col = Math.floor((docX - offsetX) / gridSize);
  const row = Math.floor(docY / gridSize);
  pointerCell = { col, row };

  const r = CFG.cursorRadius;
  for (let dc = -r; dc <= r; dc++) {
    for (let dr = -r; dr <= r; dr++) {
      const dist = Math.max(Math.abs(dc), Math.abs(dr));
      const brightness = CFG.cursorCoreBrightness * (1 - dist / (r + 1));
      if (brightness > 0.02) lightCell(col + dc, row + dr, brightness);
    }
  }

  // Wake up loop if sleeping
  if (!running && shouldRun()) {
    start();
  }
}

function onPointerLeave() {
  pointerCell = null;
}

/* =============================== Loop =================================== */
function frame(ts) {
  if (!running) return;
  const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
  lastTs = ts;
  const elapsed = ts - startTs;

  ctx.clearRect(0, 0, viewW, viewH);

  runBootSweep(elapsed);
  const blocksMoving = updateAmbientBlocks(ts, dt);
  updateLitCells(dt);

  // Z-index ordering from back to front:
  // 1. Lit Grid Cells (cursor glow)
  drawLitCells();
  // 2. Ambient Blocks (on top of everything so the cursor glow goes behind them)
  drawAmbientBlocks();

  // If on low-spec device or reduced motion: freeze into static state to eliminate canvas drain
  if (isLowSpec() || reducedMotion) {
    if (elapsed > CFG.bootSweepMs + 400 && litCells.size === 0) {
      stop();
      return;
    }
  } else {
    // If boot sweep is done, lit cells have faded out, and ambient blocks have settled:
    // sleep the loop to drop CPU/GPU usage to 0% until next cursor movement, scroll, or block shift.
    if (elapsed > CFG.bootSweepMs + 400 && litCells.size === 0 && !blocksMoving) {
      stop();
      scheduleNextAmbientStep();
      return;
    }
  }

  rafId = requestAnimationFrame(frame);
}

function shouldRun() {
  // Runs across the whole page (any scroll position); only pause when the tab
  // is hidden. Lit cells are tracked in document space, so the cursor glow
  // stays grid-aligned no matter how far the page is scrolled.
  return pageVisible;
}

function start() {
  if (running || !ctx) return;
  if (ambientTimerId) {
    clearTimeout(ambientTimerId);
    ambientTimerId = 0;
  }
  if (reducedMotion) {
    // Minimal static state: one clear, no loop. (Cursor glow still works via
    // the pointermove handler painting a single frame; see maybePaintStatic.)
    maybePaintStatic();
    return;
  }
  running = true;
  lastTs = 0;
  if (!startTs) startTs = performance.now();
  rafId = requestAnimationFrame(frame);
}

function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function syncRunState() {
  if (shouldRun()) start();
  else stop();
}

/* For reduced-motion or idle low-spec mobile: paint a single static frame of
   the lit cells and ambient blocks without running an rAF loop. */
function maybePaintStatic() {
  if (!ctx) return;
  if (!reducedMotion && running) return;
  ctx.clearRect(0, 0, viewW, viewH);
  drawLitCells();
  drawAmbientBlocks();
}

/* ============================== Setup =================================== */
function createCanvas() {
  const c = document.createElement('canvas');
  c.id = 'computeGrid';
  c.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(c, document.body.firstChild);
  const context = c.getContext('2d');
  if (!context) {
    c.remove();
    return false;
  }
  canvas = c;
  ctx = context;
  return true;
}

function watchTheme() {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-theme') {
        refreshColors();
        maybePaintStatic();
        break;
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
}

export function initComputeGrid() {
  // Reduced-motion + coarse-pointer detection.
  const rmq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverq = window.matchMedia('(hover: none)');
  reducedMotion = rmq.matches;
  hasHover = !hoverq.matches;

  if (!createCanvas()) {
    // Graceful no-op: the static CSS grid remains fully intact.
    return;
  }

  refreshColors();
  resize();
  watchTheme();

  window.addEventListener('resize', () => {
    resize();
    maybePaintStatic();
  }, { passive: true });

  window.__updateComputeGridBounds = () => {
    updateExclusionBounds();
    maybePaintStatic();
  };

  window.addEventListener('load', () => {
    updateExclusionBounds();
    maybePaintStatic();
  });

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!running && ctx) {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          maybePaintStatic();
          scrollTicking = false;
        });
      }
    }
  }, { passive: true });

  // Pointer reactivity (skipped on coarse pointers via the guard inside).
  window.addEventListener('pointermove', (e) => {
    onPointerMove(e);
    maybePaintStatic();
  }, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // Pause when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    pageVisible = document.visibilityState === 'visible';
    syncRunState();
  });

  // React to OS-level reduced-motion changes at runtime.
  rmq.addEventListener('change', (e) => {
    reducedMotion = e.matches;
    if (reducedMotion) {
      stop();
      maybePaintStatic();
    } else {
      startTs = 0; // allow a fresh boot sweep
      syncRunState();
    }
  });

  syncRunState();
}
