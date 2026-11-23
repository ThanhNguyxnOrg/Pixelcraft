# pixelcraft-tui evaluation cases

## Case 1 — terminal dashboard

**Prompt**

> Build a terminal deployment dashboard with keyboard navigation.

**Expected behaviors**

- Selects or applies `pixelcraft-tui` behavior when the prompt matches its trigger.
- respects terminal width/color/input/focus/log semantics.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- mouse-only assumptions.
- ANSI soup.
- unbounded layout.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — cli review

**Prompt**

> Review a Rich-based interactive CLI.

**Expected behaviors**

- Selects or applies `pixelcraft-tui` behavior when the prompt matches its trigger.
- uses readable hierarchy/progress/help/error behavior appropriate to terminal.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- spinner forever.
- unpasteable output.
- color-only errors.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
