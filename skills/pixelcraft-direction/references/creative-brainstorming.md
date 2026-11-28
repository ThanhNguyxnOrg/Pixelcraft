# Creative brainstorming & divergence protocol

Use this protocol inside `pixelcraft-direction` whenever visual direction or workspace structure is undecided (greenfield products, new flagship surfaces, major redesigns, or brainstorming sessions). Its goal is to force genuine structural and craft divergence before a single line of UI code is written.

## 1. The 3-Tier Ambition Pitch

Pitch **3 contrasting directions** spanning three ambition tiers—never three color/font reskins of the same layout. Every tier must differ across **IA / interaction structure**, **visual posture**, AND **technical craft ambition**:

| Tier | Intent | Structural & craft posture | Best fit when |
|---|---|---|---|
| **1. Pragmatic High-Craft** | Zero-friction operational clarity with sharp subject-specific polish | Familiar platform-idiomatic IA; disciplined typography, spacing rhythm, and one restrained signature detail; lightweight CSS/native primitives | High-frequency Operate tools, tight timelines, brownfield extensions where predictability outranks spectacle |
| **2. Editorial / Domain-Object Signature** | Memorable identity rooted directly in the real artifact or workflow of the domain | Asymmetric or object-led composition derived from domain material (ledger, instrument panel, folio, specimen index, workbench); distinctive typographic hierarchy + purposeful spatial motion | Flagship consumer apps, developer tools, Persuade/Read surfaces, category-defining redesigns |
| **3. Bold Experimental** | High-conviction, unmistakable interaction model pushing the surface's craft ceiling | Non-template spatial/canvas/timeline/split-instrument architecture; bespoke interactive signature (e.g., authored state-machine motion, interactive specimen manipulation, shader/WebGPU/3D or live publication layout) while keeping the accessibility floor intact | Launches, creative studios, Experience/Play surfaces, or users explicitly asking to stand far apart from competitors |

Every direction must remain **honestly buildable** and **floor-compliant** (accessibility, localization, states, responsiveness). "Experimental" never excuses broken keyboard navigation, illegible contrast, or fake data.

## 2. Ideation Operators (use at least two before sketching)

Do not brainstorm from generic mood words ("minimal", "sleek", "modern"). Apply concrete operators to the real brief and material:

1. **Domain-Object Transfer:** inspect the physical or mental artifact practitioners already trust in this domain (flight strip, oscilloscope, field notebook, mixing console, archival ledger, architectural section cut, botanical plate, dispatch board) and translate its *information structure and controls*—not kitschy skeuomorphism—into the interface.
2. **Constraint Inversion:** identify the #1 annoying convention in this category (e.g., hiding prices behind modals, forcing a 5-step wizard before showing output, burying primary actions in top-right menus) and invert it into the core interaction model.
3. **Anti-Reference Extraction:** name **3 specific tropes** that competitors and default AI outputs fall back on for this prompt (e.g., centered eyebrow+H1+2-CTA hero, 3 tinted-icon feature cards, fake `+24.5%` KPI sparkline banner) and write an explicit structural inversion for each.
4. **Real-Material Anchor:** start from the ugliest or most authentic piece of real data in the brief (a dense table row, a real product photo, a real CLI error output, a real headline/price) and build the first screen around making *that* material unmistakable.

## 3. Structural Proof Before Code

Vague prose collapses back into hero-plus-3-cards the moment coding starts. Every pitched direction MUST include two concrete proofs **before** selection:

1. **Compact ASCII layout skeleton** (desktop + narrow/mobile adaptation note) showing exact region geometry, focal anchor, navigation shape, and where the signature element lives.
2. **Real-copy headline / primary action draft** written in concrete domain language (no lorem ipsum, no `"Supercharge your workflow"`, no `"Get Started"` + `"Learn More"` defaults).

Example structural proof fragment:

```text
+------------------------------------------------------------------+
| [Mark] Field Ledger   Routes | Calibration | Exports    [Cmd+K]  |
+----------------------+-------------------------------------------+
| LIVE INSTRUMENT RAIL |  SPECIMEN 042 — Alpine Soil Core (2,180m) |
| - Core depth: 1.42m  |  [ Interactive depth-profile cross-cut ]  |
| - Moisture: 18.4%    |                                           |
| - Last sync: 09:14   |  [ Log core sample ]   [ Export CSV ]     |
+----------------------+-------------------------------------------+
Mobile (<640px): Top live summary strip + full-width cross-cut + sticky bottom [Log core sample].
```

## 4. Design Approval `<HARD-GATE>`

```text
<HARD-GATE>
On greenfield products, new multi-screen features, or undecided redesigns:
DO NOT write implementation code until the user approves a direction.
</HARD-GATE>
```

Present the top **2–3 contrasting directions** clearly:

1. Show each direction's ambition tier, anti-references inverted, ASCII structural skeleton, real-copy lead draft, signature element, and stack/library impact.
2. On the **Mockup-First** workflow track (when image generation is available; see `references/mockup-first-generation.md`), generate and present **orthographic UI mockup images** for the top 2–3 directions alongside their summaries so the user approves visually before coding, then hand the approved mockup directly to `pixelcraft-handoff` (`image-to-code`). On **Code-First**, proceed from the approved direction card + ASCII skeleton.
3. Mark one pick clearly as **(Recommended)** with evidence-backed trade-offs (never "because it looks cleaner").
4. Ask the user to approve one direction/mockup, request a deliberate hybrid or targeted visual refinement, or redirect.

**Only bypass this `<HARD-GATE>` when:**
- the user explicitly instructs you to decide and build directly without pausing, OR
- the task is in **Direct Execution** (narrow fix, copy tweak, behavior-preserving refactor, or already-approved design).

## 5. Feedback Loop to `pixelcraft-plan`

Creative brainstorming is allowed to challenge an overly timid initial stack. If the approved direction genuinely needs a richer renderer, runtime, or purpose-built library (for example: Rive state-machine motion, Three.js/WebGPU interactive specimen, Typst/WeasyPrint publication PDF, Tauri v2 / SwiftUI / PySide6 native shell, or a dedicated charting/editor engine):

1. Reopen `.pixelcraft/plan.md` **before** entering Phase 4 (Build).
2. Update the stack decision and **Sub-Stack Capability → Purpose-Built Library Gate** with version/license/a11y/fallback verification.
3. Preserve the prior plan entry and record why the approved creative direction triggered the upgrade.
