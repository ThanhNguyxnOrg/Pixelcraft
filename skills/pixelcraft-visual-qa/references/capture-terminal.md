# Terminal capture

## tmux

```bash
tmux new-session -d -s qa -x 100 -y 30 'your-command'
tmux capture-pane -t qa -p -e > capture-ansi.txt
tmux capture-pane -t qa -p -J > capture-plain.txt
tmux kill-session -t qa
```

`-e` preserves escape sequences; `-J` joins wrapped lines. Resize the pane and recapture to verify grid adaptation. Test keyboard input with `tmux send-keys`; do not infer keyboard behavior from a static capture alone.

## Recording and framework snapshots

- `asciinema rec session.cast` records timing/input for review and sharing.
- VHS uses a `.tape` script to produce deterministic terminal GIF/video when installed.
- Framework snapshot & golden runners provide deterministic layout/interaction evidence (still pair with a live PTY test for real terminal color/resize behavior):
  - **Python (Textual):** `pytest-textual-snapshot` (SVG render snapshots across sizes/themes);
  - **Rust (Ratatui):** `TestBackend` + `insta` buffer snapshots;
  - **Go (Bubble Tea):** `teatest` (`github.com/charmbracelet/x/exp/teatest`) driving `Send()` / `Type()` input and asserting `RequireEqualOutput` golden captures;
  - **Node/TypeScript (Ink):** `ink-testing-library` (`render()`, `lastFrame()`, `stdin.write()`) verifying rendered frames and keyboard navigation states.

## Terminal constraints to capture

| Constraint | Evidence needed |
|---|---|
| width/height | narrow, short, resize during execution |
| color | truecolor, 256-color, 16-color, `NO_COLOR` where supported |
| unicode | ASCII fallback for box/emoji characters |
| input | focus/selection/help/dismiss/keyboard-only flow |
| scrollback | content does not destroy shell history unexpectedly |
| interactivity | graceful behavior when stdout is not a TTY |

Report terminal emulator, shell, dimensions, locale, color environment, and whether output was live, replayed, or snapshot-generated.
