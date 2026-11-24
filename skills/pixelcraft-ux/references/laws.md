# UX laws as operational checks

Evidence: established UX laws, platform ergonomics specifications, WCAG 2.2 target/timing floors, and usability research. Use these checks to spot concrete friction before build and during audit—not as pseudo-mathematical dogma.

## Quantitative target & motor ergonomics (Fitts's Law)

Match control size, spacing, and screen placement to input precision and frequency:

| Surface / Modality | Minimum target size | Spacing / separation | Edge & ergonomic placement |
|---|---|---|---|
| **iOS / visionOS touch** | `44 × 44 pt` (`60 pt` recommended gaze/pinch on visionOS) | `≥ 8 pt` between adjacent controls | Primary frequent actions in bottom thumb zone; destructive actions separated from confirm |
| **Android / Material touch** | `48 × 48 dp` (even if visible icon is `24 dp`, expand hit slop) | `≥ 8 dp` clearance between interactive targets | Bottom bars / floating actions within one-handed reach; avoid top-corner primary triggers on tall phones |
| **Web pointer + coarse touch** | `≥ 24 × 24 CSS px` WCAG 2.2 AA floor (`≥ 44 × 44 CSS px` on touch/responsive targets) | ≥ 24px spacing circle if target is smaller than 24px; `≥ 8px` gap between destructive & primary actions | Never trap small icon buttons flush against resize handles or scrollbars |
| **Desktop pointer (macOS/Windows/Linux)** | `≥ 28–32 px` toolbar/row height; full-row hit target for lists/menus | Zero dead gap between screen edge and edge-pinned menus/scrollbars | Exploit infinite-depth screen edges (menu bar, top-corner close/back, docked rails) by extending hit areas flush to window/screen edges |
| **Terminal / TUI keyboard** | Single-key triggers (`j`/`k`, `/`, `?`, `q`, `Esc`) for high-frequency actions | Separate destructive chords (`Shift+D`, `Ctrl+K` + confirm) from navigation keys | Keep key legend visible in footer/status bar; never collide with terminal/tmux prefixes (`Ctrl+C`, `Ctrl+B`, `Ctrl+A`) or Vim/Emacs muscle memory without disclosure |

## Quantitative response-latency tiers (Doherty / Miller / Web Vitals)

| Latency tier | Threshold | Required UI behavior |
|---|---|---|
| **Direct manipulation / press** | `≤ 100 ms` | Immediate visual/haptic acknowledgment (`:active`, selection highlight, cursor echo) |
| **Interactive responsiveness (INP)** | `≤ 200 ms` | Browser interaction-to-next-paint budget; break heavy JS work so clicks/typing stay fluid |
| **Momentum threshold (Doherty)** | `≤ 400 ms` | Ideal loop for filter, search-as-you-type, tab switch, and optimistic mutation |
| **Uninterrupted flow** | `≤ 1 s` | Avoid flashing spinners/skeletons below ~200–300 ms; show subtle pending cues only when work crosses it |
| **Attention boundary** | `> 10 s` | Show determinate progress (or stage status), allow cancellation, and support background continuation |

## Cognitive-load & decision checks (Hick, Jakob, Chunking)

| Principle | Quantitative / concrete check | Misuse to avoid |
|---|---|---|
| **Hick's Law** | Cap top-level primary navigation at ~5–7 distinct buckets; limit single-choice button bars to 1 primary + 1–2 secondary actions; group dense settings into scannable categories with search | Hiding frequent primary controls inside nested overflow menus just to make a toolbar look minimal |
| **Chunking / Miller** | Group related form fields into chunks of 3–5 inputs with visible section headings; format long strings (cards, IBANs, codes) in 3–4 character groups | Wrapping every unrelated field in nested bordered cards that multiply visual noise |
| **Jakob's Law** | Honor platform navigation/shortcut conventions (`Cmd+K` / `Ctrl+K`, swipe-back on iOS, system Back on Android, `Esc` closes overlays) | Copying mobile bottom sheets onto desktop CAD tools or web hamburger drawers onto native macOS apps |
| **Recognition over recall** | Show visible current filters, recent items, command palette hints, and inline units/formats instead of expecting users to memorize codes or hidden shortcuts | Dumping every rare advanced flag onto the default screen |
| **Smart defaults** | Preselect the safest, reversible, high-frequency option and display the active default plainly | Dark-pattern opt-ins, hidden consent, or silently destructive defaults |
| **Peak-end & recovery** | Design completion summaries, receipts, undo toasts, and error recovery with the same rigor as onboarding | Spending the entire craft budget on the hero/welcome screen while leaving errors generic |
| **Aesthetic-usability boundary** | Never accept visual polish as a substitute for a broken task, hidden label, or slow path | Rationalizing failed contrast or mystery navigation as “minimalist” |

Validate every hypothesis against real content, the state matrix, platform conventions, and evidence-labeled review.
