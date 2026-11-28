# Forms

Evidence: validation and checkout research, WCAG redundant-entry/accessible-authentication requirements, and input usability guidance.

## Structure

- One persistent visible label per field. Placeholder is never a label because it disappears, harms recall, and is often low contrast.
- Ask only for information needed now. **Explicitly mark BOTH required (`*`) AND optional (`(optional)`) fields**—marking only one side still causes ~32% of users to miss required fields. Pair visual `*` markers with programmatic required semantics (e.g., `required` / `aria-required="true"` on web or platform equivalents) and define `*` when used.
- **Hide uncommon optional inputs behind expandable inline disclosure links**: collapse rarely used fields (`Address Line 2`, `Company`, `Order note`, `Promo code`) behind clear toggles (e.g., `+ Add apartment, suite, or floor`, `+ Add company name`) rather than cluttering default scan flow; expand inline while preserving entered values.
- **Explain WHY a phone number is required inline—or remove/make it optional**: ~68% of users hesitate to share a phone number without clear justification. Omit the field if not operationally needed, mark it `(optional)` when non-essential, or add a one-line inline reason right beside/below the label (e.g., “Used only by the courier for delivery updates”). Apply the same inline justification to date of birth or government ID.
- **Checkbox and choice-group ergonomics**:
  - Place checkboxes to the **inline-start (left in LTR)** of their labels—never right-aligned far from the label (critical for screen-magnifier users who otherwise miss the box or misread pairing).
  - Never pre-check consent, marketing, or optional add-on checkboxes.
  - Include an explicit `"Select all that apply"` hint on multi-select checkbox groups whenever multiple answers are allowed.
  - **Prefer radio buttons (or segmented controls) over dropdown menus** (e.g., web `<select>` or native pickers) for **2–3 static options** so every option is scannable in one glance without an extra tap or click.
- On mobile, avoid detouring users onto separate subpages mid-form (e.g., separate address/coupon pages that risk losing scroll or input state); use inline disclosure or a single-step bottom sheet that preserves all entered fields.
- Group related choices; order by user mental model, not database schema. Use one column in most task flows.
- Use the right semantic control (text input, radio, checkbox, stepper, date picker, select) rather than forcing free text for constrained values.
- Accept forgiving formats; parse and normalize rather than forcing users to match backend storage.
- Preserve entered input after errors, navigation, refresh, authentication expiry, and submission failure.

## Input semantics and mobile adaptation

- Use correct autocomplete/input purpose tokens (web examples: `name`, `email`, `tel`, `url`, `postal-code`, payment fields, and `autocomplete="username webauthn"` for passkey conditional UI; or native content-type/autofill equivalents), input types/modes, virtual keyboard layout, `enterkeyhint` (`search`, `send`, `next`, `done`, `go`), capitalization/autocorrect settings, and paste behavior.
- **Trim accidental leading and trailing spaces** introduced by IMEs, mobile autocorrect, or clipboard paste before validation and submission so `" user@example.com "` does not fail erroneously.
- **Disable spellcheck on non-prose identifiers**: turn off spellcheck/autocorrect on email addresses, usernames, verification codes, API keys, URLs, and postal codes (e.g., `spellcheck="false"` on web; `.autocorrectionDisabled()` on SwiftUI; `InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS` on Android).
- **Never silently block keystrokes in numeric or formatted fields**: allow typing and pasting freely, then show clear inline guidance if invalid characters remain. Silently swallowing keys looks like a broken keyboard and breaks IME/assistive input.
- **No `autofocus` on touch/mobile devices**: auto-focusing an input on load pops the virtual keyboard over half the viewport, hides page headings/context, and disorients screen-reader users (reserve auto-focus for dedicated desktop-only single-task dialogs or command palettes).
- Never block paste in email/password/verification/payment fields. Do not require retyping email or other redundant entry unless a security/legal reason exists.
- Accessible authentication: no cognitive memory test, puzzle, or transcription-only flow; support password managers, paste, passkeys/biometrics (web `autocomplete="webauthn"` conditional mediation plus an explicit "Sign in with passkey" button, or platform passkey APIs), and magic links where appropriate.
- Use input masking only when it visibly reduces uncertainty without trapping IMEs/paste/screen readers.
- Verification codes: allow paste/autofill, do not split focus unpredictably, announce errors accessibly, and preserve countdown/resend state.

