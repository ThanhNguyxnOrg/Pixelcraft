# Ionic / Capacitor

## Token mapping & Ionic 8 palettes

Ionic 8 supports modern CSS **`light-dark()`** and built-in **high-contrast palettes** (`@ionic/core/css/palettes/dark.system.css`, `high-contrast.system.css`, `high-contrast-dark.system.css`). Bridge DTCG semantic CSS custom properties into Ionic's documented `--ion-*` tokens rather than piercing Shadow DOM internals:

```css
@import '@ionic/core/css/palettes/dark.system.css';
@import '@ionic/core/css/palettes/high-contrast.system.css';
@import '@ionic/core/css/palettes/high-contrast-dark.system.css';

:root {
  color-scheme: light dark;
  --ion-color-primary: light-dark(var(--semantic-action-light), var(--semantic-action-dark));
  --ion-background-color: var(--semantic-surface);
  --ion-text-color: var(--semantic-on-surface);
}
```

Use documented `::part(...)` selectors and `--ion-*` variables; never rely on fragile shadow-root traversal hacks.

## Capacitor 6–8 Android Edge-to-Edge & layout idioms

Android 15/16 enforces edge-to-edge rendering. Configure Capacitor 6–8's **`SystemBars`** plugin / `adjustMarginsForEdgeToEdge` setting (or `@capacitor/status-bar` + explicit safe-area insets) alongside `<meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0">` and CSS `env(safe-area-inset-*)` so headers, bottom tabs, and CTAs never collide with cutouts or gesture bars.

Use Ionic's `<ion-app>`, `<ion-page>`, `<ion-header>`, `<ion-content>`, `<ion-footer>`, `<ion-split-pane>`, and `<ion-router-outlet>` so swipe-back, hardware back, and scroll-to-top follow host conventions. Choose `mode` (`ios` / `md`) per host platform by default rather than locking Android users into iOS chrome or vice versa.

## Capacitor without Ionic (plain web frameworks + Konsta / Tailwind)

You do **not** need Ionic Framework to ship a Capacitor app. Teams using React, Vue, Svelte, Solid, or Angular with **Tailwind CSS** (optionally paired with **Konsta UI** for iOS/Material Tailwind primitives) can target Capacitor directly without Ionic's Web Components / Shadow DOM layer. When opting out of Ionic, you explicitly own:

- iOS swipe-back and Android hardware/predictive back handling (`@capacitor/app` `backButton` listener),
- safe-area and keyboard inset padding (`@capacitor/keyboard` + `env(safe-area-inset-*)`),
- native-feeling sheet/modal focus traps and scroll-container momentum,
- 44pt / 48dp touch targets and tap-highlight suppression (`-webkit-tap-highlight-color: transparent` paired with intentional `:active` feedback).

## Forms idiom (Ionic 7/8 `label` / `labelPlacement`)

Legacy standalone `<ion-label>` inside `<ion-item>` around form controls is **deprecated in Ionic 7/8**. Pass **`label`** and **`labelPlacement`** (`"stacked"`, `"floating"`, `"fixed"`, `"start"`) directly on `<ion-input>`, `<ion-textarea>`, `<ion-select>`, `<ion-toggle>`, `<ion-checkbox>`, and `<ion-radio>`, paired with `helper-text` and `error-text`:

```html
<ion-input
  label="Work email"
  label-placement="stacked"
  type="email"
  autocomplete="email"
  inputmode="email"
  helper-text="Receipts are sent here."
  error-text="Enter a valid email address."
></ion-input>
```

Prefer `label-placement="stacked"` for dense or localized forms so long labels do not overlap values or clip on narrow screens.

## Typography, motion, accessibility, & states idioms

Bundle fonts locally (offline-ready) with platform fallbacks and ensure text reflows cleanly under WebView / OS text zoom. Honor `@media (prefers-reduced-motion: reduce)` in CSS and disable non-essential Ionic page transitions when requested.

Manage focus explicitly on router navigation and modal/sheet dismissal (WebViews do not automatically restore focus reliably). Model both web data state (loading/empty/error/offline/optimistic) and native shell state (permission denied, `@capacitor/network` offline, `@capacitor/app` background/resume, deep-link cold start, keyboard open/closed).

## Do/don't pairs

| Do | Don't |
|---|---|
| `<ion-input label="Email" label-placement="stacked" error-text="...">` | Deprecated `<ion-item><ion-label>…</ion-label><ion-input /></ion-item>` |
| Import Ionic 8 `dark.system.css` & `high-contrast.system.css` palettes | Hard-code light-only colors that wash out in high-contrast or dark mode |
| Configure Capacitor `SystemBars` + `viewport-fit=cover` + `env(safe-area-inset-*)` | Leave Android 15/16 status/gesture bars overlapping app headers or tabs |
| Documented `--ion-*` custom properties and `::part()` | Fragile selectors attempting to pierce internal Shadow DOM markup |
| Handle `@capacitor/app` `backButton` and focus restoration explicitly | Assume browser history handles Android hardware back and modal escape |

## Known traps

Android System WebView fragmentation, Android 15/16 edge-to-edge overlap when `SystemBars` / safe-area insets are unconfigured, fixed-bottom CTAs buried under the soft keyboard, stale `npx cap sync` native assets after web builds, permission prompt loops with no denied-state recovery, cold-start deep links dropping route state, Capacitor-without-Ionic apps missing hardware back handlers.

## Verification commands

```sh
npm run lint
npm run test -- --watch=false
npm run build
npx cap sync
# Run on real device/emulator when Xcode or Android SDK is installed:
npx cap run ios
npx cap run android
```

Web build/unit tests provide `static` evidence; desktop browser DevTools verifies inner DOM only. Run real iOS/Android device or emulator builds to verify Android 15/16 edge-to-edge, keyboard insets, hardware/swipe back, native plugin permissions, VoiceOver/TalkBack, and offline recovery (`rendered`; mark unavailable targets `not-checked`).
