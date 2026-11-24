# AI data apps and internal operational tools (Chainlit, FastHTML, Preswald, Low-Code)

Use this reference when building conversational Python AI apps (**Chainlit**), hypermedia Python web/data apps (**FastHTML**), browser-local SQL/Python data apps (**Preswald**), or **low-code internal operational tools** (**Retool**, **Appsmith**, **ToolJet**, **Budibase**). For app-owned multi-agent UX patterns and streaming chat anatomy, pair with `pixelcraft-chat-ui`.

## Surface decision matrix

| Tool | Execution model | Primary strength | Primary constraint |
|---|---|---|---|
| **Chainlit** | Python async websocket server + React chat UI | Rapid LLM/RAG/agent chat apps with step traces, file uploads, feedback buttons, auth | Opinionated chat-first shell; heavy custom layouts need React Elements or custom CSS |
| **FastHTML** | Python ASGI (`Starlette`) + FT components + HTMX | Fast server-rendered HTML/hypermedia internal apps and dashboards with zero JS build | Complex client-side visual editors still need small JS islands or Web Components |
| **Preswald** | Python + SQL + DuckDB-WASM reactive runtime | Lightweight SQL/Python data apps deployable locally or as static browser WASM | Younger ecosystem; keep external warehouse secrets out of static WASM exports |
| **Retool / Appsmith / ToolJet / Budibase** | Visual canvas + query/transformer DAG + RBAC | Fast internal CRUD, approvals, SQL/REST admin panels, built-in SSO/audit logs | Vendor lock-in, hidden DAG coupling, strict sandbox boundaries for custom widgets |

## Chainlit idioms

Configure appearance, custom CSS, file upload limits, and features in `.chainlit/config.toml` (`[UI] name`, `custom_css`, `default_theme`). Use `@cl.on_chat_start`, `@cl.on_message`, `cl.Step` (for tool/retrieval traces), and `msg.stream_token(...)` for truthful streaming:

```python
import chainlit as cl

@cl.on_chat_start
async def on_start():
    cl.user_session.set("history", [])
    await cl.Message(content="Ready. Ask a question about regional orders.").send()

@cl.on_message
async def on_message(message: cl.Message):
    async with cl.Step(name="SQL Warehouse Lookup", type="tool") as step:
        step.input = message.content
        rows = await run_parameterized_query(message.content)
        step.output = f"Fetched {len(rows)} rows"

    reply = cl.Message(content="")
    await reply.send()
    async for token in stream_answer(message.content, rows):
        await reply.stream_token(token)
    await reply.update()
```

Keep per-user state in `cl.user_session` (never module globals), enable human feedback/auth callbacks before production deployment, and distinguish retrieval errors from empty data inside `cl.Step` output.

## FastHTML (`python-fasthtml`) idioms

FastHTML builds semantic HTML directly in Python via FT tags (`Div`, `Form`, `Table`, `Input`) and **HTMX** attributes (`hx_post`, `hx_target`, `hx_swap`). Override or disable default PicoCSS when bringing a custom token stylesheet:

```python
from fasthtml.common import *

app, rt = fast_app(pico=False, hdrs=(Link(rel="stylesheet", href="/tokens.css"),))

@rt("/")
def index():
    return Titled(
        "Order Lookup",
        Form(
            Label("Region", Input(name="region", value="EMEA", required=True)),
            Button("Filter", type="submit"),
            hx_post="/orders",
            hx_target="#orders-panel",
            hx_swap="innerHTML",
        ),
        Div(id="orders-panel", aria_live="polite"),
    )

@rt("/orders", methods=["POST"])
def orders(region: str):
    rows = query_orders(region)
    if not rows:
        return P("No orders match that region.", cls="empty-state")
    return Table(
        Thead(Tr(Th("Order ID"), Th("Amount"))),
        Tbody(*[Tr(Td(r["id"]), Td(f"${r['amount']:,.2f}")) for r in rows]),
    )
```

Use server-side validation, CSRF/session middleware for mutations, explicit `aria-live="polite"` on HTMX target regions, and `hx-indicator` for slow queries.

## Preswald idioms

Preswald pairs `preswald.toml` configuration (data sources, branding title/logo/primary color) with declarative Python (`connect()`, `query()`, `slider()`, `table()`, `plotly()`) powered by DuckDB:

```python
from preswald import connect, query, slider, table, text

connect()
threshold = slider("Minimum revenue (USD)", min_val=0, max_val=10000, default=500)
df = query(f"SELECT order_id, region, revenue FROM orders WHERE revenue >= {int(threshold)}", "orders_csv")

text("# Regional Orders")
if df.empty:
    text("No orders exceed the selected revenue threshold.")
else:
    table(df, title="Matching orders")
```

Coerce numeric filter inputs strictly before SQL formatting, verify source freshness, and avoid exporting private data or credentials in browser-side WASM builds.

## Low-code internal tools (Retool, Appsmith, ToolJet, Budibase)

Low-code platforms fail in production through spaghetti query graphs, unguarded writes, and zero environment separation—not missing styling:

- **Query & transformer DAG discipline**: Keep SQL/REST queries parameterized (`{{ selectRegion.value }}`), place derived shaping in pure JS transformers instead of chaining side-effect `onSuccess` scripts across 5 queries, and enable server-side pagination/filtering on every table over ~500 rows.
- **Sandboxed custom components**: Use native tables, forms, drawers, and tabs first. Reach for sandboxed custom components (iframe/React/Web Components) only for domain visuals the host lacks, respecting CSP, `postMessage` payload limits, and host light/dark CSS tokens.
- **RBAC, staging, and auditability**: Separate `development` / `staging` / `production` resource credentials, enforce least-privilege read/write roles per app/page, require confirmation modals + audit log writes on destructive queries (refunds, account disables, bulk updates), and sync app definitions to Git via Source Control where supported.

## Do/don't pairs

| Do | Don't |
|---|---|
| `cl.Step` + `cl.user_session` in Chainlit | Module-global conversation lists shared across users |
| FastHTML semantic HTML + `hx_indicator` + `aria_live` | Dropping raw unescaped user HTML via `NotStr()` |
| Parameterized queries + server-side pagination in Retool/Appsmith | Fetching 100k rows client-side into a low-code table widget |
| Staging credentials + Git sync + audit logs on internal writes | Editing production SQL queries live with admin DB creds |
| Pure JS transformers over explicit query dependencies | Tangled `onSuccess` trigger chains firing duplicate mutations |

## Verification commands

```sh
# Chainlit
chainlit run app.py -w

# FastHTML
python -m pytest
uvicorn main:app --reload

# Preswald
preswald run
```

For low-code tools (Retool, Appsmith, ToolJet, Budibase), run staging smoke tests across each RBAC role (viewer vs operator vs admin), inspect query network timings, verify empty/error/destructive-confirm states in a real browser (`rendered` evidence), and check Git diff exports (`static` evidence).
