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

- **Grapheme-cluster width (`UAX #29`) & `--ascii` fallback**: **never** measure column width with `.length`, `.len()`, or UTF-16 code units! Compute **`UAX #29` grapheme-cluster + East Asian Width** (`unicode-width` + `unicode-segmentation` in Rust, `uniseg`/`go-runewidth` in Go, `Intl.Segmenter` + `string-width` in Node, `wcwidth`/`rich.cells` in Python) so **CJK (`2` cols), ZWJ Emoji (`👨‍👩‍👧‍👦` = `2` cols), `VS16` (`⚠️` = `2` cols), and Vietnamese combining diacritics (`0` extra cols)** never corrupt box borders; degrade to `--ascii` / `+--+` glyphs when `TERM=dumb` or locale is non-UTF-8.
- **`DECSET 2004` Bracketed Paste & `OSC 52` clipboard**: enable Bracketed Paste (`\x1b[?2004h` … `\x1b[?2004l`) on interactive inputs so multi-line pastes never fire each newline as an accidental `Enter` confirmation; support **`OSC 52`** escape sequences for copying over remote SSH/`tmux` sessions alongside local OS clipboards.
- **Strict stream hygiene, `SIGPIPE`, & 16-color light/dark ANSI**: send interactive TUI chrome, spinners, and progress bars to `stderr` (or alternate screen only when `isatty(stdout)`); write machine-parseable output (`--json`, `--plain`) strictly to `stdout`; handle **`SIGPIPE` / `EPIPE` / `BrokenPipeError`** (`| head -n 5` / `| jq`) silently without stack traces; and respect `NO_COLOR`, `TERM=dumb`, `CI=true`, and 16-color dark+light ANSI themes (never hardcoding `#ffffff` on assumed-black or `#000000` on assumed-white).
- **6-step panic & signal terminal restoration**: on normal exit, `SIGINT`, `SIGTERM`, `SIGHUP`, and uncaught panics/exceptions, execute all 6 teardown steps in order: **(1)** leave alternate screen `?1049l`, **(2)** disable mouse tracking `?1000l/?1002l/?1003l/?1006l`, **(3)** disable bracketed paste `?2004l`, **(4)** disable synchronized output `?2026l` (and clear `OSC 9;4` progress), **(5)** pop Kitty keyboard flags `\x1b[<u`, **(6)** show cursor `?25h` & exit raw mode.
- **CLI distribution & exit-code contract**: ship `--help`, `--version`, semantic exit codes (**`0`** ok, **`1`** runtime error, **`2`** usage error, **`130`** `SIGINT`), **shell completions (`bash`, `zsh`, `fish`, `pwsh`)**, a `man` page, and Homebrew/Winget/Scoop/Cargo/npm binary packaging.

## Anti-lazy-default & anti-slop guard

- **Reject raw `print()` / `console.log()` / manual ANSI escape spaghetti** (`\x1b[31m...`) when structured TUI/CLI libraries fit the language: **Rich** / **Textual** (Python), **Bubble Tea v2 + Lip Gloss v2 + Huh** (Go), **Ratatui** (Rust), **Ink** / **`@clack/prompts`** (Node/Bun), or **Spectre.Console** / **Terminal.Gui v2** (.NET).
- **Match buffer mode to task scope**: use inline CLI prompts/output for one-shot commands and reserve full-screen alternate-buffer TUIs for persistent interactive workspaces; reject decorative ASCII banners that crowd out real data at `80×24`.

## Common TUI failures

- measuring columns with `.length`/`.len()` so CJK, ZWJ emoji (`👨‍👩‍👧‍👦`), `⚠️`, or Vietnamese diacritics break borders;
- missing `?2004h` Bracketed Paste causing pasted multi-line configs to execute every line on `Enter`;
- crashing with `BrokenPipeError` / `EPIPE` / Rust `.unwrap()` panic when piped into `head -n 5`, or leaking spinner ANSI to `stdout`;
- hardcoded `#ffffff` text unreadable on light 16-color terminals, or color-only diffs invisible under `NO_COLOR=1`;
- incomplete panic/signal teardown leaving `?1049h`, mouse tracking `?1003h`, `?2026h`, or Kitty `CSI u` stuck in the user's shell;
- panes disappearing at `80×24`, missing `--version`/completions/`man` page, or exiting `0` on failure.

