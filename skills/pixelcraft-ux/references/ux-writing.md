# UX writing

Evidence: empty-state/form guidance, concise copy practice, and mode-specific expression budgets.

## Rules

- Write for the user's goal, not the system's implementation. Prefer concrete domain nouns and verbs.
- Buttons are verbs or verb phrases that state consequence: “Save invoice”, “Invite member”, “Resume upload”. Avoid vague “Submit/OK/Next” when the consequence is knowable.
- Link text describes destination/action without bare “click here”; match surrounding reading flow.
- Use consistent action vocabulary across surfaces. Do not alternate delete/remove/archive or sign in/log in casually.
- Headings state the object or decision, not generic “Information”/“Details” when specificity is possible.
- Front-load distinguishing words for scanning and truncation.
- Do not blame users, expose internal exception text, or use fake warmth in high-stakes errors.
- **Destructive CTA rule (`Verb + Noun`):** every destructive trigger or confirmation button MUST pair an explicit verb with the exact target noun (`Delete project`, `Remove member`, `Cancel subscription`, `Revoke API key`)—**NEVER** bare `Confirm`, `OK`, `Yes`, or an unqualified single verb (`Delete`, `Remove`, `Cancel`) where the affected object is ambiguous. Pair it with a neutral, unambiguous safe escape (`Keep subscription`, `Go back`).
- **Zero confirmshaming copy:** never use guilt, sarcasm, or self-deprecation on decline or dismissal actions (never `"No thanks, I prefer losing money"` or `"I hate saving time"`). Keep decline labels neutral and factual (`"No thanks"`, `"Keep free plan"`, `"Continue without updates"`).
- **Above-the-fold clarity (`What you do · Who it's for · Why it matters`):** on entry, onboarding, and landing surfaces, state in plain language before the first scroll **what the product does**, **who it is for**, and **why it matters (concrete user outcome)**.
- **Ban 2025–2026 AI marketing copy clichés:** never write `supercharge`, `elevate`, `revolutionize`, `unlock`, `seamless`, `cutting-edge`, `next-gen`, `effortless`, `empower`, `streamline`, `all-in-one`, `reimagine`, `unleash`, `AI-powered`, `built for modern teams`, `delve`, `transform your`, or vague `"Get started"` / `"Learn more"` filler when a concrete domain outcome or action is knowable. Replace every buzzword with the verifiable user action, time/data unit, or domain object (e.g., `"Diff two Parquet schemas in 300ms"` instead of `"Effortlessly streamline your next-gen data workflow"`).

| Copy category | Do | Don't |
|---|---|---|
| Destructive confirmation CTA | `Delete project`, `Remove member`, `Cancel subscription` | `Confirm`, `OK`, `Yes`, bare `Delete` |
| Decline / dismiss action | `No thanks`, `Keep free plan`, `Not now` | `No thanks, I prefer losing money`, `Stay behind` |
| Above-the-fold entry copy | `Diff two Parquet schemas in 300ms — for data engineers catching breaking pipeline changes before deploy` | `Supercharge your next-gen workflow with effortless synergy` |

## Error pattern

`<what happened>` + `<what is preserved/unchanged>` + `<how to recover>`.

Do/don't:

- Do: “We couldn't upload `budget.pdf`; no file was added. Check your connection and retry.”
- Don't: “Oops! Something went wrong.”
- Do: “Enter expiry as MM/YY.”
- Don't: “Invalid input.”

## Empty states

- First-use: explain value and provide primary create/import/connect/sample action.
- No-results: reflect active query/filter and provide clear/broaden/search alternatives.
- Cleared/permission/offline: state cause and recovery. Do not use cheerful illustration to mask data loss.
- Keep empty states operational in Operate mode; decorative illustration must not consume primary space.

## Tone by mode

| Mode | Tone posture |
|---|---|
| Persuade | confident, concrete, evidence-backed |
| Operate | terse, predictable, low emotional noise |
| Read | clear editorial voice, minimal interruption |
| Experience/Play | expressive but subordinate to orientation/legibility |
| Communicate | direct and robust when images/fonts fail |

Microcopy is interface structure. Review strings at real lengths, plural forms, RTL/mixed bidi, truncation, screen-reader order, and error/offline states.
