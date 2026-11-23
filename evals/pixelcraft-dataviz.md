# pixelcraft-dataviz evaluation cases

## Case 1 — metric choice

**Prompt**

> Visualize subscription churn by cohort for an executive dashboard.

**Expected behaviors**

- Selects or applies `pixelcraft-dataviz` behavior when the prompt matches its trigger.
- chooses encoding from analytical question.
- direct-labels and preserves truthful scale.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- pie/donut misuse.
- dual axis confusion.
- legend-dependent decoding.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — map dashboard

**Prompt**

> Build a real-time outage map with drill-down.

**Expected behaviors**

- Selects or applies `pixelcraft-dataviz` behavior when the prompt matches its trigger.
- normalizes geospatial data and separates live/stale/failure states.
- chooses rendering layer by scale.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- raw-count choropleth.
- color-only status.
- unbounded stream rendering.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
