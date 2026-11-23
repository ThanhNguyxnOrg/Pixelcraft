# Rich

Rich is primarily a rendering/output library, not a complete interactive application framework. Use it for structured terminal output, logs, tables, panels, progress, syntax, markdown, prompts-adjacent display, and live dashboards when scope is limited.

## Token mapping

Define semantic style constants centrally:

```python
PC_STYLES = {"action": "bold #0074ca", "error": "bold red"}
```

Use named styles/themes rather than repeating raw color strings. Rich markup style names should express meaning (`error`, `muted`, `action`), not appearance-only chaos.

## Layout and responsive idioms

Use console width detection, tables/columns/panels/padding deliberately, soft wrapping/overflow settings, and avoid fixed-width ASCII diagrams. Rich output must degrade when piped, narrow, redirected, or logged. Interactive full-screen behavior belongs more naturally in Textual.

## Typography/custom fonts

Terminals control fonts. Use bold/dim/underline/reverse/color as hierarchy. Never rely on exact font or glyph width. Use text alternatives for box glyphs/emoji/sparklines.

## Motion/reduced motion

Use progress/live display truthfully and sparingly. Avoid rapid refresh/flash. Honor noninteractive environments and consider `NO_COLOR`; motion reduction in terminals is environment-limited, so provide quiet/no-animation flags.

## Accessibility specifics

Do not encode meaning only through color/style. stdout/stderr separation, plaintext fallback, screen-reader legibility of linear output, no cursor-address tricks in logs, and machine-readable mode where automation matters. Verify terminal capture behavior.

## States idiom

Progress bars/spinners/status must reflect real work. Error panels should explain recovery, not just decorate tracebacks. Empty/no-results/offline/cancelled/interrupted states should be explicit text. Keyboard interrupt handling is UX-critical.

## Forms idiom

Rich prompts/confirmations are linear CLI interaction, not full forms. Validate input with recovery copy, preserve prior value where possible, allow paste naturally, and provide noninteractive flags/environment variables for automation.

## Do/don't pairs

| Do | Don't |
|---|---|
| named semantic style `style="error"` | raw color repeated everywhere |
| width-aware table/panel layout | fixed 120-column ASCII layout |
| explicit interrupted/cancelled message | silent partial output on Ctrl+C |
| stdout/stderr separation and plain mode | ANSI decoration in piped machine output |
| truthful progress percentage | decorative spinner hiding unknown/failed state |

## Known traps

Markup escaping user content, width/Unicode mismatch, piped ANSI output, logs polluted by control sequences, live display flicker, nested live displays, color-only severity, huge tables overwhelming terminal scrollback.

## Verification commands

```sh
python -m pytest
python -m compileall .
python cli.py --help
NO_COLOR=1 python cli.py 2>/dev/null || true
```

Inspect actual terminal output, piped output, width matrices, screen-reader/plaintext readability where relevant, interrupt behavior, and snapshot/golden text fixtures.
