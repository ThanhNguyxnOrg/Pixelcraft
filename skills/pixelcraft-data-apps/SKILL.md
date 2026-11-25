---
name: pixelcraft-data-apps
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into data applications, AI/ML demos, dashboards, notebooks, BI reports, and internal tools in any language. Use for Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny for Python or R, Julia Genie/Stipple, marimo, Solara, Mesop, Taipy, Chainlit, FastHTML, Preswald, Jupyter ipywidgets, AnyWidget, Voila, Observable Framework, Evidence, and low-code internal tools (Retool, Appsmith, ToolJet, Budibase) including state/rerun behavior, theming limits, SQL freshness, and honest verification.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft data apps

Use this skill when the workload is a data app, AI/ML demo, dashboard, notebook surface, BI/reporting product, or internal operational tool—regardless of implementation language. The scope is the workload, not Python. Flet and Kivy are cross-platform application frameworks and route through `pixelcraft-mobile`; Qt/PySide belongs to `pixelcraft-desktop`; Textual/Rich belongs to `pixelcraft-tui`; Django/Jinja belongs to `pixelcraft-web`.

## Surface craft

Keep active filters, data freshness, and the selected result visibly linked. Put stable summaries near the controls that change them; defer heavier details without replacing the working context. Test a slow query, an empty result, a changed filter, and a stale result. Do not copy a dashboard layout without its data provenance or rerun behavior.

## Detection signals

Python imports/entry points (`st.*`, `gr.*`, `rx.*`, NiceGUI `ui.*`, Dash callbacks, Panel/HoloViz objects, Shiny UI/server, `marimo` `@app.cell`, `solara`, `mesop`, `taipy`, `chainlit` `@cl.*`, `fasthtml`, `preswald`, `anywidget`/`ipywidgets`, `voila`), `.streamlit/config.toml`, `.chainlit/config.toml`, `preswald.toml`, notebooks, R `DESCRIPTION`/`app.R` with Shiny/`bslib`, Julia `Project.toml` with Genie/Stipple, Observable `observablehq.config.*`/data loaders, Evidence `evidence.config.yaml`/`theme.yaml`/`pages`/`sources`, low-code exports/configs (Retool, Appsmith, ToolJet, Budibase), SQL/warehouse configs, and cache/data-loader definitions.

## Translate direction with honest constraints

1. Preserve the direction concept even when exact visual control is limited: hierarchy, real content, color posture, composition, copy, states, and data design still apply.
2. Map tokens through the framework's supported theme layer first; use custom CSS/components only as scoped escape hatches.
3. Understand rerun/session/callback/build semantics before designing interaction. Do not lose form state because a widget key, query lifecycle, or callback owner was careless.
4. Prioritize data legibility, task flow, feedback, empty/error states, reproducibility, and trust over cosmetic pixel matching.
5. Escape hatch order: native theme/config -> semantic component props/layout containers -> documented custom CSS/classes -> custom component/extension. Avoid brittle selectors where internals change across releases.

## Platform-wide rules

