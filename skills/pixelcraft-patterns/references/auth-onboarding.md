# Auth, onboarding, and account

Auth is a trust boundary. Optimize for reliable completion, secure recovery, and zero lockouts rather than branding theater. Platform-specific WebAuthn/browser credential APIs belong in `pixelcraft-web` (and native autofill/passkey APIs in `pixelcraft-mobile` / `pixelcraft-desktop`); this reference defines the surface-independent UX contract.

## Sign-in, passkeys, OTP, and enterprise SSO

- **Identifier-first & SSO domain discovery**: Ask for email/username first when enterprise SSO exists; automatically route managed domains to the organization's IdP ("Continue with Okta SSO") while preserving a documented break-glass recovery path for org owners if the IdP is down.
- **Passkeys / WebAuthn UX**: Offer passkeys as a low-friction primary or autofill-assisted option alongside a clear fallback (magic link, TOTP, password, or cross-device QR) when a user switches devices or cancels the OS prompt. In security settings, label registered passkeys by device/provider and last-used date, and forbid deleting the last auth method without a backup.
- **OTP & magic links**: Accept paste of the full code into the first input (and support platform one-time-code autofill), show a live resend cooldown timer rather than a silent dead button, explain when a magic link opens in a different browser/device, and provide one-click resend on expired or already-consumed links.
- **Passwords & error safety**: Use persistent labels, standard autofill hints, full paste support, show-password toggle, and upfront strength rules. Respect anti-enumeration policy on login/reset responses ("If an account exists for this email…") and distinguish temporary rate-limit cooldowns from invalid credentials.

## Progressive onboarding and workspace setup

- Teach the next concrete value-delivering action instead of locking users into an unskippable carousel tour.
- Ask only for fields needed immediately (workspace name, role/goal if it materially tailors setup); defer optional team invites and billing details.
- Provide a **progressive onboarding checklist** tied to real completed state (dismissible at any time, resumable across sessions, with honest progress counts).
- Mark any seeded sample/demo workspace content visibly and include a one-action "Clear sample data" control.

## Account lifecycle

Cover profile edits, email change verification, active sessions/devices with remote sign-out, MFA enrollment and downloadable recovery codes (confirming user saved them), workspace switching, pending invitations with expiry, account export, and deletion with consequence-specific friction and grace periods.

## State matrix

| State | Required behavior |
|---|---|
| Passkey prompt dismissed/unsupported | Return cleanly to fallback sign-in options without alarming error copy |
| Expired/replayed magic link or OTP | Explain expiry plainly and offer one-click new code/link with preserved email |
| Enterprise SSO misconfigured/unavailable | Identify IdP failure vs wrong password; surface admin contact or break-glass path |
| Rate-limited / locked out | Display truthful retry window and alternative recovery options |
| Interrupted onboarding | Resume at the last incomplete step on next sign-in without losing saved workspace config |

## Do/don't pairs

| Do | Don't |
|---|---|
| Allow pasting full 6-digit OTPs into any digit slot | Force users to type one digit per box and block paste |
| Email-first SSO discovery with visible IdP redirect state | Hide SSO behind a tiny link while showing invalid password errors |
| Dismissible onboarding checklist linked to real product tasks | Unskippable 7-step tooltip tour blocking the workspace |
| Label passkeys by device + creation/last-used date | Show opaque credential IDs users cannot safely revoke |

## Verification

Test password managers, passkey cancel/fallback, OTP paste and resend timers, SSO domain routing, expired/replayed links, rate-limit messaging, interrupted onboarding resume, IME/RTL, long email addresses, duplicate submit prevention, assistive technology announcements, and legal/locale consent handling.
