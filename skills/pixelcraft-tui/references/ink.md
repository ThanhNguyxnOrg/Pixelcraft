# Ink (React for CLI)

## Token mapping

Define semantic constants in a theme module/context and map them to Ink color props/style behavior:

```tsx
export const theme = { action: '#0074ca', error: 'red' };
```

Do not scatter chalk-style color literals through components. Terminal themes/capabilities vary, so semantic names must degrade gracefully.

## Layout and responsive idioms

Ink uses Yoga-like flexbox in terminal cells. Use flex direction/width/margin/padding deliberately, measure terminal columns/rows, define truncation/wrapping/minimum size behavior, and avoid browser layout assumptions. Static vs interactive output should be separated intentionally.

## Typography/custom fonts

Terminals control fonts. Use color/bold/dim/underline/inverse and spacing. Do not assume emoji/Unicode width consistency. Use plaintext fallbacks for symbols.

## Motion/reduced motion

Use spinners/progress truthfully and avoid rapid render loops. Offer noninteractive/quiet mode in CI/piped contexts. Reduced-motion support is terminal-limited; avoid flashing/continuous animation by default.

## Accessibility specifics

Keyboard input handling/focus semantics are application responsibility. Visible selection/focus, logical key order, escape/cancel, no color-only state, plaintext alternatives, stdout/stderr separation, and screen-reader-friendly linear output matter. Mouse support cannot be assumed.

## States idiom

Use explicit React state/reducer state machines for loading/error/empty/offline/permission/optimistic/cancelled states. Async effects need cancellation/cleanup. Ctrl+C/EOF/interrupt behavior must be designed. Preserve input across step navigation/resize/render.

## Forms idiom

Use text input components/hooks with labels/instructions, validation timing, paste behavior, cursor visibility, key conflict awareness, error copy, and input preservation. Multi-step CLI forms need back/cancel semantics and noninteractive equivalents.

## Do/don't pairs

| Do | Don't |
|---|---|
| central semantic theme constants | hard-coded color props in every component |
| visible selected/focused row style plus text marker | color-only invisible focus |
| cleanup async effect/cancel operation | state update after unmount/interrupt |
| explicit noninteractive flags for automation | requiring full-screen input inside CI |
| width-aware truncation/wrapping | overwriting terminal output unpredictably |

## Known traps

React effect lifecycle leaks, render-loop flicker, input key conflicts, Unicode width mismatch, terminal resize behavior, hidden state loss on rerender, stdout/stderr misuse, assuming TTY in automation, ANSI/INK version behavior differences.

## Verification commands

```sh
npm run lint
npm run test -- --run
node dist/cli.js --help
CI=1 node dist/cli.js 2>/dev/null || true
```

Use actual terminal runs at multiple widths, keyboard-driven integration tests, ink-testing-library-style tests where configured, piped/non-TTY checks, NO_COLOR/TERM matrices, and interrupt-path testing.