## Validation timing

| Moment | Use for |
|---|---|
| while typing | format hinting only when non-disruptive; do not show premature errors |
| after field completion/blur | invalid format, availability, mismatch, missing required value |
| on submit | cross-field/server/business-rule validation |
| after correction | clear error promptly; do not require full resubmission to know it fixed |

Do not validate required empty fields aggressively before the user has had a chance to answer. **Never pre-disable Submit before click**: keep Submit clickable so activation runs validation, displays clear field errors/summary, and focuses the error summary or first invalid field. **Never attach hover tooltips to `disabled` buttons** (native disabled controls suppress pointer/focus events and disappear from keyboard tab order)—keep the control focusable with semantic disabled state (e.g., `aria-disabled="true"` on web) plus accessible description, or show the unlock requirement persistently inline.

## Error copy and recovery

Pattern: `<exact failure cause>` + `<what was preserved>` + `<how to fix>`.

Use **adaptive validation error messages** tailored to the exact failure cause rather than collapsing every failure into `"Invalid input"`:

| Input failure | Generic (avoid) | Adaptive cause-specific message (use) |
|---|---|---|
| Email missing `@` | “Invalid email.” | “Add an `@` symbol to your email address (for example, `name@domain.com`).” |
| Email invalid domain | “Invalid email.” | “Check the domain after `@`—`gmial` looks incomplete or misspelled.” |
| Email already registered | “Invalid email.” | “An account with `name@domain.com` already exists. Sign in or reset your password.” |
| Card expiry malformed | “Invalid input.” | “Enter the expiry month as two digits, for example `09`. Your other payment details are unchanged.” |
| Numeric field has letters | *(silently blocks keys)* | “Enter digits only for routing number (9 digits). Your other entries are preserved.” |

- Put messages adjacent to fields and provide an error summary for long/complex forms; moving focus must be deliberate and accessible.
- Use forgiving constraints before validation. A date picker, mask, or autocomplete is often prevention; validation is the fallback.
- Destructive form reset/cancel must distinguish discard from close/back and protect entered work.

## Input-type and autocomplete matrix

Choose semantics before layout (HTML attributes below are web examples; map to platform equivalents on native/desktop):

| Data | Input/control posture | Formatting behavior |
|---|---|---|
| email | email semantics; `autocomplete="email"`; `spellcheck="false"`; `enterkeyhint="next"` or `"done"`; paste allowed | do not reject valid internationalized/plus-address forms because they look unusual; trim accidental outer whitespace |
| sign-in username / passkey | `autocomplete="username webauthn"` for conditional passkey autofill + explicit passkey button fallback; `spellcheck="false"` | support password managers and WebAuthn conditional mediation without hiding fallback auth |
| search / chat composer | `type="search"` + `enterkeyhint="search"` (or `enterkeyhint="send"` for chat input) | match mobile virtual keyboard action key to actual submit/next behavior |
| telephone | telephone semantics/input mode; `tel` autocomplete; inline reason why required (or mark `(optional)`) | accept grouping punctuation/spaces; normalize internally; never assume one national format without locale scope |
| URL / API key / code | URL or text semantics; `spellcheck="false"`; paste allowed | trim outer whitespace; accept bare host only if product explicitly supports normalization; explain final normalization |
| postal code | postal-code autocomplete; text input, not number; `spellcheck="false"` | preserve leading zeroes/spaces/case; trim outer whitespace; validate by selected country/region only when known |
| payment card/expiry/CVC | correct payment autocomplete/input mode; numeric keyboard where appropriate | mask grouping visibly; tolerant spaces; never alter paste ordering, silently drop keys, or block password-manager/autofill behavior |
| name/address | full granular autocomplete tokens where platform supports them; collapse uncommon optional lines (`Address Line 2`, `Company`) behind disclosure links | do not force ASCII-only or given/family-name structure globally; preserve user spelling exactly |
| verification code | one-time-code semantics where supported; `spellcheck="false"`; single coherent field or controlled segmented behavior | paste/autofill must fill the complete code; trim outer whitespace; do not move focus unpredictably or lose digits during IME/paste |
| date/time/currency/number | constrained picker/stepper/input mode appropriate to locale and precision | allow typing + inline guidance rather than silent key blocking; parse locale-aware input; store exact semantic value separately from display string |

