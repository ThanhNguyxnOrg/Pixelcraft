# Ionic / Capacitor

## Token mapping

Ionic exposes CSS variables for theme and component customization. Bridge generated CSS variables into Ionic semantic variables in global CSS:

```css
:root {
  --ion-color-primary: var(--semantic-color-action);
  --ion-background-color: var(--semantic-color-background);
}
```

Do not override internal shadow DOM with brittle selectors when documented CSS variables/parts exist.

## Layout and responsive idioms

Use Ionic page/content/header/footer/menu/router outlet idioms. Respect safe areas, split pane behavior, hardware/software back semantics, keyboard inset behavior, and mobile navigation rather than treating the app as a responsive website in a shell. Web responsive layout remains relevant inside content.

## Typography/custom fonts

Use web font loading plus platform-appropriate fallbacks. Ionic mode (`ios`/`md`) affects typography/platform behavior; choose intentionally rather than forcing one mode blindly everywhere. Text zoom/reflow must survive WebView settings and device font scaling.

## Motion/reduced motion

Use Ionic component transitions/navigation idioms and CSS motion honoring `prefers-reduced-motion`. Capacitor plugins/native APIs may expose additional behavior, but do not fake system haptics/animation everywhere.

## Accessibility specifics

Ionic components carry useful semantics but still require labels/names/focus management. Router transitions and modal/popover dismissal need focus restoration. Capacitor apps need real device testing because web accessibility behavior does not cover native shell/permissions/keyboards.

## States idiom

Treat web data state and native device state separately: network offline/online, permission denied, background/resume, keyboard open/closed, deep link/app URL open, push notification cold start. Loading/empty/error/offline/optimistic states follow web rules plus native interruption recovery.

## Forms idiom

Ionic inputs need persistent labels (`ion-label` or modern input label APIs), correct type/autocomplete/inputmode, clear helper/error copy, paste/autofill support, keyboard behavior, and validation timing. Do not use floating labels as the only memory aid in long forms without checking overlap/truncation.

## Do/don't pairs

| Do | Don't |
|---|---|
| use documented `--ion-*` variables/parts | piercing shadow internals with fragile selectors |
| platform-aware navigation/back behavior | forcing one navigation model because codebase is shared |
| explicit focus restoration after modal close | assuming WebView automatically chooses correct focus |
| device permission primer/fallback flow | looping the native permission prompt with no escape |
| test keyboard-safe bottom action | placing fixed CTA beneath keyboard/home indicator |

## Known traps

WebView version fragmentation, safe-area/keyboard mismatch, shadow DOM styling frustration, forced MD/iOS mode alien to users, native plugin permission lifecycle, hardware back duplication, deep-link cold start state, offline cache staleness, confusing PWA/mobile behavior.

## Verification commands

```sh
npm run lint
npm run test -- --watch=false
npm run build
npx cap sync
npx cap run ios 2>/dev/null || true
npx cap run android 2>/dev/null || true
```

Use browser inspection for DOM plus real device/emulator tests for native shell, keyboard, permissions, back, gestures, screen readers, and offline behavior.
