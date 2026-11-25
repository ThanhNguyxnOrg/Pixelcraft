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

## Enterprise grid, export security, and safe mutations (internal tools & admin apps)

Operational data apps and low-code panels (Retool, Appsmith, ToolJet, Budibase, FastHTML, Reflex, Dash) touch live production tables—enforce enterprise data-grid, export, and write safety by default:

- **Indexed cursor/keyset pagination + URL-serialized views**: replace `OFFSET 50000` (which scans and discards 50k rows per page) with indexed keyset pagination (`WHERE (created_at, id) < (:cursor_ts, :cursor_id) ORDER BY created_at DESC, id DESC LIMIT 50`), and mirror active filters, sort keys, timezone (`UTC` vs local), and saved view IDs in the URL query string so operators can bookmark and share exact incident views.
- **OWASP CSV/XLSX Formula Injection neutralization + streaming exports**: user-controlled strings starting with `=`, `+`, `-`, `@`, `\t`, or `\r` execute as live formulas or `DDE` payloads when opened in Excel, LibreOffice Calc, or Google Sheets! Neutralize every string cell before CSV/XLSX serialization (while keeping genuine `int`/`float` negatives typed as numbers in XLSX), and stream exports (`> 10k` rows) via chunked/background workers instead of buffering whole tables in web worker RAM:

```python
FORMULA_TRIGGERS = ("=", "+", "-", "@", "\t", "\r")

def sanitize_spreadsheet_cell(val: object) -> object:
    # Keep real numbers numeric; neutralize untrusted strings that Excel/Sheets parse as formulas
    if isinstance(val, (int, float)) or val is None:
        return val
    text = str(val)
    if text.startswith(FORMULA_TRIGGERS):
        return f"'{text}"
    return text
```

- **RBAC, Row-Level Security (RLS), `Diff / Confirm` modals, and Audit Logs**:
  - Separate `development` / `staging` / `production` credentials and enforce both UI role gates **and** backend/database **Row-Level Security (RLS)** (hiding a button in UI never secures the endpoint).
  - Gate every bulk update, refund, status override, or delete behind a **`Diff / Confirm` impact modal** showing exact affected row count, target scope, and `Before -> After` field diffs (requiring a typed reason or confirmation token for high-blast-radius actions).
  - Record every mutation in an append-only **Audit Log** (`actor_id`, `role`, `timestamp_utc`, `entity_id`, `before_json`, `after_json`, `reason`, `request_id`).

## Do/don't pairs

| Do | Don't |
|---|---|
| `cl.Step` + `cl.user_session` in Chainlit | Module-global conversation lists shared across users |
| FastHTML semantic HTML + `hx_indicator` + `aria_live` | Dropping raw unescaped user HTML via `NotStr()` |
| Indexed keyset/cursor pagination + URL-serialized filter/timezone state | `OFFSET 100000` queries or ephemeral filters lost on browser refresh |
| Prefix string cells starting with `=`, `+`, `-`, `@`, `\t`, `\r` on CSV/XLSX export and stream large downloads | Export raw user strings into CSV/XLSX where `=HYPERLINK(...)` or `=CMD|...` executes on open |
| Enforce backend RBAC/RLS + `Diff / Confirm` impact modal + immutable `who/when/before->after` Audit Log | Execute direct production bulk `UPDATE`/`DELETE` on a single unlogged button click |

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

Run staging tests across each RBAC role (`viewer` vs `operator` vs `admin`), test CSV/XLSX export payloads containing `=1+1` and `@SUM(...)` (`static`), verify keyset pagination, URL filter reload, SLA staleness badges, and `Diff / Confirm` modals in a real browser (`rendered`), and inspect Audit Log writes (`static`/`rendered`).
