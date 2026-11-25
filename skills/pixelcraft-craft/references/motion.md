# Motion and interaction

Evidence base: usability research, platform motion/accessibility guidance, rendering-performance constraints, and the accessibility floor.

## Purpose before spectacle

Motion earns its cost only when it acknowledges input, shows causality, preserves orientation, communicates progress/state, or creates the direction's single signature moment. Apple gives the same constraint: purposeful, brief, precise, optional motion—not motion for its own sake. Showcase spectacle is not permission to sacrifice usability; celebrated interfaces are still wrong when motion blocks comprehension, control, or access.

## B1 — Frequency-calibrated motion & warm tooltip chains

Calibrate animation duration inversely to daily action frequency—high-repetition controls must never pay ceremonial animation tax:

| Frequency tier | Typical interactions | Duration budget | Required behavior |
|---|---|---|---|
| **High frequency** (`50–100+×/day`) | command palettes, context/dropdown menus, tab/row/cell selection, keyboard list traversal, warm tooltips | **`0–100ms`** (`0ms` on key-repeat / TUI cell step) | Instant acknowledgment; zero stagger or decorative entrance delay; hold-key repeat runs at `0ms` |
| **Warm tooltip chain** | sweeping pointer/focus across sibling toolbar icons or table headers | `300–500ms` cold open (`~100ms` fade) → **`0ms` delay & `0ms` fade** while warm | Once one tooltip in a group opens, sibling tooltips open immediately with zero fade until pointer leaves the group (`~300–400ms` cooldown) |
| **Medium frequency** (`5–30×/day`) | drawers, side sheets, modal dialogs, inspector panes, accordion disclosures | **`150–220ms`** | Snappy deceleration or critically damped spring; retargetable mid-flight without queuing |
| **Low frequency / expressive** (`≤ 1–3×/session`) | first-run onboarding, signature hero reveal, milestone confirmation | **`300–500ms`** | Never block pointer, scroll, or keyboard input; user can click or navigate through immediately |
| **Rendering & concurrency** | all interactive and choreographed layers | compositor-only (`transform`, `opacity`) | Normally 1 primary + at most 2 supporting motions; ban `transition: all`, layout/paint thrashing, and idle loops in Operate/Read |

Tokenize semantic durations and physics (`motion.instant`, `motion.fast`, `motion.panel.enter`, `motion.panel.exit`, `motion.spring.operational`) rather than scattering raw milliseconds.

## B3 — Origin-aware scaling, asymmetric open/close & damped springs

Overlays and interactive surfaces must preserve spatial causality and dismiss without drag:

1. **Subtle trigger-anchored scale (`0.95 → 1.0`, never `0 → 1` center balloon):** popovers, context menus, combobox lists, and contextual sheets enter from **`scale(0.95)`–`scale(0.97)` to `1.0`** paired with opacity, anchored to the trigger's attachment corner or edge—never zooming from `0` or expanding from viewport center when opened by a corner button.
2. **Asymmetric enter vs exit duration:** closing transitions run **faster than opening (`~100–130ms` exit vs `~160–200ms` enter)** using a brisk exit curve (`ease-in` or tight spring) so dismissing menus, modals, and sheets gets out of the user's way immediately.
3. **Velocity-preserving, non-rubbery operational springs (`ζ ≥ 0.85`):** gesture-driven sheets, swipeable cards, and pan-to-dismiss overlays inherit release velocity via spring physics without cartoonish overshoot (damping ratio `ζ ≥ 0.85`—critically or near-critically damped—in Operate/Read UI; degrade to brief opacity crossfades under Reduced Motion).

| Platform | Trigger-origin anchor idiom | Asymmetric timing / operational spring (`ζ ≥ 0.85`) |
|---|---|---|
| **Web CSS / Popover** | `transform-origin: var(--popover-origin, top start)` (or CSS Anchor Positioning edge) + `scale(0.96)` | Enter `180ms` `ease-out` / spring `linear()`; exit `115ms` `ease-in` |
| **SwiftUI / AppKit** | `.popover(attachmentAnchor: .rect(.bounds))` or `.scaleEffect(open ? 1 : 0.96, anchor: .topLeading)` | `.spring(duration: 0.2, bounce: 0.0)` (enter) / `.easeIn(duration: 0.12)` (exit) |
| **Jetpack Compose** | `scaleIn(initialScale = 0.95f, transformOrigin = TransformOrigin(0f, 0f))` | `tween(180, FastOutSlowInEasing)` enter / `tween(115, FastOutLinearInEasing)` exit; `Spring.DampingRatioNoBouncy` |
| **Flutter** | `ScaleTransition` / `Transform.scale` with `alignment: AlignmentDirectional.topStart` | `SpringDescription.withDampingRatio(mass: 1, stiffness: 500, ratio: 0.9)` or `duration: 180ms` / `reverseDuration: 115ms` |
| **Desktop / Game UI** | Anchor popup rect to widget `mapToGlobal` trigger edge (Qt/WinUI/Slint/UMG); scale `0.96 → 1.0` | `160–180ms` enter, `100–120ms` exit; instant `0ms` in TUI |

