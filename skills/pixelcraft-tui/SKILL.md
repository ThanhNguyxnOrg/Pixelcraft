---
name: pixelcraft-tui
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into terminal user interfaces across Textual, Rich, Ink, Bubble Tea/Lip Gloss, and Ratatui. Use for keyboard-first CLI apps, dashboards, installers, logs, forms, terminal layout, character-grid composition, color/unicode fallback, NO_COLOR behavior, resizing, snapshots, accessibility, and state feedback.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft TUI

Use this skill when the rendering surface is a terminal character grid. Terminal constraints are design constraints, not an excuse for unstructured text output.

## Detection signals

Python `textual`/`rich`, Node `ink`, Go `bubbletea`/`lipgloss`/`tcell`/`tview`, Rust `ratatui`/`crossterm`, alternate-screen/raw-mode setup, keybinding tables, snapshot tests, terminal capability handling.

## Translate direction to terminal idioms

1. Treat cells/rows/columns as the layout system. Establish alignment, scanlines, density, focus, and rhythm explicitly.
2. Map tokens to semantic styles supported by the framework; do not assume truecolor, Unicode width, mouse support, or persistent screen size.
3. Keyboard-first means every task has discoverable keys, focus/order, escape/cancel behavior, help, and no hidden mouse-only path.
4. Use color as enhancement; meaning must survive 16-color, monochrome, low contrast, and `NO_COLOR` environments.
5. Unicode box glyphs/braille/sparklines need fallback glyphs or graceful degradation because width/support varies.
6. Design resize behavior: minimum dimensions, truncation/wrapping, pane priority, scrollback vs alternate screen, and terminal reflow.

## Platform-wide rules

- Do not spam full-screen redraws/log output; preserve orientation and make current state visible.
- Interactive UI and machine-readable output are different modes. Provide noninteractive/plain output where automation matters.
- Respect stdout/stderr separation, tty detection, piped output, terminal width, locale encoding, and CI constraints.
- Never require color, emoji, mouse, hyperlinks, or exact terminal emulator features unless detected or explicitly documented.
- Progress is truthful and cancellable; keyboard interrupt handling is part of UX.
- Terminal accessibility is limited and emulator-dependent: avoid color-only state, rapid flashing, cursor traps, and unreadable dense glyph art.

## Common TUI failures

- decorative ASCII art consuming the only useful viewport;
- emoji/unicode width corruption in CJK or narrow terminals;
- color-only diffs/status;
- keybindings conflicting with shell/readline/IME expectations;
- panes disappearing at 80×24 or smaller;
- no noninteractive fallback in CI/pipes;
- focus invisible or state lost after resize;
- full-screen alternate buffer used for simple one-shot output.

## Verification options

TUI rendering can be inspected with actual terminal runs, framework test backends, snapshot tests, width/height fixtures, piped-output tests, NO_COLOR/TERM/color-term matrices, and keyboard-driven integration tests. Textual supports SVG snapshot tests through `pytest-textual-snapshot`; Ratatui supports `TestBackend` and insta-style snapshot testing. Passing a unit test without a buffer/snapshot is not visual evidence.

## Framework routing

- Read [references/textual.md](references/textual.md) for Textual apps/widgets/CSS.
- Read [references/rich.md](references/rich.md) for Rich output, live display, logging, and prompt-adjacent use.
- Read [references/ink.md](references/ink.md) for Ink/React terminal UI.
- Read [references/bubbletea-lipgloss.md](references/bubbletea-lipgloss.md) for Bubble Tea/Lip Gloss Go TUI.
- Read [references/ratatui.md](references/ratatui.md) for Rust Ratatui.