`type=number` (web) is not a substitute for validation. It can reject leading zeros, expose steppers users do not need, and mishandle localized decimal/grouping input. Use text input plus input mode/pattern behavior when identifiers are numeric strings rather than quantities.

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

Validation timing and messaging adapt to both entry stage and specific failure cause:

1. Initial entry: avoid premature required/format errors while the user is still composing.
2. Commit/blur: trim accidental outer whitespace and validate field-level format/completeness with cause-specific guidance when enough input exists to judge.
3. Submit attempt: never pre-disable Submit; allow click → run cross-field/business/server validation → preserve all input → focus error summary or first invalid field.
4. Correction: revalidate the corrected field promptly; clear resolved errors without requiring full form resubmission.
5. Server rejection: map the failure to the responsible field with the specific cause (e.g., already registered vs expired token), keep a summary for complex forms, and explain what was preserved.
6. Async availability/uniqueness: show pending state, stale-response protection, cancellation behavior, and failure-to-verify separately from invalid input.

Do not enable submit and silently ignore clicks, and do not pre-disable submit before attempt. On attempted submit, summarize all material missing/invalid fields without overwhelming the user with redundant live announcements.

## Error summary and focus behavior

For long or complex forms:

- place an error summary near the top/result of the submission attempt and field-level messages adjacent to their controls;
- move focus deliberately to the summary or first actionable error according to platform convention; never move focus on every keystroke;
- summary entries link/navigate to the actual controls where supported and preserve scroll/context;
- use wording that identifies the field and correction, not a generic “error occurred”;
- expose summary/status through platform accessibility semantics without repeated live-region noise;
- after correction, remove stale summary entries or explain that revalidation/submission is required.

Focus movement is a context change. Do not use it as a substitute for visible persistent messages.

## Cross-platform IME composition guard & `Unicode NFC` normalization

Single-line search bars, chat/comment composers, tag inputs, inline cell editors, and dialogs that bind `Enter` (submit/send) or `Escape` (cancel/close) **must check active IME composition first**. Otherwise users typing Vietnamese Telex/VNI, Japanese Kana→Kanji, Korean Hangul, or Chinese Pinyin accidentally send half-composed messages or dismiss dialogs when committing/canceling IME candidates:

| Platform | Guard condition before treating `Enter` as submit or `Escape` as cancel/dismiss |
|---|---|
| **Web DOM** | `if (event.isComposing || event.keyCode === 229) return;` inside `keydown` (never bind submit to `keyup`) |
| **iOS UIKit / SwiftUI** | `guard textField.markedTextRange == nil else { return true }` (`UITextInput` marked text active) |
| **Android Views / Compose** | Views: `BaseInputConnection.getComposingSpanStart(editable) != -1`; Compose: `if (value.composition != null) return@onPreviewKeyEvent false` |
| **macOS AppKit / Qt / Desktop** | AppKit: `client.hasMarkedText()`; Qt: track active `QInputMethodEvent` preedit (`!preedit.isEmpty()`) before accepting `Qt::Key_Return` / `Qt::Key_Escape` |

Idiomatic multi-platform guards:

```js
// Web DOM: chat composer / search input / inline edit
input.addEventListener('keydown', (event) => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submitNormalized(input.value.normalize('NFC'));
  }
});
```

```swift
// iOS UIKit / SwiftUI UITextInput bridge: ignore Return while marked IME text is active
func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    guard textField.markedTextRange == nil else { return false }
    submit((textField.text ?? "").precomposedStringWithCanonicalMapping)
    return true
}
```

```kotlin
// Jetpack Compose: guard hardware Enter while IME composition span is active
OutlinedTextField(
    value = fieldValue,
    onValueChange = { fieldValue = it },
    modifier = Modifier.onPreviewKeyEvent { event ->
        if (event.type == KeyEventType.KeyDown && event.key == Key.Enter && !event.isShiftPressed) {
            if (fieldValue.composition != null) return@onPreviewKeyEvent false
            onSubmit(Normalizer.normalize(fieldValue.text, Normalizer.Form.NFC))
            true
        } else false
    }
)
```

Normalize submitted and validated text to **`Unicode NFC`** before length checks, regex rules, deduplication, or persistence so pasted `NFD` strings (such as macOS filenames or Vietnamese names like `"Nguyễn"`) never fail validation or create duplicate records.
