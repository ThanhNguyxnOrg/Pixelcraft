# 3D asset pipeline

## Preferred delivery path

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
