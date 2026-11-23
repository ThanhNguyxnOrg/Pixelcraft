# Component state token matrix

State tokens define how interface controls communicate interaction. They are semantic contracts, not decorative hover colors. Define them once at the highest useful tier and consume them consistently across platforms.

## Required state set

Cover these states where the control type supports them:

| State | Meaning | Required token categories |
|---|---|---|
| rest/default | stable baseline | background/surface, ink/icon, border, elevation |
| hover | pointer is over control; never required for operation | background/ink/border shift; avoid layout movement |
| focus-visible / focused | current keyboard/controller/remote input target | ring/outline, background/border contrast, invariant geometry |
| pressed/active | pointer or activation key currently down | immediate feedback; stronger but temporary contrast/depth |
| selected/checked/current | persistent selection or location | non-color cue plus semantic background/icon/text treatment |
| disabled/unavailable | visible but cannot be activated now | reduced contrast without becoming invisible; explanatory copy where needed |
| invalid/error | user input or process state failed validation | error border/icon/text/status token; do not rely on red alone |
| loading/busy/progress | action or content is pending | progress indication, disabled/interaction semantics, stable geometry |
| readonly | value visible but intentionally immutable | distinguish from editable and disabled without ambiguity |
| destructive | action causes irreversible/high-cost consequence | danger semantics, confirmation/undo behavior, restrained persistent emphasis |
| dragged/placeholder/target | object moving or valid drop target | position/order/affordance cues beyond color |
| expanded/collapsed/open | disclosure state | icon/chevron semantics, aria/state exposure, motion-safe transition |

Do not create every token for every atom. Define shared semantic roles first (`state.focus.ring`, `control.disabled.ink`, `feedback.error.surface`) and add component overrides only when behavior genuinely differs.

## Matrix template

```markdown
| Component/region | Mode | State | Background/surface | Ink/icon | Border/ring | Elevation/overlay | Motion | Validation |
|---|---|---|---|---|---|---|---|---|
| button.primary | light | rest |  |  |  |  |  | contrast/focus/target checked? |
| button.primary | dark | focus-visible |  |  |  |  |  |  |
| input.text | high-contrast | invalid+focus |  |  |  |  |  |  |
```

Fill combinations that can actually occur. Invalid+focus, selected+disabled, loading+pressed, and hover+selected are common omissions. Mark impossible combinations `not applicable` instead of inventing decorative values.

## Interaction rules

1. **Hover is enhancement.** Never put essential meaning or access only in hover.
2. **Focus must beat theme decoration.** Focus indication needs contrast against adjacent colors in every mode and must not be clipped by overflow/rounded clipping.
3. **Pressed feedback is immediate.** Target acknowledgment within normal input latency; do not wait for network completion.
4. **Disabled does not mean invisible.** Preserve enough legibility for orientation, and explain missing permission/prerequisite when it affects the user.
5. **Selection is redundant.** Pair color with check/icon/text/position/weight or geometry.
6. **Loading preserves layout.** Avoid jumping controls; make cancellation/retry semantics explicit.
7. **Errors persist until corrected.** Do not clear them merely because focus moved away.
8. **Forced colors/high contrast may replace color tokens.** Preserve meaning through system colors, outlines, icons, and text rather than fighting the platform.

## Validation procedure

For each interactive component family:

- enumerate the realistic state combinations before implementation;
- verify foreground/background and border/ring contrast in all supported modes;
- inspect reduced-motion equivalents where state is animated;
- test keyboard/controller focus order and focus restoration;
- test touch/pointer target size outside hover-dependent behavior;
- inspect dark/high-contrast/forced-color rendering;
- validate localized/disabled/error text clipping;
- verify platform accessibility state (`selected`, `disabled`, `busy`, `invalid`, `expanded`) is exposed rather than only visually implied.

Exporter tests cover syntax only. They do not prove state usability; rendered or manual evidence remains necessary.
