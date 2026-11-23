# Shiny for Python

## Token mapping

Use the project's supported theme/bootstrap mechanism plus external CSS assets. Exact theme APIs vary by Shiny for Python version and UI layout choice; verify local dependency docs before relying on a named constructor. Keep semantic CSS variables in assets and map plots separately because plotting libraries have independent themes.

## Layout and responsive idioms

Use Shiny UI layout functions (`page_*`, layout columns/sidebar/nav panels/cards depending version) to express information architecture. Reactive outputs should occupy stable reserved space where possible. Do not depend on fixed browser width or hidden overflow for dense dashboards.

## Typography/custom fonts

Use external CSS/font assets with explicit fallback/loading policy. Configure plotting typography separately. Ensure numeric/date/locale formatting happens through explicit formatting rather than raw string concatenation.

## Motion/reduced motion

Reactive invalidation/progress feedback is more important than decorative animation. Use progress indicators honestly for long operations. Custom CSS/JS animation must honor reduced motion.

## Accessibility specifics

Use semantic headings/labels/input bindings, visible focus, accessible error/status text, chart summaries/tables, and keyboard verification. Shiny generates web UI, but abstraction does not guarantee accessible custom layout or plot meaning.

## States idiom

Understand reactive graph invalidation. Separate inputs, reactive calculations, outputs, side effects, and session/user state. Render loading/recalculating/empty/error/stale/offline states explicitly. Long jobs need progress/error/cancellation expectations and input preservation.

## Forms idiom

Use correct input controls/types/bounds/labels/help, validation timing after meaningful input, explicit submit/apply for expensive workflows, and recovery copy. Do not trigger costly reactive chains on every keystroke unless debounced/intentional.

## Do/don't pairs

| Do | Don't |
|---|---|
| explicit reactive dependency graph | hidden chain reactions nobody can debug |
| `req()`/validation paths with user-visible explanation | output silently disappearing when inputs are invalid |
| stable placeholder layout while recalculating | whole dashboard collapsing/flashing on each input |
| user/session-scoped state | mutable module-global state leaking across users |
| plot plus text/table alternative | color-only chart treated as complete analysis |

## Known traps

Reactive graph over-invalidation, stale session state, hidden server errors, version-dependent theme APIs, plot/page theme mismatch, input focus loss during redraw, expensive recomputation, concurrency/multi-user leakage.

## Verification commands

```sh
shiny run app.py
python -m pytest
python -m compileall .
```

Use browser inspection across widths/input sequences and inspect reactive errors/logs; compile success is not UI evidence.
