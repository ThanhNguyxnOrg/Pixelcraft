# Motion and interaction

Evidence base: usability research, platform motion/accessibility guidance, rendering-performance constraints, and the accessibility floor.

## Purpose before spectacle

Motion earns its cost only when it acknowledges input, shows causality, preserves orientation, communicates progress/state, or creates the direction's single signature moment. Apple gives the same constraint: purposeful, brief, precise, optional motion—not motion for its own sake. Showcase spectacle is not permission to sacrifice usability; celebrated interfaces are still wrong when motion blocks comprehension, control, or access.

## B1 — Frequency-calibrated motion, Delight-Impact Curve & instant subsequent tooltips

Calibrate animation duration inversely to daily action frequency using the **Delight-Impact Curve**—high-repetition controls must never pay ceremonial animation tax:

- **Delight-Impact Curve:** reserve deliberate delight, character, and expressive choreography for **rare or ceremonial moments** (`≤ 1–3×/session`: first-run onboarding, security/verification completion, milestone/empty-state moments). Keep **`100+/day` high-frequency actions and keyboard-initiated actions at `0` animation** (`0ms`) so power users feel immediate, zero-latency control.

| Frequency tier | Typical interactions | Duration budget | Required behavior |
|---|---|---|---|
| **High frequency & keyboard** (`100+×/day`) | command palettes, keyboard-initiated shortcuts/navigation, context/dropdown menus, tab/row/cell selection, key-repeat | **`0ms`** (`0–100ms` max for pointer-only subtle state feedback) | Instant acknowledgment; zero stagger or decorative entrance delay; keyboard-initiated actions and key-repeat stay at `0` animation |
| **Instant subsequent tooltips (`data-instant`)** | sweeping pointer/focus across sibling toolbar icons or table headers | `300–500ms` cold open (`~100ms` fade) → **`0ms` delay & `0ms` transition** while warm | Once one tooltip in a group is open, mark subsequent tooltips instant (e.g., `data-instant` with `transition-duration: 0ms` on web, or shared warm-group state in SwiftUI/Compose/Desktop) until pointer/focus leaves the group (`~300–400ms` cooldown) |
| **Medium frequency** (`5–30×/day`) | drawers, side sheets, modal dialogs, inspector panes, accordion disclosures | **`150–220ms`** | Snappy deceleration or critically damped spring; retargetable mid-flight without queuing |
| **Rare / ceremonial delight** (`≤ 1–3×/session`) | onboarding completion, security/passkey confirmation, milestone or empty-state reveal | **`300–500ms`** | Never block pointer, scroll, or keyboard input; user can click or navigate through immediately |
| **Rendering & concurrency** | all interactive and choreographed layers | compositor-only (`transform`, `opacity`) | Normally 1 primary + at most 2 supporting motions; ban `transition: all`, layout/paint thrashing, and idle loops in Operate/Read |

Tokenize semantic durations and physics (`motion.instant`, `motion.fast`, `motion.panel.enter`, `motion.panel.exit`, `motion.spring.operational`) rather than scattering raw milliseconds.

## B3 — Origin-aware scaling, subtle asymmetric exits & damped springs

Overlays and interactive surfaces must preserve spatial causality and dismiss without visual drag:

1. **Subtle trigger-anchored scale (`0.95 → 1.0`, never `0 → 1` center balloon):** popovers, context menus, combobox lists, and contextual sheets enter from **`scale(0.95)`–`scale(0.97)` to `1.0`** paired with opacity, anchored to the trigger's attachment corner or edge—never zooming from `0` or expanding from viewport center when opened by a corner button.
2. **Asymmetric & subtle exit animations:** closing transitions run **faster (`~100–130ms` exit vs `~160–200ms` enter)** AND **lighter** than entrances—use **partial travel** (e.g., `25–50%` of enter offset, `4–8px`, rather than a full-distance jarring slide-out) combined with opacity fade and optional subtle `blur(1–2px)` (omitting blur under Reduced Motion or constrained GPUs) so dismissing overlays dissolves cleanly out of the user's way.
3. **Velocity-preserving, non-rubbery operational springs (`ζ ≥ 0.85`):** gesture-driven sheets, swipeable cards, and pan-to-dismiss overlays inherit release velocity via spring physics without cartoonish overshoot (damping ratio `ζ ≥ 0.85`—critically or near-critically damped—in Operate/Read UI; degrade to brief opacity crossfades under Reduced Motion).

