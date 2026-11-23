# XR platform notes

## visionOS

Core surface model:

| Surface | Use |
|---|---|
| window | ordinary 2D UI floating in Shared Space; resize/adaptation are standard expectations |
| volume | bounded 3D content people can view from multiple angles without taking over the whole space |
| immersive space | content controls the scene; use when presence/world interaction is the point, not for ordinary forms |

Apple guidance warns that supplemental content generally belongs in an adjacent window rather than ornaments. Use ornaments for controls/tooling closely tied to a window, keep them reachable at resize extremes, and avoid duplicate navigation chrome. Use system glass/material behavior for the control layer; do not apply translucent material indiscriminately to content where it harms legibility. Inset meaningful inline 3D objects so they do not collide with edges/controls.

Input/privacy facts from Apple's guidance:

- gaze-and-pinch input is private by design: hover feedback lets people know what is targeted without exposing gaze before selection;
- use system/SwiftUI/RealityKit hover effects rather than logging gaze merely to recreate feedback;
- ARKit world/hand/scene data may require a Full Space and explicit permission depending on feature;
- do not infer emotion/identity/attention beyond the user's explicit input;
- support indirect input, direct touch equivalents, keyboard/gamepad/accessibility paths where relevant.

RealityKit/SwiftUI rules:

- choose `WindowGroup`, `Volume`, or `ImmersiveSpace` deliberately rather than mixing all three by default;
- keep entity hierarchy/scale in meters and account for resize/reposition;
- use attachments/ornaments for UI connected to 3D entities only when alignment and collision behavior are tested;
- test Shared Space behavior with other apps/windows and Full Space permission boundaries separately.

## WebXR, Three.js, React Three Fiber, and A-Frame

The WebXR Device API is a W3C browser standard surface. Core concepts:

- feature-detect `navigator.xr` and `isSessionSupported(mode)`;
- common modes are `inline`, `immersive-vr`, and `immersive-ar`;
- request sessions with required/optional features explicitly (`local-floor`, `bounded-floor`, `hand-tracking`, `layers`, plane/mesh features where supported);
- input sources expose handedness/target ray/grip semantics depending on device;
- browser/session support is fragmented; provide non-XR fallback and do not use user-agent detection.

Three.js baseline:

```js
renderer.xr.enabled = true;
renderer.setAnimationLoop(render);
```

Use `setAnimationLoop`, not a normal animation-frame loop, for XR presentation. Manage reference-space scale, camera rig movement rather than camera-only hacks, controller events, resize/session end, color space, tone mapping, and frame budget. Do not import desktop postprocessing chains without measuring stereo cost.

React Three Fiber/XR packages wrap Three.js rather than removing XR constraints. Keep immutable scene state outside per-frame render paths, dispose GPU resources, memoize geometry/materials, and profile both eyes. Use the current `@react-three/xr` API/version rather than copying older examples.

A-Frame is entity-component HTML-like composition over Three.js. It is appropriate for declarative prototypes/scenes, but component lifecycle, asset loading, occlusion, input abstraction, and version compatibility still require real-device verification.

## Meta Quest / Interaction SDK

Use native interaction primitives instead of custom rays/colliders where possible:

- ray/distance interaction for sparse distant targets;
- poke/direct touch for near panels;
- grab/hand interaction for physical manipulation;
- controller and hand-tracking parity or explicit alternatives;
- visual/audio/haptic feedback for hover/select/grab/release;
- hand tracking loss/false-positive recovery.

Meta's locomotion tunneling implementation defines the vignette angularly rather than assuming a fixed device FOV. That principle matters generally: express comfort occlusion in visual-angle terms, not screen UV alone.

## Unity XR Interaction Toolkit

Useful architecture:

- XR Origin/XR rig as the movable player reference;
- interactors/interactables rather than ad hoc raycast input;
- locomotion mediator/providers for move/turn/teleport;
- snap turn and continuous turn as distinct user options;
- tunneling vignette as a configurable comfort mode;
- input action abstraction across controller profiles.

Measure frame timing in Unity Profiler/device capture, not editor playback. Quest/Android XR builds have different thermal/GC/rendering constraints than desktop editor runs.
