# Mockup-First Visual Concepting & Generation

Use this reference inside `pixelcraft-direction` when `.pixelcraft/plan.md` selects the **Mockup-First** workflow track: generating high-craft visual UI mockup images for the user to inspect, compare, and approve **before** translating the winning mockup into production code via `pixelcraft-handoff` (`references/image-to-code.md`).

---

## 1. Choosing the Workflow Track (`Code-First` vs `Mockup-First`)

Select the track explicitly during `pixelcraft-plan` (and confirm in `pixelcraft-direction` before diverging):

| Track | How divergence & approval work | Best fit when |
|---|---|---|
| **Code-First** (default for brownfield & dense tools) | Pitch 2–3 contrasting directions with **Direction Cards + ASCII structural skeletons + real-copy drafts** → approve → build directly in target stack. | Existing strict design system / brownfield feature; data-heavy `Operate` workflows (tables, forms, settings) where interaction logic outranks visual novelty; TUI/CLI/email; or when no image-generation tool is available. |
| **Mockup-First** (visual alignment before coding) | Draft 2–3 contrasting Direction Cards → generate **orthographic UI mockup images** for the top 2–3 directions → user inspects pixels, iterates if needed, and approves one visual mockup → translate approved mockup to idiomatic code via `pixelcraft-handoff` (`references/image-to-code.md`). | Greenfield flagship products, `Persuade` / `Experience` / `Play` surfaces, high-stakes redesigns, or when the user wants to **see and approve the exact visual look** before spending implementation turns. |

### Capability Check & Graceful Fallback

Before promising **Mockup-First**, verify whether an image-generation tool is available in the current session (e.g., `imagegen`, native image-generation subagent/tool, MCP asset generator, or user-provided mockup workflow):

- **Image tool available:** Run the full Mockup-First protocol below.
- **No image tool available:** Tell the user plainly in one sentence that image generation is unavailable in this environment, and offer either: (a) **Code-First** using Direction Cards + ASCII skeletons (default fallback), or (b) pausing while the user generates/uploads a mockup image using the structured prompt you provide, then resuming directly in `pixelcraft-handoff` (`references/image-to-code.md`). Never pretend to generate an image or fall back silently without noting it.

---

## 2. Converting Direction Cards into High-Craft UI Mockup Prompts

Never prompt an image model with vague mood words ("modern SaaS dashboard, sleek, clean UI"). Image models default straight to Dribbble purple-gradient slop and garbled pseudo-text unless constrained by a strict structural specification.

Build each mockup prompt directly from its **Direction Card + ASCII Structural Skeleton** using the **5-Part Orthographic UI Contract**:

1. **Viewport & Orthographic Framing (Critical for Image-to-Code):**
   - Specify exact surface and aspect ratio: `16:9` (`1440×900` / `1920×1080`) for desktop web/apps, `9:16` (`390×844`) for mobile apps, `4:3` for tablet/editorial.
   - Require **flat, full-bleed orthographic UI capture** filling the entire frame edge-to-edge.
   - Explicitly forbid presentation fluff: *no tilted perspective, no 3D floating device mockups, no hands holding phones, no macOS browser window chrome/URL bars, no drop-shadow backdrop canvas, no watermarks.*
2. **Literal Layout & Grid Geometry:**
   - Translate the ASCII structural skeleton into explicit spatial instructions: fixed sidebar width/position, top header bar, column splits (`12-column grid`, `60/40 asymmetric split`, `3-column bento`), sticky action bar, and exact focal-anchor placement.
3. **Surface, Palette & Typography System:**
   - Name exact palette posture and concrete hex anchors (background surface, raised card surface, primary ink, muted ink, hairline border, single disciplined accent).
   - Specify border radius, hairline stroke weight (`1px solid`), elevation posture (flat / crisp borders / soft ambient shadow), and typography style (clean geometric sans, editorial serif headline + grotesk body, tabular monospace for numbers).
4. **Exact Quoted Real Copy (Anti-Gibberish Anchor):**
   - Wrap **every visible headline, nav link, primary button label, section title, and key numeric value in double quotes `"..."`** using real domain copy from the brief.
   - Keep text blocks concise (headlines, 1-line subheads, short labels, 3–5 list rows) so the image model renders crisp, legible lettering instead of melting long paragraphs into alien glyphs.
5. **Strict Prompt Hygiene (Zero Rejected Concepts):**
   - **Never mention rejected ideas or slop tropes by name inside the positive prompt** if the model tends to leak negated tokens (e.g., avoid writing *"no neon purple blobs"* if it triggers purple blobs; instead describe the exact positive aesthetic: *"matte warm stone `#F6F4EF` background, deep charcoal `#161614` ink, single forest-green `#1E5631` accent, crisp flat surfaces"*).
   - Keep the rejected concepts and anti-references strictly in the separate **Decision Log** outside the image prompt.

### Structured Mockup Prompt Blueprint

