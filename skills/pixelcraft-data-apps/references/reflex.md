# Reflex

## Token mapping

Configure global appearance, accent, gray scale, and radius on `rx.App(theme=rx.theme(...))` (backed by Radix Themes), and centralize semantic style tokens in a Python constants module rather than scattering inline style dicts across components:

```python
import reflex as rx

app = rx.App(
    theme=rx.theme(
        appearance="inherit",  # respects system light/dark or rx.color_mode
        has_background=True,
        radius="medium",
        accent_color="blue",
        gray_color="slate",
    )
)
```

## Reactive state, `@rx.event`, background tasks, and control flow

Reflex compiles Python UI definitions into a React/Vite frontend paired with a FastAPI/WebSocket state backend. Always use Reflex's reactive primitives (`@rx.event`, `@rx.var(cache=True)`, `rx.foreach`, `rx.cond`, `rx.match`, `rx.ComponentState`) instead of plain Python `if`/`for` on state vars:

```python
import reflex as rx

class MetricsState(rx.State):
    region: str = "EMEA"
    rows: list[dict[str, str]] = []
    status: str = "idle"  # "idle" | "loading" | "error" | "ready"
    error_message: str = ""

    @rx.var(cache=True)
    def row_count(self) -> int:
        return len(self.rows)

    @rx.event
    def set_region(self, value: str):
        self.region = value

    @rx.event(background=True)
    async def refresh_rows(self):
        async with self:
            self.status = "loading"
            self.error_message = ""
        try:
            data = await fetch_region_rows_async(self.region)
            async with self:
                self.rows = data
                self.status = "ready"
        except Exception as exc:
            async with self:
                self.error_message = str(exc)
                self.status = "error"

def metrics_view() -> rx.Component:
    return rx.vstack(
        rx.hstack(
            rx.select(["EMEA", "AMER", "APAC"], value=MetricsState.region, on_change=MetricsState.set_region),
            rx.button("Load", on_click=MetricsState.refresh_rows, loading=MetricsState.status == "loading"),
        ),
        rx.match(
            MetricsState.status,
            ("loading", rx.spinner(size="3")),
            ("error", rx.callout(MetricsState.error_message, color_scheme="red")),
            (
                "ready",
                rx.cond(
                    MetricsState.row_count > 0,
                    rx.foreach(MetricsState.rows, lambda r: rx.text(f"{r['id']}: {r['total']}")),
                    rx.text("No records match the selected region."),
                ),
            ),
            rx.text("Select a region and load data."),
        ),
    )
```

- **`@rx.event`**: Mark every UI-invocable state method explicitly with `@rx.event` so backend state boundaries stay auditable and safe.
- **`@rx.event(background=True)`**: Offload slow I/O, LLM streaming, or warehouse queries to background tasks; mutate `self.*` strictly inside `async with self:` blocks so the client can stay interactive while work runs.
- **`@rx.var(cache=True)`**: Cache derived computed vars so expensive filters or aggregations only recompute when their tracked dependencies change.
- **`rx.ComponentState`**: Use `class FilterCard(rx.ComponentState)` when rendering multiple independent instances of a stateful widget (editable cards, modals, inline drawers) so each instance gets isolated state automatically without manual dictionary keys.

## Layout, typography, motion, and accessibility

Use responsive Radix layout props (`columns=rx.breakpoints(initial="1", md="2", lg="3")`) rather than fixed desktop widths. Load custom fonts via `stylesheets=[...]` on `rx.App(...)` and respect `prefers-reduced-motion` in custom CSS. Verify real DOM labels, keyboard focus order, disabled/loading states, and contrast on Radix/custom components rather than assuming Python wrappers guarantee accessibility.

## Forms idiom

Prefer `rx.form(..., on_submit=State.handle_submit)` for multi-field mutations so form inputs do not incur websocket roundtrips on every keystroke. Preserve failed drafts in state and show validation copy adjacent to the offending field rather than toast-only alerts.

## Do/don't pairs

| Do | Don't |
|---|---|
| `@rx.event` on handlers and `@rx.event(background=True)` for slow I/O | Blocking the default state lock with long synchronous queries |
| `rx.cond`, `rx.match`, `rx.foreach` over reactive `Var`s | Python `if State.flag:` or `for item in State.rows:` inside render |
| `@rx.var(cache=True)` for expensive derived values | Recomputing heavy aggregations on every unrelated state tick |
| `rx.ComponentState` for repeatable stateful widgets | Sharing one global state singleton across multiple widget instances |
| `rx.form(on_submit=...)` to batch edits | Sending websocket `on_change` events per keystroke on large forms |

## Known traps

Mutating `self` outside `async with self:` inside a background event, placing unserializable database connections on `rx.State` (keep them module/pool-level or underscore-prefixed private backend vars), websocket disconnects without visible state, oversized state payloads serialized on every delta, and forgetting `cache=True` on heavy computed vars.

## Verification commands

```sh
python -m compileall .
python -m pytest
reflex run
reflex export --frontend-only
```

`reflex export` validates frontend compilation (`static`), and `pytest` checks state logic (`static`); inspect rendered browser views, responsive breakpoints, dark mode, and websocket state transitions for `rendered` evidence.
