# Jupyter widgets / ipywidgets

## Token mapping

ipywidgets exposes limited style/layout objects rather than a complete design-token system. Use semantic Python constants and apply them consistently to `Layout`/`style` objects; use notebook/custom CSS only when the environment is controlled. Do not expect broad theming across JupyterLab/classic/VS Code/nbconvert contexts.

## Layout and responsive idioms

Compose boxes/grids intentionally but accept host frontend constraints. Notebook cells are document flow, not application windows. Width/height/responsive behavior differs across frontends. Keep controls close to the output they affect and preserve reading order in the notebook narrative.

## Typography/custom fonts

Notebook/frontend typography is host-controlled. Do not fight it globally. Use heading hierarchy, concise labels, units, captions, and formatted output. Charts need their own legible typography/color decisions.

## Motion/reduced motion

Use progress/trait updates truthfully. Decorative motion is inappropriate in most notebook contexts and host support varies. Long computations need interrupt/cancel guidance because kernel interruption is user-visible behavior.

## Accessibility specifics

Notebook frontend accessibility varies and is actively evolving. Use real labels/descriptions, logical output order, text alternatives/data tables for charts, keyboard verification, and no color-only meaning. Custom widgets must implement frontend semantics deliberately; do not assume Python trait names are exposed accessibly.

## States idiom

Trait synchronization (`observe`, `link`, `unlink`) and kernel/frontend lifecycle are the state model. Handle kernel restart/disconnect, stale widget state, expensive computation interruption, missing data, empty results, validation errors, and duplicated output. Preserve user-entered state in traits deliberately.

## Forms idiom

Use labeled controls, constrained numeric/date/text widgets, validation after meaningful interaction, explicit run/apply buttons for costly work, and input preservation. Do not couple expensive computation directly to every slider movement without throttling/apply semantics.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic constants reused across layout/style | raw styling copied per widget |
| explicit Apply/Run control for expensive analysis | retraining/requerying on every slider tick |
| narrative headings/help adjacent to controls | disconnected control panel far from output |
| text/table summary under chart | color-only chart as sole answer |
| graceful kernel-restart/missing-state behavior | assuming widget state survives every frontend action |

## Known traps

Frontend differences (JupyterLab/classic/VS Code/Colab/nbconvert), kernel disconnect/restart, widget state serialization, custom widget extension complexity, limited theming, accessibility variability, hidden mutable kernel state, accidental expensive recompute loops.

## Verification commands

```sh
python -m pytest
python -m compileall .
jupyter lab 2>/dev/null || jupyter notebook 2>/dev/null || true
```

Verify in every target frontend claimed. Static notebook export is evidence only of static rendering, not interactive widget behavior.
