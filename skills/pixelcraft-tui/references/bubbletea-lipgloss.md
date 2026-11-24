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

## Token mapping, layout, & typography

Centralize semantic `lipgloss.Style` definitions in one styles struct derived from detected terminal color profile / light-dark background (`lipgloss.HasDarkBackground` / v2 background-color query) so colors never clash on light terminals or disappear under `NO_COLOR=1`.

Always recompute pane widths/heights on `tea.WindowSizeMsg` using `lipgloss.Width(...)` and `lipgloss.Height(...)` (which account for ANSI codes and wide CJK/emoji cells—never measure terminal layout with Go `len(str)`). Define a clean `80×24` minimum layout and collapse secondary panes gracefully.

## Motion, accessibility, states, & forms idioms

Keep `tea.Tick` / spinner rates bounded and cancel background goroutines/HTTP requests via `context.Context` stored in model state. Tag async messages with request IDs/generations so stale `tea.Cmd` results never overwrite newer user filters or selections.

Expose keyboard help via `bubbles/help` + `bubbles/key` (`?` toggle for full keymap), show plain-text focus/selection markers (`>`, `[x]`) alongside color, support `Esc`/`q`/`Ctrl+C` cleanly, and provide non-interactive flags (`--json`, `--no-interactive`) when stdout is not a TTY. For standalone forms, honor `ACCESSIBLE=1` (`huh.WithAccessible(true)`) so screen-reader users get linear prompts instead of cursor-rewriting widgets.

## Do/don't pairs

| Do | Don't |
|---|---|
| Centralize semantic Lip Gloss styles and measure with `lipgloss.Width` | Scatter raw ANSI hex colors or align columns using `len(s)` |
| Recompute layout on every `tea.WindowSizeMsg` (tested at `80×24`) | Capture terminal width once at startup or hard-code 120 columns |
| Use Bubble Tea v2 `tea.View` + Lip Gloss v2 `Layer`/`table`/`tree` on new v2 apps | Mix v1 `tea.EnterAltScreen` commands with v2 declarative `tea.View` |
| Use **Huh** (`WithAccessible`) or **Bubbles** + **Teatest** golden tests | Hand-roll text cursor editing and skip automated TUI tests |
| Track request generation / `context.Context` cancellation in `Update` | Allow stale async `tea.Cmd` responses to clobber active model state |

## Known traps

Measuring printable width with `len()` instead of `lipgloss.Width()` (breaks on ANSI codes and CJK/emoji), forgetting to check `go.mod` for Bubble Tea v1 vs v2 API differences, leaving alt-screen/raw mode active on non-TTY piped output, unbounded `tea.Tick` loops saturating CPU, overlapping modals corrupting cells without Lip Gloss v2 `Layer`, ignoring light-background terminal contrast.

## Verification commands

```sh
go test ./...
go vet ./...
go run ./cmd/app --help
# Verify NO_COLOR, narrow width, and non-TTY piped output:
NO_COLOR=1 COLUMNS=80 go run ./cmd/app --help
go run ./cmd/app --help | cat
```

`go test` (including **Teatest** golden-file simulations) and `go vet` provide `static`/virtual-buffer evidence. Run the binary in real dark and light terminals at `80×24`, `NO_COLOR=1`, `TERM=dumb`, and piped stdin/stdout for `rendered` evidence; label untested emulators `not-checked`.
