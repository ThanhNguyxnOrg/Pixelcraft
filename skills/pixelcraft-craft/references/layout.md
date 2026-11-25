# Layout and composition

## Composition before components

- Choose the primary scan path: Z/F pattern, editorial column, instrument cluster, object-led spatial composition, timeline, index, or task-first workspace.
- Use asymmetry deliberately: unequal columns, anchored negative space, diagonal/orthogonal tension, or alignment interruption. Do not center everything by default.
- Establish one dominant element per viewport/screen region. Supporting elements need quieter scale, contrast, and motion.
- Equal left/right content edges are often more important than identical internal column widths.
- Cards are one containment tool, not a page structure. Consider tables, lists, editorial columns, comparison matrices, timelines, canvases, toolbars, inspectors, and spatial regions.

## Grids and rhythm

- Define a small spacing base (commonly 4 or 8 in screen UI) and semantic multipliers; dense expert tools may use a smaller rhythm but need stronger alignment discipline.
- Use consistent optical alignment, not merely numeric alignment. Correct for icon mass, uppercase height, hanging punctuation, and image crop.
- Dense Operate UI: prioritize scanlines, aligned values, persistent controls, predictable row heights, and visible state.
- Persuade/Read: vary pacing deliberately across sections; repetition without rhythm creates monotony.
- Do not let grid lines become decoration. Grids should control placement, measurement, or orientation.

## Density by mode

| Mode | Density posture | Key risk |
|---|---|---|
| Persuade | lower density, strong pacing | empty generic hero without substance |
| Operate | medium/high density, stable scanlines | decorative spacing hides data/actions |
| Read | measure-controlled medium density | long lines, weak paragraph rhythm |
| Experience | variable density by scene | disorientation without navigation feedback |
| Play | scene-dependent, HUD clarity | effects obscure critical state |
| Communicate | conservative density | client rendering destroys layout |

## Adaptation

- Restructure at breakpoints/size classes; do not simply scale desktop down.
- Decide what becomes navigation, disclosure, secondary pane, or sequence at narrow widths.
- Compare the same task across size and input classes: a wide comparison table may become aligned summaries with detail on touch, and a persistent sidebar may become reachable disclosure or navigation. Keep comparable facts and destinations reachable; prefer the same semantic structure when it already works.
- Preserve primary action visibility without covering content with sticky chrome.
- Test landscape/portrait, split window, dynamic text, RTL mirroring, safe area, virtual keyboard, controller focus order, and minimum terminal size as applicable.
- Horizontal scrolling can be correct for data tables/timelines, but never accidental page overflow.

## Modern CSS layout primitives

Prefer native CSS layout primitives over JS resize observers or hardcoded breakpoint duplication when targeting modern browsers:

