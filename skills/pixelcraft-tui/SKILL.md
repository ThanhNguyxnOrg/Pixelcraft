---
name: pixelcraft-tui
description: Translates Pixelcraft direction, tokens, UX, and floor requirements into terminal user interfaces across Textual, Rich, Ink, Bubble Tea v2/Lip Gloss, Ratatui, Terminal.Gui, Spectre.Console, prompt_toolkit, OpenTUI, FTXUI, and Clack/CLI prompts. Use for keyboard-first CLI apps, dashboards, installers, logs, forms, character-grid layout, Kitty/Sixel/OSC 8/DEC 2026 terminal protocols, NO_COLOR fallback, resizing, snapshots, accessibility, and state feedback.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft TUI

Use this skill when the rendering surface is a terminal character grid. Terminal constraints are design constraints, not an excuse for unstructured text output.

## Surface craft

Give repeated keyboard work stable regions: list or prompt, result, status and a short reversible help layer. Preserve task progress through terminal resize; keep a text marker when terminal colors or Unicode are limited. Check the smallest supported columns/rows after switching panes, with no mouse and in a low-capability terminal.

## Detection signals

Python `textual`/`rich`/`prompt_toolkit`/`questionary`, Node/Bun `ink`/`@inkjs/ui`/`@opentui/*`/`@clack/prompts`/`@inquirer/prompts`, Go `bubbletea`/`lipgloss`/`huh`/`tcell`/`tview`, Rust `ratatui`/`crossterm`/`cliclack`/`inquire`/`dialoguer`, .NET `Terminal.Gui`/`Spectre.Console`, C++ `ftxui`/`notcurses`, alternate-screen/raw-mode setup, keybinding tables, snapshot tests, and terminal capability handling.

## Translate direction to terminal idioms

1. Treat cells/rows/columns as the layout system. Establish alignment, scanlines, density, focus, and rhythm explicitly.
2. Map tokens to semantic styles supported by the framework; do not assume truecolor, Unicode width, mouse support, or persistent screen size.
3. Keyboard-first means every task has discoverable keys, focus/order, escape/cancel behavior, help, and no hidden mouse-only path.
4. Use color as enhancement; meaning must survive 16-color, monochrome, low contrast, `TERM=dumb`, and `NO_COLOR` environments.
5. Unicode box glyphs/braille/sparklines/graphics protocols need fallback glyphs or plain-text degradation because terminal and `tmux` support varies.
6. Design resize behavior: minimum dimensions (`80×24`), truncation/wrapping, pane priority, scrollback vs alternate screen, and terminal reflow.

## Platform-wide rules

- Do not spam full-screen redraws/log output; preserve orientation and make current state visible.
- Interactive UI and machine-readable output are different modes. Provide noninteractive/plain/JSON output where automation matters.
- Respect `stdout`/`stderr` separation, `isatty` detection, piped output, `NO_COLOR`/`FORCE_COLOR`/`TERM=dumb`, terminal width, locale encoding, and CI constraints.
- Never require color, emoji, mouse, OSC 8 hyperlinks, Kitty/Sixel graphics, or Kitty keyboard protocol unless negotiated with a clean fallback.
- Progress is truthful and cancellable; keyboard interrupt (`Ctrl+C`) and panic teardown must always restore raw mode, alt-screen, and protocol state cleanly.
- Terminal accessibility is limited and emulator-dependent: avoid color-only state, rapid flashing, cursor traps, and unreadable dense glyph art.

## Common TUI failures

- decorative ASCII art consuming the only useful viewport;
- emoji/Unicode width corruption in CJK or narrow terminals;
- color-only diffs/status invisible under `NO_COLOR=1`;
- keybindings conflicting with shell/readline/IME expectations or leaving Kitty `CSI u` unpopped on exit;
- panes disappearing at `80×24` or smaller;
- no noninteractive fallback in CI/pipes (or ANSI escapes leaking into piped `stdout`);
- focus invisible or state lost after resize;
- full-screen alternate buffer used for simple one-shot wizards or CLI output.

## Verification options

TUI rendering can be inspected with actual terminal runs, framework test backends, snapshot tests, width/height fixtures, piped-output tests, `NO_COLOR`/`TERM=dumb`/`COLORTERM` matrices, and keyboard-driven integration tests. Textual supports `App.run_test()`/`Pilot` and SVG snapshots via `pytest-textual-snapshot`; Ratatui supports `TestBackend` + `insta`; Bubble Tea supports `Teatest`; Ink supports `ink-testing-library`. Passing a unit test without a rendered frame/buffer/snapshot is `static`, not `rendered` evidence; label untested emulators `not-checked`.

## Framework routing

- Read [references/terminal-protocols.md](references/terminal-protocols.md) when implementing DEC Mode 2026 synchronized output, Kitty/Sixel/iTerm2 graphics fallbacks, OSC 8 hyperlinks, Kitty keyboard protocol (`CSI u`), OSC 52 clipboard, OSC 9;4 progress, or `NO_COLOR`/`TERM`/`isatty` capability handling.
- Read [references/textual.md](references/textual.md) when building Python Textual apps with `Theme`, TCSS cell units, `CommandPalette`, `@work(exclusive=True)`, and `Pilot`/SVG snapshots.
- Read [references/rich.md](references/rich.md) when building Python Rich CLI output, `Theme` consoles, `stderr` progress/live displays, or markup-safe logging.
- Read [references/ink.md](references/ink.md) when building Node/Bun Ink 5/6 (React 19) terminal UIs with `<Static>`, `useInput`, `useFocus`, `@inkjs/ui`, and `ink-testing-library`.
- Read [references/bubbletea-lipgloss.md](references/bubbletea-lipgloss.md) when building Go Bubble Tea v2 / Lip Gloss v2 TUIs or using the Charm ecosystem (Huh, Bubbles, Glamour, Gum, Fang, Teatest).
- Read [references/ratatui.md](references/ratatui.md) when building Rust Ratatui (`0.28–0.30+`) TUIs with `ratatui::run`/`init`+`restore`, `Constraint::Fill`/`Flex`, `ratatui-image`, and `TestBackend`+`insta`.
- Read [references/extended-tui-toolkits.md](references/extended-tui-toolkits.md) when building .NET `Terminal.Gui v2` or `Spectre.Console`, Python `prompt_toolkit`, `OpenTUI`, C++ `FTXUI`, `Notcurses`, Go `tcell`/`tview`, migrating off Blessed, or choosing inline CLI prompts (`@clack/prompts`, `@inquirer/prompts`, `questionary`, `cliclack`/`inquire`/`dialoguer`).
