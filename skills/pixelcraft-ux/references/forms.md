# Forms

Evidence: validation and checkout research, WCAG redundant-entry/accessible-authentication requirements, and input usability guidance.

## Structure

- One persistent visible label per field. Placeholder is never a label because it disappears, harms recall, and is often low contrast.
- Ask only for information needed now. Mark optional fields rather than plastering required markers everywhere when most fields are required.
- Group related choices; order by user mental model, not database schema. Use one column in most task flows.
- Use correct control type: text input vs select vs radio/checkbox/stepper/date picker. Do not force tiny dropdowns for few choices or free text for constrained values.
- Accept forgiving formats; parse and normalize rather than forcing users to match backend storage.
- Preserve entered input after errors, navigation, refresh, authentication expiry, and submission failure.

## Input semantics and mobile adaptation

- Use correct autocomplete/input purpose tokens (`name`, `email`, `tel`, `url`, `postal-code`, payment fields), input types/modes, virtual keyboard layout, capitalization/autocorrect settings, and paste behavior.
- Never block paste in email/password/verification/payment fields. Do not require retyping email or other redundant entry unless a security/legal reason exists.
- Accessible authentication: no cognitive memory test, puzzle, or transcription-only flow; support password managers, paste, passkeys/biometrics/magic links where appropriate.
- Use input masking only when it visibly reduces uncertainty without trapping IMEs/paste/screen readers.
- Verification codes: allow paste/autofill, do not split focus unpredictably, announce errors accessibly, and preserve countdown/resend state.

## Validation timing

| Moment | Use for |
|---|---|
| while typing | format hinting only when non-disruptive; do not show premature errors |
| after field completion/blur | invalid format, availability, mismatch, missing required value |
| on submit | cross-field/server/business-rule validation |
| after correction | clear error promptly; do not require full resubmission to know it fixed |

Do not validate required empty fields aggressively before the user has had a chance to answer. Never disable submit as the only indication of incomplete input; explain missing/invalid fields on attempt.

## Error copy and recovery

Pattern: `<what is wrong>` + `<what was preserved>` + `<how to fix>`.

- Bad: “Invalid input.” Better: “Enter the expiry month as two digits, for example 09. Your other payment details are unchanged.”
- Put messages adjacent to fields and provide an error summary for long/complex forms; moving focus must be deliberate and accessible.
- Use forgiving constraints before validation. A date picker, mask, or autocomplete is often prevention; validation is the fallback.
- Destructive form reset/cancel must distinguish discard from close/back and protect entered work.

## Input-type and autocomplete matrix

Choose semantics before layout:

| Data | Input/control posture | Formatting behavior |
|---|---|---|
| email | email semantics; `email` autocomplete; paste allowed | do not reject valid internationalized/plus-address forms because they look unusual; trim only insignificant outer whitespace |
| telephone | telephone semantics/input mode; `tel` autocomplete | accept grouping punctuation/spaces; normalize internally; never assume one national format without locale scope |
| URL | URL semantics/input mode; paste allowed | accept bare host only if product explicitly supports normalization; explain final normalization |
| postal code | postal-code autocomplete; text input, not number | preserve leading zeroes/spaces/case; validate by selected country/region only when known |
| payment card/expiry/CVC | correct payment autocomplete/input mode; numeric keyboard where appropriate | mask grouping visibly; tolerant spaces; never alter paste ordering or block password-manager/autofill behavior |
| name/address | full granular autocomplete tokens where platform supports them | do not force ASCII-only or given/family-name structure globally; preserve user spelling exactly |
| verification code | one-time-code semantics where supported; single coherent field or controlled segmented behavior | paste/autofill must fill the complete code; do not move focus unpredictably or lose digits during IME/paste |
| date/time/currency/number | constrained picker/stepper/input mode appropriate to locale and precision | parse locale-aware user input where feasible; store exact semantic value separately from display string |

`type=number` is not a substitute for validation. It can reject leading zeros, expose steppers users do not need, and mishandle localized decimal/grouping input. Use text input plus input mode/pattern behavior when identifiers are numeric strings rather than quantities.

## Masking rules

Use input masks only when they reduce uncertainty more than they constrain input:

- show expected grouping, not hidden enforcement;
- preserve cursor position predictably during correction/paste;
- accept unmasked pasted values and normalize them;
- never trap IME composition or screen-reader announcements;
- expose the mask/format in persistent hint text when failure is costly;
- validate the semantic value, not the visual mask;
- provide a plain-text fallback when international variation or assistive input makes the mask unreliable.

Do not use masks for names, free-form addresses, globally variable phone formats, or data whose valid structure is unknown.

## Adaptive validation behavior

Validation timing adapts to correction state:

1. Initial entry: avoid premature required/format errors while the user is still composing.
2. Commit/blur: validate field-level format/completeness when enough input exists to judge.
3. Submit attempt: run cross-field/business/server validation and preserve all input.
4. Correction: revalidate the corrected field promptly; clear resolved errors without requiring full form resubmission.
5. Server rejection: map the failure to the responsible field when possible, keep a summary for complex forms, and explain what was preserved.
6. Async availability/uniqueness: show pending state, stale-response protection, cancellation behavior, and failure-to-verify separately from invalid input.

Do not enable submit but silently ignore clicks, and do not disable submit as the only explanation. On attempted submit, summarize all material missing/invalid fields without overwhelming the user with redundant live announcements.

## Error summary and focus behavior

For long or complex forms:

- place an error summary near the top/result of the submission attempt and field-level messages adjacent to their controls;
- move focus deliberately to the summary or first actionable error according to platform convention; never move focus on every keystroke;
- summary entries link/navigate to the actual controls where supported and preserve scroll/context;
- use wording that identifies the field and correction, not a generic “error occurred”;
- expose summary/status through platform accessibility semantics without repeated live-region noise;
- after correction, remove stale summary entries or explain that revalidation/submission is required.

Focus movement is a context change. Do not use it as a substitute for visible persistent messages.
