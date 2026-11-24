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

## Layout, typography, & responsive idioms

- Let Rich adapt tables and panels to `console.width` (`expand=False` or responsive `ratio`/`overflow="fold"`/`"ellipsis"`) rather than building fixed 120-column ASCII boxes that wrap catastrophically at 80 columns.
- Terminals control fonts: establish hierarchy with bold, dim, underline, indentation, and clean rules (`Rule`), pairing semantic color with plain-text markers (`[OK]`, `[WARN]`, `[ERR]`) so `NO_COLOR=1` and screen-reader linear reads remain clear.
- Provide a `--json` or `--plain` mode when automation consumes command output, and check `out.is_terminal` before emitting decorative boxes or interactive prompts.

## Motion, progress, & states idioms

- Use `Progress` and `Live` on `Console(stderr=True)` with bounded refresh rates (`refresh_per_second=4`–`10`) and truthful counts/bytes—never run an infinite spinner that conceals hung network calls or hides errors.
- Disable animated spinners and live redraws automatically when `not err.is_terminal` or `CI` / `--quiet` is set, logging discrete line-by-line milestones instead.
- Catch `KeyboardInterrupt` cleanly: stop active `Progress`/`Live` contexts, print an explicit cancelled state (`[WARN] Cancelled by user; 0 files modified.`), and exit with standard code `130`.

## Forms & linear CLI prompts

Rich's `Prompt.ask` / `Confirm.ask` / `IntPrompt.ask` fit short linear confirmations only. Always provide non-interactive CLI flags (`--yes`, `--name`, env vars) for CI/scripts, validate input with plain recovery copy, and preserve defaults cleanly. For rich multi-step interactive forms or fuzzy autocomplete in Python, prefer **`prompt_toolkit`** or **`questionary`** (`references/extended-tui-toolkits.md`).

## Do/don't pairs

| Do | Don't |
|---|---|
| Define semantic `Theme({...})` + `Console(theme=...)` | Repeat inline `[bold #0074ca]` style strings across every print call |
| Escape dynamic strings with `rich.markup.escape(val)` or `markup=False` | Interpolate raw file paths or errors like `items[0]` into Rich markup |
| Put `Progress`, `Live`, and warnings on `Console(stderr=True)` | Pollute piped `stdout` JSON/CSV data with spinner ANSI sequences |
| Emit plain line-based progress and `--json` mode when not a TTY | Render cursor-rewriting live tables into CI log files |
| Handle `KeyboardInterrupt` cleanly and print what completed vs aborted | Leave partial ANSI state or silent tracebacks on `Ctrl+C` |

## Known traps

Unescaped `[...]` brackets throwing `MarkupError` or silently disappearing, progress bars written to `stdout` breaking pipes, nested `Live` / `Progress` contexts corrupting cursor rows, fixed-width tables unreadable at `80` columns, `NO_COLOR=1` rendering status invisible when color was the only signal, giant tables blowing past scrollback without `--limit`/pagination.

## Verification commands

```sh
python -m compileall .
python -m pytest
python cli.py --help
# Verify NO_COLOR, narrow width, and piped non-TTY output cleanly:
NO_COLOR=1 COLUMNS=80 python cli.py --help
python cli.py --help | cat
```

Unit tests and `Console(record=True, width=80, no_color=True)` string-capture fixtures provide repeatable `static`/snapshot evidence. Inspect actual terminal runs across `80`-column width, `NO_COLOR=1`, piped stdout, and `Ctrl+C` interruption for `rendered` evidence; label untested emulators `not-checked`.