| Platform | Trigger-origin anchor idiom | Asymmetric timing / operational spring (`ζ ≥ 0.85`) |
|---|---|---|
| **Web CSS / Popover** | `transform-origin: var(--popover-origin, top start)` (or CSS Anchor Positioning edge) + `scale(0.96)` | Enter `180ms` `ease-out` / spring `linear()`; subtle exit `115ms` `ease-in` (partial travel + opacity) |
| **SwiftUI / AppKit** | `.popover(attachmentAnchor: .rect(.bounds))` or `.scaleEffect(open ? 1 : 0.96, anchor: .topLeading)` | `.spring(duration: 0.2, bounce: 0.0)` (enter) / `.easeIn(duration: 0.12)` (exit) |
| **Jetpack Compose** | `scaleIn(initialScale = 0.95f, transformOrigin = TransformOrigin(0f, 0f))` | `tween(180, FastOutSlowInEasing)` enter / `tween(115, FastOutLinearInEasing)` exit; `Spring.DampingRatioNoBouncy` |
| **Flutter** | `ScaleTransition` / `Transform.scale` with `alignment: AlignmentDirectional.topStart` | `SpringDescription.withDampingRatio(mass: 1, stiffness: 500, ratio: 0.9)` or `duration: 180ms` / `reverseDuration: 115ms` |
| **Desktop / Game UI** | Anchor popup rect to widget `mapToGlobal` trigger edge (Qt/WinUI/Slint/UMG); scale `0.96 → 1.0` | `160–180ms` enter, `100–120ms` exit; instant `0ms` in TUI |

## Tactile micro-feedback & spinner anti-flicker

| Pattern | Concrete rule | Cross-platform guardrails |
|---|---|---|
| **Press compression** | Scale tactile buttons, pills, and pressable cards to **`scale(0.97)`** over **`100–160ms ease-out`** on pointer/touch down, releasing immediately on pointer-up or cancel | CSS `:active` transform; SwiftUI `ButtonStyle` `.scaleEffect(isPressed ? 0.97 : 1)`; Compose `collectIsPressedAsState()`; Flutter `AnimatedScale`. Skip scale on inline prose links; replace with instant tone/border feedback under Reduced Motion. |
| **In-place icon swap cross-fade** | When an icon toggles state in place (copy → check, play → pause, show → hide, sort), cross-fade outgoing and incoming icons over **`150–200ms`** using opacity + slight **`scale` (`0.85 ↔ 1.0`)** + subtle **`blur(1–2px)`** inside one fixed bounding box | Overlap both icons in the same layout cell so button dimensions never shift. Fall back to instant swap or opacity-only crossfade under Reduced Motion. |
| **Spinner anti-flicker** | (1) Wait **`150–300ms`** before showing a spinner so fast responses never flash; (2) once shown, hold for a **`300–500ms` minimum** before clearing so the indicator never blinks for a single frame; (3) **preserve button label & width** so entering/leaving loading causes zero horizontal layout jump | Keep the label in flow at `opacity: 0` (or reserve exact `min-width` / grid overlay slot) while centering the spinner over it; disable duplicate submission while maintaining accessible busy state (`aria-busy` / native status announcement). |

## Interruptible motion, Apple Gesture Physics & choreography discipline

Every gesture-driven or multi-step transition must stay physically coherent and responsive on every frame:

