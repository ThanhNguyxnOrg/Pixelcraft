# Terminal capture

## tmux

```bash
tmux new-session -d -s qa -x 100 -y 30 'your-command'
tmux capture-pane -t qa -p -e > capture-ansi.txt
tmux capture-pane -t qa -p -J > capture-plain.txt
tmux kill-session -t qa
```

`-e` preserves escape sequences; `-J` joins wrapped lines. Resize the pane and recapture to verify grid adaptation. Test keyboard input with `tmux send-keys`; do not infer keyboard behavior from a static capture alone.

## Recording

- `asciinema rec session.cast` records timing/input for review and sharing.
- VHS uses a `.tape` script to produce deterministic terminal GIF/video when installed.
- Framework snapshots such as Textual `pytest-textual-snapshot` and Ratatui `TestBackend` are deterministic layout evidence, not proof of runtime color support.

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
