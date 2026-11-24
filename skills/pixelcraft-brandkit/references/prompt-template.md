# Internal image-generation prompt template

Keep decision reasoning separate from the text sent to the image model. Diffusion and multimodal image generators suffer from **concept leakage**: naming rejected metaphors or discarded aesthetics inside the generation prompt frequently causes the model to render those unwanted elements onto the board.

## 1. Pre-prompt decision log (DO NOT send to the image model)

Record this internally before composing the prompt (and summarize in the final report):

```text
Identity mode: [create from scratch / build on existing brand / requested refresh]
Supplied assets to preserve: [exact logos/colors/fonts, or none]
Rejected brand worlds (kept OUT of the image prompt):
- [Concept A] — rejected because [criterion: audience fit / ownability / scalability]
- [Concept B] — rejected because [criterion]
Selected brand world: [selected concept]
Signature / ownable rule: [single strongest repeatable identity behavior]
Explicit anti-goals (translate into positive visual choices below): [clichés avoided]
```

## 2. Image-generation prompt block (positive visual brief only)

Fill every bracket with concrete, strategy-backed specifics describing **only** what should appear:

```text
Create a cohesive brand-kit overview board for "[BRAND NAME]".

Brand direction:
- identity mode: [create from scratch / build on existing brand / requested refresh]
- existing assets: [supplied elements to preserve verbatim, or none]
- category & audience: [category] for [audience]
- core metaphor: [selected metaphor]
- selected brand world: [selected visual world]
- signature identity rule: [the single repeatable graphic/material behavior]

Canvas:
[requested width × height, aspect ratio, or orientation; otherwise 4:3 or 16:10].
The dimensions describe the complete output image, not individual panels.
Preserve the closest supported aspect ratio without distorting geometry.

Layout:
[3×3 / 2×3 / 2×2 / 1×3 / 4×2 / custom] grid on a [dark/light/specific] presentation canvas with crisp gutters, exact edge alignment, generous negative space, and clear focal hierarchy.

Panels:
- logo cover: [cover behavior]
- logo construction: [geometric construction grid or exact supplied-logo lockup]
- digital application: [minimal browser/app/terminal/UI fragment]
- tagline / brand essence: [exact short line, if used]
- color system: [swatch/chip/disc/strip treatment]
- typography: [specimen/pairing behavior]
- physical application: [tactile object/label/packaging mockup]
- image direction: [art-directed scene/texture]
- system detail: [chips/icons/pattern/input/detail]
[adapt/omit/reorder strictly to match the chosen layout]

Visual mode & palette:
- mode: [selected visual mode and concrete material interpretation]
- palette: [base + primary accent + optional secondary accent + neutrals; exact hex/values if supplied]
- repeat the same palette strictly across all panels.

Logo:
[reuse the supplied logo verbatim with exact shapes and proportions] OR [render one crisp, simple, scalable mark built with METHOD: monogram+meaning / product action / metaphor fusion / negative space / construction geometry].
Repeat the exact same mark consistently across every panel.

Typography & exact text inventory:
- keep typography clean, high-contrast, and sparse; render only the listed text cleanly with zero filler body copy:
  - brand name: [name]
  - tagline: [one short specific line, or omit]
  - optional URL/command: [at most one, or omit]
  - labels/chips: [2–5 short labels maximum]

Image & mockup direction:
- imagery: [editorial / material / halftone / architectural / product-world scene matched to the palette]
- applications: minimal believable touchpoints only ([browser header / terminal bar / app icon / printed badge / folder / label]).

Finish:
Crisp studio identity-guidelines deck with disciplined negative space, aligned grid seams, controlled lighting, cohesive material texture, and clean vector-grade mark edges.
```

## Reference usage clause

When the user supplies inspiration references, extract layout rhythm, grid style, spacing, typography scale, density, logo placement, amount of text, image treatment, accent-color logic, and brand-system behavior. Explicitly instruct the generator **not** to copy exact logos, names, compositions, slogans, or unique visual assets.

When the user supplies existing identity assets, treat them as source material to reuse accurately—not as inspiration to avoid copying.

## Post-generation report requirements

Report selected concept, rejected alternatives in one line, actual dimensions/ratio, generator limitations if any, supplied assets preserved, palette/type implications for `pixelcraft-tokens`, and unresolved manual-review needs.
