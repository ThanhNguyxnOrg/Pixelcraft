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
