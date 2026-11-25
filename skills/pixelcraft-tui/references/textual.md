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

## `UAX #29` width (`wcwidth`/`rich.cells`), Bracketed Paste, `OSC 52` & teardown

- **Grapheme width & `--ascii`**: never compute terminal column alignment with Python `len(s)`—use **`rich.cells.cell_len`** or **`wcwidth.wcswidth`** so CJK (`2` cols), ZWJ emoji (`👨‍👩‍👧‍👦` = `2` cols), `VS16` (`⚠️` = `2` cols), and Vietnamese combining diacritics (`0` extra cols) align cleanly; provide `textual-ansi` (16-color dark+light safe) and ASCII borders (`border: ascii`) when `--ascii`, `TERM=dumb`, or non-UTF-8 locale is set.
- **Bracketed Paste (`DECSET 2004`) & `OSC 52` clipboard**: handle Textual's **`events.Paste`** (`?2004h`) in `Input` / `TextArea` / custom widgets so multi-line pastes never fire accidental `Enter` submissions, and call **`self.copy_to_clipboard(text)`** (which emits **`OSC 52`** automatically over remote SSH/`tmux`).
- **Stream hygiene, `BrokenPipeError`, & 6-step crash restoration**: only boot the alternate-screen Textual app when `sys.stdout.isatty()`; for `--json`/`--plain` CLI modes, write strictly to `sys.stdout`, catch **`BrokenPipeError`** (`os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())` + `sys.exit(0)` so `| head -n 5` exits silently without a Python traceback!), and ensure `SIGINT`/`SIGTERM`/`SIGHUP` + uncaught exception hooks complete the 6-step terminal reset (`?1049l`, mouse `?1000l/?1002l/?1003l/?1006l`, `?2004l`, `?2026l`, `\x1b[<u`, `?25h` + raw mode exit—see [terminal-protocols.md](terminal-protocols.md)).
- **Accessibility & CLI distribution**: ensure every task works strictly via keyboard (`Tab`/`Shift+Tab`, arrow keys, `Enter`, `Esc`, `CommandPalette`), pair colors with plain-text state markers (`[ERR]`, `[*]`), and ship `--help`, `--version`, `0/1/2/130` exit codes, `bash`/`zsh`/`fish`/`pwsh` completions (via Typer/Click/argcomplete), a `man` page, and `uv tool` / Homebrew / Scoop / Winget packaging.

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
| Use cell units (`padding: 0 2;`), registered `Theme` vars, and `textual-ansi` / `border: ascii` fallbacks | Write web pixel units (`4px`) or hardcode `#ffffff` unreadable on light 16-color terminals |
| Measure columns with `rich.cells.cell_len` / `wcwidth`, handle `events.Paste`, and use `copy_to_clipboard` (`OSC 52`) | Use Python `len(s)` on CJK/`👨‍👩‍👧‍👦`/Vietnamese text or let pasted newlines fire `Enter` submits |
| Use `@work(exclusive=True)`, catch `BrokenPipeError` on `--plain`/`--json`, and verify 6-step signal reset | Block asyncio, dump `BrokenPipeError` tracebacks on `\| head -n 5`, or leave `?1049h`/`?1003h` stuck |
| Test keyboard flows with `App.run_test(size=(80, 24))` + `Pilot` & `snap_compare` | Rely only on manually glancing at one wide developer terminal |
| Pair `BINDINGS` + `Footer` + `CommandPalette` + CLI completions (`bash`/`zsh`/`fish`/`pwsh`) + `man` page | Hide essential commands behind mouse-only clicks or ship without `--version`/completions |

## Known traps

Invalid CSS `px` units in TCSS, blocking the asyncio loop with synchronous `requests` calls, Python `len()` miscounting CJK/ZWJ/combining marks, `BrokenPipeError` tracebacks on piped `--json` output, focus lost after closing `ModalScreen`, omitting non-interactive CLI fallback when piped in CI.

## Verification commands

```sh
python -m compileall .
python -m pytest
NO_COLOR=1 python app.py --help
python app.py --plain | head -n 5
```

`compileall` and logic tests are `static`; `App.run_test`/`Pilot` and `snap_compare` SVGs verify headless rendering (`rendered` snapshot evidence). Also run in real dark and light terminal emulators at `80×24`, `TERM=dumb`/`NO_COLOR=1`, `--ascii`, multi-line paste, and piped `head -n 5` (`rendered`; label untested terminals `not-checked`).
