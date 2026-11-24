# Extended TUI toolkits & CLI prompt libraries

For Python Textual/Rich, Node Ink, Go Bubble Tea/Lip Gloss, and Rust Ratatui, read their dedicated references in `pixelcraft-tui`. Use this reference for **.NET (`Terminal.Gui v2`, `Spectre.Console`), Python `prompt_toolkit`, OpenTUI, C++ `FTXUI`, `Notcurses`, Go `tcell`/`tview`, legacy Blessed migration, and inline CLI prompt libraries**.

## CLI prompts vs full-screen TUI (choose the right surface first)

Do **not** launch an alternate-screen full-screen TUI for a linear setup wizard, scaffolder, or one-shot confirmation—preserving terminal scrollback makes copy-paste, error inspection, and CI debugging far cleaner:

| Mode | When to choose | Modern libraries |
|---|---|---|
| **Inline CLI prompts** (scrollback-preserving) | Linear wizards, `init` scaffolders, auth/confirm flows, 1–5 step inputs | **TS/JS**: `@clack/prompts` (clean linear rail aesthetic), `@inquirer/prompts` (modular modern rewrite) · **Python**: `questionary` (`prompt_toolkit`-backed) · **Rust**: `cliclack`, `inquire`, `dialoguer` · **Go**: Charm `huh` / `gum` · **.NET**: `Spectre.Console` |
| **Full-screen TUI** (alternate buffer) | Live monitoring, multi-pane browsing, log/DB/git exploration, persistent keyboard workspaces | Textual, Bubble Tea v2, Ratatui, Ink, **Terminal.Gui v2**, **OpenTUI**, **FTXUI**, **tview** |

Always pair inline prompts with non-interactive flags (`--yes`, `--json`, env vars) and check `isatty` so CI pipelines never hang waiting on stdin.

## Extended full-screen & REPL toolkit matrix

| Toolkit | Ecosystem | UI model | Best fit & key caveats |
|---|---|---|---|
| **Terminal.Gui (v2)** | .NET / C# | Retained widget toolkit (`Window`, `MenuBar`, `TableView`, `Pos`/`Dim`, `Scheme`) | .NET admin consoles, DB/file browsers; always wrap `Application.Init()` / `Shutdown()` in `try`/`finally` |
| **Spectre.Console** | .NET / C# | Inline rich CLI (`Table`, `Tree`, `Progress`, `Live`, `SelectionPrompt`) | Modern .NET CLIs & installers; escape user input with `Markup.Escape()` |
| **prompt_toolkit (v3)** | Python | Readline-plus REPL (`PromptSession`, `WordCompleter`, `patch_stdout`) & full-screen `Application` | Interactive SQL/AI/dev REPLs & multiline code prompts; for CSS dashboards prefer **Textual** |
| **OpenTUI** | TS/JS + Zig | Zig-powered high-FPS native cell renderer with `@opentui/core`, `@opentui/react`, `@opentui/solid` | Performance-sensitive TS/React/Solid TUIs needing native cell diffing beyond Ink/Yoga |
| **FTXUI** | C++ (17+) | Functional declarative C++ TUI (`ScreenInteractive`, `vbox`/`hbox`/`flex`, `CatchEvent`) | Zero-dependency native C++ CLIs, profilers, and embedded Linux diagnostics |
| **tcell / tview** | Go | `tcell` (low-level terminal cell/event engine) + `tview` (imperative widget library: `Table`, `TreeView`, `Flex`) | Existing Go repos using `tview`/`k9s`-style widgets; for new Go TUIs compare **Bubble Tea v2** (Elm architecture, richer ecosystem) |
| **Notcurses** | C / C++ / Rust | High-throughput multimedia/blitter TUI engine | Specialized visual/media terminal apps; heavy capability assumptions require plain fallback when unsupported |

**Blessed / Neo-Blessed migration note**: `blessed` and `neo-blessed` are legacy, largely unmaintained Node.js libraries with brittle terminfo/escape parsing. Migrate active or new Node/Bun TUIs to **Ink** (`references/ink.md`), **OpenTUI**, or **`@clack/prompts` / `@inquirer/prompts`** rather than building new features on Blessed internals.

