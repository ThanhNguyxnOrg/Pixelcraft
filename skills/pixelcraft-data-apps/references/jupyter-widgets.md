# Jupyter widgets, AnyWidget, and Voilá

## Token mapping

Classic `ipywidgets` exposes limited `Layout`/`style` objects rather than a full token system; define semantic Python constants once and reuse them instead of repeating raw hex colors. When building custom interactive surfaces, prefer **AnyWidget** so CSS custom properties can align with host themes (`--jp-layout-color0`, `--vscode-editor-background`) with clean fallbacks rather than hardcoding light-only colors.

## AnyWidget (modern cross-frontend custom widget standard)

Use `anywidget` (`anywidget.AnyWidget` + `traitlets` + standard ES modules) instead of legacy `cookiecutter-ipywidgets` / Webpack extensions. A single AnyWidget works across **JupyterLab, Jupyter Notebook, VS Code, Google Colab, marimo (`mo.ui.anywidget`), Solara, Panel, and Shiny** with zero frontend bundler required for simple widgets and hot-module reload during development:

```python
import anywidget
import traitlets

class RangeFilterWidget(anywidget.AnyWidget):
    _esm = """
    function render({ model, el }) {
      const root = document.createElement("div");
      root.className = "rf-wrap";
      const input = document.createElement("input");
      input.type = "range";
      input.min = "0";
      input.max = "100";
      input.value = String(model.get("threshold"));
      input.setAttribute("aria-label", "Score threshold");
      const out = document.createElement("output");
      const sync = () => {
        input.value = String(model.get("threshold"));
        out.textContent = `${model.get("threshold")}%`;
      };
      input.addEventListener("change", () => {
        model.set("threshold", Number(input.value));
        model.save_changes();
      });
      model.on("change:threshold", sync);
      sync();
      root.append(input, out);
      el.append(root);
      return () => root.remove();
    }
    export default { render };
    """
    _css = """
    .rf-wrap { display: flex; gap: 0.75rem; align-items: center; }
    .rf-wrap output { font-variant-numeric: tabular-nums; }
    """
    threshold = traitlets.Int(50).tag(sync=True)
```

For larger widgets, point `_esm = pathlib.Path(__file__).parent / "static" / "widget.js"` and `_css = ...` so AnyWidget hot-reloads edits without restarting the kernel. Always return a cleanup function from `render()` to detach listeners and prevent memory leaks on cell re-execution.

## Voilá standalone serving

Turn a notebook of `ipywidgets` / `AnyWidget` outputs into a standalone web app with **Voilá** (`voila dashboard.ipynb`). Voilá executes cells in a dedicated per-user kernel, strips code cells by default, and blocks arbitrary code execution from the browser:

- Pass `--theme=dark` (or a custom template with `--template=...`), `--strip_sources=True`, and `--pool_size=2` (pre-warmed kernels for faster first load) in deployment commands.
- Explicitly design for cold-start progress, kernel disconnect/idle culling, and narrow viewport reflow—a notebook that fits a wide JupyterLab cell often overflows in Voilá's standalone template.
- Never embed warehouse secrets in notebook cell outputs or widget synced traits, because synced traits serialize directly to the browser.

## Layout, motion, and accessibility

Notebook cells live in document flow, not full-screen windows. Keep controls adjacent to the output they modify, use `HBox`/`VBox`/`GridBox` or AnyWidget flex/grid CSS that wraps cleanly, and avoid relying on fixed pixel widths. Keep progress indicators truthful and document kernel interrupt behavior for long jobs. Give every `ipywidgets` control a clear `description` and every AnyWidget DOM element explicit ARIA roles/labels, keyboard focus, and a text/table summary beneath custom canvas/SVG visuals.

## States and forms idiom

Trait synchronization (`observe`, `link`, `dlink`, `model.on("change:...")`) defines the state model. Handle kernel restart/disconnect, stale widget outputs after re-running cells out of order, empty results, and validation errors cleanly. Attach expensive computations to explicit Run/Apply buttons (`Button.on_click`) or `change` (release) events rather than firing on every `continuous_update=True` slider drag.

## Do/don't pairs

| Do | Don't |
|---|---|
| `AnyWidget` ESM + `traitlets` with `render()` cleanup | Legacy Webpack/npm JupyterLab extension boilerplate for simple widgets |
| `continuous_update=False` or explicit Apply button for heavy jobs | Re-running SQL/ML on every slider pixel tick |
| Return cleanup callbacks from AnyWidget `render()` | Leaking DOM listeners or intervals on every cell re-run |
| Serve end-user dashboards via Voilá with `--strip_sources=True` | Sharing raw editable notebooks with non-technical operators |
| Host-aware CSS vars with fallbacks in `_css` | Hardcoding light-only colors that clash in dark JupyterLab/VS Code |

## Known traps

Frontend divergence across JupyterLab, VS Code, Colab, and Voilá; out-of-order cell execution leaving orphaned observers; memory leaks when `render()` omits cleanup; secrets serialized in `.tag(sync=True)` traits; and Voilá cold-start delays without kernel pooling.

## Verification commands

```sh
python -m compileall .
python -m pytest
jupyter lab
voila dashboard.ipynb --no-browser --strip_sources=True
```

Verify widgets in every target frontend claimed (JupyterLab, VS Code, Voilá) for `rendered` evidence; `pytest` and static `nbconvert` HTML export provide `static` evidence only and do not verify live trait synchronization.
