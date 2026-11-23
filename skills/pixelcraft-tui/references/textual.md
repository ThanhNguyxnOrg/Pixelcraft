# Textual

Evidence: current docs confirm Textual CSS variables use `$name`; `pytest-textual-snapshot` provides the `snap_compare` fixture and SVG snapshot comparisons.

## Token mapping

Use exported Textual variables directly:

```tcss
$semantic-color-action: #0074ca;
$space-control-inline: 4px;

Button {
  background: $semantic-color-action;
}
```

Keep variables semantic and scoped intentionally. Do not hard-code repeated colors through TCSS/widget constructors when a variable can express the role.

## Layout and responsive idioms

Use containers, grids/docks/horizontal/vertical layouts, fractional/percent/auto sizing, scrollable containers, focus chains, and terminal width/height adaptation. Design minimum dimensions such as 80×24 and define what collapses/disappears first.

## Typography/custom fonts

Terminals control fonts. Use weight/style/color/underline/inverse and spacing as typography; never assume custom typefaces or exact glyph width. Unicode width/emoji/CJK behavior can differ by terminal/font.

## Motion/reduced motion

Textual has animation/timer/refresh capabilities, but terminal motion should be sparse. Use reduced-motion/user configuration where platform support is uncertain. Avoid rapid flashing/full-screen refresh and prefer stable state changes.

## Accessibility specifics

Keyboard-first bindings, visible focus, logical focus order, no color-only state, screen-reader-friendly text equivalents, `NO_COLOR`/low-color fallback, mouse optional. Do not use emoji/glyph-only critical meaning. Terminal accessibility depends on emulator/screen reader integration; verify what can actually be inspected.

## States idiom

Use widgets/screens/modals/data state explicitness: loading/error/empty/offline/permission/worker progress/cancellation. Textual workers/tasks need cancellation/error propagation. Preserve input through screen changes and resize. Show disconnected/completed/failed state textually.

## Forms idiom

Use real Input/TextArea/Select/Checkbox/Button widgets, validation timing, focus order, keybindings, paste behavior verification, visible error copy, and preservation across modal/navigation. Do not make Enter/Escape behavior ambiguous.

## Do/don't pairs

| Do | Don't |
|---|---|
| semantic TCSS `$variables` | hex constants repeated in every widget/rule |
| keyboard `Binding` plus visible help/footer | hidden mouse-only interaction |
| worker cancellation/error state visible | background task silently failing |
| snapshot test at multiple widths | only manually glancing at one terminal size |
| plain text state plus color | color-only green/red status |

## Known traps

Unicode width mismatch, terminal font assumptions, color capability variation, focus loss in modals/screens, worker lifecycle leaks, rapid repaint noise, overflow/truncation at narrow width, mouse support assumptions, TCSS specificity confusion.

## Verification commands

```sh
python -m pytest
pytest --snapshot-update  # only when intentionally updating
python -m compileall .
python app.py 2>/dev/null || true
```

Use `pytest-textual-snapshot` snapshots, actual terminal runs, narrow/wide matrices, `NO_COLOR`/TERM variations, keyboard-only flows, and piped/non-TTY behavior where relevant.
