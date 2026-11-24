# Creative rendering choices

## Select by content

| Renderer | Strong fit | Cost / boundary |
|---|---|---|
| DOM/CSS | UI, small transitions, layout effects | Keep semantic state in HTML; avoid layout-heavy animation |
| SVG | Icons, diagrams, vector marks, path drawing, moderate object counts | DOM/SVG complexity grows with many animated nodes |
| Canvas 2D | Procedural drawing, simple particles, paint tools | App must provide semantics, focus, text/data alternative |
| **PixiJS v8** | Sprite/texture-heavy 2D scenes, particles, filters, batching | Adds a runtime and GPU memory; supports WebGPU + WebGL2 automatically |
| OGL / raw WebGL / `regl` | A compact shader or custom GPU surface | Lower-level lifecycle/compatibility work |
| Three.js / R3F / Babylon / Threlte / TresJS | 3D scene graphs, camera, lighting, loaders | Read [scene-architecture.md](scene-architecture.md) and [web-3d-engines.md](web-3d-engines.md) |
| **WebGPU** | Compute shaders, high-draw-call instancing, or modern GPU pipelines | Capability-detect first; ship WebGL2 or static fallback |

## PixiJS v8 breaking-change initialization

PixiJS v8 **removed synchronous constructor options** and renamed `app.view` → **`app.canvas`**. Always construct `new Application()`, await `app.init({ preference: 'webgpu', ... })` (falls back to WebGL2 automatically), mount `app.canvas`, and call `app.destroy({ removeView: true }, { children: true, texture: true })` on unmount:

```ts
import { Application } from 'pixi.js';

export async function mountPixiStage(container: HTMLElement) {
  const app = new Application();
  await app.init({
    preference: 'webgpu',
    resizeTo: container,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    backgroundAlpha: 0,
  });
  container.appendChild(app.canvas);
  return () => app.destroy({ removeView: true }, { children: true });
}
```

Keep product UI, forms, and navigation in real DOM outside the Pixi canvas.

## WebGL / WebGPU capability check & fallback

```ts
export async function detectGpuBackend(): Promise<'webgpu' | 'webgl2' | 'none'> {
  if ('gpu' in navigator) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) return 'webgpu';
    } catch {
      // Fall through to WebGL2 check
    }
  }
  const probe = document.createElement('canvas');
  return probe.getContext('webgl2') ? 'webgl2' : 'none';
}
```

- WebGPU requires a secure context (`https://` or `localhost`) and a valid `GPUAdapter`; never assume `'gpu' in navigator` means an adapter exists.
- Provide a deterministic static poster/SVG fallback when `'none'` is returned or GPU context fails.
- Do not treat a `<canvas>` tag as proof that WebGL/WebGPU initialized; verify rendered pixels and context state in a real browser (`rendered`).

## Official references

- PixiJS v8 guides: https://pixijs.com/8.x/guides
- WebGL API: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
