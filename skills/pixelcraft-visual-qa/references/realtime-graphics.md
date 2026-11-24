# Canvas, WebGL, WebGPU and 3D verification

## Runtime states

Verify:
- poster/placeholder before renderer initialization;
- ready state and the primary task;
- failed asset and offline/network failure;
- unsupported API or lost GPU context;
- document hidden/offscreen and restored;
- resize/orientation change and DPR change;
- reduced-motion or low-power mode;
- repeated open/close and memory cleanup.

## Performance record

Record browser/device/GPU where visible, viewport, DPR, refresh rate, scene state, cold/warm cache, frame-time/FPS sample, long tasks, transfer/parse cost, asset sizes, draw calls/texture dimensions where tooling exposes them, and measurement method. Distinguish actual hardware from emulation.

## Visual evidence

A rendered screenshot supports composition, not frame stability, interaction, or GPU cost. Use a profiler/performance trace and actual interaction where available. If tooling cannot expose GPU/memory information, report the limitation; do not estimate a passing number.

## Quality gates

- Essential text/actions remain semantic DOM.
- Canvas has a fallback and accessible summary/control path.
- Work pauses when hidden/offscreen where appropriate.
- Resources and listeners are released on unmount/route change.
- No high-frequency flashing or unwanted motion.
