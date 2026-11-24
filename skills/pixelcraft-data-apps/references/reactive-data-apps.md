# Reactive Python data apps and notebooks (marimo, Solara, Mesop, Taipy)

When top-to-bottom script reruns or Jupyter's out-of-order hidden state cause bugs, choose a **reactive DAG, component-scoped, or scenario-driven Python framework**.

## Framework decision matrix

| Framework | Execution model | Source format | Best fit | Primary trade-off |
|---|---|---|---|---|
| **marimo** | Reactive dependency DAG (cells re-run deterministically on input change) | Pure Git-friendly `.py` files (`@app.cell`) | Reproducible notebooks, DuckDB SQL exploration, zero-hidden-state web apps, WASM exports | Global variable names must be unique across cells; circular references are disallowed |
| **Solara** | React-like component tree (`@solara.component` + `solara.reactive`) over ipywidgets/Vuetify | Standard Python modules | Stateful multi-page data apps reusing Jupyter/AnyWidget/Altair/Plotly ecosystems | React hook rules (`use_state`, `use_effect`, `use_task`) differ from linear scripts |
| **Mesop** | Typed Python UI (`@me.stateclass` + `@me.page`) rendered with Angular Material components | Pure Python | Internal AI/ML eval tools and rapid Python-only web apps with zero JS build | Opinionated Material styling; custom JS requires web component wrappers |
| **Taipy** | Pipeline/scenario DAG (`taipy.Core`) + reactive GUI (`taipy.gui`) | Python + Builder (`tgb`) or Markdown | Enterprise operations, what-if scenario comparison, scheduled pipelines + dashboards | Heavier project architecture than lightweight single-file tools |

## marimo idioms

- Bind widgets (`mo.ui.slider`, `mo.ui.table`, `mo.ui.dropdown`, `mo.ui.anywidget`) in one cell and read `.value` downstream. Set `debounce=True` on sliders driving SQL or ML queries.
- Query DataFrames and Parquet files directly with `mo.sql` (DuckDB engine), cache expensive steps with `@mo.cache` / `@mo.persistent_cache`, and reserve `mo.state` only for synced multi-control edits that a pure DAG cannot express.
- Configure notebook appearance via `marimo.App(width="medium", css_file="custom.css")` and serve end-user apps read-only with `marimo run app.py` or static Pyodide WASM via `marimo export html-wasm app.py -o dist --mode run`.

```python
import marimo as mo
import altair as alt

threshold = mo.ui.slider(0.0, 1.0, step=0.05, value=0.5, debounce=True, label="Threshold")
filtered = mo.sql(f"SELECT region, score FROM scores_df WHERE score >= {threshold.value}")

@mo.cache
def expensive_summary(min_score: float):
    return run_heavy_agg(min_score)

# Embed any AnyWidget bidirectionally inside the reactive DAG:
widget = mo.ui.anywidget(MyCustomAnyWidget(threshold=threshold.value))
```

## Solara idioms

Scope per-user reactive state with `solara.reactive` (for app/session stores) or `solara.use_state` (component-local), offload slow queries with `solara.use_task`, and map palette tokens through `solara.lab.theme`:

```python
import solara
import solara.lab

solara.lab.theme.themes.light.primary = "#0074ca"
solara.lab.theme.dark = False
selected_region = solara.reactive("EMEA")

@solara.component
def Page():
    task = solara.use_task(lambda: fetch_region_df(selected_region.value), dependencies=[selected_region.value])
    with solara.AppLayout(title="Operations"):
        with solara.Sidebar():
            solara.Select(label="Region", value=selected_region, values=["EMEA", "AMER", "APAC"])
            solara.lab.ThemeToggle()
        if task.pending:
            solara.ProgressLinear(True)
        elif task.error:
            solara.Error(f"Query failed: {task.exception}")
        elif task.value.empty:
            solara.Info("No records match the active filter.")
        else:
            solara.DataFrame(task.value)
```

## Mesop idioms

Declare all serializable session state in a `@me.stateclass`, define pages with `@me.page`, read Material theme tokens via `me.theme_var(...)` + `me.set_theme_mode("system")`, and stream generator yields directly from event handlers:

