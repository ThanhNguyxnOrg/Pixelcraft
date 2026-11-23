---
name: pixelcraft-spatial
description: Designs and verifies spatial, XR, VR, AR, and 3D interfaces across visionOS, WebXR, Three.js/React Three Fiber/A-Frame, Meta Quest Interaction SDK, and Unity XR Interaction Toolkit. Use for windows/volumes/immersive spaces, RealityKit, ornaments, glass materials, hover effects, gaze-and-pinch input, hand/controller interaction, locomotion comfort, depth/layering, XR ergonomics, spatial text legibility, privacy, frame-rate budgets, and XR accessibility.
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft spatial

Spatial UI is embodied interface design. Depth, scale, motion, head/body ergonomics, input privacy, frame stability, and real-world safety are product behavior—not decorative polish. Do not place a flat screen in space and call it XR.

## References

- Read [references/platforms.md](references/platforms.md) for visionOS, WebXR, Three.js/React Three Fiber/A-Frame, Meta Quest Interaction SDK, and Unity XR Interaction Toolkit.
- Read [references/comfort-accessibility.md](references/comfort-accessibility.md) for locomotion comfort, frame-rate discipline, ergonomic distances/fields of view, angular sizing, depth/layering, gaze/pinch privacy, text legibility, and XR accessibility.

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
| dimensional purpose | Use 3D/immersion only when spatial inspection, embodiment, presence, scale, or environmental context improves the task. |
| comfort | Never move/rotate the camera involuntarily; offer locomotion/comfort choices and preserve orientation/recovery. |
| frame stability | Dropped frames/reprojection are UX failures in XR; budget assets/shaders/lights/physics accordingly. |
| input feedback | Every interactable needs hover/target/acquire/release feedback through visual/audio/haptic channels appropriate to input mode. |
| privacy | Treat gaze, hand/body tracking, room geometry, camera/passthrough, biometrics, and spatial audio telemetry as sensitive. |
| accessibility | Provide seated/standing/one-handed/controller alternatives, captions/audio equivalents, contrast/scale controls, reduced motion, and non-head-aimed interaction where possible. |
| anti-slop | Reject floating glass panels everywhere, pointless particle/depth effects, miniature desktop UI, unbounded scroll walls, motion-heavy demos, and demo scenes that ignore safety boundaries. |

## Pre-submit checklist

- [ ] reality model, session duration, physical posture, and input modes are explicit;
- [ ] object scale/distance/angular size can be recalculated from documented assumptions;
- [ ] primary content stays in a comfortable viewing/interaction envelope;
- [ ] depth/layering/occlusion collisions are tested from multiple positions/heights;
- [ ] locomotion and camera-motion choices include comfort settings;
- [ ] measured frame timing/headroom meets the target device or is `not-checked`;
- [ ] gaze/hand/camera/room data collection is minimized and disclosed;
- [ ] accessibility alternatives were implemented or explicitly labeled `not-checked`.
