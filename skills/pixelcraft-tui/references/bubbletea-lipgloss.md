# Bubble Tea + Lip Gloss (Go)

## Token mapping

Define semantic Lip Gloss styles centrally:

```go
var actionStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("#0074ca"))
```

Use semantic variables (`actionStyle`, `errorStyle`) rather than raw color/style literals scattered through model/view code. Color profile detection should influence output; do not assume truecolor.

## Layout and responsive idioms

Use width/height messages to recompute layout, Lip Gloss join/place/align helpers deliberately, truncation/wrapping libraries/helpers carefully, and define minimum terminal dimensions. Keep scanlines/alignment stable across updates. Alternate screen vs inline output is an intentional choice.

## Typography/custom fonts

Terminals control fonts. Use bold/faint/italic/underline/reverse/color and spacing. Unicode width and emoji/CJK behavior need width-aware libraries/fallbacks. Do not center everything by naive string length because printable width differs.

## Motion/reduced motion

Use ticks/spinner/progress truthfully. Avoid high-frequency redraw loops. Provide quiet/no-color/noninteractive modes and cancel timers/ticks correctly. Reduced-motion support is terminal-limited; do not depend on motion for meaning.

## Accessibility specifics

Keyboard-first key map, visible cursor/selection/focus, escape/cancel/back semantics, plaintext state markers, no color-only meaning, stdout/stderr separation, screen-reader-readable output where possible, and no hidden mouse-only functionality.

## States idiom

Bubble Tea model-update-view architecture makes state explicit—use it. Represent loading/error/empty/offline/permission/cancelled/concurrent operations in the model. Commands need cancellation/timeout/error messages; avoid duplicate commands on repeated keys. Preserve input in model state across resize/navigation.

## Forms idiom

Use textinput/textarea/list/help/bubbles-style components or explicit model state with labels/instructions, validation timing, cursor/paste behavior verification, error copy, back/cancel semantics, and noninteractive flags.

## Do/don't pairs

| Do | Don't |
|---|---|
| centralized semantic styles | raw ANSI/color literals throughout views |
| update layout on `tea.WindowSizeMsg` | fixed width captured once at startup |
| explicit model state machine | boolean soup and duplicated async commands |
| plain marker + color for selection | color-only invisible selection |
| cancel/timeout command ownership | goroutine/cmd results mutating stale state |

## Known traps

Unicode width miscalculation, unbounded redraw frequency, stale async command results, terminal color profile differences, focus/key conflicts, resize truncation, alternate-screen misuse, scrollback behavior, hidden noninteractive incompatibility.

## Verification commands

```sh
go test ./...
go vet ./...
go run ./cmd/app --help
NO_COLOR=1 go run ./cmd/app 2>/dev/null || true
```

Use actual terminal runs, golden output/snapshot tests where configured, narrow/wide matrices, piped/non-TTY behavior, keyboard-driven tests, interrupt/cancel paths, and color-capability matrices.
