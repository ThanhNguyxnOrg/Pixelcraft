# Gradio

## Version compatibility and breaking changes (Gradio 5 vs 6)

Check the installed `gradio` version before editing theme, CSS, or chat code:

- **Message-format chat history**: Use OpenAI-style message dicts (`{"role": "user" | "assistant", "content": ...}`) with `type="messages"` in Gradio 5 (`gr.Chatbot(type="messages")`, `gr.ChatInterface(..., type="messages")`). Legacy `[user, bot]` tuple history is deprecated in Gradio 5 and removed in Gradio 6 (where message dicts are the default).
- **`theme` and `css` placement**: In Gradio 5, pass `theme=` and `css=` to `gr.Blocks(theme=..., css=...)`. In **Gradio 6**, `theme`, `css`, `js`, and `head` move to `demo.launch(theme=..., css=...)`. Inspect the repo's `gradio` pin and existing entrypoints before choosing placement.

## Token mapping

Start with a prebuilt theme (`gr.themes.Base`, `Soft`, `Default`, `Monochrome`) and override semantic CSS variables with `.set(...)`. Attach stable `elem_id` or `elem_classes` hooks rather than targeting generated Svelte classes:

```python
import gradio as gr

theme = gr.themes.Soft(primary_hue="blue", neutral_hue="slate").set(
    body_background_fill="#faf8f1",
    loader_color="#0074ca",
)

# Gradio 5: gr.Blocks(theme=theme, css=".result-panel { border-radius: 12px; }")
# Gradio 6: pass theme=theme and css=... to demo.launch(...)
with gr.Blocks() as demo:
    out = gr.Markdown(elem_classes=["result-panel"])

demo.launch(theme=theme, css=".result-panel { border-radius: 12px; }")
```

## Chat, dynamic rendering, multipage, and state idioms

```python
import gradio as gr

def respond(message: str, history: list[dict]):
    partial = ""
    for token in stream_model(message, history):
        partial += token
        yield partial

with gr.Blocks() as demo:
    prefs = gr.BrowserState({"temperature": 0.2})  # persisted in browser localStorage
    session_cache = gr.State({})                   # per-session server state

    gr.ChatInterface(
        fn=respond,
        type="messages",   # required in Gradio 5; default in Gradio 6
        title="Model Evaluator",
    )

    count = gr.Slider(1, 4, step=1, value=2, label="Candidate outputs")

    @gr.render(inputs=count)
    def render_candidates(n: int):
        with gr.Row():
            for i in range(int(n)):
                gr.Textbox(label=f"Candidate {i + 1}", interactive=False)

with demo.route("Settings"):
    gr.Markdown("## Evaluation settings")
    gr.Slider(0.0, 1.0, value=0.2, label="Temperature")

demo.launch(ssr_mode=True, mcp_server=True)
```

- **`@gr.render`**: Dynamically generate components from reactive inputs instead of pre-allocating dozens of hidden widgets with `visible=False`.
- **Multipage (`demo.route(...)`)**: Split distinct workflows (inference vs benchmark settings) onto dedicated routes with automatic nav links instead of cramming tabs into one page.
- **`gr.BrowserState` vs `gr.State`**: Use `gr.BrowserState` for safe non-secret client preferences that survive reloads; use `gr.State` for ephemeral per-session server objects; never store credentials in `BrowserState`.
- **`ssr_mode=True` & `mcp_server=True`**: Enable `ssr_mode=True` when fast initial HTML paint matters (requires Node runtime); enable `mcp_server=True` when exposing typed Python functions (with docstrings and type hints) as MCP tools for agents.
- **Custom components**: Author custom components with the **Svelte 5** CLI workflow (`gradio cc create`, `gradio cc dev`, `gradio cc build`) rather than injecting fragile inline `<script>` hacks.

## Layout, motion, and accessibility

Group controls in `gr.Row`, `gr.Column`, `gr.Tabs`, and `gr.Accordion` along the input -> trigger -> output scan path. Use generator yields and `gr.Progress(track_tqdm=True)` for truthful long-running feedback; ensure custom CSS honors `prefers-reduced-motion`. Give every control a clear `label` and `info` text, keep media alt/captions present, and test narrow iframe and mobile widths.

## Forms and concurrency idiom

Make expensive inference triggers explicit (`gr.Button("Run", variant="primary")`) rather than firing on every slider tick. Configure `concurrency_limit` and `cancels=[run_event]` on `.click()` handlers so users can abort slow generations cleanly and queue backpressure stays visible. Validate file types/sizes before GPU work and preserve inputs on error (`gr.Error("...")`).

## Do/don't pairs

| Do | Don't |
|---|---|
| `type="messages"` dict history (`{"role", "content"}`) | Deprecated `[user, bot]` tuple chat history |
| Match `theme`/`css` placement to installed Gradio 5 vs 6 | Pass Gradio 5 `Blocks(theme=...)` blindly on Gradio 6 |
| `@gr.render` for variable-length UI lists | Pre-creating 20 hidden components toggled with `visible=` |
| `elem_classes=["result-panel"]` stable CSS hooks | Scraping generated Svelte class hashes |
| Explicit Run + Cancel button with `concurrency_limit` | Triggering heavy inference on every slider drag |
| `gr.BrowserState` only for non-secret client prefs | Storing API keys or PII in `gr.BrowserState` |

## Known traps

Gradio 5/6 `Blocks` vs `launch` API mismatch, tuple-vs-messages `Chatbot` format errors, generator cancellation leaks, queue starvation without `concurrency_limit`, large media uploads exhausting memory, `ssr_mode=True` failing without Node, and mobile/iframe horizontal clipping.

## Verification commands

```sh
python -m compileall .
python -m pytest
python app.py
```

Backend `pytest` checks verify handler logic (`static`); inspect rendered desktop/mobile/iframe views, streaming cancellation, and error paths in a browser for `rendered` evidence.
