# Slides and presentation surfaces

Slides are performance aids viewed at distance. They are not dense reports pasted onto a projector. One slide carries one primary idea; speaker notes and handouts carry detail.

## Composition rules

| Concern | Practical rule |
|---|---|
| idea density | one claim/idea per slide; split sequences instead of shrinking everything |
| type scale | as a starting floor for projection, body text around 24–32pt/px-equivalent or larger, important content 36–60+, titles larger; validate at authored resolution and viewing distance rather than treating numbers as law |
| safe area | keep essential content inside roughly the central 90–95% of the frame; projector cropping, bezels, captions, and platform UI can obscure edges |
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

Slidev uses Markdown-driven slides with Vue ecosystem extensibility. Slides are separated by `---`; the first frontmatter block configures the deck, including fields such as `theme`, `title`, and export/presentation behavior depending on version. Per-slide frontmatter can choose layouts. Vue components and custom themes make it powerful but easy to overbuild.

Rules:

- keep Markdown content readable even if custom components fail;
- use presenter notes intentionally rather than hiding essential content in them;
- pin theme/dependencies and inspect exported PDF/PPTX/PNG behavior with the installed Slidev version;
- validate syntax highlighting size/contrast and line wrapping;
- test presenter mode/keyboard navigation if used live.

## reveal.js

reveal.js initializes a scalable slide deck in the browser. Current documented sizing defaults include:

```js
Reveal.initialize({
  width: 960,
  height: 700,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,
});
```

For a 16:9 deck, set an explicit authoring frame such as `width: 1280, height: 720` and tune `margin`, `minScale`, and `maxScale` only after testing target displays. `center: false` prevents vertical recentering when fixed layout matters. `embedded: true` changes sizing for embedded decks and requires explicit layout responsibility.

Rules:

- test keyboard navigation, fragments, overflow scrolling, PDF export/print stylesheet, speaker view, and browser scaling;
- do not rely on automatic scaling to rescue overcrowded slides;
- fragments should reveal logic, not every bullet merely for rhythm;
- nested/vertical slides need clear navigation purpose.

## Marp

Marp uses Markdown with directives in frontmatter, commonly:

```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
---
```

Marp CLI can render/export supported formats depending on installation/version. Rules:

- choose or create a theme rather than accepting default typography by accident;
- use directives consistently (`paginate`, `header`, `footer`, `size`) and inspect actual output;
- keep Markdown semantic; do not inject fragile HTML/CSS for every slide;
- test image resolution, math/syntax highlighting, PDF export, and font availability in CI/export containers.

## Export and live verification

- inspect slides at 100% authored frame and projected/scaled size;
- test first/middle/last slides, overflow, long titles, missing images/fonts, offline assets, presenter notes, and laser/pointer contrast;
- export PDF/PPTX/video using the real pipeline and inspect frame edges;
- verify embedded fonts/licenses where applicable;
- use a remote/clicker/keyboard path in live presentation rather than assuming mouse control;
- label accessibility and export verification honestly (`rendered` versus `not-checked`).

## Anti-slop warnings

Reject bullet-only decks, gradient title templates with no content hierarchy, unreadable full-screen screenshots, decorative 3D transitions, six-column agenda fragments, tiny chart axes copied from dashboards, and logo watermarks consuming safe area. Distinctiveness should come from editorial clarity, image choice, scale, timing, and domain-specific visual evidence.