## Verification options

TUI rendering can be inspected with actual terminal runs, framework test backends, snapshot tests, width/height fixtures, piped-output tests, `NO_COLOR`/`TERM=dumb`/`COLORTERM` matrices, and keyboard-driven integration tests. Textual supports `App.run_test()`/`Pilot` and SVG snapshots via `pytest-textual-snapshot`; Ratatui supports `TestBackend` + `insta`; Bubble Tea supports `Teatest`; Ink supports `ink-testing-library`. Passing a unit test without a rendered frame/buffer/snapshot is `static`, not `rendered` evidence; label untested emulators `not-checked`.

## Pre-submit checklist

- [ ] zero `TODO`s, placeholder stubs, dead keybindings, or raw hardcoded ANSI escape spaghetti;
- [ ] `UAX #29` grapheme width verified on CJK (`2`), ZWJ emoji (`👨‍👩‍👧‍👦` = `2`), `VS16` (`⚠️` = `2`), and Vietnamese diacritics (`0`), plus `--ascii` fallback and `80×24` resize;
- [ ] `DECSET 2004` Bracketed Paste (`?2004h`…`?2004l`) and `OSC 52` SSH/`tmux` + local clipboard wired;
- [ ] `stderr`/`stdout` separation, silent `SIGPIPE`/`EPIPE`/`BrokenPipeError` exit (`| head -n 5`), `NO_COLOR=1`, `TERM=dumb`, `CI=true`, and 16-color dark+light ANSI contrast verified;
- [ ] full 6-step terminal restoration (`?1049l`, mouse `?1000–1006l`, `?2004l`, `?2026l`, `\x1b[<u`, `?25h` + raw mode) verified on exit, `SIGINT`/`SIGTERM`/`SIGHUP`, and panic;
- [ ] `--help`, `--version`, semantic exit codes (`0/1/2/130`), `bash`/`zsh`/`fish`/`pwsh` completions, `man` page, and `rendered` vs `static` evidence labels verified.

## Framework routing

- Read [references/terminal-protocols.md](references/terminal-protocols.md) when implementing DEC Mode 2026 synchronized output, Kitty/Sixel/iTerm2 graphics fallbacks, OSC 8 hyperlinks, Kitty keyboard protocol (`CSI u`), OSC 52 clipboard, OSC 9;4 progress, or `NO_COLOR`/`TERM`/`isatty` capability handling.
- Read [references/textual.md](references/textual.md) when building Python Textual apps with `Theme`, TCSS cell units, `CommandPalette`, `@work(exclusive=True)`, and `Pilot`/SVG snapshots.
- Read [references/rich.md](references/rich.md) when building Python Rich CLI output, `Theme` consoles, `stderr` progress/live displays, or markup-safe logging.
- Read [references/ink.md](references/ink.md) when building Node/Bun Ink 5/6 (React 19) terminal UIs with `<Static>`, `useInput`, `useFocus`, `@inkjs/ui`, and `ink-testing-library`.
- Read [references/bubbletea-lipgloss.md](references/bubbletea-lipgloss.md) when building Go Bubble Tea v2 / Lip Gloss v2 TUIs or using the Charm ecosystem (Huh, Bubbles, Glamour, Gum, Fang, Teatest).
- Read [references/ratatui.md](references/ratatui.md) when building Rust Ratatui (`0.28–0.30+`) TUIs with `ratatui::run`/`init`+`restore`, `Constraint::Fill`/`Flex`, `ratatui-image`, and `TestBackend`+`insta`.
- Read [references/extended-tui-toolkits.md](references/extended-tui-toolkits.md) when building .NET `Terminal.Gui v2` or `Spectre.Console`, Python `prompt_toolkit`, `OpenTUI`, C++ `FTXUI`, `Notcurses`, Go `tcell`/`tview`, migrating off Blessed, or choosing inline CLI prompts (`@clack/prompts`, `@inquirer/prompts`, `questionary`, `cliclack`/`inquire`/`dialoguer`).
