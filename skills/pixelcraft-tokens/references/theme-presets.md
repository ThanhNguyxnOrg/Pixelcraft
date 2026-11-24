# Theme presets: light, dark, and high contrast

A theme is a semantic reassignment, not a filter. Do not invert colors, flip luminance mechanically, or assume every hue keeps the same saturation/contrast across modes.

## Required preset model

Maintain at minimum:

| Mode | Purpose |
|---|---|
| light | default high-luminance surface system |
| dark | low-luminance surface system with adjusted elevation/accent behavior |
| high-contrast | accessibility-oriented variant increasing foreground/background separation and non-color redundancy; may exist in light and dark forms |

High contrast is not merely “more saturated.” It often means fewer decorative colors, stronger borders/focus indication, simpler surfaces, larger contrast ratios, and explicit system-color behavior. Decide whether it is a product theme, accessibility mode, or platform-mediated behavior and expose that choice consistently.

## Semantic dark-mode mapping

Map roles deliberately:

| Semantic role | Light behavior | Dark behavior |
|---|---|---|
| `surface.base` | near-white/neutral paper | deep neutral, not pure black by default |
| `surface.raised` | white/light elevation | slightly lighter than base; dark elevation uses luminance/layering because black shadows disappear |
| `surface.overlay` | elevated card/popover | progressively lighter plus border/edge separation |
| `ink.primary` | dark high-contrast text | light high-contrast text, softened only enough to reduce glare |
| `ink.muted` | lower contrast but readable | carefully adjusted; dark muted text fails quickly |
| `action.primary` | saturated brand/action color | often lighter/desaturated to maintain contrast and avoid vibrating against dark surfaces |
| `focus.ring` | visible against surface/action | hue/luminance adjusted per surface; never same hue assumption as light |
| `border.subtle` | low-key gray | use actual semantic border tokens; hairlines behave differently in dark |
| `shadow.*` | darker shadow opacity | often reduce shadow opacity/size and add surface luminance/border instead |

Pure black backgrounds can cause smearing/halation and remove elevation cues. Pure white text can glare. Use measured contrast and real rendering, not aesthetic slogans.

Desaturate or lighten accents in dark mode when saturation vibrates or contrast fails. Preserve hue identity and state distinctness; do not make success/warning/error indistinguishable.

## `light-dark()`, `prefers-contrast`, `prefers-reduced-transparency`, and forced colors

On modern web targets, pair `color-scheme: light dark` with CSS Color 5 `light-dark()` so form controls, scrollbars, and semantic color tokens switch cleanly under system preference or explicit user choice (`color-scheme: light` / `color-scheme: dark` on `:root[data-theme="..."]`):

```css
:root {
  color-scheme: light dark;
  --color-surface-base: light-dark(oklch(0.98 0.005 95), oklch(0.20 0.01 265));
  --color-ink-primary: light-dark(oklch(0.22 0.015 265), oklch(0.93 0.008 95));
}
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }

@media (prefers-contrast: more) { /* stronger borders, ink separation, and focus outlines */ }
@media (prefers-reduced-transparency: reduce) { /* replace translucent/glass fills with opaque surface tokens */ }
@media (forced-colors: active) { /* preserve platform system colors and borders */ }
```

`prefers-contrast` values include `no-preference`, `more`, `less`, and `custom`. Whenever a theme uses translucent or glass surfaces, provide an opaque high-contrast token swap under `prefers-reduced-transparency: reduce` (and Apple/Windows Reduce Transparency settings). Forced Colors Mode/Windows High Contrast is stronger: the platform constrains colors. Use system colors such as `Canvas`, `CanvasText`, `ButtonText`, `ButtonFace`, `LinkText`, `Highlight`, and `HighlightText` deliberately. Do not remove outlines/backgrounds that the platform needs for meaning, and do not use box shadows/background-only cues that disappear in forced colors.

### Anti-FOUC pre-paint theme initialization

For web apps supporting a persisted user theme override (`light` / `dark` / `system`), execute a tiny synchronous inline script in `<head>` **before** stylesheets paint so the page never flashes light mode before hydrating dark mode (or emit the saved theme cookie on the server during SSR):

```html
<script>
  (() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
      const mode = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
      document.documentElement.dataset.theme = mode;
      document.documentElement.style.colorScheme = mode;
    } catch {}
  })();
</script>
```

## DTCG modes: Resolver vs. `$extensions.pixelcraft.modes`

For multi-theme and multi-brand production pipelines, use the **W3C DTCG 2025.10 Resolver Specification** (`*.resolver.json` with `sets`, `modifiers`, `contexts`, and `resolutionOrder`, documented in `references/format.md`) compiled with Terrazzo or Resolver-aware Style Dictionary.

For lightweight single-file token sets exported with Pixelcraft's zero-dependency `scripts/export-tokens.mjs`, use token-level overrides under `$extensions.pixelcraft.modes`. A replacement can be a raw value or an object containing `$value`:

```json
{
  "color": {
    "$type": "color",
    "surface": {
      "$value": { "colorSpace": "oklch", "components": [0.98, 0.005, 95], "alpha": 1 },
      "$extensions": {
        "pixelcraft": {
          "modes": {
            "dark": { "$value": { "colorSpace": "oklch", "components": [0.2, 0.01, 265], "alpha": 1 } },
            "high-contrast": { "$value": { "colorSpace": "oklch", "components": [1, 0, 0], "alpha": 1 } }
          }
        }
      }
    }
  }
}
```

Use [../assets/tokens.modes.example.json](../assets/tokens.modes.example.json) for a fuller working file. Export a mode with:

```sh
node scripts/export-tokens.mjs assets/tokens.modes.example.json --format css --mode dark
```

Rules:

- default/base `$value` remains the light or baseline theme;
- a mode may override only tokens that differ; unspecified tokens inherit the base value;
- references inside mode replacements resolve against the same token graph;
- mode names are lowercase hyphenated product semantics (`dark`, `high-contrast`, `dim`, brand/context modes), not implementation selectors;
- generated artifacts are output; do not manually patch one mode in generated CSS/native files.

## Validation matrix

- verify all required foreground/background pairings in every mode rather than isolated swatches;
- test hover/active/focus/selected/disabled/destructive/success/warning/info states;
- test elevation/order overlaps: base → raised → overlay → modal/popover;
- test charts/data visualization semantic palettes separately;
- inspect forced-colors and high-contrast rendering where the platform supports them;
- test transition/flash behavior at page load and theme switch;
- verify screenshots at real scale—contrast math does not capture glare, halation, antialiasing, or visual vibration.
