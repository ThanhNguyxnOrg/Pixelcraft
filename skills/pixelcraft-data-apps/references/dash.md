# Plotly Dash

## Dash 3 runtime, theming, and component ecosystem

Dash 3 runs on **React 18**, replaces the removed `app.run_server()` with **`app.run()`**, and introduces **`dash.hooks`** for reusable plugin/layout/callback lifecycle extensions.

- **Token mapping**: Place semantic CSS variables in `assets/tokens.css` (auto-served by Dash) or configure **Dash Mantine Components (`dash_mantine_components` / `dmc.MantineProvider`)** with a typed theme object rather than duplicating inline `style={...}` dicts. Always synchronize Plotly figure templates (`layout.template`) with light/dark page tokens.
- **High-density tables**: Prefer **Dash AG Grid (`dash_ag_grid.AgGrid`)** over legacy `dash_table.DataTable` for virtualized sorting, filtering, pinned columns, accessible keyboard grid navigation, and numeric formatting.
- **Multipage apps**: Enable **Dash Pages** (`Dash(__name__, use_pages=True)`) with `dash.register_page(__name__, path="/cohorts", name="Cohorts")` and render `dash.page_container` inside one shared shell.

## Callbacks: Patch, clientside, background, and duplicate outputs

```python
import dash
from dash import Dash, DiskcacheManager, Input, Output, Patch, State, callback, clientside_callback, dcc, html
import dash_mantine_components as dmc
import dash_ag_grid as dag
import diskcache

cache = diskcache.Cache("./.dash-cache")
app = Dash(__name__, use_pages=True, background_callback_manager=DiskcacheManager(cache))

app.layout = dmc.MantineProvider(
    dmc.AppShell(
        [
            dmc.AppShellHeader(dmc.Group([dmc.Title("Ops Monitor", order=3), dmc.Switch(id="dark-toggle", label="Dark")])),
            dmc.AppShellMain([
                dmc.Button("Run heavy backfill", id="run-btn"),
                dmc.Button("Cancel", id="cancel-btn", variant="outline"),
                dmc.Progress(id="job-progress", value=0),
                dcc.Graph(id="live-chart"),
                dag.AgGrid(id="orders-grid", columnDefs=[{"field": "order_id"}, {"field": "amount"}], rowData=[]),
                dash.page_container,
            ]),
        ]
    )
)

# Partial update with Patch(): append a point without re-serializing the whole figure
@callback(Output("live-chart", "figure", allow_duplicate=True), Input("tick", "n_intervals"), prevent_initial_call=True)
def append_point(_):
    patched = Patch()
    patched["data"][0]["x"].append(next_ts())
    patched["data"][0]["y"].append(next_value())
    return patched

# Zero-roundtrip JS callback for instant UI responsiveness (theme switch, drawer toggle)
clientside_callback(
    "checked => checked ? 'dark' : 'light'",
    Output("mantine-provider", "forceColorScheme"),
    Input("dark-toggle", "checked"),
)

# Non-blocking background callback with cancellation and real progress
@callback(
    Output("orders-grid", "rowData"),
    Input("run-btn", "n_clicks"),
    background=True,
    running=[(Output("run-btn", "disabled"), True, False)],
    cancel=[Input("cancel-btn", "n_clicks")],
    progress=[Output("job-progress", "value")],
    prevent_initial_call=True,
)
def run_backfill(set_progress, _n):
    rows = []
    for pct, batch in fetch_batches():
        rows.extend(batch)
        set_progress(pct)
    return rows

if __name__ == "__main__":
    app.run(debug=True)
```

- Use `dash.hooks.layout(...)` / `dash.hooks.error(...)` to attach cross-cutting banners, telemetry, or global error handling cleanly across pages.
- Always pair `Output(..., allow_duplicate=True)` with `prevent_initial_call=True` (or `"initial_duplicate"`) and document which callbacks write to the same target.

## Typography, motion, and accessibility

Load custom fonts via `assets/` or `external_stylesheets` and configure `figure.layout.font` explicitly because Plotly SVGs do not inherit every page font role. Honor `prefers-reduced-motion` in `assets/*.css`. Use semantic HTML (`html.Main`, `html.Nav`, `html.Label`) or accessible `dmc` primitives, verify keyboard reach in AG Grid and modals, and pair Plotly charts with text summaries or expandable tables.

## States and forms idiom

Keep user/session state in `dcc.Store(storage_type="session" | "memory")` (never mutable module globals), bound payload size, and surface empty datasets, callback errors, and offline states visibly rather than leaving an infinite loading spinner. Use `State(...)` + an explicit Apply button for multi-filter expensive queries.

## Do/don't pairs

| Do | Don't |
|---|---|
| `app.run(debug=True)` in Dash 3 | Removed `app.run_server(...)` |
| `Patch()` for incremental chart/grid mutations | Re-serializing megabyte figure dicts on every tick |
| `clientside_callback` for theme toggles and pure UI state | Round-tripping to Python just to open a modal or flip dark mode |
| `background=True` with `running=`, `cancel=`, `progress=` | Blocking Gunicorn workers on 30-second queries |
| `dash_ag_grid.AgGrid` + `dash_mantine_components` | Nested raw `html.Div`s with repeated inline `style={...}` |
| `dcc.Store` per-session state | Mutating global Python lists/DataFrames across concurrent users |

## Known traps

Calling removed `app.run_server()`, circular callback graphs, giant JSON payloads in `dcc.Store`, forgetting `prevent_initial_call` with `allow_duplicate=True`, uncancelled long background jobs, Plotly default light template clashing with dark mode, and silent callback exceptions leaving spinners stuck.

## Verification commands

```sh
python -m compileall .
python -m pytest
python app.py
```

Use `dash.testing` (`dash_duo` with headless Chromium) or Playwright to inspect rendered callbacks, network payloads, dark mode, and keyboard navigation (`rendered` evidence); direct Python callback unit tests prove logic only (`static`).