## Concentric geometry and translucent materials

- **Concentric corner radii** (see `references/layout.md` `B2`): when nesting rounded containers, compute `innerRadius = max(0, outerRadius - padding)` so nested borders stay optically parallel instead of pinching at corners.
- **Refractive / glass surfaces** (see `references/color.md` `B4`): pair translucent blur with saturation boost (`saturate(160–180%)` / native OS vibrancy) and provide a solid high-contrast fallback under `@media (prefers-reduced-transparency: reduce)` and platform Reduce Transparency settings:

```css
@media (prefers-reduced-transparency: reduce) {
  .glass-surface {
    backdrop-filter: none;
    background-color: var(--semantic-color-surface-raised);
  }
}
```

## Technique library

| Technique | Use when | Web implementation | Native/mobile equivalent | Reduced/fallback path | Cliché risk |
|---|---|---|---|---|---|
| scroll-driven reveal/progress | progress itself is spatial/temporal: drawing a route, filling a meter, comparing before/after | CSS scroll-driven animations or small observer-driven transform/opacity; no input hijacking | scroll-linked offset/phase in SwiftUI/Compose/Flutter | static final state or chapter thumbnails; progress readable without motion | every section fading/sliding upward becomes meaningless decoration |
| pinned/sticky narrative | one artifact needs persistent context while chapters annotate it | sticky media pane + normal document flow; sparse keyed state changes | split pane or top preview + pageable chapters | linear static layout with all annotations visible | scrolljacked full-screen scenes that trap the user |
| View Transitions/shared element | object identity continues across route/state | same-document `startViewTransition` or cross-document opt-in; name only meaningful shared elements | native shared-element/container transform transitions | instant navigation; preserve focus and announce route change | morphing everything because the API exists |
| cursor/hover response | pointer precision adds inspection, magnetic affordance, or localized reveal | transform/opacity near cursor; keyboard focus receives equivalent state | touch/long-press/context menu or focus ring equivalents | static emphasis; no hover-only disclosure | custom cursor replacing the system cursor without value |
| text reveal | short editorial headlines where sequencing creates voice | per-line or per-phrase mask/translate once; keep text selectable and semantically whole | attributed text/line-level fade or no-op | all words visible instantly | letter-by-letter spectacle on long/localized copy |
| page transition | spatial continuity or scene change is real | View Transition or brief opacity/transform; keep browser navigation expectations | platform navigation transition/spring | instant transition | ceremonial transitions that delay every task |
| micro-interaction | state needs confirmation or physical cause | pressed scale/color/token state within 100ms; no layout shift | haptics/platform touch feedback plus visual state | static state/icon/color change | bouncy jelly controls on serious operations |
| WebGL/shader accent | material/light/data inherently spatial or generative | one bounded canvas/scene; pause offscreen; static poster; GPU/memory budget | Metal/Vulkan/OpenGL/native scene only at signature surface | high-quality static image/canvas fallback | default orb/fluid/aurora background |
| kinetic type/marquee | ticker/log/scoreboard semantics or deliberate print/poster voice | transform-only loop, pause on hover/focus, duplicate content accessibly | ticker view with reduced speed/control | static wrapped text | meaningless infinite marquee as faux award-site signal |

## Modern native CSS motion primitives

Prefer declarative browser primitives over JS animation runtimes when targeting modern web surfaces—always pair with `@supports` progressive enhancement and `@media (prefers-reduced-motion: reduce)`:

