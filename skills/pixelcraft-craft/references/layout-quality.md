# Layout quality inspection

Use this reference after choosing a composition and again on rendered output. It converts layout critique from vague taste into observable checks. Do not use scores as proof of beauty; use them to find defects and explain trade-offs.

## Mode-dependent complexity budget

| Mode | Default complexity posture | Warning signs |
|---|---|---|
| Operate | low-to-medium density, high grouping discipline, familiar scanning structure | competing accents, ungrouped dense controls, decorative fragments near primary work |
| Read | low clutter, long-line control, strong vertical rhythm | dense side noise, interrupted measure, excessive cards/rules |
| Persuade | medium complexity with one controlled focal spectacle | several hero effects at once, feature clutter, decorative copy |
| Experience/Play | higher sensory complexity allowed when orientation and floor survive | unreadable HUD/navigation, uncontrolled motion/contour noise |
| Communicate | lowest renderer-dependent complexity | background interference, fragile alignment, ink/data waste |
| Constrained/game/spatial | complexity budgeted by distance, input speed, and safety | tiny targets, focal rivalry, occlusion, glance failure |

Complexity is not a moral quality. Dense expert tooling can be correct; sparse marketing can still be empty. Judge whether grouping and focal control make the complexity legible.

## Static inspection checklist

| Dimension | Pass condition | Defect examples |
|---|---|---|
| focal path | first/second/third visual priority can be named without hesitation | everything bold/large/accented; primary action visually weaker than decoration |
| alignment | repeated edges/centerlines/baselines are intentional; deviations have purpose | near-alignment drift, accidental 1–3px mismatches, orphan controls |
| grouping | related items share proximity/containment; unrelated groups have clear separation | equal spacing everywhere, wrong grouping by proximity, boxed noise |
| density | density varies deliberately by importance/mode | uniform compaction or uniform whitespace with no information hierarchy |
| balance | visual weight feels stable without requiring symmetry | heavy media cluster unsupported by structure, accidental empty quadrant |
| contour clutter | edges, borders, shadows, icons, and chart marks do not compete | every atom carded, nested outlines, decorative grid behind dense data |
| measure/rhythm | spacing scale and text rhythm survive real content | magic numbers per component, broken baseline/measure after localization |
| focal area | primary content/action lies in expected scan/input region for modality | key control stranded below fold/safe area/overscan without reason |
| responsive integrity | narrowing reorders/restructures rather than merely shrinking | side-by-side squeeze, clipped labels, hidden priority actions |
| orientation | user can tell location, progress, and escape route | immersive layout with no context, missing back/navigation state |

## Rendered inspection procedure

1. Inspect the smallest supported viewport first; then typical and wide sizes.
2. Squint/blur mentally or zoom out: identify the first focal object and whether it matches intent.
3. Trace the visual path using actual content order, not placeholder-perfect content.
4. Count visible accents/borders/containers in the primary region. If the count cannot be justified, remove visual noise before adding emphasis.
5. Measure or inspect repeated edges: card/container alignment, text baselines, icon centers, split boundaries, sticky regions.
6. Resize through breakpoints rather than jumping only between canned screenshots.
7. Test text expansion/contraction, RTL mirroring, long data, empty data, and missing media.
8. Record defects by region and severity; do not report “spacing feels off” without an observable example.

## Layout repair order

1. restore task access, clipping, overflow, keyboard/focus visibility, and orientation;
2. correct grouping/hierarchy before changing decoration;
3. remove duplicate containment/borders/accents;
4. repair rhythm and alignment using semantic spacing/layout constraints;
5. adjust optical balance only after structural defects are fixed;
6. re-render the affected breakpoint/state, not the entire matrix by default.

## Hard warnings

- Do not equate whitespace with quality; unused space can be as defective as clutter.
- Do not equate density with expertise; expert users need grouping and predictability, not noise.
- Do not break learned operational patterns merely to look distinctive.
- Do not optimize one static breakpoint while destroying resize/reflow behavior.
- Do not use overlay text on busy imagery unless contrast and reading priority remain measurable in the real asset.

## Measurable geometry inventory

When rendered evidence is available, measure rather than guess: estimated uncovered viewport ratio, content centroid/asymmetry, repeated overlap count, maximum content width, visible grid count, and resize behavior. In the live corpus the estimated whitespace median was approximately **0.57** with a middle half around **0.42–0.68**; obvious content-center deviation appeared in roughly **18%** of pages, while some positive overlap appeared in roughly **76%** because heroes, cards, media, and sticky controls overlap intentionally. Median maximum content width was approximately **784 px**, with an upper quartile around **1073 px** at a 1440 px viewport.

These measurements are not targets. High whitespace can mean emptiness; low whitespace can mean density done well; overlap can be intentional layering or a defect. Calibrate interpretation by mode: dense Operate surfaces, editorial Read surfaces, and expressive Persuade scenes should not share one whitespace expectation. Use numbers to locate regions for inspection and compare before/after states. Full-bleed media is an explicit exception, while body text and operational controls need deliberate measure constraints.
