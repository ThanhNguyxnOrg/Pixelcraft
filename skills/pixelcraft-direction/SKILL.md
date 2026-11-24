---
name: pixelcraft-direction
description: Generates distinctive visual direction without template collapse. Use when starting a new UI, redesigning a surface, choosing an aesthetic direction, fighting generic AI-looking design, creating a design concept, or checking repetition against prior builds. Extracts the brief and real material, samples several far-apart directions, scores and commits to one, defines a signature element, maintains .pixelcraft/history.json, and scans for slop fingerprints.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft direction

Divergence is a procedure, not a mood. Never ask for “the best design” in one shot; generate a small distribution of materially different directions, score them against evidence, then commit.

## References

- Read [references/creative-brainstorming.md](references/creative-brainstorming.md) before pitching directions on any greenfield, redesign, or undecided surface (3-Tier Ambition Pitch, Ideation Operators, ASCII structural proof, Design Approval `<HARD-GATE>`, and feedback loop to `pixelcraft-plan`).
- Read [references/movements.md](references/movements.md) when selecting or translating a design movement/aesthetic.
- Read [references/composition-library.md](references/composition-library.md) when choosing the structural composition/grid or when hero-plus-cards feels like the default answer.
- Read [references/slop-fingerprints.md](references/slop-fingerprints.md) before proposing directions and again before finalizing one.
- Read [references/direction-card.md](references/direction-card.md) whenever writing the committed direction.
- Read [references/direction-scoring.md](references/direction-scoring.md) before comparing or selecting directions.
- Read [references/repetition-history.md](references/repetition-history.md) before generating candidates and when writing the final repetition check.
- Read [references/motion-identity.md](references/motion-identity.md) when defining a consistent motion language.
- Read [references/reference-analysis.md](references/reference-analysis.md) when researching visual examples and transferring patterns with provenance and evidence labels.
- Read [references/wildcards.md](references/wildcards.md) when catalog directions feel repetitive, insufficiently subject-derived, or too safe.

## 1. Extract brief and material first

Before ideation, record:

| Field | Required content |
|---|---|
| subject | what the thing actually is, in domain vocabulary |
| audience | who uses/reads it, expertise, locale/language scope, accessibility needs |
| job | primary job-to-be-done and success signal |
| mode | Persuade, Operate, Read, Experience, Play, Communicate, or hybrid |
| material | real copy, data, images, products, brand assets, screenshots, terminology |
| constraints | platform, input modality, viewport/window, performance, legal, existing tokens/components, user anti-goals/hate-list |
| absence | what is unknown or missing; mark it instead of inventing proof |

Use real material as a constraint. If the subject is absent from the visual concept, the direction is decoration.

## 2. Verbalized-sampling & 3-tier creative brainstorming

Generate 3–5 directions using [references/creative-brainstorming.md](references/creative-brainstorming.md) (3-Tier Ambition Pitch + Ideation Operators: Domain-Object Transfer, Constraint Inversion, Anti-Reference Extraction, Real-Material Anchor). Assign each a rough probability that a conventional model would choose it; do not treat probability as quality. At least one direction must have low conventional probability but high brief fit.

Every pair of directions must differ on at least three axes:

1. composition/grid & IA structure;
2. typography/voice;
3. color posture;
4. material/texture/depth;
5. motion behavior;
6. imagery/iconography;
7. density/information structure & technical craft ambition.

Do not create false diversity by changing only hue or font. Reject near-duplicates and regenerate. Every pitched direction MUST include a compact **ASCII structural skeleton** and a **real-copy headline/primary action draft**.

## 3. Score before choosing

Score each direction 0–4 across all 12 criteria defined in `references/direction-scoring.md`. Require concrete evidence notes for **high scores (3–4)** as well as low/uncertain scores (0–2)—never rubber-stamp a favorite template with unsubstantiated 4s.

| Criterion | Question |
|---|---|
| subject fit | does it arise from the actual domain/material? |
| task/mode fit | does expression match user success and frequency of use? |
| prototypicality | does it preserve learned platform/domain recognition where helpful? |
| hierarchy clarity | is the next decision obvious without reading every pixel? |
| visual complexity | does element count, grouping, and density match the mode? |
| accessibility risk | can contrast, text scaling, focus, motion safety, and cognitive load be preserved? |
| localization risk | does the layout/type system survive expansion, RTL, and script shaping? |
| platform transfer | can it be idiomatic in the target stack and input modality? |
| implementation cost | can it be built honestly within project constraints and timeline? |
| distinctiveness | is it meaningfully apart from slop fingerprints and prior project history? |
| content truth | is every claim, metric, copy block, and visual backed by real provenance? |
| coherence | can one system sustain all required states, modes, and screens? |

Apply mode weights from `references/direction-scoring.md`. Hard floor/legal/truth failures are disqualifying regardless of total. Log why every losing direction lost using criterion names; “less pretty” is not a reason.