| Rule | Mandatory behavior | Anti-pattern to reject |
|---|---|---|
| **Live presentation-value interruption** | On interruption or mid-flight retargeting, start the new animation from the **current live presentation value** (`CALayer.presentation()`, SwiftUI/Compose `Animatable` value, Web Animations `commitStyles()` / active spring state)—never the previous logical target | Snapping to the old target before reversing or restarting from `0` |
| **Never lock input during transition** | Keep pointer, touch, scroll, and keyboard active while panels, sheets, drawers, or route transitions run | Disabling clicks (`pointer-events: none`) or ignoring swipes until `onTransitionEnd` fires |
| **Velocity blending on gesture reversal** | Preserve and smoothly blend incoming velocity into the reversed spring when a user changes drag direction mid-motion | Hard-cutting velocity to `0` ("brick wall" stop) on direction reversal |
| **Independent X and Y springs** | Decompose 2D drags (PIP windows, draggable cards, freeform sheets) into **independent X and Y springs** so diagonal throws curve naturally along each axis's momentum | Single scalar progress interpolation that forces unnatural straight-line snaps |
| **Momentum-based dismissal (`velocity > 0.11`)** | Dismiss swipeable sheets, toasts, and drawers from release velocity (**`velocity > 0.11`**, e.g., `> 0.11 px/ms` ≈ `110 px/s` or platform velocity projection) even below 50% drag distance; snap back smoothly on slow releases | Requiring users to drag past 50% height/width despite a brisk flick |
| **Pointer capture & multi-touch guard** | Acquire pointer capture (`setPointerCapture` / native exclusive gesture recognizer) on drag start and ignore secondary pointers (**multi-touch guard**) during an active single-pointer drag | Losing the drag when the pointer leaves the handle or teleporting on an accidental second finger |
| **Rubber-band damping at boundaries** | Apply asymptotic resistance at overscroll, sheet, or slider limits (e.g., `offset = limit * (1 - 1 / (1 + x / limit))`) | Hard abrupt stops or linear unbounded stretch past the limit |
| **Pause off-screen loops** | Automatically pause ambient, shader, media, or ticker loops when outside the viewport (`IntersectionObserver` / native visibility lifecycle) or when the window/tab is backgrounded | Burning CPU/GPU/battery on hidden or scrolled-away loops |
| **Storyboard `TIMING` comment block** | For multi-step choreography (`≥ 3` orchestrated beats), place a structured `TIMING` comment block right above the animation listing each beat (`t=0ms`, `t=80ms`, `t=180ms`), duration, easing, and reduced-motion collapse | Scattering undocumented magic `delay` numbers across separate components |
| **Zero inherited CSS variable churn in drag/scroll loops** | Inside high-frequency drag or scroll handlers, update the moving target's compositor `transform` directly (or use a leaf-scoped `@property` with `inherits: false`) | Updating inherited parent/root CSS variables (`--scroll-y`, `--drag-x` on `:root` or ancestor wrappers) every frame, triggering full-subtree style recalc storms |

## 3-state theme switching (`System` / `Light` / `Dark`)

Implement theme switching cleanly across web, desktop, and mobile surfaces without boot flashes or transition waves:

1. **Three explicit states with `System` default:** expose **`System` (default)**, **`Light`**, and **`Dark`**. When `System` is selected, react live to OS appearance changes (`matchMedia('(prefers-color-scheme: dark)')`, SwiftUI/AppKit `colorScheme`, Android `uiMode`, desktop OS theme events).
2. **Pre-first-paint resolution (zero white flash):** resolve stored preference + system scheme **before first paint** (small synchronous boot script in `<head>` setting the root theme attribute + `color-scheme` on web; native window/splash appearance configuration before initial reveal on desktop/mobile).
3. **Brief transition suppression during switch (zero color-ripple wave):** disable transitions globally for the switch frame (e.g., toggle `[data-theme-switching]` applying `transition: none !important` across `*`, flush layout/paint, then remove on the next frame, or batch native appearance invalidation) so cards, borders, and text swap in lockstep instead of rippling at mismatched transition speeds.
4. **Cross-tab & cross-window sync:** broadcast preference writes immediately across open tabs or windows (`storage` event / `BroadcastChannel` on web; shared preference store / IPC notification on desktop and mobile).

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
