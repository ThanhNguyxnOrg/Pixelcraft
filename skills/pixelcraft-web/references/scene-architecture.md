# 3D scene architecture

## Renderer and engine decision

- **Three.js**: direct control of scene, renderer, camera, asset loading, and disposal across any web stack.
- **React Three Fiber (R3F v9)**: declarative React composition over Three.js (read [r3f-integration.md](r3f-integration.md)). Use `@react-three/drei` selectively for helpers/controls/loaders—never pull the whole barrel blindly.
- **Alternative browser 3D engines**: for zero-code product GLB/AR previews (`<model-viewer>`), Babylon.js, PlayCanvas, Svelte **Threlte v8**, Vue **TresJS v5**, **luma.gl v9**, or `regl`, read [web-3d-engines.md](web-3d-engines.md). For designer-authored hosted scenes, Spline is an option when payload and accessibility trade-offs are explicitly accepted.
- **Embodied XR / headset UX**: for WebXR/visionOS/Quest comfort, depth ergonomics, and spatial interaction, use `pixelcraft-spatial`.

## Three.js `WebGPURenderer` (`three/webgpu`) + TSL (`three/tsl`)

Modern Three.js ships **`WebGPURenderer`** from `'three/webgpu'` (which runs on WebGPU when supported and **automatically falls back to a WebGL 2 backend** when WebGPU is unavailable) alongside **TSL (`'three/tsl'` — Three.js Shading Language)**, a composable JavaScript node-material graph that compiles to both WGSL and GLSL without duplicating shader files:

```ts
import * as THREE from 'three/webgpu';
import { color, mix, positionLocal, time, uniform } from 'three/tsl';

const renderer = new THREE.WebGPURenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
await renderer.init(); // Required async init before first render
container.appendChild(renderer.domElement);

// Node material compiles to WGSL on WebGPU and GLSL on WebGL2 fallback
const uMotion = uniform(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1);
const mat = new THREE.MeshStandardNodeMaterial();
mat.colorNode = mix(
  color(0x1f2937),
  color(0x38bdf8),
  positionLocal.y.add(time.mul(0.4).mul(uMotion)).sin().mul(0.5).add(0.5),
);
```

Always call `renderer.setAnimationLoop(null)`, dispose geometries/materials/textures, and call `renderer.dispose()` on unmount.

## Scene contract

Record before building:
- world units and object scale (standardize 1 unit = 1 meter for PBR lighting and physics);
- coordinate orientation and origin;
- camera type, FOV/frustum, near/far planes, and reset behavior;
- user controls, damping, polar/zoom limits, and keyboard/DOM reset mapping;
- lighting/environment (`PMREMGenerator` / HDRI envMap) and linear-to-sRGB tone mapping (`ACESFilmicToneMapping` or `AgXToneMapping`);
- asset loading, missing asset, WebGL/WebGPU context loss, resize, and reduced-motion behavior.

Keep high-value text, pricing, forms, and primary controls in the DOM. Treat the canvas as a visual/manipulation surface, not a replacement for product semantics.

## Composition

- Establish silhouette and camera framing before adding detail.
- Use one main light strategy plus an environment map; avoid stacking multiple real-time shadow-casting lights without profiling.
- Keep postprocessing selective: a single restrained pass can be meaningful; multiple full-screen passes multiply fill-rate and VRAM cost.
- Make object manipulation bounded, resettable, and understandable. Avoid involuntary idle camera spin.

## Official references

- Three.js docs: https://threejs.org/docs/
- Three.js WebGPU & TSL wiki/examples: https://threejs.org/examples/?q=webgpu
- React Three Fiber docs: https://r3f.docs.pmnd.rs/
- Drei docs: https://drei.docs.pmnd.rs/
- WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
