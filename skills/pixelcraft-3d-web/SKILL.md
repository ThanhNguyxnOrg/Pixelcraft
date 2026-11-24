---
name: pixelcraft-3d-web
description: Designs and implements real-time 3D browser experiences with Three.js, React Three Fiber, Drei, Spline, WebGL, WebGPU, shaders, physics, and optimized GLTF assets. Use for 3D product showcases, configurators, interactive portfolios, spatial storytelling, camera controls, GPU rendering, or web 3D performance.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft 3D web

Use real-time 3D only when spatial inspection, depth, material, scale, or manipulation materially improves the task. A visually impressive scene is not a reason to put essential information in a canvas.

## References

- Read [references/scene-architecture.md](references/scene-architecture.md) for renderer, camera, controls, lighting, and scene structure.
- Read [references/r3f-integration.md](references/r3f-integration.md) for React Three Fiber, React/Next.js boundaries, and application state.
- Read [references/assets-pipeline.md](references/assets-pipeline.md) for GLTF/GLB models, textures, animation clips, compression, and streaming.
- Read [references/rendering-performance.md](references/rendering-performance.md) for GPU, frame-time, memory, adaptive-quality, fallback, and mobile budgets.

## Rendering strategy

| Requirement | Candidate | Decision boundary |
|---|---|---|
| Conventional UI with a few depth effects | DOM/CSS/SVG | Prefer semantic native elements |
| Interactive scene in a framework-independent page | Three.js | Direct scene, renderer, camera, lifecycle, and loading ownership |
| React tree containing 3D objects | React Three Fiber + selective Drei | React owns declarative structure; frame updates stay in render loop |
| Designer-authored embedded scene | Spline | Validate export/runtime, responsive behavior, controls, accessibility, and vendor constraints |
| Custom real-time graphics | WebGL or WebGPU | Choose required GPU features and support, with a fallback |
| Physical interaction | Rapier or maintained physics engine | Add only when dynamics affect the task |

WebGPU is an optional capability path, not a universal baseline. Feature-detect it, verify browser/device coverage and library support, and retain WebGL, DOM, video, or static alternatives.

## Workflow

1. Prove the spatial requirement and identify what remains semantic DOM content.
2. Inventory renderer, framework, routing, bundler, asset formats, GPU constraints, and supported devices before adding packages.
3. Define units, world scale, camera, controls, targets, lighting, color management, shadow strategy, and loading/error states.
4. Keep controls, headings, labels, links, forms, and critical data in semantic HTML where practical.
5. Load heavy code/assets on demand. Show a useful poster/loading state; do not block first content on the full scene.
6. Optimize models/textures before postprocessing. Use instancing, LOD, compression, culling, and adaptive quality where measured.
7. Verify on a representative mid-tier laptop and mobile device. Record frame time/FPS context, memory, context loss/recovery, touch controls, reduced motion, and static fallback.

## Scene rules

- Keep one renderer/canvas per intended scene unless sharing is justified by measurement.
- Make camera control explicit and recoverable; provide reset/view presets when users can lose orientation.
- Do not move the camera without user intent in operational/product tasks.
- Avoid excessive bloom, depth of field, transparency, real-time shadows, and full-scene postprocessing by default.
- Do not set React state every frame. Use the renderer loop and mutable refs for continuous motion.
- Dispose geometry, materials, textures, render targets, controls, listeners, and observers on teardown.
- Handle resize, DPR, visibility, reduced motion, WebGL context loss, failed assets, and unsupported WebGPU.
- Route headset gaze, room data, and immersive headset input to pixelcraft-spatial.

## Do not

- Create a generic floating orb as a signature.
- Ship huge models or 4K textures without a user-facing reason and loading budget.
- Put text, navigation, primary actions, or accessible names exclusively inside canvas.
- Infer performance from desktop screenshots or successful builds.
- Replace a project renderer or package manager without an authorized migration.

## Completion contract

State why 3D is needed, renderer and compatibility path, model/texture preparation, semantic fallback, measured device/frame evidence, and unchecked runtime constraints.
