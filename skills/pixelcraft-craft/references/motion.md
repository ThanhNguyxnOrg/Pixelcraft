# Motion and interaction

Evidence base: usability research, platform motion/accessibility guidance, rendering-performance constraints, and the accessibility floor.

## Purpose before spectacle

Motion earns its cost only when it acknowledges input, shows causality, preserves orientation, communicates progress/state, or creates the direction's single signature moment. Apple gives the same constraint: purposeful, brief, precise, optional motion—not motion for its own sake. Showcase spectacle is not permission to sacrifice usability; celebrated interfaces are still wrong when motion blocks comprehension, control, or access.

## Budgets

| Layer | Budget posture |
|---|---|
| input acknowledgment | immediate; roughly 50–120ms; never delayed behind a scene animation |
| local state change | roughly 100–250ms; most UI animation belongs in a 100–500ms envelope |
| sheet/panel/route transition | roughly 200–400ms; shortest non-jarring duration |
| scroll-linked progress | visually respond within one normal wheel/touch increment; never require pixel-perfect scrolling |
| concurrent choreographed elements | normally 1 primary + at most 2 supporting motions; cascade only when order encodes meaning |
| ambient/looping motion | default none in Operate/Read; if used, subtle, pausable, and outside the reading focus |
| rendering | target compositor work; animate transform/opacity, avoid layout/paint-triggering properties and `transition: all` |
| assets | motion cannot justify layout shift, delayed LCP media, blocked input, or main-thread long tasks |

Tokenize semantic durations/easings (`feedback.instant`, `state.standard`, `scene.enter`) rather than scattering raw milliseconds. For physics-driven systems (Material 3 Expressive, SwiftUI, Motion), prefer **spring composite tokens** (`stiffness` + `damping` / `response` + `bounce`) over fixed-duration curves so interrupted gestures settle naturally; degrade springs to brief opacity crossfades under Reduced Motion.

## Concentric geometry and translucent materials

- **Concentric corner radii**: when nesting rounded containers, compute `innerRadius = max(0, outerRadius - padding)` (or use platform concentric radius APIs) so nested borders stay optically parallel instead of pinching at corners.
- **Refractive / glass surfaces**: translucent blur/refraction layers must maintain readable contrast over shifting backgrounds and provide a solid high-contrast fallback under `@media (prefers-reduced-transparency: reduce)` (and platform Reduce Transparency settings):

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
/* 1. CSS linear() spring easing (approximated physics curve with zero JS runtime) */
:root {
  --ease-spring-snappy: linear(
    0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%,
    1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%,
    1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%,
    0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1
  );
}

/* 2. Entry/exit transitions for top-layer <dialog> and [popover] */
dialog, [popover] {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 160ms ease-out, transform 180ms var(--ease-spring-snappy),
              overlay 180ms allow-discrete, display 180ms allow-discrete;
}
dialog[open], [popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
  @starting-style { opacity: 0; transform: translateY(6px); }
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
