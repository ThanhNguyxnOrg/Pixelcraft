# Plotly Dash

## Token mapping

Put generated CSS variables in the `assets/` folder or external stylesheet; Dash automatically serves project assets when configured correctly. Use consistent component class names/design-system wrappers rather than inline style dictionaries everywhere.

## Layout and responsive idioms

Dash layout is React component composition authored in Python. Use HTML containers, grid/flex CSS, responsive breakpoints/logical spacing, and component hierarchy deliberately. Do not make a page of nested Divs with inline styles and call it a design system.

## Typography/custom fonts

Load fonts through assets/external stylesheets with fallback/subset policy. Verify figure fonts separately; Plotly chart typography does not automatically inherit every page font/role.

## Motion/reduced motion

Use CSS motion sparingly and honor reduced motion. Callback latency/loading states are the primary motion/feedback concern. Do not spin indefinitely because a callback failed silently.

## Accessibility specifics

Use semantic html components, labels associated with inputs where supported, meaningful button/link distinctions, alt text/text summaries for charts, keyboard/focus verification. Plotly charts need nonvisual summaries/tables for critical data. Dash abstraction does not guarantee DOM correctness.

## States idiom

Callbacks need explicit `Input`/`Output`/`State` ownership, validation, exception handling, duplicate/collision behavior, cancellation/background strategy where appropriate, and loading/empty/error/offline state rendering. Use `prevent_initial_call` deliberately; hidden chained callbacks create unpredictable UX.

## Forms idiom

Use correct core component types, labels/help text, validation after meaningful completion, persistence through callback failure, debouncing only when appropriate, and paste/autofill behavior inherited from DOM. Do not trigger expensive callbacks per keystroke unintentionally.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic stylesheet + stable class names | inline `style={...}` repeated across every component |
| explicit callback error output/state | swallowing exceptions so loading never resolves |
| chart plus textual takeaway/table alternative | color-only Plotly chart as sole critical evidence |
| debounce/submit explicit expensive queries | backend query on every keystroke by accident |
| callback ownership graph understood/documented | circular/hidden chained callbacks nobody can reason about |

## Known traps

Duplicate callback outputs, hidden chaining, stale cache/session leakage, large serialization payloads, Plotly color/font defaults clashing with page design, callback exception opacity, asset loading order, multi-user state leakage.

## Verification commands

```sh
python app.py
python -m pytest
python -m compileall .
```

Use browser inspection and callback/network tracing for interaction evidence. Plotly export/static screenshots are not full UI verification.
