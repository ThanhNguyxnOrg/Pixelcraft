# React Three Fiber (R3F v9) integration

Use R3F as a renderer inside an existing React application, not as an alternate application architecture. Keep the DOM/scene boundary explicit. For non-React declarative 3D (Svelte Threlte, Vue TresJS) or Babylon.js/`<model-viewer>`, see [web-3d-engines.md](web-3d-engines.md).

## Version & ecosystem compatibility

- **R3F v9 + React 19**: React 19 requires **`@react-three/fiber` v9+** (R3F v8 is strictly for React 18). Match `@react-three/drei`, `@react-three/postprocessing`, and `@react-three/rapier` majors to your installed React/R3F versions.
- **Postprocessing (`@react-three/postprocessing`)**: batch effects inside a single `<EffectComposer multisampling={0}>` (for example selective `<Bloom mipmapBlur luminanceThreshold={1} />` + `<ToneMapping mode={ToneMappingMode.ACES_FILMIC} />`) instead of stacking unmerged fullscreen shader passes.
- **Physics (`@react-three/rapier`)**: wrap physics bodies in `<Physics paused={reducedMotion || !visible}>` so WASM physics steps pause when offscreen or static, and keep collider meshes simpler than visual meshes (`colliders="hull"` / primitives).
- **WebGPU (`three/webgpu`)**: R3F v9 accepts an async `gl` factory (`gl={async (props) => { const r = new WebGPURenderer(props); await r.init(); return r; }}`) so scenes can opt into Three.js `WebGPURenderer` + TSL (`scene-architecture.md`) with WebGL2 fallback.

## Component boundaries

- Place `<Canvas>` in a narrow `'use client'` component dynamically imported with `ssr: false` (or client-only lazy wrapper) when using server-rendered React/Next.js/React Router/TanStack Start.
- Keep SEO text, headings, buttons, pricing, product options, and accessible descriptions outside `<Canvas>`.
- Keep per-frame values in refs/mutable objects (`meshRef.current.rotation.y += delta`); **never** call `setState` inside `useFrame`.
- Memoize shared geometries/materials and avoid recreating loaders, vectors (`new THREE.Vector3()`), or callbacks inside `useFrame`.

## Demand rendering & explicit `invalidate`

Default to `frameloop="demand"` for product viewers, configurators, and mostly static scenes so the GPU idles at 0% between interactions, and call **`useThree((s) => s.invalidate)`** whenever external state or an imperative animation requires a fresh frame:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type * as THREE from 'three';

function ProductMesh({ finishColor }: { finishColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    invalidate(); // Request one new frame when finishColor changes under frameloop="demand"
  }, [finishColor, invalidate]);

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={finishColor} />
    </mesh>
  );
}

export function ProductCanvas({ finishColor }: { finishColor: string }) {
  return (
    <Canvas dpr={[1, 2]} frameloop="demand" gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      <ProductMesh finishColor={finishColor} />
      <OrbitControls enableDamping makeDefault />
    </Canvas>
  );
}
```

## Interaction, SSR, and fallback

- Keep camera controls bounded (`minDistance`, `maxDistance`, `maxPolarAngle`) and expose a DOM "Reset view" button and keyboard controls for interactive viewers.
- Render a styled poster/image fallback inside `<Suspense fallback={...}>` and wrap `<Canvas>` in a React Error Boundary so WebGL/WebGPU unavailability degrades to a clean static product view.
- Never instantiate WebGL/WebGPU during SSR; seed any procedural geometry deterministically so visual QA is reproducible.

## Official references

- R3F docs: https://r3f.docs.pmnd.rs/
- R3F hooks & `invalidate`: https://r3f.docs.pmnd.rs/api/hooks
- `@react-three/postprocessing`: https://react-postprocessing.docs.pmnd.rs/
- `@react-three/rapier`: https://github.com/pmndrs/react-three-rapier
