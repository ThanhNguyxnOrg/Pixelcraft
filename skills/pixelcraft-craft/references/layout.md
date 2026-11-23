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
- Preserve primary action visibility without covering content with sticky chrome.
- Test landscape/portrait, split window, dynamic text, RTL mirroring, safe area, virtual keyboard, controller focus order, and minimum terminal size as applicable.
- Horizontal scrolling can be correct for data tables/timelines, but never accidental page overflow.

## Hierarchy checks

Squint test: primary/secondary/tertiary grouping should remain visible when detail blurs. Remove one visual property at a time; if hierarchy disappears only when color is removed, color-only dependence is likely. Compare real content lengths rather than lorem ipsum symmetry.
