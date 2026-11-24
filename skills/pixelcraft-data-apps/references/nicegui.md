# NiceGUI

## Token mapping

Configure Quasar palette tokens globally with `app.colors(...)` or per page with `ui.colors(...)`, pair with `ui.dark_mode()` (`None` follows system preference), and add scoped semantic CSS variables via `ui.add_head_html` only when Quasar/Tailwind utility classes are insufficient:

```python
from nicegui import app, ui

app.colors(primary="#0074ca", secondary="#0f766e", positive="#15803d", negative="#b91c1c")
ui.add_head_html("<style>.num { font-variant-numeric: tabular-nums; }</style>", shared=True)
```

## Page isolation, storage scopes, refreshables, and async offloading

Always use `@ui.page(...)` for multi-user apps. Top-level auto-index scripts share one UI tree across every connected browser, leaking selections and form input between users.

| Storage scope | Persistence | Isolation | Requirement / use case |
|---|---|---|---|
| `app.storage.user` | Server JSON/Redis + signed cookie | Per user across tabs & reloads | Requires `storage_secret=...` in `ui.run()`; preferences, theme, auth user ID |
| `app.storage.tab` | Server memory (TTL) | Per browser tab across reloads | Active tab filters, draft wizard state |
| `app.storage.client` | Server memory | Single websocket connection | Ephemeral view objects cleared on refresh |
| `app.storage.general` | Server JSON/Redis | Shared across all users | Global feature flags, shared reference metadata only |

```python
from nicegui import app, run, ui

@ui.page("/reports")
async def reports_page():
    ui.dark_mode().bind_value(app.storage.user, "dark_mode")
    region = app.storage.tab.setdefault("region", "EMEA")
    state = {"rows": [], "loading": False, "error": None}

    @ui.refreshable
    def results_panel():
        if state["loading"]:
            ui.spinner(size="lg")
            return
        if state["error"]:
            ui.label(f"Load failed: {state['error']}").classes("text-negative")
            return
        if not state["rows"]:
            ui.label("No rows match the selected region.")
            return
        ui.aggrid({"columnDefs": [{"field": "order_id"}, {"field": "amount"}], "rowData": state["rows"]})

    async def load_data():
        state["loading"], state["error"] = True, None
        results_panel.refresh()
        try:
            # Offload blocking DB I/O or heavy CPU work off the asyncio event loop
            state["rows"] = await run.io_bound(query_warehouse, app.storage.tab["region"])
        except Exception as exc:
            state["error"] = str(exc)
        finally:
            state["loading"] = False
            results_panel.refresh()

    with ui.header().classes("items-center justify-between"):
        ui.label("Operations Reports").classes("text-h6")
        ui.switch("Dark").bind_value(app.storage.user, "dark_mode")

    with ui.row().classes("w-full items-end gap-4"):
        ui.select(["EMEA", "AMER", "APAC"], label="Region", value=region).bind_value(app.storage.tab, "region")
        ui.button("Refresh", on_click=load_data)

    results_panel()
    await load_data()

ui.run(storage_secret="replace-with-env-secret")
```

- Use `run.io_bound(fn, ...)` for blocking network/database calls and `run.cpu_bound(fn, ...)` for heavy NumPy/Pandas compute so websocket heartbeats never freeze and clients do not disconnect.
- Use `@ui.refreshable` (calling `.refresh()`) to update only the affected DOM subtree instead of clearing and rebuilding the entire page.

## Layout, typography, motion, and accessibility

Compose responsive layouts with `ui.header`, `ui.left_drawer`, `ui.row().classes("flex-wrap")`, `ui.grid`, and `ui.card` rather than fixed pixel containers. Honor `prefers-reduced-motion` in custom CSS. Quasar provides baseline ARIA, but verify labels, focus order, dark-mode contrast, and websocket disconnect banners in the rendered DOM.

## Do/don't pairs

| Do | Don't |
|---|---|
| `@ui.page(...)` with `app.storage.tab` / `app.storage.user` | Auto-index top-level UI leaking controls across every connected user |
| `await run.io_bound(...)` / `run.cpu_bound(...)` for slow work | Blocking the asyncio loop and causing websocket timeouts |
| `@ui.refreshable` for scoped dynamic regions | Calling `container.clear()` across unrelated input widgets |
| `ui.aggrid` / `ui.table` with empty and error branches | Rendering an empty grid silently when a query raises |
| Explicit `storage_secret` from env for `app.storage.user` | Hardcoding secrets or storing private user data in `app.storage.general` |

## Known traps

Accidental shared auto-index pages, blocking the event loop on synchronous DB calls, forgetting `storage_secret`, storing unserializable objects in `app.storage.user`, websocket disconnect without user feedback, and unsafe raw HTML passed to `ui.html(..., sanitize=False)`.

## Verification commands

```sh
python -m compileall .
python -m pytest
python main.py
```

Use `nicegui.testing` pytest fixtures: the lightweight `user` fixture (`User`) validates simulated DOM interactions and event handlers quickly (`static`/simulated evidence), while the `screen` fixture (`Screen`, browser-backed) or Playwright verifies real rendering, dark mode, responsive wrap, and reconnect behavior (`rendered` evidence).
