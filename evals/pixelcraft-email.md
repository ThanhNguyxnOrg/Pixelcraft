# pixelcraft-email evaluation cases

## Case 1 — receipt email

**Prompt**

> Create a transactional receipt email supporting dark mode and image blocking.

**Expected behaviors**

- Selects or applies `pixelcraft-email` behavior when the prompt matches its trigger.
- uses table/client-safe structure and plaintext parity.
- preserves meaning without images.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- div-only modern CSS.
- white-on-white dark mode.
- image-only receipt.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |

## Case 2 — digest review

**Prompt**

> Review a product digest in MJML.

**Expected behaviors**

- Selects or applies `pixelcraft-email` behavior when the prompt matches its trigger.
- accounts for client quirks/preheader/scannability/accessibility.
- Documents platform constraints, missing states, and verification tradeoffs explicitly.
- Preserves truthful content, necessary states, accessibility, security/privacy constraints, and honest evidence labels.

**Failure signals**

- huge hero template.
- hidden preheader.
- untested Outlook behavior.

**With-vs-without comparison criteria**

| Dimension | Without skill baseline | With skill target |
|---|---|---|
| Trigger/routing | Implements directly with generic assumptions | Recognizes the domain and applies the matching skill/reference |
| Constraint fidelity | Relies on common defaults or stale APIs | Uses the exact surface constraints, state model, and platform idioms in the expected behaviors |
| Verification | Reports code/text output only | Provides appropriate rendered/static/model evidence and labels unavailable checks |
