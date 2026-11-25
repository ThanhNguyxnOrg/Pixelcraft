# Bubble Tea & Lip Gloss (Go / Charm ecosystem)

## Bubble Tea v2 & Lip Gloss v2 idioms

Bubble Tea **v2** (alongside v1 in existing repos—check `go.mod` module path before editing) introduces major craft and performance upgrades:

- **Declarative `tea.View` struct (v2)**: `View()` returns a `tea.View` value (e.g., `tea.NewView(content)`) where `AltScreen`, `MouseMode`, `WindowTitle`, `ProgressBar` (OSC 9;4), and cursor position are declared directly from model state instead of imperative startup options or command toggles.
- **Cursed Renderer**: cell-level diffing renderer minimizing terminal writes and flicker on high-frequency updates.
- **Built-in Kitty Keyboard Protocol & `tea.KeyPressMsg`**: accurate disambiguation of `shift+enter`, `ctrl+i` vs `tab`, and release events while degrading gracefully on legacy terminals.
- **Lip Gloss v2**: built-in **`table`**, **`tree`**, and **`list`** subpackages, compositing **`Layer` / `Canvas`** for clean modal overlays over panes without corrupting background cells, and automatic color **downsampling** (TrueColor → ANSI 256 → ANSI 16 → ASCII/`NO_COLOR`) via color profile detection.

```go
// Bubble Tea v2 declarative View() + semantic Lip Gloss styles:
type PcStyles struct {
    Action lipgloss.Style
    Error  lipgloss.Style
    Focus  lipgloss.Style
}

func (m model) View() tea.View {
    content := m.styles.Focus.Render("> "+m.selectedTitle()) + "\n" + m.helpView()
    v := tea.NewView(content)
    v.AltScreen = true
    v.WindowTitle = "Invoices"
    return v
}
```

*(In Bubble Tea v1 repos, `View() string` returns the string directly and `tea.WithAltScreen()` is passed to `tea.NewProgram`.)*

## Broader Charm ecosystem decision table

Reuse first-party Charm libraries instead of reimplementing terminal primitives from scratch:

| Library | Role | When to use |
|---|---|---|
| **Bubbles** | Core widgets (`textinput`, `textarea`, `viewport`, `table`, `list`, `progress`, `spinner`, `help`, `key`) | Standard interactive controls inside Bubble Tea apps with built-in keymaps |
| **Huh** | Interactive CLI forms & multi-step wizards (`huh.NewForm`) | Setup wizards, config prompts, validated inputs; supports **`huh.WithAccessible(true)`** screen-reader-friendly linear mode |
| **Glamour** | Styled terminal Markdown renderer | Release notes, docs, AI responses, help pages with width-aware wrapping |
| **Gum** | Composable shell-scriptable TUI primitives | Bash/CI scripts needing quick filter/choose/confirm/spin UX without a Go binary |
| **Fang** | Modern Cobra CLI wrapper | Styled help text, manpages, version output, and shell completions out of the box |
| **Teatest** | Headless Bubble Tea test harness (`x/exp/teatest`) | Automated keystroke simulation, resize tests, and golden output assertions |

## Token mapping, `UAX #29` width, & `--ascii` fallback

Centralize semantic `lipgloss.Style` definitions in one styles struct derived from detected terminal color profile / light-dark background (`lipgloss.HasDarkBackground` / v2 background-color query) so colors never clash on light terminals or disappear under `NO_COLOR=1` (never hardcode `#ffffff` or `#000000` without adapting to background luminance).

Always recompute pane widths/heights on `tea.WindowSizeMsg` using **`lipgloss.Width(...)`**, **`github.com/rivo/uniseg`** (`uniseg.StringWidth` / `uniseg.NewGraphemes`), or `go-runewidth`—**never** Go `len(str)` or `utf8.RuneCountInString(str)`, which corrupt borders on CJK (`2` cols), ZWJ emoji (`👨‍👩‍👧‍👦` = `2` cols), `VS16` (`⚠️` = `2` cols), and Vietnamese combining diacritics (`0` extra cols). Switch `lipgloss.RoundedBorder()` to `lipgloss.ASCIIBorder()` when `--ascii`, `TERM=dumb`, or non-UTF-8 locale is detected, and define a clean `80×24` minimum layout.

