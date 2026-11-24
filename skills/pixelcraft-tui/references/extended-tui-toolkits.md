# Extended TUI toolkits (.NET Terminal.Gui, Spectre.Console, Python prompt_toolkit)

For Python Textual/Rich, Node Ink, Go Bubble Tea, and Rust Ratatui, read the dedicated references in `pixelcraft-tui`. Use this reference for **.NET console/TUI apps (`Terminal.Gui`, `Spectre.Console`) and Python interactive REPL/prompt UIs (`prompt_toolkit`)**.

## Toolkit decision matrix

| Toolkit | Ecosystem | UI model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Spectre.Console** | .NET / C# | Inline rich CLI output (`Table`, `Tree`, `Progress`, `Live`, `SelectionPrompt`) | Modern .NET CLIs, installers, build tools, structured status tables & prompts | Inline/scrollback model—not a full-screen multi-pane window manager |
| **Terminal.Gui (v2)** | .NET / C# | Full-screen alternate-buffer widget toolkit (`Window`, `MenuBar`, `TableView`, mouse + keyboard) | .NET interactive dashboards, admin consoles, file/DB browsers | Full-screen TUI requires explicit non-interactive `--json` / piped fallback for CI |
| **prompt_toolkit (v3)** | Python | Readline-plus interactive prompts (`PromptSession`, `WordCompleter`, `KeyBindings`) and full-screen `Application` | Interactive SQL/AI/dev REPLs, multi-line code prompts, autocomplete CLIs | For full CSS-styled dashboard TUIs in Python, prefer **Textual** (`references/textual.md`) |

## Verified implementation idioms

### Spectre.Console (.NET)

- **Markup injection / crash guard**: square brackets `[...]` are parsed as style tags in `AnsiConsole.MarkupLine`. Always escape dynamic strings with `Markup.Escape(userInput)` or use `AnsiConsole.MarkupLineInterpolated($"Value: {input}")` so paths, JSON, or array indices like `items[0]` never throw a parse exception.
- **CI / piped output**: check `AnsiConsole.Profile.Capabilities.Interactive` and skip `SelectionPrompt` / spinners when stdout is redirected or `--no-interactive` is passed.

```csharp
using Spectre.Console;

string userInput = "settings[debug]";
AnsiConsole.MarkupLine($"[green]Key:[/] {Markup.Escape(userInput)}");
// Or equivalently:
AnsiConsole.MarkupLineInterpolated($"[green]Key:[/] {userInput}");
```

### Python `prompt_toolkit`

- Use `PromptSession(history=FileHistory(...), completer=WordCompleter(...))` to persist command history across sessions.
- Wrap background log printing inside `with patch_stdout():` so asynchronous output prints cleanly above the active prompt without corrupting the user's input line.

```python
from prompt_toolkit import PromptSession
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.history import FileHistory
from prompt_toolkit.patch_stdout import patch_stdout

session = PromptSession(
    history=FileHistory(".app_history"),
    completer=WordCompleter(["status", "deploy", "rollback", "exit"]),
)

with patch_stdout():
    cmd = session.prompt("ops> ")
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Escape dynamic strings with `Markup.Escape()` or `MarkupLineInterpolated()` in Spectre.Console | Interpolate unescaped filenames/errors into `AnsiConsole.MarkupLine($"...")` |
| Wrap concurrent logging in `with patch_stdout():` in `prompt_toolkit` | Call `print()` from background threads and shred the active prompt line |
| Detect non-TTY / `NO_COLOR` and provide plain machine-readable output in CI | Hang CI pipelines waiting on `SelectionPrompt` or full-screen `Terminal.Gui` |
| Use `Terminal.Gui` for full-screen .NET apps and `Spectre.Console` for inline CLI tools | Force alternate-screen TUI mode for a one-shot CLI status command |

## Verification commands

```sh
dotnet test
pytest
```

Verify both interactive 80×24 terminal sessions (`rendered`) and piped / `NO_COLOR=1` non-interactive invocations (`static`/`rendered`).
