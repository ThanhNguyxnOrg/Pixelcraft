# Measured craft by surface

State the craft claim and expected result before capturing. Compare the same fixture, revision pair, input sequence, theme, locale, device/client/renderer version, and geometry. Record changes in cache, throttling, data, capture timing or OS if you cannot hold them fixed. Store comparable artifacts and inspect the path that matters; do not reward a prettier screenshot when task success regresses.

| Surface | Evidence to capture instead of a generic browser score |
|---|---|
| Responsive web | Identical 390/768/1440 captures and browser inventory for changed flows; add 320 when reflow-sensitive. Compare type, palette, estimated geometry, motion signals, initial/deferred requests and vitals; execute the actual interaction and inspect reduced-motion separately. |
| Mobile / constrained | Device or clearly labeled emulator at supported scaling and insets; capture interrupted/resumed task, first usable state and reduced/disabled animation. Include physical distance or input limits when relevant. |
| Desktop / extensions | Host window at minimum size and target scale, native theme and keyboard state; capture action and restoration, plus startup or input latency if that is the claim. |
| Game / spatial | Target controller and viewing distance; capture a sequence against changing scene backgrounds or object depths, focus/motion options and frame timing under load. No device means mark device claims unchecked. |
| TUI | Terminal recording or snapshots with exact rows/columns, locale and terminal capability; measure resize recovery, focus, prompt feedback and non-color fallback. |
| Email / document / media | Actual sent/exported artifact in supported client, PDF reader, print, projector or thumbnail renderer. Inspect images off, page breaks, plain text/reading order, final crop or compressed playback as applicable. |
| Chat / data / dataviz | Capture action acknowledgement, failure/empty/expired response, filtering or stale-data transition; inspect comparable scales, text alternatives and client-specific fallbacks. |

## Browser before/after

Use the existing inventory for a changed view where it can answer a question. Use the same target, fixture and settings for both revisions:

```sh
node scripts/style-inventory.mjs http://localhost:3000 --breakpoints 390x844,768x1024,1440x900 --out before-inventory.json
# Apply the scoped change and run the same fixture again:
node scripts/style-inventory.mjs http://localhost:3000 --breakpoints 390x844,768x1024,1440x900 --out after-inventory.json
node scripts/shoot.mjs http://localhost:3000 --breakpoints 390x844,768x1024,1440x900 --out visual-qa
```

The inventory uses optional Playwright/Chromium and CDP. Computed font families are not per-glyph proof; the palette omits many image effects; geometric whitespace is an estimate; script names and media-query rules are not proof of active or reduced animation. Payload is specific to cache and load timing. Use a Chrome DevTools Performance or Network trace when you need to attribute a web regression; use platform-native profiling for non-browser claims. Do not turn gallery medians into targets. Label a missing renderer, fixture or untested motion path `not-checked`.

For a canvas-, video-, or image-led first screen, label the art layer separately before using DOM color, whitespace, font counts, or content width to critique it. A full-bleed plane can drive geometric whitespace to zero while the image itself has negative space; an intro or consent overlay can dominate the sampled text. Inspect paired captures with region names and capture times, and compare equivalent scene states rather than folding dissimilar captures into one range.

When claiming a lighter static or compact alternative, start fresh default and reduced-motion contexts at the same viewport, select the setting before navigation, and replay the same entry task. Check requests and initialization for the specific scene, not just total bytes or CSS rules. Repeat at the supported landscape or short-height viewport if the shell recomposes. Distinguish an unneeded scene that never initializes from a needed scene that loads later on explicit request.
