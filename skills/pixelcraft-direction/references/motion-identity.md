# Motion identity

Motion identity is the consistent character of movement across a brand or product, not a library or a bag of effects. Define identity here during direction; implement compositor budgets, CSS/native APIs, and scroll mechanics through `pixelcraft-craft` and the platform skill.

## Motion-identity archetypes

Pick one primary archetype tied to subject matter and surface mode—never mix contradictory physics across sibling controls:

| Archetype | Physical reference | Tempo & curve character | Stagger & spatial grammar | Best surface fit |
|---|---|---|---|---|
| **Mechanical / detented** | toggle switch, vernier caliper, camera shutter | crisp, near-instant onset, zero overshoot; settles into exact stops | orthogonal/grid-aligned snaps, minimal or zero stagger | Operate, developer tools, finance, hardware instruments, TUI |
| **Editorial / cut** | print turn, slide projector, film cut | direct cuts or short deliberate fades; still typography, quiet layout | sequential reveal only for chapter/index hierarchy | Read, publishing, archives, documentation, legal |
| **Fluid / organic** | water surface, ink spread, draped cloth | longer deceleration tails, gentle continuous continuity, low friction | directional wave or shared-element continuity along reading path | Persuade, culture, hospitality, creative portfolios, media |
| **Tactile / spring** | physical card deck, damped rubber detent, direct-manipulation sheet | velocity-preserving spring physics, interruptible mid-flight, slight controlled bounce on spatial moves only | finger/pointer-coupled gestures; effects (color/opacity) never bounce | Consumer mobile, spatial/XR, playful tools, Material 3 Expressive / Apple native |

## Define the direction's motion language

Record these six choices in the direction card before implementation:

1. **Archetype & tempo:** immediate, measured, energetic, ceremonial, or intentionally static.
2. **Spatial vs. effect separation:** spatial geometry moves (`transform`, sheet expansion) may use curves or springs; non-spatial effects (opacity, color, border) stay critically damped with zero overshoot.
3. **Token roles:** map the archetype to a compact semantic token vocabulary rather than raw numbers.
4. **Spatial grammar:** planar slides, depth elevation, shared-element handoff, or direct cuts.
5. **Signature moment:** one memorable transition with a clear subject/product cause (e.g., an instrument needle settling on filtered totals).
6. **Reduced-motion identity:** how the same character reads when spatial movement is replaced (e.g., instant detent highlight for Mechanical, crisp 80–120ms opacity dissolve for Fluid).

## Archetype-to-token mappings

Use these starting token profiles to keep motion coherent across CSS, SwiftUI, Compose, Flutter, and Motion runtimes:

| Token role | Mechanical / detented | Editorial / cut | Fluid / organic | Tactile / spring |
|---|---|---|---|---|
| `motion.feedback` (press/toggle) | `60–90ms`, `cubic-bezier(0.2, 0, 0, 1)` | `0–80ms`, instant cut or linear fade | `100–140ms`, `cubic-bezier(0.22, 1, 0.36, 1)` | spring `stiffness: 600, damping: 38` (critically damped) |
| `motion.state` (panel/tab/disclosure) | `120–160ms`, `cubic-bezier(0.2, 0, 0, 1)` | `120–180ms`, `cubic-bezier(0.25, 0.1, 0.25, 1)` | `200–280ms`, `cubic-bezier(0.16, 1, 0.3, 1)` | spring `stiffness: 420, damping: 30` (fast spatial) |
| `motion.scene` (sheet/route/signature) | `180–220ms`, stepped or sharp ease-out | `180–240ms`, clean opacity crossfade | `300–420ms`, `cubic-bezier(0.16, 1, 0.3, 1)` | spring `stiffness: 280, damping: 24` (subtle settle) |
| `motion.effects` (opacity/color) | `80–120ms`, ease-out (no overshoot) | `100–140ms`, ease-out | `150–200ms`, ease-out | `120–180ms`, ease-out (never spring-bounced) |
| Reduced-motion equivalent | instant state swap (`0ms`) + border/ink detent | instant cut or `80ms` opacity fade | `120ms` opacity crossfade, zero translation | `100ms` opacity crossfade, zero bounce/scale |

## Do / Don't

| Do | Don't |
|---|---|
| Match motion character to domain physics (a trading blotter snaps mechanically; a museum catalog dissolves quietly). | Apply the same 400ms bouncy spring to a dense form, a marketing hero, and an error banner. |
| Keep operational feedback faster and tighter than Persuade/Experience choreography. | Make repeat users wait through ceremonial entrances on frequent tasks. |
| Spend the signature moment in one deliberate place (such as view transition or mode switch). | Animate every card, heading, and icon on scroll entrance. |
| Record motion grammar from references (timing, axis, interruption, trigger). | Copy a library tag (“uses GSAP”) and call it a motion identity. |
| Keep every transition interruptible when user input changes mid-motion. | Lock clicks or queue uninterruptible animations while a user moves quickly. |

## Cross-surface identity translation

Translate the motion archetype into the target surface's native capabilities instead of forcing web physics onto every renderer:

| Surface | How to preserve the archetype |
|---|---|
| Web / Desktop webview | Semantic CSS custom properties + compositor-only curves/springs; see `pixelcraft-craft` for CSS/runtime implementation |
| iOS / macOS (SwiftUI/AppKit) | Map archetype directly to `.snappy`, `.smooth`, `.bouncy`, or custom `.spring(duration:bounce:)` presets |
| Android / Compose / Flutter | Map to Material 3 Expressive `spatial` vs `effects` spring specs or Flutter `SpringDescription` / `Curves` |
| TUI / Email / Print | Translate identity into pacing, focus highlight, state cadence, and crisp hierarchy (zero decorative keyframe loops) |

## Reference motion extraction

When studying an external reference during direction exploration, extract grammar rather than effect labels:

- **Trigger:** pointer, keyboard focus, click/tap, gesture velocity, scroll offset, or system state change;
- **Axis & continuity:** what stays anchored while what moves, and whether shared elements bridge views;
- **Interruption behavior:** what happens when the user reverses input mid-transition;
- **Absence check:** verify what the reference keeps still so the signature movement reads clearly.
