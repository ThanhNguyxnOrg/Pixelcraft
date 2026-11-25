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

## Dynamic input-glyph hot-swapping (`<= 1 frame`, zero layout jump)

- **Instant `<= 1 frame` hot-swap (`0` hysteresis timer lag)**: switch glyphs on the **very next rendered frame** across **Xbox**, **PlayStation (DualSense)**, **Nintendo Switch**, **Steam Deck**, **Keyboard + Mouse**, and **Touch** the moment an explicit button/key press or stick/mouse delta exceeding the hardware noise floor (`stick magnitude > 0.35`, `mouse delta > 4px`) occurs—filter stick drift by deadzone threshold, **never** by multi-second delay timers that leave stale icons onscreen.
- **Zero layout jump**: render button prompts inside fixed-dimension inline glyph slots or monospaced sprite atlases (`min-width` sized for wide keys like `[Space]` / `[LShift]`) so swapping `(A)` <-> `[Enter]` never reflows surrounding HUD or dialog text.
- **Manual override & live bindings**: provide a **Button Prompt Style** override (`Auto / Xbox / DualSense / Switch / Steam Deck / KBM`) in Settings and resolve glyphs from the player's **live remapped action bindings** rather than hardcoded `"Press [E]"` strings.

## Steam Deck Verified (`1280×800`, `16:10`), Safe Areas & Ultrawide Clamping

| Target surface | Resolution / aspect | Mandatory UI engineering contract |
|---|---|---|
| **Steam Deck Verified** | `1280×800` (`16:10` native) | **`>= 9px` absolute minimum glyph height / `12–14px` body target** at `1280×800`; **100% controller navigation from boot with zero external mouse-only launcher**; invoke Steam/OS virtual keyboard (`SteamUtils.ShowFloatingGamepadTextInput` / `DisplayServer.virtual_keyboard_show`) automatically on text-input focus; render native Steam Deck / gamepad glyphs and `16:10` without black bars or clipped sidebars |
| **10-Foot Console / Living-Room TV** | `1920×1080` / `3840×2160` (`16:9`) | **`>= 24–28px` body/HUD floor at `1080p`** (`>= 52px` at `4K`); keep all vital HUD/subtitle elements inside a **`90%` title-safe inset** (`5%` margin per edge) respecting overscan and OS achievement/party toast corners |
| **Ultrawide & Super-Ultrawide** | `21:9` (`3440×1440`) & `32:9` (`5120×1440`) | Clamp peripheral HUD anchors (health, minimap, ammo, objective feed) to a **centered `16:9` container** by default (with a `HUD Horizontal Bounds` slider `16:9 <-> Full`) while spanning world render and edge vignettes edge-to-edge—**never stretch 2D sprites, circular reticles, or minimap aspect ratios** |

## Console Lotcheck / TRC / XR Compliance & Game-Feel Polish

Design these certification and feel mechanics into core UI systems from day one (still label formal console submission `not-checked` unless verified against the NDA checklist):

- **Active controller disconnect auto-pause**: subscribe to hardware device-loss events (`InputSystem.onDeviceChange`, `Input.joy_connection_changed`, `PlatformUser` pairing); immediately **pause gameplay simulation and present a controller-reconnect modal** specifying which player slot disconnected.
- **Persistent active profile / gamertag**: display the signed-in player's gamertag/avatar on title, main menu, and profile-switching surfaces so save-data ownership is unambiguous.
- **Explicit autosave notice**: display a non-blocking **"Saving — do not turn off your system…"** indicator + animated icon **before and during** non-volatile storage writes, performing serialization asynchronously off the UI/render thread.
- **Menu input buffering (`100–150 ms`)**: queue `Confirm` / `Cancel` / `Tab` presses arriving during the final `100–150 ms` of a screen/tab transition instead of dropping player inputs during brief animations.
- **UI audio buses & `±3%` pitch modulation**: route UI audio to a dedicated **`UI` bus** decoupled from **`Master / Music / SFX / Voice`** volume faders, and randomize hover/tick/inventory SFX pitch by **`±3%` (`0.97–1.03`)** (with `>= 30–40 ms` retrigger cooldown) so rapid list scrolling never sounds robotic.
- **`0 B/frame` steady-state UI GC allocation**: preallocate text buffers (`TMP_Text.SetText`, reusable `StringBuilder`, pooled combat floaters, cached delegates) so active gameplay HUD updates allocate **`0 bytes/frame`** on the managed heap and never trigger GC frame spikes.

## HDR UI paper-white calibration

- Separate UI luminance from scene HDR specular peaks (`1,000–4,000 nits`). Render the UI layer at a calibrated **SDR paper-white target (`150–250 nits` default)** with a user-adjustable **HDR UI Brightness / Paper-White slider**, composited **after** scene tone-mapping, bloom, and chromatic aberration.

## Accessibility, photosensitivity & localization floor (XAG)

| Area | Concrete testable pattern |
|---|---|
| **HUD & distance scale (XAG 101)** | Independent **HUD Scale (`80%–150%+`)** and **Menu Text Size** presets (`>= 9px` floor / `12–14px` at `1280×800`; `>= 24–28px` at `1080p` TV) without clipping |
| **Contrast & colorblindness (XAG 102/103)** | `>= 4.5:1` text contrast over dynamic 3D scenes via dark scrim/plate; pair team/rarity/status colors with **distinct shapes, icons, patterns, or labels** + customizable palette |
| **Subtitles & captions (XAG 104)** | Scalable subtitle size, **independent background scrim opacity (`0–100%`)**, speaker labels + color tags, and directional `[Explosion — Left]` audio captions |
| **Full input remapping & motor assists (XAG 107/108)** | Remap every gameplay/UI action across gamepad & KBM with conflict resolution, one-button **Reset to Default**, **hold-to-toggle** (`Aim`, `Sprint`, `Crouch`, `Radial Wheel`), and QTE rapid-tap bypass |
| **Photosensitivity & motion (XAG 115)** | Hard cap luminance/red transitions at **`<= 3 Hz`** across HUD alerts, hit-flashes, and menus; independent **Camera Shake**, **Motion Blur**, ** Vignette**, and **Reduced UI Motion** toggles |
| **Localization** | Pseudo-localize early (`+35–40%` expansion for German/Finnish), bundle dynamic CJK/Arabic/RTL/Vietnamese/Cyrillic fallback font atlases, and pull dynamic action glyphs into localized templates |

## State hierarchy

Separate persistent HUD state, transient non-blocking pickups (mirrored permanently in the inventory/log), modal controller-disconnect/pause interruptions, subtitles, autosave indicators, and OS overlays with an explicit z-order and input-capture stack.

## Verification matrix

Record engine/version/target hardware, resolution matrix (`1280×800` Steam Deck, `1920×1080` TV, `3440×1440` `21:9`), `<= 1 frame` glyph hot-swap, controller-disconnect auto-pause, virtual keyboard trigger, `0 B/frame` profiler trace, audio bus separation, `<= 3 Hz` flash check, and localization/accessibility passes (`rendered`; mark uninspected console NDA checklists `not-checked`).
