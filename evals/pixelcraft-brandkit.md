# pixelcraft-brandkit evaluation cases

## Case 1 — brand world

**Prompt**

> Create a premium identity board for a climate robotics startup.

**Expected behaviors**

- Selects or applies `pixelcraft-brandkit` behavior when the prompt matches its trigger.
- diverges into distinct brand worlds.
- uses specific art direction/material/typographic evidence.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- generic blue gradient tech moodboard.
- logo-only output.
- unexplained image prompts.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — logo QA

**Prompt**

> Evaluate a generated logo system before delivery.

**Expected behaviors**

- Selects or applies `pixelcraft-brandkit` behavior when the prompt matches its trigger.
- tests silhouette/scaling/meaning/trademark risk/visual consistency.
- includes appropriateness, distinctiveness, simplicity, monochrome behavior, mascot/pixel-art constraints when relevant, and rendered 16/32/64 px evidence.
- documents QA evidence.
- records asset naming/versioning, provenance/licensing, clearspace/minimum size, approved/incorrect use, contrast pairs, and ownership before treating generated imagery as final brand assets.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- accepts first image.
-  illegible favicon.
- blurred or misaligned pixel geometry.
- stock icon resemblance.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
