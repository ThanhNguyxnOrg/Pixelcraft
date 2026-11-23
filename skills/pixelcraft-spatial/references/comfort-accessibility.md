# XR comfort, ergonomics, and accessibility

## Locomotion and frame-rate comfort

Motion sickness usually comes from sensory conflict: visual motion without matching vestibular motion, unexpected camera acceleration/rotation, latency, or unstable frames.

Rules:

- never move/rotate/tilt the camera involuntarily for cutscenes, transitions, impacts, or UI emphasis;
- prefer physical movement or teleport for high-comfort defaults;
- offer snap turn and smooth turn as explicit settings; do not decide one is universally correct;
- use acceleration sparingly; constant velocity is usually easier than rubbery acceleration;
- use tunneling/vignette during artificial locomotion, configurable in angular size/feather/color where supported;
- avoid forced bobbing/head shake/peripheral motion particles;
- maintain orientation landmarks and provide recentering/pause/exit at all times;
- preserve user control during loading/network stalls.

There is no universal “correct FPS” across devices. The hard rule is to meet the target headset/runtime frame rate with worst-case scenes and thermal state. Design scenes with measured headroom rather than average frame rate; frame-time spikes matter. Test density, lighting/shadows, transparency/overdraw, postprocessing, physics, GC churn, asset streaming, and both eyes.

## Ergonomic distances, field of view, and angular sizing

These are working spatial-design heuristics, not regulatory constants. Validate target headset optics/body size/app scale. Use angular measures because physical pixel size at one distance is meaningless in XR.

Angular conversion:

```text
physical size ≈ 2 × distance × tan(angle / 2)
```

At 1 meter, a 0.5° object is about 8.7 mm tall and a 1° object about 17.5 mm tall. At 2 meters those values double.

Practical starting envelope:

| Concern | Initial heuristic |
|---|---|
| frequent direct interaction | roughly 0.5–1.5 m from user, within reachable/comfortable arm/torso posture |
| primary read/watch content | roughly 1–3 m depending scale/session; avoid forcing prolonged neck flexion |
| near boundary | be cautious below ~0.5 m because stereo convergence/focus and physical collision discomfort increase |
| frequent attention zone | around eye height within approximately ±15° vertical/horizontal of neutral forward gaze |
| secondary scan zone | up to roughly ±30°, not dense permanent controls |
| periphery | ambient/wayfinding only; no critical persistent text or tiny targets |
| critical short text | start around 0.5° visual angle or larger and validate in headset |
| ordinary readable body text | often needs ~0.7–1°+ depending duration/contrast/typeface/user |
| minimum target visual size | start around 1–1.5° plus input-error tolerance; increase for gaze/hand/controller imprecision |

Do not copy phone point sizes into 3D. Compute physical size from intended distance using the formula above. Validate seated/standing heights, wheelchair reach, shorter/taller users, and recentering behavior.

## Depth and layering

Depth should encode spatial meaning:

- near objects invite direct manipulation;
- mid-distance surfaces support reading/selection;
- distant content supports scale/context/ambience;
- foreground occlusion must never hide critical controls unexpectedly;
- shadows/contact cues/lighting establish grounding better than arbitrary float height;
- parallax is evidence of depth—test while moving, not only from a fixed camera screenshot.

Avoid z-fighting, intersecting panels, clipping through walls/users, duplicate curved screens at slightly different depths, and eye-level content that blocks passthrough/safety awareness. In mixed reality, respect real surfaces/occlusion rather than treating the room as empty.

## Gaze-and-pinch input and privacy

Gaze direction, dwell time, hand/body pose, room scans, passthrough imagery, voice, and behavioral biometrics are sensitive even when no raw camera frame is stored.

Rules:

- prefer system-mediated hover/selection feedback;
- collect the minimum spatial/eye/hand telemetry necessary and define retention;
- do not use covert dwell/attention scoring for manipulation or advertising;
- explain permission purpose in plain language before system prompts;
- provide controller/indirect/touch alternatives where gaze/hand tracking is unavailable or denied;
- never require precise pinch/rapid gestures as the only completion path.

Input feedback sequence: target/hover → confirmation of acquisition → manipulation/state change → release/commit. Missing intermediate feedback makes spatial controls feel unreliable.

## Text legibility in XR

- use high contrast, sturdy weight, generous line spacing, and controlled measure;
- avoid thin/light fonts, subpixel-dependent detail, dense tables, and long paragraphs;
- keep text surfaces perpendicular enough to view direction or provide billboard/reorientation behavior deliberately;
- account for chromatic aberration at lens edges, mura/compression, passthrough lighting, and accommodation distance;
- localize expansion/CJK/RTL/Indic scripts and test glyph rasterization at physical scale;
- use semantic UI/text objects rather than baking critical text into textures where possible.

## Accessibility in XR

Provide meaningful alternatives rather than declaring XR inherently exempt:

- seated mode, height scaling, recentering, one-handed mode, controller-only mode;
- captions/subtitles and visual alerts for spatial audio cues;
- audio/haptic cues for visual state and visual cues for audio/haptic state;
- adjustable text scale/contrast/brightness and color-independent encoding;
- reduced motion/comfort presets and locomotion speed/turn-angle controls;
- remappable input and dwell/activation alternatives;
- screen reader/voice access where platform supports it, semantic object labels otherwise;
- safe exit/pause accessible without precise gesture or visual search.

Test with real target users/devices where possible. Simulator compliance checklists do not capture fatigue, nausea, reach, tracking failure, or sensory overload.
