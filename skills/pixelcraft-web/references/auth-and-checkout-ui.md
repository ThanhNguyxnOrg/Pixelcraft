# Passkeys, WebAuthn, OTP, and checkout UI patterns

This reference covers **frontend UI/UX engineering** for authentication and payment flows—never backend cryptography or PCI storage. Broken autofill, blocked password managers, missing passkey conditional UI, and confusing checkout error recovery are among the highest-impact conversion and accessibility failures in web products.

## Passkeys & WebAuthn Conditional UI (W3C WebAuthn)

- **Conditional UI (`autocomplete="username webauthn"`)**: do not force every returning user through a separate modal button when passkey autofill is available. Feature-detect `PublicKeyCredential.isConditionalMediationAvailable()`, start `navigator.credentials.get({ publicKey, mediation: 'conditional', signal: controller.signal })` on page load, and always abort the pending request via `AbortController` if the user switches to another sign-in method (magic link, OAuth, password submit).
- **Password manager compatibility (WCAG 3.3.8 Accessible Authentication)**: never block paste (`onPaste={e => e.preventDefault()}`) on password or OTP inputs, and always use standard HTML `autocomplete` tokens (`username`, `current-password`, `new-password`, `one-time-code`).

```html
<label for="email">Work email</label>
<input id="email" name="email" type="email" autocomplete="username webauthn" required />

<label for="pw">Password</label>
<input id="pw" name="pw" type="password" autocomplete="current-password" required />
```

```ts
const controller = new AbortController();

if (window.PublicKeyCredential?.isConditionalMediationAvailable) {
  if (await PublicKeyCredential.isConditionalMediationAvailable()) {
    try {
      const cred = await navigator.credentials.get({
        publicKey: serverChallengeOptions,
        mediation: 'conditional',
        signal: controller.signal,
      });
      await verifyAssertion(cred);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err);
    }
  }
}
```

## OTP, magic links, and MFA UI

- **One-time code (`one-time-code`)**: support pasting the full 6-digit code into either a single `inputmode="numeric" autocomplete="one-time-code"` field (preferred for screen readers and mobile SMS autofill) or segmented boxes that distribute pasted characters cleanly and allow `Backspace` across boxes.
- **Resend & expiry**: show an explicit countdown before re-enabling "Resend code", preserve the entered email address on error, and allow editing the email without restarting the entire flow.

## Checkout, billing, and payment UI

- **PCI isolation (Stripe Elements / Payment Element / Express Checkout)**: never mount raw `<input>` card-number fields inside your own app bundle when a hosted PCI-compliant iframe element (e.g., Stripe Payment Element, Adyen Drop-in, Braintree) is available; pass your semantic theme tokens into the provider's appearance API so visual craft stays coherent without touching raw PANs.
- **Express wallets & Payment Request**: surface Apple Pay / Google Pay / Link only when capability-detected on the current device/browser; never render broken wallet buttons on unsupported platforms.
- **Idempotent submit & failure recovery**: lock the Pay button with an explicit pending state (`aria-busy="true"`, clear amount shown on button: `"Pay $49.00"`), keep all billing/shipping fields intact if a card declines, and focus the decline message with actionable recovery ("Try another card" / "Check postal code").

## Do/don't pairs

| Do | Don't |
|---|---|
| Pair `autocomplete="username webauthn"` with `mediation: "conditional"` + `AbortController` | Force a disruptive modal WebAuthn prompt on page load before user interaction |
| Allow paste and password managers on password & OTP fields (WCAG 3.3.8) | Disable paste on password/confirm-password/OTP inputs |
| Use hosted PCI Elements (`Stripe Payment Element`) themed with semantic tokens | Collect raw credit card numbers in custom uncontrolled React inputs |
| Preserve shipping/billing inputs and show exact charge amount on the Pay CTA | Wipe checkout fields on card decline or use vague "Submit" labels |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify password-manager autofill attributes (`static`), and test virtual authenticator WebAuthn conditional UI, OTP paste, and card-decline input preservation in a real browser (`rendered`).
