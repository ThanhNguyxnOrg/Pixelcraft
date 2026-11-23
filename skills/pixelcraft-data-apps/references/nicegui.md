# NiceGUI

Evidence: current docs confirm `ui.colors(...)`, app-wide `app.colors(...)`, `ui.dark_mode()`, and `ui.add_head_html` for custom CSS/HTML.

## Token mapping

Use app/page color configuration first:

```python
app.colors(primary='#0074ca', brand='#0074ca')
ui.colors(primary='#0074ca')
dark = ui.dark_mode()  # None means auto
```

Use Quasar/Tailwind-style classes deliberately and inject scoped CSS with `ui.add_head_html` only when supported configuration is insufficient.

## Layout and responsive idioms

NiceGUI is component/server driven. Use rows/columns/cards/expansion/tabs/pages by task flow, but verify actual responsive DOM. Shared/global page state and per-user state must be separated explicitly. Avoid fixed-width desktop dashboard assumptions.

## Typography/custom fonts

Use CSS/font assets through documented HTML/head mechanisms. Because output is web DOM, fallback/loading/script coverage remain relevant. Do not hide typography inside ad hoc inline styles everywhere.

## Motion/reduced motion

Use CSS/Quasar motion sparingly and honor `prefers-reduced-motion`. Server push/update latency is interaction feedback; use immediate local pending state where possible.

## Accessibility specifics

Quasar components provide baseline semantics, but labels/aria/focus/keyboard behavior still need inspection. Dynamic server-side updates need status/error visibility. `ui.add_head_html` can add meta/CSS but cannot repair missing semantic structure by itself.

## States idiom

Understand page lifecycle, shared objects, background tasks, timers, and websocket/client state. Explicitly model loading/error/empty/offline/disconnected states. Avoid mutating shared global UI objects across users. Background work needs cancellation/timeout/error propagation.

## Forms idiom

Use labeled inputs, validation rules where supported, correct props/types, preservation across server events, and explicit submit behavior. Do not run expensive actions on every keystroke unless intentionally debounced/designed.

## Do/don't pairs

| Do | Don't |
|---|---|
| `app.colors(primary=...)` or page-level `ui.colors` intentionally | injecting global CSS that fights Quasar unpredictably |
| `ui.dark_mode()` auto/manual behavior explicit | assuming dark mode exists because browser prefers it |
| stable classes plus scoped `ui.add_head_html` CSS | brittle generated-selector hacks |
| per-user page/state ownership | shared mutable globals leaking across sessions |
| visible reconnect/error state | silent websocket failure while UI appears live |

## Known traps

Shared-state leakage, server-client synchronization gaps, dark-mode precedence confusion, custom CSS instability, background task lifecycle, browser disconnect/reconnect state, mobile layout assumptions, injected HTML/security risk.

## Verification commands

```sh
python main.py
python -m pytest
python -m compileall .
```

Rendered evidence requires actual browser inspection including resize, dark mode, keyboard, disconnect/reconnect, and multi-client behavior where relevant.
