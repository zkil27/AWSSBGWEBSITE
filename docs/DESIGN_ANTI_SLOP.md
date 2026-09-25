# Design Anti-Slop Checklist

A working reference for avoiding "AI slop" design defaults on this project.

**Source & attribution:** Distilled from *Impeccable — "The missing design vocabulary
for agents"* ([impeccable.style/slop](https://impeccable.style/slop/)). Content has been
paraphrased and reorganized for this repo's use; see the original for the full catalog
(61 detector rules + 6 design-review patterns). Content was rephrased for compliance with
licensing restrictions.

This complements the repo's existing `.agents/skills/` guidance (frontend-design,
ui-layout-design, web-design-guidelines, ui-ux-pro-max) and `.kiro/steering/project-conventions.md`.

---

## The core idea

A "finding" is a reason to look closer, not an automatic error. Always weigh the page, the
task, and any intentional design choice. Decoration that doesn't help someone use the page
is the enemy.

---

## 1. Cards & surfaces (most relevant to the speaker/sponsor cards)

- **No side-tab / top accent stripe on a rounded card** unless it marks a real status or
  warning. A colored stripe on every card makes an ordinary card look like an alert and
  decorates nothing useful.
- **Pick the edge OR the shadow, not both.** A hairline border *and* a wide shadow both try
  to define the same surface — choose one so the shape reads clearly.
- **No nested cards.** Cards inside cards add padding, shadows, and depth around the same
  content. Flatten with spacing, typography, and dividers instead.
- **Avoid extreme border-radius.** Very large corner radii squeeze content and make every
  card look identical. Match the radius to the card's size.
- **Let the background define the card** where possible; if a border is needed, keep it light.
- **No decorative grid-line backgrounds** — reserve grids for canvases/maps/measurement.
- **No repeating-gradient stripes or glow/halo fills** to occupy empty space.

## 2. Motion

- **Images stay still.** Do not zoom/rotate images on hover unless the motion explains what
  someone can do. (This was a slop pattern in the previous card attempt.)
- **No auto-scrolling marquees** that force reading at the page's pace — or give pause controls.
- **No pulsing status dots / blinking cursors** on static content.
- **No bounce/elastic easing** on routine actions; let things settle quickly.
- **Animate transforms, not layout.** Animating size/spacing shifts neighbors and stutters.
- **Content must be visible by default** — never leave it hidden waiting on an entrance
  animation that might not run.

## 3. Typography

- **Body text ≥ ~16px**; line-height ~1.5; comfortable secondary text too.
- **Clear hierarchy** — vary size/weight/spacing so headings and body don't look the same.
- **Line length 65–75 characters** via `max-width`.
- **No tiny interface text** for nav/links/controls; no crushed or wide letter-spacing on body.
- **No all-caps or justified body text**; uppercase only for short labels.
- **No label/badge above a heading** if it just repeats it — fold useful words into the heading.
- **Don't lean on Inter/Geist by default**; typography should give the product a voice. (This
  repo already has a deliberate stack: Plus Jakarta Sans, Inter, IBM Plex Mono — use it with
  intent, not as filler.)
- **No tiny numbered section labels** unless there's a real sequence to follow.
- **No oversized decorative numerals** that outweigh the content they label.

## 4. Color & contrast

- **Meet WCAG AA:** ≥ 4.5:1 for regular text, ≥ 3:1 for large text.
- **No gradient text** for decoration — one solid color, use size/weight for emphasis.
- **Avoid the "AI palette"** (purple→blue gradients, neon cyan on dark). Build around the
  product's real identity. (This repo's identity = the pixel/brand blocks + brand colors in
  `theme.css`.)
- **Dark mode: keep glow restrained** so useful info stands out.
- **Gray text on colored surfaces looks washed out** — use a darker tint or light text and
  re-check contrast against the actual background.

## 5. Layout & spacing

