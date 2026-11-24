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

## Evidence

Record device/GPU/browser, viewport, DPR, refresh rate, scene state, warm/cold cache, frame-time distribution or FPS sample, long tasks, memory where observable, and whether capture was actual device or emulation. Do not compare numbers from unlike devices as if they were equivalent.

The visual-qa performance budget is the shared project-level floor; this guide adds scene-specific measurements. If device profiling is unavailable, label GPU/frame checks not-checked rather than inferring from a screenshot.

## Official references

- WebGL best practices: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- Three.js manual: https://threejs.org/manual/
- R3F performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
