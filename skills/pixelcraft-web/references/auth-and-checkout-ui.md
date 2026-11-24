# Auth, Passkeys (WebAuthn), OTP, and checkout UI patterns

This reference covers **frontend UI/UX engineering** for authentication and payment flows—never backend cryptography or PCI storage. Broken autofill, blocked password managers, missing passkey conditional UI, and confusing checkout error recovery are among the highest-impact conversion and accessibility failures in web products.

## Auth & billing UI integration matrix

| Category | Platforms / SDKs | Frontend UI integration rule |
|---|---|---|
| **Auth SDKs & hosted UI** | **Better Auth** (self-hosted TS, passkey/2FA/org plugins), **Clerk** (embeddable `<SignIn>`/`<UserButton>`), **Auth.js (NextAuth v5)**, **Supabase Auth** (`@supabase/ssr`) | Map semantic design tokens into hosted component appearance props (e.g., Clerk `appearance.variables`); for custom forms (Better Auth / Auth.js / Supabase), preserve input on error, enforce `autocomplete` tokens, and keep OAuth/PKCE redirect errors recoverable with a clear retry link |
| **Direct payment gateways** | **Stripe Payment Element**, **Stripe Embedded Checkout**, Adyen Drop-in, Braintree | Use **Stripe Embedded Checkout** (`<EmbeddedCheckoutProvider>` / `stripe.initEmbeddedCheckout`) for full turnkey hosted checkout inside your route, or **Payment Element** (`appearance.variables`) for custom checkout layouts—never render raw card `<input>`s in app code |
| **Merchant of Record (MoR)** | **Polar**, **Paddle** (`Paddle.Checkout.open`), **Lemon Squeezy** | Prefer MoR overlay/inline checkouts + customer portals when global VAT/GST/sales-tax compliance and invoicing are out of scope; always show clear post-checkout confirmation/polling states while webhooks settle |

## Passkeys & WebAuthn Level 3 Conditional UI

- **Feature detection**: prefer WebAuthn Level 3 **`await PublicKeyCredential.getClientCapabilities()`** (checking `caps.conditionalGet`, `caps.userVerifyingPlatformAuthenticator`, `caps.hybridTransport`) with fallback to `PublicKeyCredential.isConditionalMediationAvailable()`.
- **JSON parsing without manual Base64URL glue**: use **`PublicKeyCredential.parseRequestOptionsFromJSON(serverJson)`** (and `parseCreationOptionsFromJSON` for registration + `credential.toJSON()` for submission) instead of hand-rolled `Uint8Array` / Base64URL converters where supported (feature-detect or use `@simplewebauthn/browser` for older browsers).
- **Conditional UI (`autocomplete="username webauthn"`)**: start `navigator.credentials.get({ publicKey, mediation: 'conditional', signal: controller.signal })` on page load and always abort via `AbortController` if the user picks password/OAuth/magic link instead.
- **Password manager compatibility (WCAG 3.3.8 Accessible Authentication)**: never block paste (`onPaste={e => e.preventDefault()}`) on password or OTP inputs, and always use standard HTML `autocomplete` tokens (`username`, `current-password`, `new-password`, `one-time-code`).

```html
<label for="email">Work email</label>
<input id="email" name="email" type="email" autocomplete="username webauthn" required />

<label for="pw">Password</label>
<input id="pw" name="pw" type="password" autocomplete="current-password" required />
```

```ts
const controller = new AbortController();

async function supportsConditionalPasskeys(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  if ('getClientCapabilities' in PublicKeyCredential) {
    const caps = await PublicKeyCredential.getClientCapabilities();
    return Boolean(caps.conditionalGet);
  }
  return Boolean(await PublicKeyCredential.isConditionalMediationAvailable?.());
}

if (await supportsConditionalPasskeys()) {
  try {
    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(serverChallengeJson);
    const cred = (await navigator.credentials.get({
      publicKey,
      mediation: 'conditional',
      signal: controller.signal,
    })) as PublicKeyCredential | null;
    if (cred) await verifyAssertion(cred.toJSON());
  } catch (err) {
    if ((err as Error).name !== 'AbortError') showAuthRecoveryMessage(err);
  }
}
```

## OTP, magic links, and MFA UI

- **One-time code (`one-time-code`)**: support pasting the full 6-digit code into either a single `inputmode="numeric" autocomplete="one-time-code"` field (preferred for screen readers and mobile SMS autofill) or segmented boxes that distribute pasted characters cleanly and allow `Backspace` across boxes.
- **Resend & expiry**: show an explicit countdown before re-enabling "Resend code", preserve the entered email address on error, and allow editing the email without restarting the entire flow.

## Checkout, billing, and payment UI

- **PCI isolation**: never mount raw `<input>` card-number fields inside your own app bundle; use Stripe Embedded Checkout / Payment Element, Polar/Paddle/Lemon Squeezy checkout, or Adyen Drop-in, passing semantic CSS custom properties into the provider's appearance config so visual craft stays coherent without touching raw PANs.
- **Express wallets & Payment Request**: surface Apple Pay / Google Pay / Link only when capability-detected on the current device/browser; never render broken wallet buttons on unsupported platforms.
- **Idempotent submit & failure recovery**: lock the Pay button with an explicit pending state (`aria-busy="true"`, clear amount shown on button: `"Pay $49.00"`), keep all billing/shipping fields intact if a card declines, focus the decline message with actionable recovery ("Try another card" / "Check postal code"), and handle async webhook fulfillment gracefully ("Confirming payment…").

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `getClientCapabilities()` + `parseRequestOptionsFromJSON()` + `mediation: "conditional"` + `AbortController` | Force a disruptive modal WebAuthn prompt on page load or hand-roll buggy Base64URL byte loops |
| Allow paste and password managers on password & OTP fields (WCAG 3.3.8) | Disable paste on password/confirm-password/OTP inputs |
| Use Stripe Embedded Checkout / Payment Element or Polar / Paddle / Lemon Squeezy themed with semantic tokens | Collect raw credit card numbers in custom React/Vue inputs |
| Preserve shipping/billing inputs, show exact charge amount, and handle post-redirect webhook settling | Wipe checkout fields on card decline or assume redirect return equals settled entitlement |
| Enforce server-side session & authz checks with Better Auth / Clerk / Auth.js / Supabase SSR | Trust client-only auth state or redirect flags for protected routes |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify password-manager autofill attributes (`static`), and test virtual authenticator WebAuthn conditional UI, OTP paste, auth error recovery, and card-decline input preservation in a real browser (`rendered`).
