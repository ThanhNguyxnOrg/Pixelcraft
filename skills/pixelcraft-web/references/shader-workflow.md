# Shader workflow

## Before writing a shader

- State the visual/material behavior in plain language and identify its semantic role.
- Choose GLSL for the selected WebGL pipeline or WGSL for a verified WebGPU path; do not assume source code ports between them.
- Define input textures, coordinate space, uniforms, color space, alpha behavior, time source, precision needs, and target output.
- Build a static shader frame first, then add pointer/time/audio inputs.
- Clamp time/delta and normalize coordinates across aspect ratios and DPR.

## Debugging sequence

1. Confirm shader compiles on the supported target.
2. Render a diagnostic color/UV gradient.
3. Check color space, gamma/tone mapping, premultiplied alpha, texture orientation, and sampling.
4. Add one effect at a time and inspect GPU/CPU frame cost.
5. Test context loss, resize, texture failure, reduced motion, and static fallback.

## Rules

- Bound loop counts and texture reads.
- Avoid expensive nested loops or large sample kernels without profiling.
- Use derivative-based antialiasing and scale-aware thresholds where appropriate.
- Do not introduce high-frequency flashing/noise.
- Seed procedural noise for deterministic visual QA.
- Do not paste shader code from a proprietary site or reproduce distinctive artwork; derive an original effect from the interaction requirement.

References: WebGL Fundamentals (https://webglfundamentals.org/) and WGSL spec (https://www.w3.org/TR/WGSL/).
