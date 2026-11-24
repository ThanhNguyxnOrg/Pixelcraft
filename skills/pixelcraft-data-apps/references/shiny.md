# Shiny for Python

## Token mapping

Use `ui.Theme` (backed by Bootstrap 5 / Bootswatch Sass compilation) for semantic colors, typography, and spacing, paired with `ui.input_dark_mode()` and scoped CSS files under `www/`. Synchronize Matplotlib/Plotly/Altair figure styles separately because plotting libraries do not automatically inherit Bootstrap CSS variables.

```python
from shiny import ui

app_theme = (
    ui.Theme("flatly")
    .add_defaults(
        primary="#0074ca",
        body_bg="#faf8f1",
        body_color="#161b24",
    )
    .add_rules(".metric-note { font-variant-numeric: tabular-nums; }")
)
```

## Express vs Core architecture

Choose the API surface that matches app complexity rather than mixing them randomly:

| Mode | Entry idiom | Best fit | Trade-off |
|---|---|---|---|
| **Shiny Express** | `from shiny.express import input, render, ui` | Rapid single-file prototypes, notebook-like top-to-bottom apps | Implicit UI ordering makes large modular apps harder to test and share |
| **Shiny Core** | `App(app_ui, server)` + `@module.ui` / `@module.server` | Production multi-page dashboards, reusable modules, strict separation of layout and reactive server graph | Slightly more boilerplate for tiny demos |

```python
# Shiny Core with non-blocking ExtendedTask and streaming ui.Chat
import asyncio
from shiny import App, reactive, render, ui

app_ui = ui.page_sidebar(
    ui.sidebar(
        ui.input_select("region", "Region", ["EMEA", "AMER", "APAC"]),
        ui.input_task_button("run_forecast", "Run forecast"),
        ui.input_dark_mode(),
    ),
    ui.layout_columns(
        ui.card(ui.card_header("Forecast"), ui.output_data_frame("forecast_tbl")),
        ui.card(ui.card_header("Analyst assistant"), ui.chat_ui("assistant")),
    ),
    title="Revenue Forecast",
    theme=app_theme,
)

def server(input, output, session):
    @ui.bind_task_button(button_id="run_forecast")
    @reactive.extended_task
    async def compute_forecast(region: str):
        await asyncio.sleep(0.1)  # replace with async I/O or ThreadPoolExecutor work
        return run_model_for_region(region)

    @reactive.effect
    @reactive.event(input.run_forecast)
    def _start_forecast():
        compute_forecast(input.region())

    @render.data_frame
    def forecast_tbl():
        return render.DataGrid(compute_forecast.result())

    chat = ui.Chat(id="assistant")

    @chat.on_user_submit
    async def _handle_chat(user_input: str):
        await chat.append_message_stream(stream_llm_chunks(user_input))

app = App(app_ui, server)
```

## Layout, responsiveness, and Shinylive (WASM)

- Build responsive layouts with `ui.page_sidebar`, `ui.page_navbar`, `ui.layout_columns(col_widths=...)`, `ui.card(full_screen=True)`, and `ui.value_box`. Reserve stable heights for reactive outputs so charts do not jump on recalculation.
- For zero-server static distribution (docs, demos, public reports), export to **Shinylive (Pyodide/WebAssembly)** with `shinylive export app site`. Verify every dependency has a pure-Python or Pyodide wheel, keep all secrets out of client code, and show an honest loading state while the WASM runtime initializes.

## Typography, motion, and accessibility

Load custom fonts via `ui.Theme` / `ui.head_content` with explicit fallbacks and `tabular-nums` for KPIs. Prefer reactive busy indicators (`ui.input_task_button`, `ui.Progress`) over decorative motion, and honor `prefers-reduced-motion` in custom CSS. Ensure inputs have real labels, plots include text/table alternatives, and focus does not vanish when dynamic UI rerenders.

## States and forms idiom

Separate reactive calculations (`@reactive.calc`), side effects (`@reactive.effect`), and non-blocking jobs (`@reactive.extended_task`). Use `req(...)` or explicit empty/error UI panels so invalid filters never silently blank an output without explanation. Isolate per-user state inside `server(...)` (or `reactive.value` per session); never mutate module-level globals across concurrent users.

## Do/don't pairs

| Do | Don't |
|---|---|
| `ui.Theme(...)` + `ui.input_dark_mode()` | Scattering inline CSS overrides across every component |
| `@reactive.extended_task` + `ui.input_task_button` for slow work | Blocking the shared asyncio loop with synchronous CPU/DB calls |
| Shiny Core + `@module.ui`/`@module.server` for multi-view apps | Growing a 1,500-line single-file Express script with name collisions |
| `ui.Chat` + `append_message_stream` for streaming responses | Re-rendering an entire markdown blob on every token |
| Explicit empty/error message when a query returns zero rows | Silent blank output caused by bare `req()` without user copy |

## Known traps

Blocking the event loop without `ExtendedTask`/executor offloading, mutating module globals across sessions, plot themes ignoring dark mode, Shinylive builds failing on C-extension packages or leaking credentials, and focus loss during dynamic `render.ui` redraws.

## Verification commands

```sh
python -m compileall .
python -m pytest
shiny run app.py
shinylive export app site
```

Run `pytest` with Playwright (`shiny.playwright` / `shiny.pytest`) and inspect narrow/desktop layouts, dark mode, and empty/error states in a browser for `rendered` evidence; compilation alone is `static`.
