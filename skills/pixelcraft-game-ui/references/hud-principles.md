# Cross-engine HUD principles

## UI spatial taxonomy (diegetic, spatial, meta, non-diegetic)

Choose each HUD layer deliberately based on legibility vs immersion—never let world-space spectacle destroy survival-critical readability:

| Category | Exists in game story? | Exists in 3D space? | Examples & design rule |
|---|---|---|---|
| **Diegetic** | Yes | Yes | Ammo counter on weapon, cockpit dials, wrist health rig. High immersion, but vulnerable to motion blur, lighting, FOV, and low vision—always pair with a readable HUD/subtitle/audio fallback option. |
| **Spatial** | No | Yes | Floating enemy health bars, 3D objective waypoints, interaction prompts anchored to world objects. Apply distance scaling clamps and occlusion rules so overlapping markers never obscure targets. |
| **Meta** | Yes | No | Screen-edge blood/frost vignette, lens condensation, cracked visor. Never rely on meta effects alone for exact survival state (pair with clear numeric/icon/audio indicators and offer a reduced-effect toggle). |
| **Non-diegetic** | No | No | Classic 2D HUD bars, minimap, subtitle box, pause menus. Highest glanceability and accessibility; keep anchored cleanly inside safe zones without blocking the crosshair or action center. |

## Legibility under play

- Define criticality tiers: survival-critical, objective-critical, tactical/optional, ambient/flavor.
- Critical information must survive motion, particles, explosions, variable scene luminance, distance, low brightness, colorblindness, localization expansion, and streaming compression.
- Use multi-channel redundancy: color + distinct shape/icon + text/number + position + audio/haptic cue.
- Never cover the crosshair, objective path, or incoming threats with decorative panels or modal tutorial prompts.

## Dynamic input-glyph hot-swapping

- Detect the **active input device** dynamically and swap prompt glyphs live across **Xbox**, **PlayStation (DualSense/DualShock)**, **Nintendo Switch**, **Steam Deck**, **Keyboard + Mouse**, and **Touch**.
- **Debounce analog stick drift** (require a deliberate deadzone threshold > ~0.35 or explicit button press before switching from KBM to gamepad, and mouse delta > threshold before switching back) so prompts never flicker between icons.
- Provide a manual **Button Prompt Style override** (`Auto / Xbox / PlayStation / Nintendo / KBM`) in Settings for Steam Input wrappers, third-party adapters, and assistive controllers.
- Reflect **remapped bindings** dynamically in tutorials, HUD prompts, and combat callouts—never bake static `"Press [E]"` strings into localization files.

## HDR UI paper-white calibration

- Separate UI luminance from scene HDR specular peaks (which can hit 1,000–4,000 nits). Render the UI layer at a calibrated **SDR paper-white target (typically 150–250 nits default)** with a user-adjustable **HDR UI Brightness / Paper-White slider** in Display Settings.
- Composite UI **after** scene tone-mapping, auto-exposure, bloom, and chromatic aberration (or explicitly exempt UI from bright post-processing) so white HUD text neither sears eyes in dark rooms nor turns muddy gray in sunlit scenes.

## Safe areas and ultrawide (21:9 / 32:9) HUD clamping

- Respect TV overscan (~90–95% title-safe area), mobile notches/Dynamic Island, and platform system notification corners (achievements, invites, recording indicators).
- **Ultrawide HUD clamping**: on **21:9 and 32:9** monitors, clamp peripheral HUD anchors (health, ammo, minimap, chat) inside a central **16:9 safe box** by default—and expose a **HUD Safe Width / Edge Clamping** slider—so players never turn their heads 60° to check health. Keep fullscreen backgrounds/vignettes spanning full width while keeping interactive HUD inside comfortable peripheral vision.
- Test 16:9, 21:9, 32:9, 16:10 handheld (Steam Deck 1280×800), 4:3/split-screen, and portrait layouts where applicable.

## Controller and focus navigation

- Set deterministic initial focus on every screen/modal and restore previous focus on close, cancel, transaction completion, error, or scene transition.
- Avoid dead ends, hidden-widget focus jumps, and surprise wrap behavior; ensure `Back`/`Cancel` semantics stay identical across menus, popups, and platform overlays.
- Every primary action must work without a mouse or touch where controller/keyboard is supported.
- Input remapping UI must display device, context, chords, and binding conflicts cleanly with one-step Reset to Default.

## Xbox Accessibility Guidelines (XAG) and localization patterns

Treat accessibility and localization as core UI architecture (still label official platform certification `not-checked` unless verified against the current official checklist):

| Area | Concrete testable pattern |
|---|---|
| Text & distance legibility (XAG 101) | Default body/HUD text legible at 10-foot viewing distance (~28px+ at 1080p for TVs, scalable up to 150–200% without clipping or overlap); crisp high-contrast backing behind floating text |
| Contrast & colorblindness (XAG 102/103) | >= 4.5:1 text contrast (or adjustable opaque backdrop); pair team/rarity/danger colors with distinct shapes, icons, labels, or patterns |
| Subtitles & captions (XAG 104) | Scalable font size, adjustable background opacity (0–100%), speaker identification, and non-speech directional/important audio cues |
| Input & motor assists (XAG 107/108) | Full button remapping, hold-to-toggle conversions (sprint, aim, radial wheels), QTE/rapid-press alternatives, and single-stick/one-handed presets where feasible |
| Screen narration & focus (XAG 109/110) | High-visibility focus highlight (shape + contrast, not tint alone), predictable spatial order, and OS/TTS menu narration hooks where supported |
| Motion & photosensitivity (XAG 115) | Explicit reduced-motion, camera-shake, motion-blur, FOV, and flash-reduction sliders (avoid >3 Hz full-screen flashes) |
| Localization | Pseudo-localize early (+35–40% expansion for German/Finnish), verify CJK/Arabic/RTL/Cyrillic glyph fallback atlases, and keep numbers/units locale-formatted |

## State hierarchy

Separate persistent HUD state, transient feedback, modal interruption, tutorial/coach marks, cinematic subtitles, network/system notifications, and debug overlays with explicit priority rules.

Give acquisitions or milestones two levels when the moment needs both: brief non-blocking confirmation during active play, and a stable record in the inventory, objective log, or pause screen to inspect afterward. Verify the player can keep playing without interruption, look up exact details later, and distinguish the event without color or sound alone.

## Verification matrix

Record engine/version/target hardware, resolution/aspect/ultrawide clamp, HDR paper-white setting, input device + hot-swap debounce, viewing distance, locale/script/HUD scale, accessibility settings, gameplay chaos level, and task completion (`rendered`; mark uninspected console/platform certification rules `not-checked`).
