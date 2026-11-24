---
name: pixelcraft-creative-code
description: Builds expressive real-time 2D graphics, generative visuals, particles, custom shaders, image distortion, and GPU effects with Canvas, PixiJS, WebGL, GLSL, WebGPU, and WGSL. Use for procedural art, interactive backgrounds, shader effects, particle systems, visualizers, generative layouts, or custom rendering beyond ordinary DOM/CSS.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft creative code

Creative coding is a rendering decision, not an excuse to abandon semantic UI. Keep the page understandable without the effect, bound the graphics surface, and treat GPU cost and context failure as product states.

## References

- Read [references/rendering-choice.md](references/rendering-choice.md) before choosing SVG, Canvas 2D, PixiJS, WebGL, OGL, or WebGPU.
- Read [references/shader-workflow.md](references/shader-workflow.md) when writing GLSL/WGSL or building procedural materials.
- Read [references/creative-effects.md](references/creative-effects.md) for particles, displacement, noise fields, SDF, generative grids, and interaction recipes.

## Choose the least powerful renderer that fits

| Need | Prefer | Escalate when |
|---|---|---|
| Icons, diagrams, crisp paths, morphable marks | SVG | Many thousands of animated primitives exceed practical DOM/SVG cost |
| Few 2D shapes or simple paint interaction | Canvas 2D | Batching, textures, filters, or sprite workloads need GPU |
| Sprite-heavy 2D, particles, filters, visual layers | PixiJS | Custom shader pipeline or 3D scene is required |
| Small custom WebGL scene/shader | OGL or direct WebGL | Larger scene graph, loaders, lighting, or ecosystem needed |
| Complex 3D/browser scene | Three.js / R3F | Route scene architecture to pixelcraft-3d-web |
| Supported compute/rendering features | WebGPU/WGSL | Never make it the only path without an explicit constraint |

Do not introduce PixiJS, WebGL, or WebGPU for content CSS/SVG can render clearly and cheaply.

## Workflow

1. Define canvas bounds, resolution, coordinate space, pointer/touch mapping, time source, pause behavior, and semantic equivalent.
2. Identify whether the effect is decoration, meaningful data, direct manipulation, or primary content.
3. Set target frame rate, DPR cap, object/particle count, texture dimensions, memory, and CPU/GPU budget before implementation.
4. Build a deterministic static state first; add animation, pointer input, or audio reactivity afterward.
5. Isolate renderer from layout/application state. Avoid per-frame allocation or framework rerenders.
6. Handle resize, DPR, visibility, context loss, reduced motion, pointer cancellation, and initialization failure.
7. Verify on target devices and throttled conditions; capture fallback, pause, error, and restoration states.

## Guardrails

- Use normalized coordinates and scale-aware geometry; avoid viewport-only hard coding.
- Make effects deterministic for screenshots/tests with fixed seed/time where possible.
- Keep text, labels, focusable controls, and data summaries in DOM where practical.
- Use workers/OffscreenCanvas only when supported and profiling proves a main-thread bottleneck.
- Bound particle count and simulation steps; clamp delta time after tab suspension.
- Respect color space, alpha/compositing, premultiplied alpha, texture filtering, and DPR.
- Avoid flashing, rapid oscillation, and high-contrast repetitive patterns.
- Pause offscreen/hidden; expose mute/pause for ambient visual/audio systems.
- Provide static poster, CSS/SVG fallback, or simplified low-power renderer.

## Completion contract

Report renderer, target features, deterministic test controls, device/performance evidence, fallback, and semantic alternatives. Visual resemblance does not identify which rendering API is in use.
