---
name: pixelcraft-spatial
description: Designs and verifies embodied spatial, XR, VR, and AR interfaces across visionOS 26, Android XR (Jetpack XR / Compose for XR), Meta Horizon OS / Meta Spatial SDK, WebXR (@react-three/xr, Wonderland Engine, Needle Engine), Unity XR Interaction Toolkit, and Unreal OpenXR. Use for headset, room-scale, windows/volumes/immersive spaces, RealityKit, SceneCore, ornaments/orbiters, gaze-and-pinch/hand/controller input, locomotion comfort, depth/layering, spatial text legibility, frame-rate budgets, privacy, and XR accessibility; ordinary browser 3D scenes use pixelcraft-web.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft spatial

Spatial UI is embodied interface design. Depth, scale, motion, head/body ergonomics, input privacy, frame stability, and real-world safety are product behavior—not decorative polish. Do not place a flat screen in space and call it XR.

## Surface craft

Attach depth to a meaningful relationship such as an object with nearby annotation, not decorative panels scattered around the room. Keep primary controls at a comfortable stable depth; offer seated and low-motion routes, with a non-immersive alternative where practical. Verify occlusion, relocalization and task completion with actual input when hardware is available.

## References

- Read [references/platforms.md](references/platforms.md) for visionOS 2/26, Android XR (Jetpack Compose for XR / SceneCore), Meta Horizon OS / Meta Spatial SDK, WebXR (`@react-three/xr` v6, Wonderland Engine, Needle Engine, Babylon.js/PlayCanvas WebXR, WebXR Layers), Unity XR Interaction Toolkit, and Unreal OpenXR.
- Read [references/comfort-accessibility.md](references/comfort-accessibility.md) for locomotion comfort, frame-rate discipline, ergonomic distances/fields of view, angular sizing, depth/layering, gaze/pinch privacy, text legibility, and XR accessibility.

For ordinary browser 3D product scenes and graphics runtimes (`<model-viewer>`, Three.js/R3F, Babylon.js, PlayCanvas, Threlte, TresJS, luma.gl), use the `pixelcraft-web` skill.

## Required workflow

1. **Define reality model.** Shared windowed workspace, bounded volume, mixed-reality passthrough, immersive VR, tabletop/room scale, seated/standing/mobile use, and session duration.
2. **Map input truth.** Gaze/pinch, direct touch, indirect ray, controllers, hand tracking, keyboard/voice/gamepad, tracking loss, latency, and privacy permissions.
3. **Establish scale and coordinate systems.** Units, floor/reference space, user height/seated mode, recentering, collision/boundary behavior, and real-world object persistence.
4. **Design depth hierarchy.** Primary content, interactable objects, ambient context, UI chrome, passthrough visibility, occlusion, shadows, focus feedback, and layering collisions.
5. **Choose comfort intentionally.** Physical movement, teleport, snap/continuous turn, continuous motion, acceleration, camera motion, vignette, and user comfort settings.
6. **Verify in headset.** Simulator/browser rendering cannot prove comfort, stereo convergence, input fatigue, scale, tracking, or frame stability.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| **Meta Quest VRC & frame lock** | Render the first head-tracked interactive frame in **`<= 4 s`** from launch and hold a locked **`72 / 90 / 120 fps`** (**`0` head-pose frame drops**; enable dynamic/eye-tracked foveated rendering `FFR`/`ETFR` before cutting stereo clarity). |
| **visionOS target & zero-shift gaze** | Size interactive spatial targets **`>= 60×60 pt` (`dpt`)** with **`>= 12–16 pt` edge spacing** (`>= 72–76 pt` center-to-center) and enforce **zero geometry/layout shift on eye-gaze hover**—use subtle OS specular/luminance `.hoverEffect()` only (resizing or nudging bounds under gaze causes saccadic oscillation and eye strain!). |
| **Spatial ergonomics & postures** | Anchor primary reading/control panels **`1.2–2.0 m`** away and **`5–15°` below eye horizon**, support **relaxed lap-level indirect pinch** ("gorilla-arm" prevention), **full one-handed completion** (zero mandatory two-hand chorded gestures without single-hand alternative), and **Seated, Standing, Wheelchair, AND Lying-down / Reclined recentering & height calibration**. |
| **No head-locked HUDs & interruption recovery** | **Never lock world-blocking HUD panels rigidly to head rotation** (use world-locked, lazy-follow, or wrist/orbiter anchors); never rotate/move the camera involuntarily; ship **teleport + `30–45°` snap-turn + angular comfort vignette** defaults; and handle **tracking-lost, low-light hand-tracking degradation, small-room/stationary guardian boundary, and headset-removed/donned interruption states** gracefully without disorientation or data loss. |
| **Passthrough & privacy** | Reserve raw eye-gaze rays strictly to OS system hover (zero covert gaze telemetry), disclose room/hand/camera permissions, and verify **passthrough UI legibility in both sunlit bright rooms AND dim rooms**. |
| **Spatial captions, audio cues & physical comfort QA** | Pair directional 3D audio with **world/lazy-anchored spatial captions AND directional visual edge/radar cues** so deaf/HoH users never miss off-FOV events; provide controller/hand/voice parity; and run **multi-user body/IPD/vision comfort testing on physical headsets** (`rendered`, never inferred from flat 2D simulator previews per `Rule #0.3`). |

## Pre-submit checklist

- [ ] **Boot & frame budget**: first head-tracked frame **`<= 4 s`** and locked **`72 / 90 / 120 fps`** (`0` head-pose drops, dynamic foveation profiled) verified on physical headset or marked `not-checked`;
- [ ] **Targets & gaze stability**: visionOS/spatial controls **`>= 60×60 pt` (`dpt`)** with **`>= 12–16 pt` spacing** and **zero layout/geometry shift on eye-gaze hover**;
- [ ] **Ergonomics, one-handed & wheelchair postures**: primary panels **`1.2–2.0 m`** at **`5–15°` below eye horizon**, **relaxed lap-level indirect pinch**, **one-handed mode**, and **Seated + Standing + Wheelchair + Lying-down/Reclined** recentering verified;
- [ ] **Comfort, captions & interruptions**: zero head-locked world-blocking HUDs; teleport + **`30–45°` snap-turn** + vignette defaults; **spatial captions & visual cues for spatial audio**; and **tracking-lost / low-light / small-room / headset-removed interruption states** handled cleanly;
- [ ] **Real-room passthrough, privacy & multi-user headset comfort**: text/glass contrast tested in **sunlit bright + dim rooms**, eye-gaze kept private to OS hover, and **multi-user body/vision comfort tested on physical headsets** (or labeled `not-checked`);
- [ ] **Checklist-Until-Passing Stop-Gate (`<HARD-GATE>`):** walk every checklist item above + run `slop-scan.mjs --fail-on p2`, `check-contrast.mjs`, XR build/profiler checks, and `check-acceptance.mjs .pixelcraft/acceptance.json` (`pixelcraft-review`) in a `Fix → Re-verify` loop until passing (`0` `fail`/`pending` rows, `rendered` evidence on visual/perf/a11y per `Rule #0.3`).
