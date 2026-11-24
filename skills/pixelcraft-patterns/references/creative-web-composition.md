# Art-directed editorial composition patterns

Use this reference for **expressive layout rhythm, visual pacing, and art-directed editorial composition** (portfolios, case studies, product launches, brand stories, interactive showcases). For conversion hierarchy, proof ethics, and funnel mechanics, read [marketing.md](marketing.md); for platform-specific CSS grid, animation, and WebGL implementation mechanics, coordinate with `pixelcraft-web`.

## Editorial composition catalog

Treat each entry as a content-and-interaction recipe—never a fixed wireframe to copy verbatim:

| Pattern | Editorial rhythm | Key failure & resilience checks |
|---|---|---|
| **Editorial opener** | Subject-led framing (asymmetric split, full-bleed artifact, typographic poster, or live specimen) + concrete claim + single next cue | Avoid default centered hero / two CTAs / three-card row; verify text contrast over media and narrow-viewport crop |
| **Case-study index** | Curated grid or indexed list with real domain metadata (year, discipline, outcome) and persistent filters | Preserve labels, keyboard reach, filter state on Back, and empty/loading states |
| **Project detail** | Context & constraint -> role -> process artifact -> verified outcome | Never invent metrics; ensure full long-form reading works cleanly under reduced motion |
| **Product story** | Material/problem -> mechanism -> live/static specimen -> decision action | Keep specs, pricing, and interactive controls accessible without depending on animation |
| **Interactive artifact viewer** | Primary visual/3D/specimen paired with semantic specs and explicit viewpoint presets | Renderer failure or slow GPU must fall back to high-res stills without blocking comparison |
| **Capabilities / index directory** | Structured typographic table or grouped index with concrete examples | Replace decorative infinite marquee tickers with scanable, pauseable or static content |
| **Narrative chapter** | Numbered/titled chapter prose paired with an optional persistent artifact | Require direct chapter links, normal scroll pacing, and static reduced-motion layout |
| **Structured mega-menu / index overlay** | Grouped destinations with clear spatial hierarchy and keyboard model | Enforce Escape dismissal, focus restoration, viewport height fit, and touch parity |
| **Editorial footer** | Colophon, sitemap, contact/legal, and a meaningful next-story cue | Do not trap users behind decorative curtain animations delaying footer links |

## Adapting references without cloning

1. Analyze reference sites at the **structural level** (pacing, typographic scale contrast, whitespace ratio, media-to-copy balance, transition timing)—never copy brand palettes, iconography, copy tone, or assets.
2. Pair expressive sections with calm functional sections so eye fatigue stays low and interactive controls remain immediately recognizable.
3. Define how each asymmetric or multi-column editorial band collapses into a clean single-column reading order on narrow screens before implementation.

## Do/don't pairs

| Do | Don't |
|---|---|
| Derive section pacing from real media aspect ratios and copy length | Stretch thin copy across giant empty scroll corridors |
| Pair interactive 3D/canvas specimens with static fallback imagery | Render a blank black box when GPU acceleration is unavailable |
| Keep reading order and visual order aligned across breakpoints | Reorder columns purely visually in ways that scramble keyboard/screen-reader flow |
| Give expressive typography generous fallback metrics and zoom headroom | Lock display headlines to rigid viewport-height boxes that clip at 200% zoom |

## Acceptance

Every editorial pattern must document its primary reading task, collapsed mobile/narrow order, localization/text-expansion tolerance, reduced-motion fallback, and media-failure behavior.