| Primitive | Use for | Concrete idiom / guardrail |
|---|---|---|
| **Container Queries** (`@container`, `cqi`/`cqb`, style queries) | Component-level layout restructuring inside sidebars, split panes, and multi-column grids independent of viewport width | Declare `container-type: inline-size` on wrappers; size type/padding fluidly with `cqi`/`cqb`; use `@container style(--density: compact)` for token-driven density shifts |
| **CSS Subgrid** (`grid-template-rows: subgrid` / `columns: subgrid`) | Aligning internal headings, metadata rows, and footers across sibling grid items without rigid fixed heights | Inherit parent tracks so multi-line localized titles stay baseline-aligned across rows |
| **CSS Anchor Positioning** (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`) | Tooltips, popovers, and menus tethered to triggers with automatic viewport collision flipping | Pair with Popover API; include `position-try-fallbacks: flip-block, flip-inline` and feature-detect (`@supports (anchor-name: --a)`) with fallback positioning for older browsers |
| **Dynamic viewport units** (`svh`, `dvh`, `lvh`) | Full-height mobile shells, sticky composers, and hero frames with collapsible mobile browser toolbars | Use `svh` for stable initial-paint heights that must not jump as toolbars retract; reserve `dvh` for active interactive workspaces (e.g., chat input bars) where real-time bottom-edge fit matters; avoid `100vh` on mobile |
| **Intrinsic sizing animation** (`interpolate-size: allow-keywords` / `calc-size()`) | Smooth disclosure, accordion, and `<details>` height transitions to/from `auto` without measuring `scrollHeight` in JS | Opt in via `interpolate-size: allow-keywords` (or `calc-size(auto, size)`) and gate motion under `prefers-reduced-motion` |

## B2 — Optical alignment, concentric geometry & text-box balance

Numeric bounding-box math produces subtly crooked interfaces; align by optical mass and curvature:

| Law | Defect when ignored | Concrete rule & cross-platform idiom |
|---|---|---|
| **Asymmetric icon centroid offset** | Play triangles (`▶`), chevrons (`›`/`‹`), back/forward arrows, and paper-plane send glyphs centered by bounding box look pushed away from their tip inside circular/square buttons | Shift glyph **`+1–2` units (`px`/`pt`/`dp`) toward its visual center of mass** (e.g., play triangle nudged `+1.5px` inline-end inside a circular button) or author optical padding directly inside the `24×24` icon frame |
| **Concentric corner radii** | Giving nested cards and inner media/buttons the exact same border radius (`16px` inside `16px`) creates pinched, lumpy corner walls | Enforce **`R_outer = R_inner + padding`** (`R_inner = max(0, R_outer - padding)`). Clamp `R_inner` to `0` when `padding >= R_outer`. Use CSS `calc(var(--r-outer) - var(--pad))`, SwiftUI `ConcentricRectangle` / container-relative shapes, or tokenized inner/outer radius pairs |
| **Optical vertical text balance** | Font em-boxes reserve descender space below the alphabetic baseline, making symmetric top/bottom padding look bottom-heavy on buttons, pills, and single-line headers | Trim or compensate vertical metrics: CSS `text-box-trim: trim-both; text-box-edge: cap alphabetic`, Compose/SwiftUI/Qt `FirstBaseline` alignment, or `-1` to `-2` unit bottom padding compensation where trim APIs are unavailable |

## B5 — Forgiving pointer, invisible hit-slop, Safe Triangle & pointer capture

Decouple compact visual density from physical pointer/touch ergonomics so fast movement never mis-fires:

| Mechanism | Required behavior | Cross-platform idioms |
|---|---|---|
| **Invisible hit-slop expansion** | Compact `24–28` unit icon controls (`px`/`pt`/`dp`) keep crisp visual bounds while expanding their interactive hit box by **`+6–10` units per side** (meeting `≥ 40–48` unit comfort targets without colliding with neighbors) | **Web:** `position: relative` + `::before { content: ""; position: absolute; inset: -8px; }`<br>**SwiftUI / UIKit:** `.padding(8).contentShape(Rectangle())` or override `point(inside:with:)`<br>**Android / Compose:** `TouchDelegate` or `Modifier.minimumInteractiveComponentSize()`<br>**Flutter / Desktop / Game:** `HitTestBehavior.translucent` padded box, Qt hit-margin, or expanded HUD rect |
| **Safe Triangle submenu corridor** | Cascading hover submenus, flyouts, and megamenus must survive diagonal cursor travel from trigger row to child pane without collapsing across sibling items | Compute a dynamic **Safe Triangle** from cursor exit `(x, y)` to the open submenu's near top and bottom corners (or hold a `120–180ms` directional-intent grace timer while pointer moves toward the submenu); always preserve click/Enter/Arrow keyboard parity |
| **Slider, scrubber & splitter pointer capture** | Dragging a timeline scrubber, range slider, color Loupe, or pane splitter continues smoothly until release even when the pointer drifts outside the narrow track | **Web:** call `el.setPointerCapture(e.pointerId)` on `pointerdown` and release on `pointerup`/`pointercancel`<br>**SwiftUI / Compose / Flutter:** `DragGesture` / `pointerInput { detectDragGestures }` continuous capture<br>**Desktop / Game:** Qt `grabMouse()`, Win32/XAML `CapturePointer` + **`Escape` cancel** + **`Shift`/Arrow fine-stepping** |

## Hierarchy checks

Squint test: primary/secondary/tertiary grouping should remain visible when detail blurs. Remove one visual property at a time; if hierarchy disappears only when color is removed, color-only dependence is likely. Compare real content lengths rather than lorem ipsum symmetry.
