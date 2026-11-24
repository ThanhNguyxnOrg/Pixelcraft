# Textual (Python)

## Token mapping & Textual v1–v3+ `Theme` API

Textual CSS (TCSS) uses **character cell units** (`1`, `2`, `1fr`, `50%`, `w`, `h`)—**never `px`** (pixel units are invalid in TCSS). Register semantic themes via the **`Theme`** API (`app.register_theme(...)`) and reference built-in semantic design variables (`$primary`, `$surface`, `$panel`, `$error`, `$text-muted`) across TCSS:

```python
from textual.app import App, ComposeResult
from textual.theme import Theme

PC_THEME = Theme(
    name="pixelcraft-dark",
    primary="#5BB2FF",
    secondary="#7EE787",
    accent="#D2A8FF",
    foreground="#E6EDF3",
    background="#0D1117",
    surface="#161B22",
    panel="#21262D",
    error="#F85149",
    dark=True,
)
```

```tcss
/* Integer cell units only — never `px` */
$space-control-inline: 2;

Button.-primary {
  background: $primary;
  padding: 0 $space-control-inline;
}
```

Register the theme in `on_mount` (`self.register_theme(PC_THEME); self.theme = "pixelcraft-dark"`) so users can switch cleanly between light, dark, and high-contrast themes (including `textual-ansi` for 16-color/low-capability terminals).

## Layout, `CommandPalette`, & responsive idioms

Use `Vertical`, `Horizontal`, `Grid`, `Container`, `TabbedContent`, `DataTable`, `Dock`, fractional (`1fr`) and cell sizing, and terminal-size CSS/reactive breakpoints. Test at `80×24` minimum and define which secondary pane collapses first.

Expose keyboard-first command discovery through Textual's built-in **`CommandPalette`** (`Ctrl+P` by default) by adding custom `Provider` classes (`search` yielding `Hit` results) alongside concise `BINDINGS` displayed in `Footer`.

## Async workers (`@work(exclusive=True)`) & states idiom

Never block the Textual asyncio event loop with disk/HTTP calls. Isolate async or blocking work in **`@work`** methods with explicit `exclusive=True` (automatically cancelling superseded refreshes when the user changes filters or navigates) and `thread=True` for blocking SDK calls:

```python
from textual import work
from textual.worker import get_current_worker

class InvoiceApp(App):
    @work(exclusive=True, thread=True)
    def load_invoices(self, query: str) -> None:
        worker = get_current_worker()
        rows = fetch_blocking(query)
        if not worker.is_cancelled:
            self.call_from_thread(self.apply_rows, rows)
```

Handle loading (`LoadingIndicator`), empty, error, offline, and worker-cancelled states visibly in the widget tree; preserve user input across `push_screen` / `pop_screen` modal dialogs and terminal resizes.

## Typography, motion, accessibility, & forms idioms

Terminals control fonts—use Textual bold/italic/dim/underline/reverse styles and spatial hierarchy, and never assume emoji or CJK glyph width matches single-cell Latin characters. Keep `styles.animate(...)` sparse and non-blocking; never use rapid flashing or continuous repaint loops, and provide a plain/reduced-motion toggle for low-capability terminals.

Ensure every task works strictly via keyboard (`Tab`/`Shift+Tab`, arrow keys, `Enter`, `Esc`, `CommandPalette`), pair colors with plain-text state markers (`[ERR]`, `[*]`) so `NO_COLOR` and 16-color terminals remain legible, and use real `Input`, `TextArea`, `Select`, `Checkbox`, and `Button` widgets with `Validator` classes that display recovery copy after edit/submit.

## Headless verification (`App.run_test()` / `Pilot` & SVG snapshots)

Drive real keyboard workflows and narrow-terminal resize checks deterministically using **`App.run_test()`** and **`Pilot`**, paired with **`pytest-textual-snapshot`** (`snap_compare`) SVG snapshots:

```python
import pytest

@pytest.mark.asyncio
async def test_narrow_keyboard_flow():
    app = InvoiceApp()
    async with app.run_test(size=(80, 24)) as pilot:
        await pilot.press("ctrl+p")
        await pilot.press("escape")
        assert app.focused is not None
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Use cell units (`padding: 0 2;`) and registered `Theme` `$primary`/`$surface` vars | Write web pixel units (`4px`) or scatter raw hex literals in TCSS |
| Use `@work(exclusive=True)` and check `worker.is_cancelled` | Block the Textual event loop or let stale async responses overwrite newer filters |
| Test keyboard flows with `App.run_test(size=(80, 24))` + `Pilot` & `snap_compare` | Rely only on manually glancing at one wide developer terminal |
| Pair `BINDINGS` + `Footer` + `CommandPalette` providers for discoverability | Hide essential commands behind mouse-only clicks or undocumented keys |
| Combine text markers (`[OK]`, `[ERR]`) with semantic theme colors | Use green/red text color alone without `NO_COLOR` / 16-color legibility |

## Known traps

Invalid CSS `px` units in TCSS, blocking the asyncio loop with synchronous `requests` calls, stale worker results mutating UI without `exclusive=True`, Unicode/emoji width misalignment in `DataTable` cells, focus lost after closing `ModalScreen`, omitting non-interactive CLI fallback when piped in CI.

## Verification commands

```sh
python -m compileall .
python -m pytest
# Intentionally refresh SVG snapshots only after visual inspection:
# pytest --snapshot-update
# Interactive terminal run at 80x24 and NO_COLOR=1:
python app.py
NO_COLOR=1 python app.py
```

`compileall` and logic tests are `static`; `App.run_test`/`Pilot` and `snap_compare` SVGs verify headless rendering (`rendered` snapshot evidence). Also run in a real terminal emulator at `80×24`, `TERM=dumb`/`NO_COLOR=1`, and piped stdin/stdout to confirm keyboard and capability fallback (`rendered`; label untested terminals `not-checked`).