## Bracketed Paste, `OSC 52`, `SIGPIPE`, 6-step teardown & CLI packaging

- **Bracketed Paste (`DECSET 2004`) & `OSC 52` clipboard**: handle `tea.PasteMsg` (Bubble Tea enables `?2004h` automatically) so pasted multi-line configs enter `textarea`/`textinput` cleanly without firing `enter` per newline; copy via **`OSC 52`** (`github.com/aymanbagabas/go-osc52/v2` / Bubble Tea v2 `tea.SetClipboard`) alongside local OS clipboard so remote SSH/`tmux` copies work out of the box.
- **Stream hygiene, `EPIPE`, & 6-step panic/signal restoration**: run interactive Bubble Tea on `tea.WithOutput(os.Stderr)` when `stdout` must emit pipeable selections, write `--json`/`--plain` strictly to `os.Stdout` while ignoring `errors.Is(err, syscall.EPIPE)` (exiting `0` silently on `| head -n 5`), and ensure `recover()` + `SIGINT`/`SIGTERM`/`SIGHUP` handlers complete the full 6-step terminal reset (`?1049l`, mouse `?1000l/?1002l/?1003l/?1006l`, `?2004l`, `?2026l`, `\x1b[<u`, `?25h` + raw mode restore—see [terminal-protocols.md](terminal-protocols.md)).
- **Accessibility, exit codes & distribution**: keep `tea.Tick` bounded, cancel async work via `context.Context` + request generation IDs, honor `ACCESSIBLE=1` (`huh.WithAccessible(true)`), use semantic exit codes (`0`, `1`, `2`, `130`), and wire **Fang** / Cobra to emit `--help`, `--version`, **`bash`/`zsh`/`fish`/`pwsh` completions**, **`man` pages**, and **GoReleaser** Homebrew/Winget/Scoop binaries.

## Do/don't pairs

| Do | Don't |
|---|---|
| Measure/truncate graphemes with `lipgloss.Width` / `rivo/uniseg` + `lipgloss.ASCIIBorder()` fallback | Align columns with `len(s)` or `utf8.RuneCountInString(s)` (corrupts CJK, `👨‍👩‍👧‍👦`, and Vietnamese) |
| Handle `tea.PasteMsg` (`?2004h`), `OSC 52` SSH copy, and full 6-step reset on panic/signal | Treat pasted newlines as `Enter` submits or leave `?1049h`/`CSI u` active on panic |
| Route TUI chrome to `stderr` when piping, ignore `syscall.EPIPE` on `stdout`, and ship Fang/Cobra completions + `man` | Pollute `stdout` JSON with spinner ANSI codes or print errors on `mycli --plain \| head -n 5` |
| Recompute layout on every `tea.WindowSizeMsg` (tested at `80×24`) + light/dark-adaptive styles | Hard-code `120` columns or `#ffffff` text unreadable on light terminals |
| Use Bubble Tea v2 `tea.View` + Lip Gloss v2 `Layer` + **Huh** (`WithAccessible`) + **Teatest** | Mix v1 `tea.EnterAltScreen` commands with v2 `tea.View` or skip automated TUI tests |

## Known traps

Measuring printable width with `len()` or `RuneCountInString()` instead of `lipgloss.Width()` / `uniseg`, forgetting `recover()` cleanup when spawning custom goroutines, leaving alt-screen/raw mode active on non-TTY piped output, unhandled `EPIPE` errors when piped to `head`, ignoring light-background terminal contrast.

## Verification commands

```sh
go test ./...
go vet ./...
NO_COLOR=1 COLUMNS=80 go run ./cmd/app --help
go run ./cmd/app --plain | head -n 5
```

`go test` (including **Teatest** golden-file simulations) and `go vet` provide `static`/virtual-buffer evidence. Run the binary in real dark and light terminals at `80×24`, `NO_COLOR=1`, `TERM=dumb`, `--ascii`, multi-line paste, and piped `head -n 5` for `rendered` evidence; label untested emulators `not-checked`.