```text
Flat orthographic full-bleed [desktop web / iOS mobile / desktop app] UI screen capture,
edge-to-edge interface filling the entire [16:9 / 9:16] frame, no device frame, no browser
chrome, no perspective tilt.

Domain & screen: [concrete product & primary screen, e.g., alpine soil-core field ledger workspace].
Visual posture: [surface hex] background, [raised surface hex] panels with [1px border hex],
[primary ink hex] typography, single accent [accent hex], [radius] corners, crisp high-contrast legibility.

Layout geometry:
- Top bar: left brand mark "[Real Brand]", center nav links "[Link 1]", "[Link 2]", "[Link 3]",
  right primary button "[Real Primary CTA]" in [accent hex].
- Left rail ([240px]): section "[Real Section]" with stacked rows: "[Row 1]", "[Row 2]", "[Row 3]".
- Main stage: headline "[Exact Real Headline]", subhead "[Short Real Subhead]",
  followed by [exact focal component — e.g., structured 4-column data table / interactive specimen panel]
  showing exact labels "[Col A]", "[Col B]", "[Col C]".

Typography: crisp, perfectly legible [type style], sharp alignment, clean vector-style UI icons,
tabular numerals for figures, generous whitespace, zero spelling errors.
```

---

## 3. Multi-Variant Visual Divergence & User Approval `<HARD-GATE>`

1. **Generate 2–3 Materially Different Visual Mockups:**
   - Generate one mockup per top contrasting Direction Card (e.g., **Option A: Pragmatic High-Craft**, **Option B: Editorial / Domain-Object Signature**, and optionally **Option C: Bold Experimental**).
   - Save mockups deterministically when workspace is writable (e.g., `.pixelcraft/mockups/option-a-<slug>.png`, `.pixelcraft/mockups/option-b-<slug>.png`) so provenance is preserved for `pixelcraft-handoff` and `pixelcraft-visual-qa`.
2. **Self-Critique Before Showing the User:**
   - Inspect every generated mockup before presenting it. Discard and regenerate if a mockup collapsed into generic slop (centered hero + 3 generic icon cards, unreadable contrast, fake 3D phone frame, or severely garbled headline text).
3. **Present Visually & Pause at `<HARD-GATE>`:**
   - Show the generated mockups alongside each option's **ambition tier**, **key trade-offs**, **stack/library impact**, and your **`(Recommended)`** pick.
   - Ask the user to:
     - **Approve** one mockup as the visual specification,
     - **Refine** a mockup (1–2 targeted image-edit/regeneration rounds, e.g., *"Option B layout, but light surface and tighter header"*), or
     - **Switch to Code-First** if they want to iterate directly in live code.
   - **Do NOT write implementation code until the user approves the visual mockup** (unless they explicitly asked you to decide and build end-to-end).

---

## 4. Handoff Contract: Approved Mockup → `pixelcraft-handoff` (`image-to-code.md`)

Once the user approves a mockup image:

1. **Record Approval in `.pixelcraft/plan.md`:**
   - Under `Design input intake`, record the approved mockup file path, aspect ratio/breakpoint represented, `classification: specification (approved AI mockup)`, and any intentional overrides requested by the user (e.g., *"keep layout & palette, replace placeholder chart with real Recharts line series"*).
2. **Lock the Direction Card:**
   - Finalize the Direction Card (`references/direction-card.md`) anchored to the approved mockup's exact semantic palette, type scale, signature element, and layout skeleton.
   - If the approved mockup introduces a visual capability needing a richer library or renderer (charts, maps, 3D, Rive, rich editor), update `.pixelcraft/plan.md` via the **Direction → Plan Feedback Loop** before coding.
3. **Route Directly to `pixelcraft-handoff` (`references/image-to-code.md`):**
   - Execute the full 6-stage Image-to-Code pipeline: **Triage & AI-Artifact Stripping → Divide-and-Conquer Layout Tree → Semantic Token & Contrast Extraction → Asset/Icon/Copy De-Hallucination → State/Responsive/A11y Inference → Stack-Idiomatic Synthesis + Vision-Guided Self-Correction Loop** against the approved mockup image.

## Pre-handoff checklist (Mockup-First)

- [ ] Workflow track explicitly set to `Mockup-First` in `.pixelcraft/plan.md` and image-generation capability verified (or clean fallback communicated).
- [ ] 2–3 genuinely distinct orthographic UI mockups generated (flat full-bleed viewport, zero fake device bezels/browser chrome, exact quoted real copy, zero leaked rejected concepts).
- [ ] Generated mockups inspected for slop collapse before presenting to the user.
- [ ] User explicitly approved one mockup (or targeted hybrid/refinement) before Phase 4 Build began.
- [ ] Approved mockup path, region authority, and overrides recorded in `.pixelcraft/plan.md` and handed off directly to `pixelcraft-handoff` (`references/image-to-code.md`).
