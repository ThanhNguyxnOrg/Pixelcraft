# Reactive Python data apps and notebooks (marimo, Solara, Mesop, Taipy)

When Streamlit's top-to-bottom script rerun model or Jupyter's out-of-order hidden state causes bugs, choose a **reactive DAG or component-scoped Python framework**.

## Framework decision matrix

| Framework | Execution model | Source format | Best fit | Primary trade-off |
|---|---|---|---|---|
| **marimo** | Reactive dependency DAG (cells re-run deterministically on input change) | Pure Git-friendly `.py` files (`@app.cell`) | Reproducible notebooks, interactive SQL/data exploration, and zero-hidden-state web apps (`marimo run`) | Global variable names must be unique across cells; circular references are disallowed by design |
| **Solara** | React-like component model (`@solara.component` + `solara.reactive`) built on ipywidgets/Vuetify | Standard Python modules | Complex stateful multi-page data apps reusing Jupyter/ipywidgets/Altair/Plotly ecosystems | More React-like mental model than linear notebooks |
| **Mesop** | Google's Python-native UI framework with Angular Material components & typed `@me.stateclass` | Pure Python | Internal AI/ML evaluation tools, rapid Python-only web UIs without writing JS/CSS | Opinionated Material styling; less customizable than full frontend frameworks |
| **Taipy** | Scenario/pipeline orchestration + GUI (`taipy.gui`) | Python + Markdown/builder UI | Enterprise operations, what-if scenario management, scheduled data pipelines + dashboards | Heavier framework footprint than lightweight notebook apps |

## marimo implementation idioms

- Bind interactive widgets (`mo.ui.slider`, `mo.ui.table`, `mo.ui.dropdown`) to variables in one cell and read `.value` in downstream cells—marimo automatically executes only dependent cells in DAG order.
- Set `debounce=True` on continuous controls (`mo.ui.slider(..., debounce=True)`) when downstream cells run expensive SQL or ML queries so dragging does not trigger dozens of intermediate computations.
- Deploy read-only end-user views with `marimo run app.py` (hides code cells by default) while developing interactively with `marimo edit app.py`.

```python
import marimo as mo

threshold = mo.ui.slider(
    start=0.0,
    stop=1.0,
    step=0.05,
    value=0.5,
    debounce=True,
    show_value=True,
    label="Confidence threshold",
)
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `debounce=True` on marimo sliders driving heavy queries or model inference | Recompute expensive pipelines on every pixel of a slider drag |
| Keep marimo notebooks in Git as `.py` files and test them as Python scripts | Rely on hidden out-of-order notebook execution state |
| Scope state cleanly in `@solara.component` or `@me.stateclass` | Mutate module-level globals shared across concurrent user sessions |
| Expose data freshness, empty states, and query errors explicitly in every view | Render blank panels when a filter returns zero rows |

## Verification commands

```sh
marimo check app.py
```

Run `marimo check` (`static`) and inspect interactive filter/slider updates, narrow viewports, and empty/error states in a real browser (`rendered`).
