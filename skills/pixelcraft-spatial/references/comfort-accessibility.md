# XR comfort, ergonomics, and accessibility

## Locomotion, boot time (`<= 4 s`), and locked frame-rate comfort

Motion sickness stems from visual-vestibular conflict, camera acceleration, head-locked clutter, or dropped head-tracked frames:

- **Meta Quest VRC boot & frame lock**: render the **first head-tracked interactive frame in `<= 4 seconds`** from app launch (never hang on a frozen black stereo buffer!) and sustain a locked **`72 / 90 / 120 fps`** with **`0` head-pose frame drops**, enabling **Dynamic / Eye-Tracked Foveated Rendering (`FFR` / `ETFR`)** and stereo layers before sacrificing text resolution.
- **Zero head-locked world-blocking HUDs**: **never bolt opaque HUD panels rigidly to the HMD camera transform**—head-locked panels induce immediate claustrophobia and prevent users from glancing directly at corner labels! Use lazy-follow/tag-along tethers with angular deadzones, wrist anchors, or world-locked spatial panels.
- **Comfort locomotion defaults**: never move/rotate/tilt the camera involuntarily; default to **physical movement / teleport + `30–45°` snap-turn + angular tunneling vignette** (offering smooth locomotion/turn strictly as opt-in comfort settings).

## Ergonomic placement (`1.2–2.0 m`, `5–15°` below horizon), targets, and lap pinch

Use angular and physical ergonomics together (`physical size ≈ 2 × distance × tan(angle / 2)`; `1° ≈ 17.5 mm` at `1 m`, `35 mm` at `2 m`):

| Concern | Studio-Grade spatial specification |
|---|---|
| **Primary panel anchor** | **`1.2–2.0 m` depth**, angled **`5–15°` below the eye horizon** (natural resting neck/gaze posture; placing primary UI above horizon causes rapid cervical strain) |
| **visionOS / spatial target floor** | **`>= 60×60 pt` (`dpt`)** interactive hit area with **`>= 12–16 pt` minimum edge spacing** (`>= 72–76 pt` center-to-center) for reliable eye-gaze + pinch targeting |
| **"Gorilla-arm" prevention** | Support **relaxed lap-level indirect gaze-and-pinch / controller ray** for sustained sessions (`> 2 min`); reserve `0.4–0.6 m` direct mid-air poke strictly for brief optional physical manipulation |
| **3-posture recentering** | Support **Seated**, **Standing**, **AND Lying-down / Reclined** (`up`-vector pitch tilt) recentering so users in bed, wheelchairs, or airplane seats can orient the workspace perpendicular to their gaze without fighting world gravity |
| **Near boundary** | Keep sustained reading surfaces **`>= 0.5 m`** away to avoid vergence-accommodation conflict |

## Depth, layering, and real-room passthrough lighting QA

- Near objects invite direct manipulation; mid-distance (`1.2–2.0 m`) panels support reading/selection; distant geometry provides ambient context.
- Avoid z-fighting, intersecting panels, and eye-level overlays that block real-world tripping hazards in mixed reality.
- **Dual-lighting passthrough legibility QA**: translucent glass/additive spatial materials wash out against sunlit windows and glare harshly in dark bedrooms. **Test passthrough UI legibility in BOTH sunlit bright rooms (`> 500–1,000 lux`) AND dim rooms (`< 20 lux`)**, providing adaptive dark scrims/plates behind typography.

## Zero-shift eye-gaze hover & biometric privacy

- **Zero geometry or layout shift on eye-gaze hover**: when a user's eyes sweep across controls, **never scale, translate, expand, or reflow button bounds on hover**! Moving target edges under eye-gaze triggers involuntary corrective saccades, hover oscillation loops, and severe eye strain. Use **subtle OS-rendered specular/luminance `.hoverEffect()` highlights only**, deferring size/layout transitions until explicit pinch/click commit.
- **Strict gaze privacy**: keep raw eye-tracking vectors inside the OS compositor hover boundary—never record covert gaze heatmaps or dwell biometrics without explicit opt-in clinical/research consent, and always provide controller/hand/voice parity when eye tracking is uncalibrated or denied.

## Text legibility and XR accessibility

- Use sturdy font weights (Regular/Medium+), generous leading, perpendicular/billboarded text planes, and native **compositor quad/cylinder layers** (`ViewAttachmentComponent`, `WebXR Layers`, `UStereoLayerComponent`) rather than double-sampled eye-buffer textures.
- Provide **Seated / Standing / Reclined** posture modes, **one-handed** mode (never require simultaneous two-hand pinch-zoom as the only scale path), spatial audio **directional captions**, adjustable text/panel scale, and an always-reachable pause/exit action.
- Label simulator-only checks honestly—stereo comfort, convergence, passthrough contrast, and `72/90/120 fps` thermal headroom require real headset `rendered` verification or `not-checked`.