- **Geometric spacing scale** (4/8px multiples: 8, 16, 24, 32, 48, 64). No random 13px/27px.
- **Proximity:** related items closer; more space between separate groups. No monotonous
  equal gaps everywhere.
- **Section headings get more space above than below.**
- **No horizontal overflow / no content spilling its container** — text wraps, elements shrink.
- **Cards in a scroller need matching space at both ends** (not flush to the edge).
- **Adequate padding** — text should never press against a card/button edge; body text needs
  side padding at narrow widths.
- **Vary layout to the content** — don't repeat the same hero/metric/feature grid with only
  color swaps; don't give every point identical card weight.

## 6. Content / UX writing

- **No redundant text** explaining the same field/label multiple times.
- **No em-dash overuse**; use full stops between separate thoughts.
- **No generic marketing claims** ("supercharge", "world-class") — say what people can do.
- **No forced "Not X. A Y." slogan patterns.**

## 7. Robustness

- **No JavaScript errors on load** — fix before polishing.
- **No broken/placeholder images**; check assets load.
- **Menus/popovers must not be clipped** by an overflow container.
- **Long text wraps or truncates gracefully** without breaking layout.

---

## Quick pre-ship self-check for any component

1. Does every visual element help someone *use* this, or is it decoration?
2. Border **or** shadow — did I accidentally use both?
3. Any accent stripe that isn't communicating status? Remove it.
4. Do images move on hover for no reason? Stop them.
5. Is text ≥16px, ≥4.5:1 contrast, hierarchy clear, line length capped?
6. Spacing on the 4/8 scale, related items grouped by proximity?
7. Equal-height / aligned where the grid implies it; nothing overflows; nothing hidden by default.


---

## Impeccable detector waivers (recorded in `.impeccable/config.json`)

After the QA remediation pass, the following detector rules/values are intentionally
ignored. Each is a deliberate design decision, not an unaddressed defect. Re-evaluate
if the design direction changes.

**Value waivers (`detector.ignoreValues`):**
- `overused-font: inter` and `overused-font: plus jakarta sans` — the documented brand
  type stack (see `.kiro/steering/project-conventions.md`). Deliberately kept.

**Rule waivers (`detector.ignoreRules`):**
- `ai-color-palette` — the AWS-brand block palette (blue/green/purple/pink) and the
  animated "grainient" WebGL background are the site's core visual identity (the one
  signature). Not generic AI purple-gradient slop.
- `radial-spotlight-glow` — only the `#blueprint-pin` grainient backdrop remains; it is
  the signature background.
- `dark-glow` + `gpt-thin-border-wide-shadow` — the About-page chapter/director
  "battle card" component aesthetic (intentional colored rings + soft elevation). Off the
  primary landing experience; restyling risked visual regressions for little payoff.
- `layout-transition` — the About-page stacked-card/masonry accordions genuinely animate
  height; `transform` cannot substitute. All are `prefers-reduced-motion`-guarded.
- `tiny-text` + `tight-leading` + `wide-tracking` — the residuals are all short **uppercase
  micro-labels** at 11px (tier badges, countdown units, schedule durations/pills, view
  tabs, venue captions, brand subtitle). Impeccable's own guidance permits wide tracking /
  compact size on short uppercase labels; forcing 12px/1.4 line-height would break the
  compact countdown, schedule, and badge layouts.
- `low-contrast` — the residuals are text over the two **signature animated media
  surfaces** (the video hero and the WebGL grainient). Real remediation was applied (a
  solid hero scrim and an opaque blueprint text backing, both screenshot-verified
  readable); the detector's remaining reports come from worst-case pixel sampling over
  live video/WebGL frames, which contradicts the visible result.

Note: waiving `tiny-text`, `tight-leading`, `wide-tracking`, and `low-contrast` at the
rule level also suppresses *future* genuine violations of those rules. If typography or
contrast is changed later, temporarily remove the relevant `ignoreRules` entry and re-scan.
