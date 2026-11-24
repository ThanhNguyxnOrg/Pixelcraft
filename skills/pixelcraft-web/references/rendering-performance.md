# Real-time 3D performance

Set budgets during planning and measure on representative devices. A fixed FPS target is meaningless without device, refresh rate, viewport, scene, and throttling context.

## Control the cost

- Cap device pixel ratio; full-resolution rendering at high-DPI can multiply fragment work.
- Bound triangles, draw calls, textures, render targets, lights, shadows, physics steps, and postprocessing passes.
- Prefer instancing for repeated meshes and LOD/culling for wide scenes.
- Use static environment maps or baked lighting where realtime lighting has no user-facing value.
- Lazy-load scene code and assets; show a poster before initialization.
- Pause when document hidden or scene offscreen; avoid idle animation on operational pages.
- Use lower quality presets for mobile/thermal pressure and expose a non-3D fallback.
- Dispose resources and test memory after route changes or repeated open/close.
- Avoid blanket `will-change: transform` on large lists; apply compositor promotion only to actively animating elements to prevent VRAM exhaustion.

```ts
// Cap DPR, pause when offscreen or hidden, and handle WebGL context loss + restoration
const dpr = Math.min(window.devicePixelRatio || 1, 2);
renderer.setPixelRatio(dpr);

let visible = true;
let rafId = 0;

function tick(now: number) {
  if (!visible || document.hidden) {
    rafId = 0;
    return;
  }
  renderFrame(now);
  rafId = requestAnimationFrame(tick);
}

function startLoop() {
  if (!rafId && visible && !document.hidden) rafId = requestAnimationFrame(tick);
}

const io = new IntersectionObserver(
  ([entry]) => {
    visible = entry.isIntersecting;
    if (visible) startLoop();
  },
  { threshold: 0.01 },
);
io.observe(canvas);

const onVisibility = () => { if (!document.hidden) startLoop(); };
document.addEventListener('visibilitychange', onVisibility);

const onContextLost = (e: Event) => {
  e.preventDefault();
  cancelAnimationFrame(rafId);
  rafId = 0;
};
const onContextRestored = () => {
  rebuildGpuResources();
  startLoop();
};
canvas.addEventListener('webglcontextlost', onContextLost);
canvas.addEventListener('webglcontextrestored', onContextRestored);

// On teardown:
// cancelAnimationFrame(rafId); io.disconnect();
// document.removeEventListener('visibilitychange', onVisibility);
// canvas.removeEventListener('webglcontextlost', onContextLost);
// canvas.removeEventListener('webglcontextrestored', onContextRestored);
// geometry.dispose(); material.dispose(); renderer.dispose();
```

## Evidence

Record device/GPU/browser, viewport, DPR, refresh rate, scene state, warm/cold cache, frame-time distribution or FPS sample, long tasks, GPU memory (`renderer.info.memory`), draw calls (`renderer.info.render.calls`), and whether capture was actual device or emulation (`rendered`). Do not compare numbers from unlike devices as if they were equivalent.

The visual-qa performance budget is the shared project-level floor; this guide adds scene-specific measurements. If device profiling is unavailable, label GPU/frame checks `not-checked` rather than inferring from a screenshot.

## Official references

- WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Three.js manual: https://threejs.org/manual/
- R3F performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
