# Panel / HoloViz

## Token mapping

Use Panel theme/config/template mechanisms before custom CSS. Depending project version, configure theme on template/extension and inject scoped stylesheets through documented extension/assets mechanisms. Keep Plotly/HoloViews/Bokeh figure themes synchronized with page semantic tokens; figure defaults are a common mismatch.

## Layout and responsive idioms

Use `Row`, `Column`, `GridSpec`/template layouts and sizing modes intentionally (`stretch_width`, fixed, responsive). Panel dashboards often fail because resize behavior was never specified. Sidebar/main/template structure should reflect task hierarchy rather than exposing every control at once.

## Typography/custom fonts

Use template/global CSS/font configuration deliberately. Visualization libraries may require separate font settings; test rendering/export contexts. Keep dense scientific labels legible and localized units/formats explicit.

## Motion/reduced motion

Panel interaction is callback/server driven. Use loading spinners/indicators and busy state truthfully; decorative motion is secondary. Any custom CSS/JS animation must honor reduced motion.

## Accessibility specifics

Use labels/names/help text, keyboard-operable widgets, semantic ordering, chart alternatives/summaries, and visible focus. DOM output is web-backed but accessibility varies across widget/type; inspect actual output rather than assuming Bokeh/Panel abstractions guarantee semantics.

## States idiom

Understand parameter/`param` dependencies, reactive functions, session state, caching, and async tasks. Render empty data, missing file/model, backend exception, stale cache, busy state, offline/disconnect state, and permission failure explicitly. Avoid hidden global mutable state across sessions.

## Forms idiom

Use widgets with names/labels/help, validation bounds/types, explicit apply/submit controls for expensive computation, and input preservation. Parameterized forms should not recompute expensively on every tiny adjustment unless designed.

## Do/don't pairs

| Do | Don't |
|---|---|
| deliberate sizing mode per pane | fixed notebook-sized layout pasted into production dashboard |
| explicit busy/error state around expensive callbacks | silent spinner or stale plot after backend failure |
| semantic page CSS plus synchronized figure theme | default white plot floating inside custom dark UI |
| apply button for costly parameter sweeps | recompute on every slider tick unintentionally |
| per-session state ownership | global mutable cache leaking user-specific data |

## Known traps

Resize/sizing behavior, template/version differences, disconnected sessions, callback ordering, hidden global state, plot theme mismatch, expensive recompute loops, notebook-vs-server behavior divergence, dense expert UI becoming inaccessible through clutter.

## Verification commands

```sh
panel serve app.py
python -m pytest
python -m compileall .
```

Rendered evidence requires browser inspection at multiple widths/session states; notebook rendering alone is insufficient.
