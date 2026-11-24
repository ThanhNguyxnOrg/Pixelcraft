# Web 3D and graphics engine alternatives

For Three.js / React Three Fiber / Spline / PixiJS / raw WebGL-WebGPU guidance, see `pixelcraft-web` (`scene-architecture.md`, `r3f-integration.md`, `rendering-choice.md`). Use this reference when selecting or implementing **Babylon.js, PlayCanvas, Threlte, TresJS, `<model-viewer>`, regl, or luma.gl**.

## Engine decision matrix

| Engine | Target framework / style | WebGPU support | Built-in extras | Best fit |
|---|---|---|---|---|
| **`<model-viewer>` (v4+)** | Standards Web Component (any stack) | Via Three.js | Orbit camera, poster, progressive loading, AR (`webxr scene-viewer quick-look`) | E-commerce / product 3D & AR previews without writing scene-graph code |
| **Babylon.js** | Framework-agnostic TypeScript | Yes (`WebGPUEngine`) | Full scene graph, PBR, GUI, spatial audio, Havok physics, WebXR helper | Complex interactive 3D apps, industrial configurators, simulations, and WebXR |
| **PlayCanvas** | JS/TS ECS + cloud/local editor | Yes | Lightweight runtime, physics, asset pipeline, collaborative visual editor | Web games, playable ads, high-FPS mobile 3D experiences |
| **Threlte (v8+)** | Svelte 5 declarative Three.js | Via Three.js | `@threlte/extras`, Rapier physics, `@threlte/gltf`, auto-disposal for `<T>` | Svelte / SvelteKit 3D interfaces |
| **TresJS (v5+)** | Vue 3 / Nuxt declarative Three.js | Via Three.js | `@tresjs/cientos`, `@tresjs/rapier`, `@tresjs/nuxt` | Vue / Nuxt 3D interfaces |
| **luma.gl (v9+)** | Low-level GPU library | Yes (WebGPU + WebGL2) | Compute shaders, buffer/pipeline abstraction (powers deck.gl) | Custom GPU data visualization and scientific rendering |
| **regl** | Functional stateless WebGL | WebGL 1 | Minimal command-based draw calls | Lightweight procedural shaders and custom 2D/3D experiments |

## Verified implementation idioms

### `<model-viewer>` (product 3D + AR)

Always supply `alt` (accessible name), `poster` (instant LCP image before GLB downloads), and `touch-action="pan-y"` (prevents vertical mobile scroll hijacking). Setting `ar-modes="webxr scene-viewer quick-look"` supports iOS Quick Look with on-the-fly USDZ conversion when `ios-src` is omitted.

```html
<model-viewer
  src="/models/chair.glb"
  poster="/models/chair-poster.webp"
  alt="Oak lounge chair in natural finish"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  touch-action="pan-y"
  shadow-intensity="1"
></model-viewer>
```

### Babylon.js (tree-shaking, WebGPU, WebXR)

- Import subpaths from `@babylonjs/core/*` rather than the monolithic `babylonjs` barrel to keep bundles tree-shakable.
- When initializing WebGPU with XR, pass `{ xrCompatible: true }` and `await engine.initAsync()`. For WebXR controller models under ES6 tree-shaking, import `@babylonjs/loaders/glTF` and `@babylonjs/core/Materials/Node/Blocks`. Always call `scene.dispose()` and `engine.dispose()` on unmount.

```ts
import { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine';
import { Scene } from '@babylonjs/core/scene';
import '@babylonjs/core/XR/webXRDefaultExperience';
import '@babylonjs/loaders/glTF';
import '@babylonjs/core/Materials/Node/Blocks';

const engine = new WebGPUEngine(canvas, { xrCompatible: true });
await engine.initAsync();
const scene = new Scene(engine);
const xr = await scene.createDefaultXRExperienceAsync({ floorMeshes });
```

### Threlte (Svelte 5) & TresJS (Vue 3)

- **Threlte v8**: wrap scene content in a child `Scene.svelte` inside `<Canvas>` so `useTask((delta) => ...)` accesses canvas context. Remember that automatic disposal only covers objects created by `<T.*>` components—manually dispose external textures/assets loaded outside `<T>`.
- **TresJS v5**: `useRenderLoop`, `useCamera`, `useSeek`, and `useTresReady` were **removed in v5**. Use `useLoop()` (`onBeforeRender` inside a child of `<TresCanvas>`, or `@loop` on `<TresCanvas>`), `useTres()` for camera access, and `useGraph()` for GLTF scene nodes.

```ts
// TresJS v5 (child component inside <TresCanvas>)
import { useLoop } from '@tresjs/core';

const { onBeforeRender } = useLoop();
onBeforeRender(({ delta }) => {
  if (meshRef.value) meshRef.value.rotation.y += delta * 1.5;
});
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `<model-viewer>` with `poster`, `alt`, and `touch-action="pan-y"` for simple GLB product previews | Spin up a full Babylon.js or Three.js app just to orbit one product GLB |
| Import `@babylonjs/core/*` subpaths and call `engine.dispose()` on unmount | Import the entire Babylon monolithic bundle or leak GPU contexts |
| Use `useLoop()` (`onBeforeRender`) and `useTres()` in TresJS v5 | Copy removed v4 `useRenderLoop()` or `useCamera()` snippets into TresJS v5 |
| Manually dispose external `useTexture` / loader assets in Threlte when unmounted | Assume Threlte auto-disposes textures created outside `<T.*>` |

## Verification commands

```sh
npm run build
npx playwright test
```

Inspect chunk sizes (`static`), and verify poster-to-3D transition, mobile scroll (`touch-action`), GPU memory cleanup on navigation, and WebXR fallback in a real browser/device (`rendered`).
