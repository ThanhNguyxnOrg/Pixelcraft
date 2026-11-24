# Slides and presentation surfaces

Slides are performance aids viewed at distance. They are not dense reports pasted onto a projector. One slide carries one primary idea; speaker notes and handouts carry detail.

## Composition rules

| Concern | Practical rule |
|---|---|
| idea density | one claim/idea per slide; split sequences instead of shrinking everything |
| type scale | as a starting floor for projection, body text around 24–32pt/px-equivalent or larger, important content 36–60+, titles larger; validate at authored resolution and viewing distance |
| safe area | keep essential content inside roughly the central 90–95% of the frame; projector cropping, bezels, captions, and platform UI obscure edges |
| contrast | high contrast for projection; avoid thin light-gray type and subtle gradients behind text |
| motion | transitions only when they explain sequence/object constancy; provide reduced/static export behavior |
| content ownership | every chart/image/code fragment must be legible and necessary; speaker notes are not a license to hide required detail |
| accessibility | preserve reading order, alt text/data equivalents for visuals, color-independent meaning, and keyboard navigation where interactive |

Common slide sizes:

| Surface | Typical frame | Notes |
|---|---|---|
| presentation/projector | 16:9, often authored 1920×1080 or 1280×720 | current default in most venues |
| older projector/template | 4:3 | confirm before reusing master layouts |
| vertical social video | 9:16, often 1080×1920 | platform UI overlays need separate safe-area review |
| square embed | 1:1 | simplify hierarchy; avoid dense wide tables |

## Keynote-style craft

- Open with context or a visual question, not a logo-only title repeated throughout.
- Use scale contrast: large decisive statement/visual, restrained supporting text.
- Prefer image/diagram + spoken explanation over bullet paragraphs.
- Build complex diagrams in meaningful steps; never use animation as decoration alone.
- Put code on slides only when the exact line matters. Use large type, high contrast, and limited line length; link/provide full source elsewhere.
- End sections with orientation or decision, not a generic “Questions?” placeholder.
- Keep branding consistent but subordinate. Full-bleed color can be powerful when intentional; default corporate blue templates are slop.

## Slidev

Slidev uses Markdown-driven slides (`---` separators) with Vue components, MDC inline styling, and Shiki Magic Move code transitions:

````markdown
---
theme: default
title: Query Planner Walkthrough
mdc: true
---

# Step-by-step index scan [v2.4]{.text-sm.px-2.py-0.5.rounded.bg-emerald-900.text-emerald-100}

````md magic-move
```sql
SELECT * FROM events WHERE org_id = $1;
```
```sql
SELECT id, created_at FROM events
WHERE org_id = $1
ORDER BY created_at DESC LIMIT 50;
```
````

<!--
Speaker notes: explain why the covering index eliminates heap fetches.
-->
````

Export commands (uses Playwright Chromium underneath—pin fonts and assets so headless export matches live preview):

```sh
npx slidev export --format pdf --with-clicks --output deck.pdf
npx slidev export --format pptx --output deck.pptx
```

Rules:

- enable `mdc: true` in deck frontmatter only when MDC inline syntax is actually used, and keep Markdown readable without custom components;
- use `magic-move` to explain genuine code diffs across 2–4 concise steps rather than scrolling walls of 40-line files;
- validate syntax highlighting contrast and line wrapping in both light/dark exports (`--dark`) and live presenter mode;
- test keyboard navigation (`Space`, arrows, `o` overview) and click steps (`--with-clicks`) when exporting PDF handouts.

## reveal.js

reveal.js initializes a scalable slide deck in the browser:

```js
Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,
  center: false,
});
```

Default sizing in reveal.js is `960×700`; explicitly set `width: 1280, height: 720` for modern 16:9 venues, and set `center: false` when fixed vertical alignment matters. `embedded: true` changes sizing for embedded decks and requires explicit layout responsibility.

Rules:

- test keyboard navigation, fragments, overflow scrolling, PDF export (`?print-pdf`), speaker view (`S`), and browser scaling;
- do not rely on automatic scaling to rescue overcrowded slides;
- fragments should reveal logic, not every bullet merely for rhythm;
- nested vertical slides need clear navigation cues so audiences do not lose orientation.

## Quarto RevealJS

Use Quarto RevealJS (`.qmd`) when slides embed live computational charts, tables, or code outputs from Python, R, Julia, or Observable:

```markdown
---
title: "Latency Distribution Q4"
format:
  revealjs:
    width: 1280
    height: 720
    slide-number: true
    smaller: false
    theme: [default, custom.scss]
---

## P99 tail latency {auto-animate=true}

```{python}
#| echo: true
#| code-line-numbers: "1-2|4"
import polars as pl
df = pl.read_parquet("metrics.parquet")
# Highlighted on step 2
p99 = df.select(pl.col("ms").quantile(0.99))
```

::: {.notes}
Speaker note: cite the exact dataset revision and sample size.
:::
```

Render with `quarto render talk.qmd --to revealjs` and verify `quarto render` PDF print output (`?print-pdf` or DeckTape) so interactive widgets/plots have static fallbacks.

## Touying and Polylux (Typst slides)

Use **Touying** (recommended for Typst 0.12–0.14+) or **Polylux** when exact physical typography, vector math/diagrams (`CeTZ`), speaker notes, and deterministic browser-free PDF compilation matter:

```typst
#import "@preview/touying:0.6.1": *
#import themes.simple: *

#show: simple-theme.with(aspect-ratio: "16-9")
#set text(font: "Inter", size: 22pt)

= Architecture Trade-offs

== State Isolation

- Keep domain logic pure. #pause
- Push rendering and I/O to edges.

#speaker-note[Walk through the single failure trace from last week's incident.]
```

Rules:

- pin `@preview/touying` or `@preview/polylux` versions and bundle fonts via `typst compile --font-path ./fonts`;
- generate both presenter deck (with `#pause` progressive reveals) and static handout mode (`config-common(handout: true)` in Touying) so PDF readers do not click through 80 duplicate build frames;
- inspect exported PDF metadata, selectable text, and contrast at projection scale.

## Marp

Marp uses Markdown with directives in frontmatter:

```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
---
```

Rules:

- choose or create a theme CSS (`--theme-set`) rather than accepting default typography by accident;
- use directives consistently (`paginate`, `header`, `footer`, `size`) and inspect actual output via `npx @marp-team/marp-cli deck.md --pdf --allow-local-files`;
- keep Markdown semantic; do not inject fragile raw HTML/CSS on every slide;
- test image resolution, math/syntax highlighting, and font availability in CI export containers.

## Export and live verification

- inspect slides at 100% authored frame and projected/scaled size (`rendered`);
- test first/middle/last slides, overflow, long titles, missing images/fonts, offline assets, presenter notes, and laser/pointer contrast;
- export PDF/PPTX/video using the real pipeline and inspect frame edges;
- verify embedded fonts/licenses (`pdffonts`) where applicable;
- test with a clicker/keyboard path rather than assuming mouse control;
- label accessibility and export verification honestly (`rendered` versus `not-checked`).

## Anti-slop warnings

Reject bullet-only decks, gradient title templates with no content hierarchy, unreadable full-screen screenshots, decorative 3D transitions, six-column agenda fragments, tiny chart axes copied from dashboards, and logo watermarks consuming safe area. Distinctiveness should come from editorial clarity, image choice, scale, timing, and domain-specific visual evidence.
