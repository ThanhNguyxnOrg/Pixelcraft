# Panel / HoloViz

## Token mapping and component layer

Use **Panel Material UI (`panel_material_ui` / `pmui`)** or Panel's native templates (`pn.template.FastListTemplate`, `MaterialTemplate`) with explicit light/dark palette configuration before writing custom CSS. Synchronize Bokeh/HoloViews/Plotly figure themes explicitly so dark surfaces never frame bright white default plots.

```python
import panel as pn
import panel_material_ui as pmui

pn.extension("tabulator")  # load only extensions actually used
```

## Reactive expressions (`pn.rx`), caching, chat, and Material UI idioms

Prefer **`pn.rx(...)`** reactive expressions over verbose `@pn.depends` boilerplate, scope caches with **`per_session=True`** whenever user permissions or private filters apply, and use **`pn.chat.ChatInterface`** for streaming AI/data assistants:

```python
import panel as pn
import panel_material_ui as pmui
import pandas as pd

pn.extension("tabulator")

@pn.cache(per_session=True, ttl=300)
def load_orders(region: str) -> pd.DataFrame:
    return query_region_orders(region)

region = pmui.Select(label="Region", options=["EMEA", "AMER", "APAC"], value="EMEA")
orders_rx = pn.rx(load_orders)(region)

def render_table(df: pd.DataFrame):
    if df.empty:
        return pn.pane.Alert("No orders match the active filter.", alert_type="info")
    return pn.widgets.Tabulator(df, pagination="remote", page_size=25, sizing_mode="stretch_width")

async def respond(contents: str, user: str, instance: pn.chat.ChatInterface):
    partial = ""
    async for chunk in stream_analyst_reply(contents, region.value):
        partial += chunk
        yield partial

chat = pn.chat.ChatInterface(callback=respond, sizing_mode="stretch_both")

page = pmui.Page(
    title="Operations Console",
    sidebar=[region],
    main=[
        pn.bind(render_table, orders_rx),
        chat,
    ],
)
page.servable()
```

## Pyodide / WebAssembly static deployment

For serverless public demos or documentation embeds, compile Panel apps to client-side Pyodide with:

```sh
panel convert app.py --to pyodide-worker --out dist
```

- Verify every dependency ships a pure-Python or Pyodide wheel.
- Strip all server secrets and warehouse credentials—code and bundled data ship directly to the browser.
- Provide explicit initial loading copy while Pyodide boots and downloads packages.

## Layout, motion, and accessibility

Set explicit `sizing_mode` (`"stretch_width"`, `"stretch_both"`, or fixed width where tabular alignment demands it) on every pane and widget—unspecified sizing modes are the top cause of clipped Panel dashboards. Use `pn.param.loading_indicator` / `loading=True` truthfully during callbacks, honor `prefers-reduced-motion` in custom CSS, and pair HoloViews/Bokeh canvases with text summaries or Tabulator data views for keyboard and screen-reader users.

## States and forms idiom

Keep per-user mutable state inside session callbacks or `pn.state.cache` keyed by session, never global mutable lists. For expensive parameter sweeps, bind a `pmui.Button` (or `pn.bind(..., watch=...)` with explicit trigger) instead of recomputing on every slider drag. Surface empty results, backend exceptions, and websocket disconnect states visibly.

## Do/don't pairs

| Do | Don't |
|---|---|
| `pn.rx(...)` reactive expressions with clear data flow | Deeply tangled `@pn.depends` side-effect chains |
| `@pn.cache(per_session=True, ttl=...)` for user-scoped queries | Global `@pn.cache` leaking one tenant's DataFrame to another |
| `panel_material_ui` (`pmui.Page`) with synced light/dark plot themes | Default white Bokeh/Plotly plots inside a dark template |
| Explicit `sizing_mode="stretch_width"` per pane | Fixed notebook pixel widths pasted into production apps |
| `panel convert --to pyodide-worker` only for secret-free apps | Exporting apps containing DB credentials to WASM |

## Known traps

Missing `sizing_mode`, cross-user leaks in global `@pn.cache`, forgetting `pn.extension("tabulator")` before serving, blocking Tornado's event loop with heavy synchronous I/O, Bokeh/Panel dark-mode theme mismatch, and notebook behavior diverging from `panel serve`.

## Verification commands

```sh
python -m compileall .
python -m pytest
panel serve app.py --autoreload
panel convert app.py --to pyodide-worker --out dist
```

Browser inspection across desktop/narrow widths, dark/light themes, and live filter updates gives `rendered` evidence; notebook preview and `pytest` alone are `static`/logic evidence.
