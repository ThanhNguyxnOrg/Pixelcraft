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

## Choreography & designer-authored WebGL scenes

### Theatre.js (keyframe & sequence choreography)

Use **Theatre.js** (`@theatre/core`, `@theatre/studio`, `@theatre/r3f`) when camera rails, lighting transitions, or DOM + Three.js/R3F properties require timeline curves authored visually instead of brittle nested `setTimeout` or hand-tuned easing arrays:

- **Strip Studio from production builds**: import `@theatre/studio` dynamically behind a build-time dev guard (`if (import.meta.env.DEV)`) and load the exported static `state.json` into `getProject('Hero', { state })` in production—never bundle Studio UI into end-user JavaScript.
- **Reduced motion**: when `prefers-reduced-motion: reduce` matches, seek directly to the resting keyframe (`sheet.sequence.position = REST_TIME`) instead of playing camera sweeps.

```ts
import { getProject, types } from '@theatre/core';
import bakedState from './hero-sequence.theatre-project-state.json';

if (import.meta.env.DEV) {
  const studio = (await import('@theatre/studio')).default;
  studio.initialize();
}

const project = getProject('ProductShowcase', { state: bakedState });
const sheet = project.sheet('Intro');
const cameraRig = sheet.object('Camera', {
  fov: types.number(40, { range: [25, 75] }),
  orbitY: types.number(0, { range: [-Math.PI, Math.PI] }),
});
```

### Spline (`@splinetool/react-spline` / `@splinetool/runtime`)

Use **Spline** only when a designer-authored interactive 3D scene justifies its runtime payload and the following budget rules are enforced:

- **Lazy-load**: wrap `@splinetool/react-spline` in `React.lazy` (or load `@splinetool/runtime` on `IntersectionObserver` entry) so the Spline runtime never blocks hydration or first paint.
- **Scene weight budget**: audit `.splinecode` transfer size and embedded texture resolution before shipping (compress textures, cull hidden meshes, keep total scene transfer bounded rather than shipping 15 MB hero downloads).
- **Static poster & reduced-motion fallback**: render a high-craft static WebP/AVIF poster image immediately for LCP, keep the static poster when `prefers-reduced-motion: reduce` or Save-Data is active (with an explicit opt-in play toggle if interactive inspection matters), and keep all copy, buttons, and forms in semantic DOM above the canvas.

```tsx
'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function ProductSpline({ sceneUrl, posterUrl, alt }: { sceneUrl: string; posterUrl: string; alt: string }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (reducedMotion) {
    return <img src={posterUrl} alt={alt} className="scene-poster" />;
  }

  return (
    <Suspense fallback={<img src={posterUrl} alt={alt} className="scene-poster" />}>
      <Spline scene={sceneUrl} aria-label={alt} />
    </Suspense>
  );
}
```

### Unicorn Studio (interactive WebGL scene embeds)

Use **Unicorn Studio** when embedding designer-authored shader/WebGL motion backdrops with explicit performance and accessibility guardrails:

- Lazy-initialize (`UnicornStudio.init()`) only when the section approaches the viewport, cap DPR (`data-us-dpi="1.5"`), and destroy/pause instances when scrolled offscreen or unmounted (`UnicornStudio.destroy()`).
- Always render a lightweight CSS/static poster fallback beneath the canvas for `prefers-reduced-motion: reduce`, low-power/Save-Data devices, or WebGL context failure.
- Treat Unicorn Studio strictly as an atmospheric layer—never lock readable headlines, navigation, or conversion forms inside the WebGL canvas.

## Official references

- Three.js docs: https://threejs.org/docs/
- Three.js WebGPU & TSL wiki/examples: https://threejs.org/examples/?q=webgpu
- React Three Fiber docs: https://r3f.docs.pmnd.rs/
- Drei docs: https://drei.docs.pmnd.rs/
- Theatre.js docs: https://www.theatrejs.com/docs/latest
- Spline docs: https://docs.spline.design/
- WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
