# Rive and Lottie / dotLottie selection

## Choose by behavior

| Need | Choose | Packages | Why |
|---|---|---|---|
| Interactive state machine, pointer-tracking rig, or data-bound vector animation | **Rive** | `@rive-app/react-canvas`, `@rive-app/canvas` (vanilla/Vue/Svelte), `@rive-app/webgl2` / `@rive-app/react-webgl2` (feathering / dense vector GPU scenes) | State machines and ViewModel Data Binding run in a compact WASM runtime without rebuilding timelines in JS |
| One-shot or looped vector illustration / empty-state graphic | **dotLottie** (`.lottie` archive) | `@lottiefiles/dotlottie-react`, `@lottiefiles/dotlottie-web` (WASM) | Compressed `.lottie` bundles with built-in theming/state support replace bloated legacy `lottie-web` JSON payloads |
| UI state, selection, validation, focus, or form feedback | Native DOM/CSS | N/A | Assistive tech and application state require semantic controls, not canvas pixels |
| Complex scroll choreography or path movement | GSAP / native CSS scroll timelines | `gsap` (`gsap.md`) | Timeline/scroll ownership is easier to inspect and synchronize with DOM |

## Rive Data Binding (ViewModels) & dotLottie idioms

- **Rive Data Binding / ViewModels**: prefer Rive's **Data Binding (`autoBind: true` + `useViewModelInstanceString` / `Number` / `Boolean` / `Trigger`)** over brittle manual `useStateMachineInput` string lookups whenever the `.riv` asset defines a ViewModel. Keep application state authoritative; drive Rive properties from app state.
- **Rive cleanup & offscreen pause**: call `rive.cleanup()` on unmount in vanilla integrations (`useRive` handles disposal in React) and pause playback when hidden via `IntersectionObserver` or `prefers-reduced-motion`.
- **dotLottie reduced-motion & disposal**: pass `autoplay={!prefersReduced}` and call `dotLottie.pause(); dotLottie.setFrame(0);` (or render a static SVG/image fallback) under `prefers-reduced-motion: reduce`; call `dotLottie.destroy()` on unmount.

```tsx
// Rive React: state machine + Data Binding (autoBind) + reduced-motion pause
import { useEffect } from 'react';
import { useRive, useViewModelInstanceNumber } from '@rive-app/react-canvas';

export function SyncGauge({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/sync-gauge.riv',
    artboard: 'Gauge',
    stateMachines: 'State Machine 1',
    autoBind: true,
    autoplay: !reducedMotion,
  });

  const { setValue } = useViewModelInstanceNumber('progress', rive?.viewModelInstance);

  useEffect(() => {
    setValue(progress);
  }, [progress, setValue]);

  return (
    <div role="img" aria-label={`Sync progress ${progress}%`}>
      <RiveComponent />
    </div>
  );
}
```

```tsx
// dotLottie React: compressed .lottie archive with reduced-motion guard
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function EmptyArchiveGraphic({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <DotLottieReact
      src="/animations/empty-archive.lottie"
      loop={!reducedMotion}
      autoplay={!reducedMotion}
      aria-hidden="true"
    />
  );
}
```

## Integration checklist

- Keep application state authoritative; the animation reflects state and never replaces DOM controls or status text.
- Provide `aria-label` (for meaningful graphics) or `aria-hidden="true"` (for pure decoration alongside real DOM copy).
- Lazy-load WASM runtimes and `.riv`/`.lottie` files on routes/regions that need them, cache cleanly, and supply a static SVG/poster fallback if WASM or asset fetch fails.
- Pause offscreen loops (`IntersectionObserver` + `document.hidden`) and check asset provenance, embedded fonts/images, and licenses.

## Official references

- Rive docs & Data Binding: https://rive.app/docs/
- Rive web runtimes: https://rive.app/docs/runtimes/web
- dotLottie web/React SDK: https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-web/
