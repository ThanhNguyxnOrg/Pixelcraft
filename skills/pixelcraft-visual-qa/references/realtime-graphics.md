# Canvas, WebGL, WebGPU and 3D verification

## Runtime states

Verify:
- poster/placeholder before renderer initialization;
- ready state and the primary task;
- failed asset and offline/network failure;
- unsupported API or lost GPU context;
- document hidden/offscreen and restored;
- resize/orientation change and DPR change;
- reduced-motion or low-power mode;
- repeated open/close and memory cleanup (zero geometry/texture leak across remounts).

## Profiling tools and concrete verification checks

| Check | Tool / API | What to verify |
|---|---|---|
| **WebGL draw-call & shader audit** | **Spector.js** (browser extension or `spectorjs` embed) | Capture a live frame; verify redundant state changes, draw-call count, framebuffer passes, and uncompressed textures |
| **Three.js / R3F resource leaks** | `renderer.info.render` (`calls`, `triangles`) and `renderer.info.memory` (`geometries`, `textures`) | Record baseline, navigate away and return 3×, confirm `geometries` and `textures` return to baseline (`dispose()` called) |
| **WebGL context loss recovery** | `WEBGL_lose_context` extension | Force loss + restore and confirm static fallback displays and scene recovers cleanly without unhandled errors |
| **WebGPU capability fallback** | `navigator.gpu` / `requestAdapter()` stub | Simulate missing `navigator.gpu` or `requestAdapter() => null`; confirm graceful fallback to WebGL2, 2D canvas, or static media |
| **FPS & GPU memory** | Chrome DevTools **Rendering → Frame Rendering Stats** (FPS meter), Performance GPU track, Chrome Task Manager **GPU Memory** column | Confirm steady frame pacing without sustained > 16.6 ms frames or unbounded GPU memory growth |

```js
// Playwright / DevTools verification snippets for context loss & WebGPU fallback
// 1. Simulate WebGL context loss and recovery
await page.evaluate(() => {
  const gl = document.querySelector('canvas')?.getContext('webgl2');
  const ext = gl?.getExtension('WEBGL_lose_context');
  ext?.loseContext();
  setTimeout(() => ext?.restoreContext(), 500);
});

// 2. Simulate unsupported WebGPU before page load (verify fallback path)
await page.addInitScript(() => {
  Object.defineProperty(navigator, 'gpu', { value: undefined, configurable: true });
});
```

## Performance record

Record browser/device/GPU where visible (`chrome://gpu` or `WEBGL_debug_renderer_info` where exposed), viewport, DPR, refresh rate, scene state, cold/warm cache, frame-time/FPS sample, long tasks, transfer/parse cost, asset sizes, `renderer.info` draw calls/texture counts, and measurement method. Distinguish actual hardware from software SwiftShader/emulation.

## Visual evidence

A rendered screenshot supports composition, not frame stability, interaction, or GPU cost. Use a profiler/performance trace and actual interaction where available. If tooling cannot expose GPU/memory information, report the limitation (`not-checked`); do not estimate a passing number.

## Quality gates

- Essential text/actions remain semantic DOM.
- Canvas has a fallback and accessible summary/control path.
- Render loop pauses when hidden/offscreen (`document.hidden` / `IntersectionObserver`) where appropriate.
- GPU buffers, geometries, textures, and event listeners are released on unmount/route change.
- No high-frequency flashing (`≤ 3 flashes/s`) or unpausable motion (`> 5 s`).
