# 3D asset pipeline

## Preferred delivery path

1. Author or obtain assets with clear provenance and license.
2. Export GLB/glTF with only required meshes, materials, animations, and texture sets.
3. Remove hidden/unused objects, duplicate materials, unused animation clips, and excess geometry.
4. Compress geometry with a compatible Draco or Meshopt path where it benefits transfer/parse cost.
5. Compress textures with a supported GPU texture format (for example KTX2/Basis Universal) where target runtime support is verified.
6. Generate sensible LODs and responsive texture variants for large models.
7. Load lazily, cache by stable URL/version, and retain a poster/loading/error state.

## Validation

- Check visual parity after compression: normals, tangents, color space, alpha, texture filtering, animation, and material appearance.
- Measure compressed transfer, parse/decode time, GPU memory, draw calls, texture dimensions, and time-to-interactive scene.
- Prefer instancing for repeated objects; use LOD/culling for large environments.
- Do not fetch all variants at first paint. Load only the active product/scene path.
- Preserve licensing and authorship metadata for supplied/downloaded assets.

## Useful tooling and references

- glTF 2.0: https://www.khronos.org/gltf/
- glTF extensions: https://www.khronos.org/gltf/
- Three.js GLTFLoader: https://threejs.org/docs/#examples/en/loaders/GLTFLoader
- Draco: https://google.github.io/draco/
- Meshoptimizer: https://meshoptimizer.org/
- KTX-Software: https://github.com/KhronosGroup/KTX-Software
