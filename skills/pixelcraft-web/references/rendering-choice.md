# Creative rendering choices

## Select by content

| Renderer | Strong fit | Cost / boundary |
|---|---|---|
| DOM/CSS | UI, small transitions, layout effects | Keep semantic state in HTML; avoid layout-heavy animation |
| SVG | Icons, diagrams, vector marks, path drawing, moderate object counts | DOM/SVG complexity grows with many animated nodes |
| Canvas 2D | Procedural drawing, simple particles, paint tools | App must provide semantics, focus, text/data alternative |
| PixiJS | Sprite/texture-heavy 2D scenes, particles, filters, batching | Adds a runtime and GPU memory; use only for measured workloads |
| OGL/direct WebGL | A compact shader or custom GPU surface | Lower-level lifecycle/compatibility work |
| Three.js/R3F | 3D scene graphs, camera, lighting, loaders | Route to pixelcraft-3d-web for scene/asset architecture |
| WebGPU | Features or compute paths unavailable/inefficient in chosen WebGL approach | Optional feature path; verify target coverage and fallbacks |

## PixiJS selection notes

Use PixiJS when a dense 2D scene needs batching, texture handling, filters, or sprite systems that are awkward in DOM/SVG. Keep app UI outside the renderer. Check the installed Pixi major version, renderer path, extension modules, and browser/device compatibility before using examples.

PixiJS docs: https://pixijs.com/8.x/guides

## WebGL/WebGPU boundary

- WebGL remains a broadly deployed browser GPU API, but still requires context-loss recovery and performance measurement.
- WebGPU is capability-detected, not assumed. Confirm required features, secure-context requirements, adapter availability, browser version, and rendering library support.
- Do not treat a canvas as proof that WebGL/WebGPU is active. Inspect resources/runtime where permitted.
- Provide a deterministic static fallback when the GPU renderer cannot initialize.

References: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API and https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
