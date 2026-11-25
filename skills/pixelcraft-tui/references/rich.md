# Rich (Python)

Rich is a structured terminal rendering library—not a full-screen multi-pane application framework. Use it for CLI output, tables, panels, trees, syntax highlighting, Markdown, progress bars, and bounded live status displays. When an interface needs persistent panes, focus rings, or complex keyboard navigation, move to **Textual** (`references/textual.md`).

## Token mapping (`rich.theme.Theme`) & stdout/stderr separation

Define semantic style roles once with **`rich.theme.Theme`** and pass it to **`Console(theme=...)`**. Separate diagnostic/interactive UI (`Console(stderr=True)`) from machine-readable payload output on `stdout` so piping (`mycli list | jq`) never breaks on ANSI escape codes or spinner frames:

```python
from rich.console import Console
from rich.markup import escape
from rich.theme import Theme

PC_THEME = Theme({
    "action": "bold #0074ca",
    "success": "bold green",
    "warning": "bold yellow",
    "error": "bold red",
    "muted": "dim",
})

out = Console(theme=PC_THEME)                 # primary output (auto-strips ANSI when piped)
err = Console(stderr=True, theme=PC_THEME)    # progress, spinners, warnings, errors

filename = "report[2026].csv"
err.print(f"[action]Importing[/action] {escape(filename)}")
```

## Markup safety (`rich.markup.escape`)

Rich interprets `[...]` brackets in strings as style tags. Always wrap untrusted or dynamic strings (filenames, JSON snippets, array indices like `items[0]`, log lines) with **`rich.markup.escape(text)`**—or pass `markup=False` to `console.print(...)`—so brackets never swallow text or raise `MarkupError`.

## Layout, `rich.cells` width, & `--ascii` fallback

- Let Rich adapt tables and panels to `console.width` (`expand=False` or responsive `ratio`/`overflow="fold"`/`"ellipsis"`) rather than building fixed 120-column ASCII boxes, and measure custom padding with **`rich.cells.cell_len(text)`** (never `len(text)`, which miscounts `2`-col CJK, `👨‍👩‍👧‍👦` ZWJ emoji, `⚠️` `VS16`, and `0`-col Vietnamese combining diacritics).
- Switch tables/panels to **`rich.box.ASCII`** (`+--+`) and ASCII spinners (`spinner="line"`) when `--ascii`, `TERM=dumb`, or `legacy_windows` / non-UTF-8 encoding is active.
- Prefer ANSI 16 semantic color names (`cyan`, `green`, `yellow`, `red`, `default`) over hardcoded `#ffffff` or `#000000` so output stays legible on both dark and light terminal themes, pairing color with plain-text markers (`[OK]`, `[WARN]`, `[ERR]`) for `NO_COLOR=1` and screen readers.

## Stream hygiene, `BrokenPipeError`, progress, & CLI packaging

- **Strict `stdout` / `stderr` & silent `BrokenPipeError` exit**: run `Progress`, `Live`, spinners, and warnings exclusively on `Console(stderr=True)` (`refresh_per_second=4`–`10`, disabled automatically when `not err.is_terminal` or `CI=true`); emit `--json` / `--plain` data strictly to `sys.stdout` wrapped in a **`BrokenPipeError`** guard so `mycli list --plain | head -n 5` exits `0` silently without printing a Python traceback:

```python
import os
import sys

def flush_stdout_safely() -> None:
    try:
        sys.stdout.flush()
    except BrokenPipeError:
        devnull = os.open(os.devnull, os.O_WRONLY)
        os.dup2(devnull, sys.stdout.fileno())
        sys.exit(0)
```

- **Interrupts, semantic exit codes & distribution**: catch `KeyboardInterrupt` cleanly (stop `Progress`/`Live` so `?25h` cursor visibility restores, print cancelled summary to `stderr`, and exit **`130`**); use **`0`** for success, **`1`** for runtime errors, and **`2`** for CLI usage errors.
- **Prompts & packaging**: Rich's `Prompt.ask` / `Confirm.ask` fit short linear confirmations (prefer **`prompt_toolkit`** with Bracketed Paste `?2004h` for multi-line input—see [extended-tui-toolkits.md](extended-tui-toolkits.md)). Always provide non-interactive flags (`--yes`), `--help`, `--version`, **`bash`/`zsh`/`fish`/`pwsh` shell completions** (Typer/Click), a **`man` page**, and `uv tool` / Homebrew / Scoop / Winget packaging.

## Do/don't pairs

| Do | Don't |
|---|---|
| Define 16-color-safe `Theme({...})` + `rich.cells.cell_len` + `box.ASCII` fallback | Hardcode `#ffffff` on assumed-black terminals or measure columns with Python `len()` |
| Escape dynamic strings with `rich.markup.escape(val)` or `markup=False` | Interpolate raw file paths or errors like `items[0]` into Rich markup |
| Put `Progress`, `Live`, and warnings on `Console(stderr=True)` and catch `BrokenPipeError` on `stdout` | Pollute piped `stdout` JSON with spinner ANSI codes or print `BrokenPipeError` on `\| head -n 5` |
| Emit plain line-based progress, `--json` mode, `0/1/2/130` exit codes, completions, and `man` page | Render cursor-rewriting live tables into CI log files or exit `0` on failures |
| Handle `KeyboardInterrupt` cleanly (`?25h` cursor restored, exit `130`) | Leave hidden cursors or raw Python tracebacks on `Ctrl+C` |

## Known traps

Unescaped `[...]` brackets throwing `MarkupError`, `Progress` written to `stdout` breaking `jq` pipes, uncaught `BrokenPipeError` tracebacks when piped to `head`, Python `len()` misaligning CJK/ZWJ/Vietnamese columns, `NO_COLOR=1` or light-terminal themes rendering status invisible.

## Verification commands

```sh
python -m compileall .
python -m pytest
NO_COLOR=1 COLUMNS=80 python cli.py --help
python cli.py --plain | head -n 5
```

Unit tests and `Console(record=True, width=80, no_color=True)` string-capture fixtures provide repeatable `static`/snapshot evidence. Inspect actual dark and light terminal runs across `80`-column width, `NO_COLOR=1`, `--ascii`, piped `head -n 5`, and `Ctrl+C` interruption for `rendered` evidence; label untested emulators `not-checked`.
