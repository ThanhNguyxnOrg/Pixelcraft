# Internal image-generation prompt template

Use this structure internally. Fill every bracket with strategy-backed specifics. Do not expose hidden reasoning unless the user asks; do expose chosen direction, output size, and verification notes in the final report.

```text
Create a premium brand-kit overview image for "[BRAND NAME]".

Brand strategy:
- identity mode: [create from scratch / build on existing brand / requested refresh]
- existing assets: [supplied elements to preserve exactly, or none]
- category: [category]
- audience: [audience]
- product function: [function]
- emotional promise: [promise]
- cultural position: [position]
- trust level: [trust requirement]
- personality: [traits]
- core metaphor: [metaphor]
- visual world: [world]
- avoid: [explicit anti-goals and inappropriate clichés]

Divergent selection:
- rejected concepts: [1–2 brief alternatives and why they lost]
- selected brand world: [selected concept]
- signature/ownable idea: [the single strongest identity behavior]

Canvas:
[requested width × height, aspect ratio, or orientation; otherwise 4:3 or 16:10].
The dimensions describe the complete output image, not individual panels.
If exact dimensions are unsupported, preserve the closest supported ratio and do not invent unsupported pixel dimensions.

Layout:
[3×3 / 2×3 / 2×2 / 1×3 / 4×2 / custom] grid on a [dark/light/specific] presentation canvas with strong gutters, clean alignment, refined negative space, and unequal but coherent panel hierarchy.

Panels:
- logo cover: [cover behavior]
- logo concept / construction: [construction logic or correct existing-logo usage]
- digital application: [browser/app/terminal/UI artifact]
- tagline / brand essence: [exact short line, if used]
- color system: [swatch/chip/disc/strip treatment]
- typography: [specimen/pairing behavior]
- physical application: [object/mockup]
- image direction: [art-directed scene/texture]
- system detail: [chips/icons/pattern/input/detail]
[adapt/omit/reorder only to match the chosen layout]

Visual mode:
[selected visual mode and concrete interpretation]

Palette:
[base + primary accent + optional secondary accent + neutrals; exact colors if supplied]
Accents repeat consistently across panels. No random rainbow and no generic purple-blue AI glow.

Logo:
[reuse the supplied logo without redesign, preserving exact shapes/proportions/assets] OR [create a professional, symbolic, simple, scalable, ownable mark using METHOD: monogram+meaning / product action / metaphor fusion / negative space / construction geometry].
Repeat the same mark consistently across panels. No inconsistent variants and no copied famous marks.

Typography:
Readable, minimal, high hierarchy, sparse; no tiny fake body copy; no lorem ipsum; no dense menus or paragraphs.

Text inventory:
- brand name: [name]
- tagline: [one short specific line]
- optional URL/command: [at most one]
- labels/chips: [2–5 maximum]

Image direction:
[cinematic / halftone / material / editorial / product-world treatment matched to palette and metaphor; avoid stock people, offices, robots, and unrelated scenes]

Mockup direction:
Minimal believable identity applications only: [browser chrome / URL bar / terminal / app icon / badge / folder / label / dashboard fragment]. No dense fake dashboards, cheap gloss, device overload, or feature-demo screens.

Style:
Premium, sparse, cinematic, intentional, polished brand-guidelines deck. Strong negative space, exact alignment, coherent gutters, restrained texture, art-directed imagery, implementation-ready identity system. No clutter, no copied inspiration logos/names/compositions/slogans/unique assets, no generic startup gradient, no random floating icons.
```

## Reference usage clause

When the user supplies inspiration references, extract layout rhythm, grid style, spacing, typography scale, density, logo placement, amount of text, image treatment, accent-color logic, and brand-system behavior. Explicitly instruct the generator **not** to copy exact logos, names, compositions, slogans, or unique visual assets.

When the user supplies existing identity assets, treat them as source material to reuse accurately—not as inspiration to avoid copying.

## Post-generation report requirements

Report selected concept, rejected alternatives in one line, actual dimensions/ratio, generator limitations if any, supplied assets preserved, palette/type implications for `pixelcraft-tokens`, and unresolved manual-review needs.
