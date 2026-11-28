# Web and 3D asset pipeline

## Web favicons, critical origins, ambient loops & brand logo shortcut

- **Complete Favicon suite (with dark-mode SVG)**: ship a clean, minimal multi-platform icon set rather than 20 obsolete tags:
  - `/favicon.ico` (`32×32` fallback for legacy crawlers/tools),
  - `/icon.svg` with an embedded `@media (prefers-color-scheme: dark)` rule inside `<svg>` so browser tabs adapt cleanly to light and dark chrome,
  - `/apple-touch-icon.png` (`180×180` opaque PNG with safe padding),
  - `/manifest.webmanifest` declaring `192×192` and `512×512` (standard + `maskable`) PNG icons.
- **Preconnect critical origins**: add `<link rel="preconnect" href="https://..." crossorigin>` (in tier 3 of the `capo.js` `<head>` order, `<= 2–4` origins) **only** for origins required immediately above the fold (CDN media host, critical API, or self-hosted asset origin). Never scatter speculative `preconnect` tags for deferred analytics or chat embeds.
- **Prefer muted `<video>` over animated GIFs**: replace multi-megabyte animated GIFs with muted **`<video autoplay muted loop playsinline poster="...">`** encoded in H.264/MP4 + VP9/AV1 WebM (often 5×–10× smaller with higher frame quality). Always pair with a crisp `poster` (for `iOS Low Power Mode` and `prefers-reduced-motion`) and a WCAG 2.2.2 Pause control when looping > 5s (`accessibility-performance.md`).
- **Right-click brand logo shortcut (when a Brand Assets / Press page exists)**: on marketing, product, and docs sites that publish official brand marks, intercept `contextmenu` on the navbar brand logo to offer a compact menu (`Copy logo SVG`, `Download brand kit`, `Open Brand Assets page`) while keeping normal left-click navigation to `/` and keyboard focus completely intact.

```html
<!-- Adaptive dark-mode SVG favicon + complete suite -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
```

```svg
<!-- /icon.svg: adapts automatically to browser tab theme -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    path { fill: #111318; }
    @media (prefers-color-scheme: dark) { path { fill: #f5f7fa; } }
  </style>
  <path d="M6 6h20v20H6z" />
</svg>
```

## 3D asset delivery path

1. Author or obtain assets with clear provenance and license.
2. Export GLB/glTF containing only required meshes, materials, animations, and texture sets.
3. Strip hidden/unused nodes, duplicate materials, unused animation clips, and excess geometry.
4. Compress geometry with **Meshopt** (fast decode, preserves animation/morph targets cleanly) or **Draco** (smallest static meshes) via `gltf-transform`.
5. Transcode textures to **KTX2 / Basis Universal** (ETC1S for diffuse/albedo, UASTC for normal/ORM maps) so textures stay compressed in GPU VRAM instead of expanding into 4×–8× RGBA buffers.
6. Generate sensible LODs and cap texture dimensions (`1024px` mobile / `2048px` hero) before shipping.
7. Load lazily, cache by versioned URL, and show a poster/loading/error state until ready.

## Concrete `gltf-transform` & loader pipeline

```sh
# Optimize GLB: prune/dedup, resize textures <= 1024px, KTX2/WebP textures, Meshopt geometry
npx @gltf-transform/cli optimize raw-chair.glb chair.opt.glb \
  --compress meshopt \
  --texture-compress ktx2 \
  --texture-size 1024

# Inspect geometry, draw calls, texture sizes, and extensions
npx @gltf-transform/cli inspect chair.opt.glb
```

```ts
// Three.js GLTFLoader wired with self-hosted Draco/KTX2/Meshopt decoders + cleanup
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export function createAssetLoader(renderer: THREE.WebGLRenderer) {
  const draco = new DRACOLoader().setDecoderPath('/decoders/draco/');
  const ktx2 = new KTX2Loader().setTranscoderPath('/decoders/basis/').detectSupport(renderer);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.setKTX2Loader(ktx2);
  loader.setMeshoptDecoder(MeshoptDecoder);

  return {
    loader,
    dispose: () => {
      draco.dispose();
      ktx2.dispose();
    },
  };
}
```

Host `/decoders/draco/` and `/decoders/basis/` from your own static assets (rather than unpinned third-party CDNs) so CSP and offline caching remain deterministic.

## Validation

- Check visual parity after compression: normals (keep UASTC or linear encoding on normal maps), tangents, sRGB vs linear color space, alpha cutoff, animation tracks, and material roughness.
- Measure compressed transfer size, decode/parse time, GPU VRAM (`renderer.info.memory`), draw calls (`renderer.info.render.calls`), and time-to-interactive (`rendered`).
- Prefer `InstancedMesh` for repeated geometry and fetch only the active variant rather than preloading every color/model upfront.

## Useful tooling and references

- glTF 2.0 specification: https://www.khronos.org/gltf/
- glTF-Transform CLI & SDK: https://gltf-transform.dev/
- Three.js GLTFLoader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- Draco: https://google.github.io/draco/
- Meshoptimizer: https://meshoptimizer.org/
- KTX-Software: https://github.com/KhronosGroup/KTX-Software