```python
import mesop as me

@me.stateclass
class State:
    prompt: str = ""
    response: str = ""
    loading: bool = False

def on_run(e: me.ClickEvent):
    state = me.state(State)
    state.loading = True
    state.response = ""
    yield
    for chunk in stream_eval(state.prompt):
        state.response += chunk
        yield
    state.loading = False

@me.page(path="/", title="Eval Bench")
def page():
    state = me.state(State)
    with me.box(style=me.Style(padding=me.Padding.all(24), background=me.theme_var("surface"))):
        me.input(label="Prompt", on_blur=lambda e: setattr(me.state(State), "prompt", e.value))
        me.button("Run eval", type="flat", on_click=on_run, disabled=state.loading)
        if state.loading:
            me.progress_spinner()
        me.markdown(state.response or "_Enter a prompt and run evaluation._")
```

## Taipy idioms

Separate **scenario/pipeline configuration** (`taipy.Config`) from **GUI state** (`taipy.gui.builder` `tgb`), and theme globally with `stylekit`:

```python
import taipy.gui.builder as tgb
from taipy.gui import Gui

threshold = 0.5
chart_df = load_initial_df()

def on_threshold_change(state):
    state.chart_df = filter_df(state.threshold)

with tgb.Page() as page:
    tgb.text("# Demand Forecast", mode="md")
    tgb.slider("{threshold}", min=0.0, max=1.0, step=0.05, on_change=on_threshold_change)
    tgb.chart("{chart_df}", x="date", y="demand", type="bar")

Gui(page=page).run(
    stylekit={"color_primary": "#0074ca", "color_background_light": "#faf8f1"}
)
```

For multi-user scenario workflows (`tp.create_scenario`, `tp.submit`), attach `tgb.scenario_selector` / `tgb.scenario` / `tgb.job_selector` so job status and data node lineage stay inspectable.

## Polars & Narwhals dataframe-agnostic integration

Never serialize multi-million-row eager DataFrames into browser JSON, WebSockets, or widget props just to render a 12-bar chart or paginated table:

- **Polars lazy & streaming queries**: read Parquet/CSV lazily with `pl.scan_parquet(...)` (or `.lazy()`), push filter predicates, column projections, and `group_by().agg(...)` reductions down into Polars, and call `.collect(engine="streaming")` only on the bounded UI result set (e.g., aggregated bins or top-N rows + total count).
- **Narwhals (`narwhals`)**: wrap shared chart/table preparation helpers with `@nw.narwhalify` (or `nw.from_native(df)`) so one component accepts **Polars, Pandas, PyArrow, DuckDB, or Modin** natively without calling `.to_pandas()` copies that spike server RAM.

```python
import narwhals as nw
import polars as pl
from narwhals.typing import IntoFrameT

# Push heavy filtering/aggregation into Polars streaming engine before touching UI
def query_region_totals(path: str, min_score: float) -> pl.DataFrame:
    return (
        pl.scan_parquet(path)
        .filter(pl.col("score") >= min_score)
        .group_by("region")
        .agg(pl.len().alias("rows"), pl.col("score").mean().alias("avg_score"))
        .sort("avg_score", descending=True)
        .collect(engine="streaming")
    )

# Dataframe-agnostic UI prep helper (works identically on Polars, Pandas, PyArrow, DuckDB)
@nw.narwhalify
def top_regions(df: IntoFrameT, limit: int = 10) -> IntoFrameT:
    return df.sort("avg_score", descending=True).head(limit)
```

## Do/don't pairs

| Do | Don't |
|---|---|
| `debounce=True` on marimo sliders driving SQL or ML cells | Recompute heavy DAG branches on every pixel of a drag |
| Keep marimo notebooks in Git as `.py` and run `marimo check` | Rely on hidden out-of-order execution state |
| Push filters and aggregations into Polars LazyFrame/streaming or DuckDB and use Narwhals for library-agnostic helpers | Serialize raw million-row DataFrames over WebSockets or force `.to_pandas()` copies in every widget |
| Offload slow Solara work to `solara.use_task` with error/pending UI | Block the Solara render function with synchronous network calls |
| Keep Mesop session state serializable in `@me.stateclass` | Mutate module-level globals shared across concurrent Mesop users |
| Style Taipy via `stylekit` and explicit `state.*` updates | Mutate global DataFrames without notifying `state` |

## Verification commands

```sh
# marimo
marimo check app.py
marimo run app.py
marimo export html-wasm app.py -o dist --mode run

# Solara
solara run app.py
python -m pytest

# Mesop
mesop app.py

# Taipy
taipy run app.py
```

`marimo check` and `pytest` unit tests provide `static`/logic evidence; inspecting live filter updates, pending/error states, theme contrast, and narrow viewports in a real browser provides `rendered` evidence.
