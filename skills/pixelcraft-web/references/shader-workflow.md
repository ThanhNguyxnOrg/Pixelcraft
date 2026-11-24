# Shader workflow (GLSL, WGSL, and TSL)

## Before writing a shader

- State the visual/material behavior in plain language and identify its semantic role.
- Choose **GLSL ES 3.0** (`#version 300 es`) for WebGL 2, **WGSL** for raw WebGPU, or **TSL (`three/tsl`)** when using Three.js `WebGPURenderer` so one node graph compiles to both WGSL and GLSL (`scene-architecture.md`).
- Define input textures, coordinate space, uniforms, color space (linear math → sRGB output), alpha behavior, precision (`precision highp float;` on mobile GPUs to avoid UV/time banding), and a **`uReduceMotion`** uniform (`0.0` or `1.0`) so reduced-motion mode freezes evolution cleanly without recompiling shaders.
- Build a static UV diagnostic frame first, then layer clamped time/pointer/audio uniforms.

## Starter patterns (GLSL / WGSL / TSL)

```glsl
// GLSL ES 3.0 fragment starter: explicit highp precision, aspect-corrected UVs, uReduceMotion gate
#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uReduceMotion; // 1.0 when prefers-reduced-motion: reduce

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 centered = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float phase = mix(uTime * 0.35, 0.0, uReduceMotion);
  float band = 0.5 + 0.5 * sin(length(centered) * 6.0 - phase);
  vec3 col = mix(vec3(0.08, 0.11, 0.16), vec3(0.20, 0.42, 0.62), band * (1.0 - uv.y * 0.3));
  fragColor = vec4(col, 1.0);
}
```

```wgsl
// WGSL fragment starter: uniform buffer with reduced-motion gate
struct Uniforms {
  resolution: vec2<f32>,
  time: f32,
  reduceMotion: f32,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

@fragment
fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let centered = (pos.xy - 0.5 * u.resolution) / min(u.resolution.x, u.resolution.y);
  let phase = mix(u.time * 0.35, 0.0, u.reduceMotion);
  let band = 0.5 + 0.5 * sin(length(centered) * 6.0 - phase);
  return vec4<f32>(mix(vec3<f32>(0.08, 0.11, 0.16), vec3<f32>(0.20, 0.42, 0.62), band), 1.0);
}
```

```ts
// Three.js TSL starter (compiles to WGSL on WebGPU and GLSL on WebGL2)
import { color, float, length, mix, sin, time, uniform, uv } from 'three/tsl';

const uReduce = uniform(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0);
const phase = mix(time.mul(0.35), float(0), uReduce);
const band = sin(length(uv().sub(0.5)).mul(6).sub(phase)).mul(0.5).add(0.5);
material.colorNode = mix(color(0x141c29), color(0x336b9e), band);
```

## Debugging sequence

1. Confirm shader compiles cleanly (check `gl.getShaderInfoLog` / `device.pushErrorScope('validation')`).
2. Render a diagnostic UV gradient to verify aspect ratio and DPR scaling.
3. Verify sRGB/linear color space, tone mapping, premultiplied alpha, and texture flip-Y orientation.
4. Add one pass at a time while checking GPU frame time and memory.
5. Test context loss, resize, texture load failure, `uReduceMotion = 1`, and static fallback (`rendered`).

## Rules

- Bound loop counts and texture reads; avoid deep nested loops or wide blur kernels on mobile GPUs.
- Use derivative-based antialiasing (`fwidth`) for crisp procedural edges.
- Never introduce high-frequency flashing or strobing (>3 Hz, WCAG 2.3.1).
- Seed procedural noise deterministically for reproducible visual QA.
- Never paste proprietary shaders; derive original effects from the surface brief.

References: WebGL Fundamentals (https://webglfundamentals.org/), WGSL spec (https://www.w3.org/TR/WGSL/), and Three.js TSL (https://threejs.org/examples/?q=tsl).