## 4. Design Approval `<HARD-GATE>` & commit to one direction

On **greenfield products, new multi-screen features, or undecided redesigns**, present the top 2–3 contrasting directions—each with its ambition tier, ASCII structural skeleton, real-copy lead draft, signature element, and stack/library impact, leading with your `(Recommended)` choice—and **wait for explicit user approval before entering Build**. Only bypass this `<HARD-GATE>` when the user explicitly tells you to decide and build directly, or when an already-approved design fixes the direction.

If the approved direction requires upgrading the renderer, runtime, or library (e.g., Rive, WebGPU, Typst, Tauri, or native desktop/mobile), reopen and update `.pixelcraft/plan.md` via `pixelcraft-plan` before coding.

Write the committed direction card (`references/direction-card.md`) including: concept, ASCII structural skeleton, real-copy lead draft, composition/grid, type roles & script fallback, color posture/semantic roles, material/depth rules, motion + reduced-motion equivalent, imagery/icon provenance, one subject-derived signature element, explicit taboos, and floor validation plan. Spend boldness in one primary place; keep everything around the signature disciplined for the mode.

## 5. Signature element

Define exactly one memorable element unless the brief is explicitly maximalist. It must be derived from subject or material, repeatable without decoration spam, implementable in the target surface, legible/accessible without relying on motion or color alone, and quiet/removable in dense Operate contexts. Valid: measurement-scale nav for a precision instrument; botanical plate index for a seed archive. Invalid: random gradient blob, generic 3D shape, oversized italic word, glass card, animated grid background.

## 6. Repetition history

Use `.pixelcraft/history.json` in the user's project when writable. Never commit it for the user unless asked. The canonical schema, normalization rules, recall procedure, and privacy limits live in `references/repetition-history.md`. Before proposing directions, inspect prior entries and penalize repeats of the same movement, composition family, color posture, type pairing, signature shape, or copy formula across unrelated surfaces.

## 7. Slop scan

Reject or explicitly redesign any direction whose identity depends on a fingerprint in `references/slop-fingerprints.md`—including cream+serif+terracotta neo-slop, Inter/Geist-only defaults, indigo-purple-pink mesh gradients, border-beam cards, centered eyebrow+H1+2-CTA hero + 3 tinted-`40×40`-icon cards, pulsing `animate-ping` status pills, fake sparklines/`+24.5%` KPI deltas, emoji-as-icons, default shadcn zinc skins, generic AI marketing clichés (`next-gen`, `effortless`, `empower`, `streamline`, `reimagine`, `unleash`, `supercharge`), or implementation laziness stubs. A fingerprint may be used only when the user/project already owns it or the brief makes it semantically necessary; record the waiver.

## Iron Laws & Rationalization Table

- **IRON LAW 1:** Never pitch 3 color/font swaps of the same wireframe; every option must differ on IA/structure, visual posture, and craft ambition—proven by an ASCII skeleton and real-copy lead draft.
- **IRON LAW 2:** Never enter Build on undecided greenfield or redesign scope without passing the **Design Approval `<HARD-GATE>`** (unless explicitly instructed to decide and build directly).
- **IRON LAW 3:** Never assign a 3 or 4 score without citing concrete structural/material evidence.

| Agent rationalization | Reality & required action |
|---|---|
| "I'll pick one strong direction myself and start coding to save time." | Unapproved guesses waste implementation work and collapse to model defaults. Pitch 2–3 contrasting directions with ASCII skeletons and get sign-off first. |
| "I described the layout in prose; an ASCII skeleton is overkill." | Prose lets implementation quietly revert to hero+3-cards. Draw the ASCII skeleton and real-copy lead before committing. |
| "All three directions use the same layout, just light/dark/accent swaps." | Color swaps are not divergence. Apply Domain-Object Transfer, Constraint Inversion, and Anti-Reference Extraction to change structure. |
| "This direction fits best, so I'll give it straight 4s." | Unsubstantiated 4s mask bias and floor risks. Cite concrete evidence for every 3–4 score and every 0–2 risk. |

## Pre-submit checklist

- [ ] Real brief material, user anti-goals/hate-list, and missing provenance inventoried before ideation.
- [ ] 3–5 genuinely divergent directions generated across the 3-Tier Ambition Pitch using at least two Ideation Operators (not hue/font swaps).
- [ ] Every pitched direction includes a compact **ASCII structural skeleton** and **real-copy headline/primary action draft**.
- [ ] All 12 criteria scored with concrete evidence notes for **high scores (3–4)** as well as low/uncertain scores (0–2); losing directions logged by criterion name.
- [ ] `.pixelcraft/history.json` checked and `references/slop-fingerprints.md` cleared (or user brand waiver recorded).
- [ ] **Design Approval `<HARD-GATE>`** satisfied (or explicit user bypass recorded) and `.pixelcraft/plan.md` updated if the winning concept upgrades the stack/renderer.
- [ ] Committed direction card complete with one subject-derived signature element and explicit taboos.