## Verified implementation idioms

### .NET `Terminal.Gui` v2 (`Pos`/`Dim`, `Scheme`/`Attribute`, safe teardown)

Use relative **`Pos`** and **`Dim`** layout expressions (never fixed pixel-style coordinates) and semantic **`Scheme` / `Attribute`** pairs; always guarantee `Application.Shutdown()` runs even on exceptions:

```csharp
using Terminal.Gui;

Application.Init();
try
{
    var actionScheme = new Scheme(new Attribute(Color.White, Color.Blue));
    var win = new Window { Title = "Invoices (Ctrl+Q Quit)", Width = Dim.Fill(), Height = Dim.Fill() };
    var status = new Label { Text = "Ready", X = 1, Y = 1, Width = Dim.Fill(1) };
    var saveBtn = new Button { Text = "_Save", X = Pos.Center(), Y = Pos.Bottom(status) + 1, ColorScheme = actionScheme };
    win.Add(status, saveBtn);
    Application.Run(win);
}
finally
{
    Application.Shutdown();
}
```

### .NET `Spectre.Console` (markup injection guard & CI check)

Escape dynamic text with **`Markup.Escape(userInput)`** or **`AnsiConsole.MarkupLineInterpolated`** so brackets like `items[0]` never crash, and check `AnsiConsole.Profile.Capabilities.Interactive` before prompting:

```csharp
using Spectre.Console;

string userInput = "settings[debug]";
AnsiConsole.MarkupLineInterpolated($"[green]Key:[/] {userInput}");
```

### Python `prompt_toolkit` (history & async-safe logging)

Wrap background logging inside **`with patch_stdout():`** so asynchronous messages print cleanly above the active prompt without shredding the user's input line:

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

### C++ `FTXUI` (functional flexbox + keyboard handler)

```cpp
#include <ftxui/component/component.hpp>
#include <ftxui/component/screen_interactive.hpp>
#include <ftxui/dom/elements.hpp>

using namespace ftxui;

int main() {
  auto screen = ScreenInteractive::Fullscreen();
  auto body = Renderer([] {
    return vbox({ text("Invoices") | bold, separator(), text("[q] Quit") | dim }) | border;
  });
  auto app = CatchEvent(body, [&](Event e) {
    if (e == Event::Character('q') || e == Event::Escape) { screen.Exit(); return true; }
    return false;
  });
  screen.Loop(app);
}
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Choose inline prompts (`@clack/prompts`, `questionary`, `cliclack`, `Spectre.Console`) for linear wizards | Launch a full-screen alt-buffer TUI just to ask 3 setup questions |
| Wrap `Terminal.Gui` `Application.Init()` / `Shutdown()` in `try`/`finally` with `Pos`/`Dim` | Hard-code coordinates or skip `Shutdown()` on exceptions |
| Escape dynamic strings via `Markup.Escape()` / `MarkupLineInterpolated()` in Spectre.Console | Interpolate unescaped paths/errors into `AnsiConsole.MarkupLine($"...")` |
| Wrap concurrent output in `with patch_stdout():` in `prompt_toolkit` | Call `print()` from background threads and corrupt the active REPL line |
| Migrate legacy Blessed/Neo-Blessed apps to Ink, OpenTUI, or `@clack/prompts` | Build new production Node TUIs on abandoned Blessed internals |

## Verification commands

```sh
# Run the build/test suite matching your ecosystem:
dotnet test                    # Terminal.Gui / Spectre.Console
python -m pytest               # prompt_toolkit / questionary
cmake --build build && ctest --test-dir build  # FTXUI / Notcurses
go test ./...                  # tcell / tview
npm test                       # OpenTUI / @clack/prompts / @inquirer/prompts
```

Test suites provide `static` / logic evidence. Inspect live `80×24` interactive sessions, `NO_COLOR=1`, `TERM=dumb`, `Ctrl+C` cleanup, and piped non-TTY CI runs for `rendered` evidence; label untested emulators `not-checked`.
