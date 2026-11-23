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

- Read [references/movements.md](references/movements.md) when selecting or translating a design movement/aesthetic.
- Read [references/composition-library.md](references/composition-library.md) when choosing the structural composition/grid or when hero-plus-cards feels like the default answer.
- Read [references/slop-fingerprints.md](references/slop-fingerprints.md) before proposing directions and again before finalizing one.
- Read [references/direction-card.md](references/direction-card.md) whenever writing the committed direction.
- Read [references/direction-scoring.md](references/direction-scoring.md) before comparing or selecting directions.
- Read [references/repetition-history.md](references/repetition-history.md) before generating candidates and when writing the final repetition check.
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
| constraints | platform, input modality, viewport/window, performance, legal, existing tokens/components |
| absence | what is unknown or missing; mark it instead of inventing proof |

Use real material as a constraint. If the subject is absent from the visual concept, the direction is decoration.

## 2. Verbalized-sampling procedure

Generate 3–5 directions. Assign each a rough probability that a conventional model would choose it; do not treat probability as quality. At least one direction must have low conventional probability but high brief fit.

Every pair of directions must differ on at least three axes:

1. composition/grid;
2. typography/voice;
3. color posture;
4. material/texture/depth;
5. motion behavior;
6. imagery/iconography;
7. density/information structure.

Do not create false diversity by changing only hue or font. Reject near-duplicates and regenerate.

A useful distribution is:

- one high-probability baseline, improved and grounded;
- one historically grounded movement translation;
- one subject-derived/wildcard direction;
- optionally one restrained operational direction and one high-expression direction when mode permits.

## 3. Score before choosing

Score each direction 0–4 per criterion. Require evidence, not adjectives.

| Criterion | Question |
|---|---|
| subject fit | does it arise from the actual domain/material? |
| audience/mode fit | does expression match user success and frequency of use? |
| platform transferability | can it survive the target stack and input modality? |
| accessibility/floor risk | can contrast, text scaling, focus, motion safety, and localization be preserved? |
| implementation cost | can it be built honestly within project constraints? |
| distinctiveness | is it meaningfully apart from slop fingerprints and prior project history? |
| coherence | can one system sustain all required states/screens? |

Use the full scorecard in `references/direction-scoring.md`. Include prototypicality, hierarchy clarity, visual complexity, localization risk, implementation cost, and content truth alongside subject fit and distinctiveness. Choose the highest evidence-weighted result unless the user brief changes weights; hard floor/legal/truth failures are disqualifying regardless of total. Log why every losing direction lost; “less pretty” is not a reason.

## 4. Commit to one direction

Write the direction card before implementation. It must specify:

- concept in one sentence tied to subject;
- composition/grid and density posture;
- type roles, voice, script/fallback implications;
- color posture and semantic roles, not just hex values;
- material/texture/depth rules;
- motion purpose, duration/easing posture, reduced-motion equivalent;
- imagery/iconography rules and provenance;
- signature element;
- explicit taboos;
- UX/i18n risks and validation plan.

Spend boldness in one primary place. Everything around the signature element stays disciplined enough for the mode.

## 5. Signature element

Define exactly one memorable element unless the brief is explicitly maximalist. It must be:

- derived from subject or material;
- repeatable without becoming decoration spam;
- implementable in the target rendering surface;
- legible at required sizes and accessible without relying on motion or color alone;
- removable or quiet in dense Operate contexts.

Examples of valid signatures: a measurement scale integrated into navigation for a precision tool; seed-packet botanical plates for a seed archive; terminal scanline cadence for a retro operations console. Invalid signatures: random gradient blob, generic 3D shape, oversized italic word, glass card, animated grid background.

## 6. Repetition history

Use `.pixelcraft/history.json` in the user's project when writable. Never commit it for the user unless asked. The canonical schema, normalization rules, recall procedure, and privacy limits live in `references/repetition-history.md`. Format:

```json
{
  "version": 1,
  "entries": [
    {
      "date": "2026-01-01",
      "surface": "marketing-home",
      "direction": "blueprint-instrument",
      "axes": {
        "composition": "technical-grid",
        "type": "mono-serif-contrast",
        "color": "paper-cobalt-signal-red",
        "material": "flat-print",
        "motion": "measurement-snap",
        "imagery": "annotated-diagram",
        "density": "high"
      },
      "signature": "measurement-scale-navigation",
      "fingerprint": "sha1-or-short-stable-hash-of-axes"
    }
  ]
}
```

Before proposing directions, inspect prior entries. Penalize repeats of the same movement, composition family, color posture, type pairing, signature shape, or copy formula across nearby surfaces. Coherent product screens may share tokens but must not repeat decorative gimmicks.

## 7. Slop scan

Reject or explicitly redesign any direction whose identity depends on a fingerprint in `references/slop-fingerprints.md`, especially:

- cream background + serif display + one orange/terracotta accent;
- Inter/Geist-style neutral sans everywhere without a reason;
- purple-to-blue gradients;
- centered hero, eyebrow, two CTAs, three feature cards;
- emoji as structural icons;
- universal `rounded-2xl` plus soft shadow;
- default glassmorphism;
- generic benefit copy such as “supercharge your workflow”.

A fingerprint may be used only when the user/project already owns it or the brief makes it semantically necessary; record the waiver.

## Output contract

Return the distribution table, scores, selected direction card, repetition check, explicit taboos, and open material gaps. Do not implement until the direction is committed or the user asks for rapid exploration.