```css
/* 1. Critically damped operational spring curve (zeta >= 0.85, zero rubbery overshoot) */
:root {
  --ease-spring-operational: linear(
    0, 0.012, 0.049 2.2%, 0.194 5%, 0.421 9%, 0.728 15.5%,
    0.892 20.8%, 0.968 25.4%, 0.996 29.8%, 1.004 35%, 1.002 46%, 1
  );
}

/* 2. Origin-aware 0.96 -> 1.0 scale + asymmetric faster exit (115ms close vs 180ms open) */
[popover], dialog {
  opacity: 0;
  transform-origin: var(--popover-origin, top left);
  transform: scale(0.96) translateY(-2px);
  /* Exit transition (applies when closing): brisk 115ms ease-in */
  transition: opacity 115ms ease-in, transform 115ms ease-in,
              overlay 115ms allow-discrete, display 115ms allow-discrete;
}
[popover]:popover-open, dialog[open] {
  opacity: 1;
  transform: scale(1) translateY(0);
  /* Enter transition (applies when opening): 180ms damped spring */
  transition: opacity 160ms ease-out, transform 180ms var(--ease-spring-operational),
              overlay 180ms allow-discrete, display 180ms allow-discrete;
  @starting-style { opacity: 0; transform: scale(0.96) translateY(-2px); }
}

/* 3. Cross-document View Transitions + shared group styling */
@view-transition { navigation: auto; }
.card-media { view-transition-class: card-morph; }
::view-transition-group(.card-morph) { animation-duration: 240ms; }

/* 4. Scroll-driven animations gated by @supports and reduced-motion */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reading-progress {
      animation: grow-bar linear both;
      animation-timeline: scroll(root block);
    }
    .chapter-figure {
      animation: reveal-figure linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 35%;
    }
  }
}

/* 5. Scroll-state container queries (sticky header elevation without JS scroll listeners) */
.header-wrap { container-type: scroll-state; position: sticky; top: 0; }
@container scroll-state(stuck: top) {
  .site-header { border-bottom-color: var(--semantic-border-strong); }
}
```

## Scrolljacking boundary

Default answer: **do not scrolljack**. Scroll manipulation commonly disorients users; when stakeholders insist, use it only for functional value, keep required scroll input small, make change visible quickly, preserve normal scrollbar/progress, provide direct section links, avoid precision-dependent reveals, and user-test the rate. Never hijack input, invert direction, suppress keyboard/scrollbar behavior, or make content vanish on a slight overscroll.

## Reduced-motion matrix

1. preserve causality with an instant state change;
2. replace spatial movement with opacity/fade or static crossfade;
3. show a static intermediate/endpoint sequence;
4. provide text/icon/haptic/audio equivalent where appropriate;
5. respect `prefers-reduced-motion` on web and platform Reduce Motion settings natively; Apple specifically calls out limiting automatic/repetitive zoom, scale, peripheral motion, z-depth, and blur transitions.

Deleting feedback is not a reduced-motion path. Motion-triggering vestibular risk includes large-scale panning/zooming, spinning, parallax, autoforwarding carousels, and scrolljacking.

## Implementation checklist

- input stays interactive during nonessential animation;
- focus never remains inside removed content;
- no flashing/rapid oscillation or photosensitive pattern;
- animations pause offscreen/backgrounded and do not run in dense operational screens;
- DOM/visual order remain coherent for keyboard, controller, and assistive tech;
- frame budget verified on a mid-tier device, not only a developer workstation;
- reduced-motion, forced-colors, high-contrast, RTL, 200% text, and narrow viewport paths inspected;
- one sentence recorded for why each signature motion exists and what replaces it when motion is unavailable.

## Detectable motion inventory

Before preserving a motion system, inventory what the rendered page actually exposes: animation and transition counts, canvas/WebGL presence, smooth-scroll libraries, scroll-driven CSS, view transitions, custom cursor styles, and detectable `prefers-reduced-motion` rules. In the live corpus, a detectable reduced-motion stylesheet appeared on only about **58%** of pages, while likely scroll manipulation appeared on about **21%** and custom cursor styles on about **30%**. Use those figures as prevalence evidence for verification failure, never as permission.

Detection is heuristic. Script/global inspection can false-positive library names, cross-origin CSS may be unreadable, and a media query does not prove correct behavior. Absence of a detectable media query is a lead, not a violation; presence is not proof either. Verify reduced motion by rendering the actual setting.

Required gate:

1. audit Lenis/Locomotive or equivalent smooth-scroll libraries, hidden overflow, wheel/touch input remapping, pinned scroll regions, and missing or broken direct section links;
2. scroll manipulation requires a user-facing functional reason and explicit waiver;
3. custom cursors require keyboard/touch parity plus an ordinary system-cursor fallback;
4. canvas/WebGL content requires semantic text, static fallback, pause/mute control where applicable, and a measured performance budget;
5. every signature motion names its reduced-motion replacement before implementation;
6. keep initial-viewport idle looping animations at zero on operational/product surfaces—concentrate motion budget on short, compositor-only interactive transitions (`transform`/`opacity`) and prefer browser-native CSS Scroll-Driven Animations, `@starting-style`, and View Transitions API with progressive fallbacks over heavy JS animation runtimes.
