# Lynx / LynxJS (`@lynx-js/react`)

Use **Lynx** when shipping React + CSS interfaces built with **`@lynx-js/rspeedy`** (Rspack-based bundler) that compile to **native iOS, Android, HarmonyOS, and Web views** over a dual-threaded engine (no WebView wrapper).

## Dual-thread mental model

- **Background thread (default)**: React reconciliation, state updates, `useEffect`, standard `useRef`, network calls, and ordinary event handlers (`bindtap`, `bindscroll`) run off the UI thread so business logic does not drop frames.
- **Main Thread Scripting (MTS)**: high-frequency gestures, scroll-linked motion, and drag physics run synchronously on the main thread via the `"main thread";` directive, `useMainThreadRef`, `runOnMainThread`, and `main-thread:bind*` handlers (`main-thread:bindtouchmove`, `main-thread:bindscroll`). Commit gesture outcomes back to React state with **`runOnBackground`**.

```tsx
import { runOnBackground, useMainThreadRef } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

export function TactileCard({ onCommit }: { onCommit: (dx: number) => void }) {
  const cardRef = useMainThreadRef<MainThread.Element>(null);

  function onTouchEnd(e: MainThread.TouchEvent) {
    'main thread';
    const dx = e.detail.x;
    runOnBackground(onCommit)(dx);
  }

  return (
    <view
      className="card"
      accessibility-element={true}
      accessibility-label="Open order 4821"
      main-thread:ref={cardRef}
      main-thread:bindtouchend={onTouchEnd}
    >
      <text className="card-title">Order #4821</text>
    </view>
  );
}
```

## Token mapping

Lynx parses real CSS—export DTCG semantic tokens into CSS custom properties and switch light/dark/high-contrast themes via a root theme class or host-injected theme attribute:

```css
:root {
  --pc-action: #0074ca;
  --pc-surface: #ffffff;
  --pc-space-inline: 12px;
}
.theme-dark {
  --pc-action: #5bb2ff;
  --pc-surface: #121417;
}
.card {
  background-color: var(--pc-surface);
  padding: var(--pc-space-inline);
}
```

Do not duplicate raw hex literals across component stylesheets or inline `style={{ ... }}` objects.

## Layout and responsive idioms

- Author strictly with Lynx native primitives (`<view>`, `<text>`, `<image>`, `<scroll-view>`, `<list>`, `<list-item>`)—browser tags (`<div>`, `<button>`, `<a>`) and DOM globals (`window`, `document`) do **not** exist in native Lynx runtimes.
- Use CSS Flexbox, Grid, and Linear layout. Consume host-provided safe-area insets (injected via `lynx.__globalProps` / native bridge or CSS env where supported by host) so headers and bottom actions clear notches, home indicators, and Android 15/16 gesture bars.
- Always virtualize long feeds/grids with `<list>` + `<list-item item-key={id} estimated-main-axis-size-px={...}>` for native view recycling instead of mapping hundreds of `<view>` nodes inside `<scroll-view>`.

## Typography & custom fonts

Register custom font files via `@font-face` / host resource loader (packaged in the bundle or native app assets so they work offline) and define fallback families. Respect host OS font scaling (`sp` / Dynamic Type forwarded by the Lynx host configuration) and avoid fixed `height` on `<view>` rows containing wrapped `<text>`.

## Motion & reduced motion

Drive discrete state transitions with CSS `transition` / `@keyframes`, and continuous gesture-driven physics on the main thread via MTS (`setStyleProperty` on `MainThread.Element`). Pass the host OS reduced-motion setting into initial props or a native module query so both CSS transitions and MTS spring/drag animations degrade to instant/opacity changes when reduced motion is active.

## Accessibility specifics

Lynx `<view>` elements are non-semantic by default. Expose explicit native accessibility metadata on every interactive or composite element:

- `accessibility-element={true}` to make a control focusable by VoiceOver / TalkBack,
- `accessibility-label="..."` for clear screen-reader names (never rely on an icon `<image>` alone),
- `accessibility-traits` (`"button"`, `"header"`, `"link"`, `"none"`, etc.) and `accessibility-elements` ordering where composite cards group children.

Verify minimum hit targets (`44×44 pt` iOS / `48×48 dp` Android) and real VoiceOver/TalkBack traversal inside the host native app.

## States & forms idioms

Keep authoritative async state (`loading`, `empty`, `error`, `offline`, `optimistic`) on the background React thread; use MTS only for immediate tactile response and reconcile back through `runOnBackground` with rollback on failure.

**Native input caveats**: Lynx core intentionally ships a lean primitive set—rich `<input>`, multiline text areas, date pickers, and IME composition often rely on host-registered custom native elements (`<x-input>` or `@lynx-js` element extensions). Verify focus handling, keyboard avoidance, IME/CJK composition, paste, autofill, and accessible error announcements on **both** iOS and Android host shells before shipping complex forms.

## Do/don't pairs

| Do | Don't |
|---|---|
| Run drag/scroll animations in `"main thread";` and commit via `runOnBackground` | Round-trip every `touchmove` pixel through background React state |
| Use `<list>` + `<list-item item-key=...>` for long feeds | Render hundreds of unrecycled `<view>` nodes inside `<scroll-view>` |
| Add `accessibility-element={true}` + `accessibility-label` + `accessibility-traits` | Treat a bare `<view bindtap={...}>` as an accessible button |
| Verify host-provided native input elements for IME, paste, and keyboard avoidance | Assume browser `<input>` / DOM validation APIs exist natively |
| Pass reduced-motion and safe-area insets from the host shell | Hard-code notch padding or ignore OS accessibility settings |

## Known traps

Calling background-only JS APIs or React hooks inside `"main thread";` functions, assuming browser `window`/`document` globals exist, forgetting `accessibility-element={true}` on interactive `<view>`s, missing custom native `<input>` registrations in the host iOS/Android shell, unrecycled `<scroll-view>` memory spikes, safe-area or font-scale clipping from fixed pixel row heights.

## Verification commands

```sh
npx rspeedy build
npm run test -- --watch=false
```

`npx rspeedy build` verifies dual-thread bundle compilation (`static`). Inspect the compiled bundle inside **Lynx Explorer** or the real iOS/Android host app build for gesture frame pacing, VoiceOver/TalkBack tree, safe-area insets, dark mode, reduced motion, and native input IME behavior (`rendered`; label untested native hosts `not-checked`).
