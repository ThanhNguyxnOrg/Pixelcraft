# Lynx / LynxJS (`@lynx-js/react`)

Use **Lynx** when shipping web-authored React + CSS interfaces that compile to **truly native iOS, Android, HarmonyOS, and Web views** over a dual-threaded engine (no WebView wrapper).

## Dual-thread mental model

- **Background thread (default)**: React reconciliation, state updates, `useEffect`, standard `useRef`, and ordinary event handlers (`bindtap`, `bindscroll`) run off the UI thread so business logic does not drop frames.
- **Main Thread Scripting (MTS)**: high-frequency gestures, scroll-linked motion, and drag physics must run on the main thread using the `"main thread";` directive, `useMainThreadRef`, `runOnMainThread`, and `main-thread:bind*` attributes (`main-thread:bindtouchmove`, `main-thread:bindscroll`).

```tsx
import { useMainThreadRef } from '@lynx-js/react';
import type { MainThread } from '@lynx-js/types';

export function TactileCard({ onSelect }: { onSelect: () => void }) {
  const cardRef = useMainThreadRef<MainThread.Element>(null);

  function onTouchStart(_e: MainThread.TouchEvent) {
    'main thread';
    // Immediate main-thread gesture response without background round-trip
  }

  return (
    <view
      className="card"
      main-thread:ref={cardRef}
      main-thread:bindtouchstart={onTouchStart}
      bindtap={onSelect}
    >
      <text className="card-title">Order #4821</text>
    </view>
  );
}
```

## Primitives, styling, and lists

- Author with Lynx native primitives (`<view>`, `<text>`, `<image>`, `<scroll-view>`, `<list>`, `<list-item>`)—never assume browser HTML tags (`<div>`, `<button>`, `<a>`) or DOM APIs (`window`, `document`) exist in native Lynx targets.
- Style with real CSS (custom properties, Flexbox/Grid, transitions, media queries), respecting mobile safe areas and platform typography scaling.
- For long feeds/grids, always use `<list>` + `<list-item item-key={id} estimated-main-axis-size-px={...}>` for native view recycling instead of mapping hundreds of `<view>` nodes inside a `<scroll-view>`.

## Do/don't pairs

| Do | Don't |
|---|---|
| Put drag/scroll-linked animations in `"main thread";` handlers (`main-thread:bind*`) | Round-trip every `touchmove` pixel through the background React state thread |
| Use `<list>` + `<list-item item-key=...>` for long scrollable feeds | Render 500 unrecycled `<view>` items inside `<scroll-view>` |
| Use Lynx primitives (`<view>`, `<text>`, `<image>`) and CSS variables | Assume browser DOM APIs (`document.querySelector`) exist in native Lynx |
| Respect safe areas, Dynamic Type/`sp` scaling, and native back gestures | Hardcode fixed pixel heights that clip scaled text or collide with notches |

## Verification commands

```sh
npm run build
```

Verify dual-thread bundle output (`static`), and inspect real iOS/Android Lynx Explorer or host app builds for gesture frame pacing, safe-area insets, and font scaling (`rendered`).