- **Truthful freshness, timezone & SLA state**: every query/view exposes progress, cancellation/timeout recovery, **explicit display timezone (`UTC` vs local)**, and a **Data Freshness / SLA Staleness badge** (`Updated 12s ago` -> warning state when warehouse/stream lags SLA).
- **Honest numeric & time-series fidelity**: enforce right-aligned `tabular-nums`, **True Minus `U+2212` (`−`)**, explicit unit headers (`$ USD`, `ms`, `%`), **strict visual separation between `0` (measured zero) and `null / — / N/A` (missing)**, and **`LTTB` / `Min-Max` envelope downsampling** (never naive `every-Nth` slicing) on `10k–1M+` time-series.
- **Enterprise grid & URL-serialized state**: drive large tables via **server-side indexed cursor/keyset pagination** (`WHERE (ts, id) < (:c_ts, :c_id)` rather than slow high-offset `OFFSET`) and serialize active filters, sorts, date windows, and views into **shareable URL query parameters**.
- **OWASP CSV/XLSX export security & background streaming**: neutralize **CSV/XLSX Formula Injection** by escaping/prefixing string cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` before download so Excel/Sheets cannot trigger `DDE`/remote payload execution, and stream large exports asynchronously rather than blocking worker RAM.
- **Safe internal-tool mutations**: enforce **RBAC + database Row-Level Security (RLS)**, require a **`Diff / Confirm` impact modal** (`Before -> After` field preview + affected row count) before bulk updates/deletes, and append every write to an immutable **Audit Log** (`actor`, `timestamp_utc`, `target`, `before -> after`).
- **Strict session isolation**: secrets, uploaded files, warehouse results, and cache keys must never leak across concurrent sessions/users or into static client WASM bundles.

## Anti-lazy-default & anti-slop guard

- **Do not reflexively default every Python/data workload to Streamlit or Gradio**: Streamlit's top-to-bottom script rerun model and Gradio's single-model demo layout excel at quick prototypes and ML inference demos, but **escalate** when the workload outgrows them:
  - **Reactive notebooks & zero-hidden-state DAGs / WASM**: choose **marimo** (`@app.cell`, DuckDB `mo.sql`).
  - **Concurrent multi-user reactive apps & long-running tasks**: choose **Shiny** (`ExtendedTask`), **Panel** (HoloViz / Datashader million-point streaming), or **Dash** (enterprise AG Grid + clientside/background callbacks).
  - **Custom stateful web UI / full layout & auth control in Python**: choose **Reflex** or **NiceGUI**.
  - **Fast read-heavy BI reports & scheduled SQL publications**: choose **Observable Framework** or **Evidence** (static/pre-built SQL snapshots with instant loads).
- **Reject untouched template slop**: do not ship default sidebar-filter dumps, unattributed KPI numbers without units/timezone/SLA freshness badges, naive `every-Nth` chart slicing, unescaped CSV exports, or unguarded bulk-delete buttons.

## Common data-app failures

- uncontrolled reruns or rebuilds wiping input and triggering expensive work;
- hidden state keys or SQL parameters colliding across pages/users;
- stale data presented without timezone or SLA freshness badge, or `null` coerced to `0`;
- naive `every-Nth` downsampling hiding incident spikes, or `OFFSET 100000` pagination timing out;
- CSV/XLSX exports vulnerable to `=CMD|...` formula injection in Excel/Sheets;
- internal admin tools executing bulk SQL mutations without RBAC, `Diff / Confirm` preview, or Audit Log writes;
- wide desktop layout unusable in narrow embedded contexts.

## Verification options

DOM-backed frameworks can often be inspected in browser when the app runs, but visual verification requires actually launching them. Unit tests (`AppTest`, `nicegui.testing.User`, `testthat`, `pytest`) validate callbacks, SQL, CSV escaping, or RBAC (`static`) without proving rendering. Static data apps (Evidence, Observable, Shinylive, marimo/Panel WASM) need build inspection plus browser rendering (`rendered`). Label absence honestly.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, fabricated KPIs, or dead widget callbacks;
- [ ] framework choice matches concurrency, rerun/DAG, and publishing needs (not a lazy Streamlit/Gradio default);
- [ ] loading, empty, error, timeout/cancel, explicit timezone (`UTC`/local), and **Data Freshness / SLA Staleness badge** wired;
- [ ] heavy filtering/downsampling runs lazily (SQL/DuckDB/Polars + **`LTTB` / `Min-Max`**) with **indexed keyset/cursor pagination** and **URL-serialized filters**;
- [ ] numbers enforce right-aligned `tabular-nums`, **True Minus `U+2212` (`−`)**, unit headers, and strict **`0` vs `null / — / N/A`** separation;
- [ ] CSV/XLSX exports neutralize formula injection (`=`, `+`, `-`, `@`, `\t`, `\r`), and internal writes enforce **RBAC/RLS**, **`Diff / Confirm` modal**, and immutable **Audit Log**;
- [ ] live browser rendering (`rendered`) distinguished honestly from `AppTest`/`pytest`/build checks (`static`).

## Framework routing

- Read [references/streamlit.md](references/streamlit.md) when building or auditing Streamlit apps (`.streamlit/config.toml`, `@st.fragment`, `st.navigation`, `AppTest`).
- Read [references/gradio.md](references/gradio.md) when building or auditing Gradio 5/6 demos, chat UIs, `@gr.render`, or MCP-exposed ML interfaces.
- Read [references/reflex.md](references/reflex.md) when building or auditing Reflex apps (`@rx.event`, background tasks, `rx.ComponentState`).
- Read [references/nicegui.md](references/nicegui.md) when building or auditing NiceGUI apps (`@ui.page`, `app.storage.*`, `run.io_bound`, `nicegui.testing`).
- Read [references/dash.md](references/dash.md) when building or auditing Plotly Dash 3 apps (`Patch`, clientside/background callbacks, Dash Pages, Mantine/AG Grid).
- Read [references/panel.md](references/panel.md) when building or auditing Panel/HoloViz apps (`pn.rx`, `panel-material-ui`, `ChatInterface`, Pyodide export).
- Read [references/shiny.md](references/shiny.md) when building or auditing Shiny for Python apps (`ui.Theme`, Express vs Core, `ExtendedTask`, `ui.Chat`, Shinylive).
- Read [references/reactive-data-apps.md](references/reactive-data-apps.md) when building or auditing reactive Python data apps and notebooks (`marimo`, `Solara`, `Mesop`, `Taipy`) or lazy **Polars / Narwhals** dataframe pipelines.
- Read [references/jupyter-widgets.md](references/jupyter-widgets.md) when building or auditing `ipywidgets`, `AnyWidget` ESM widgets, or `Voilá` standalone dashboards.
- Read [references/r-shiny.md](references/r-shiny.md) when building or auditing R Shiny apps (`bslib`, `ExtendedTask`+`mirai`, `bindCache`, `shinychat`/`ellmer`, modules).
- Read [references/julia-genie.md](references/julia-genie.md) when building or auditing Julia Genie/Stipple reactive data apps (`@app`, `@in`/`@out`/`@onchange`).
- Read [references/observable-framework.md](references/observable-framework.md) when building or auditing Observable Framework data documents (polyglot loaders, DuckDB-Wasm, `resize()`).
- Read [references/evidence.md](references/evidence.md) when building or auditing Evidence SQL/Markdown BI reports (Universal SQL, Svelte components, `npm run sources`).
- Read [references/ai-and-internal-data-apps.md](references/ai-and-internal-data-apps.md) when building or auditing Chainlit, FastHTML, Preswald, or low-code internal tools (Retool, Appsmith, ToolJet, Budibase).
