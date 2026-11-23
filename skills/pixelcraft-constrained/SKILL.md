---
name: pixelcraft-constrained
description: "Designs and verifies interfaces for constrained or nonstandard surfaces: TV/console/10-foot UI, D-pad/gamepad spatial navigation, watchOS/Wear OS wearables, e-ink displays, kiosks/self-service hardware, embedded LVGL/low-resolution screens, automotive CarPlay/Android Auto templates, and basic voice UI. Use when input, viewing distance, refresh technology, memory/frame-rate budgets, safety regulation, reach, glanceability, or lack of pointer/touch fundamentally constrains the interface."
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft constrained surfaces

Constraint is the primary design material. Do not shrink a desktop/mobile interface: determine viewing distance, input device, interruption cost, refresh capability, compute/memory budget, physical ergonomics, safety context, and failure recovery before layout.

## References

- Read [references/tv-wearables.md](references/tv-wearables.md) for TV/console, D-pad focus engines, overscan/title-safe layout, tvOS, Android TV/Leanback/Compose for TV, webOS/Tizen, watchOS, and Wear OS.
- Read [references/specialized-hardware.md](references/specialized-hardware.md) for e-ink, kiosk/self-service, embedded/LVGL/low-res displays, and automotive CarPlay/Android Auto constraints.
- Read [references/voice-ui.md](references/voice-ui.md) for voice prompts, confirmations, error recovery, turn-taking, multimodal fallback, and SSML basics.

## Required workflow

1. **Measure the constraint.** Record viewing distance, screen size/resolution/color depth/refresh behavior, input sensors/buttons, orientation, environment noise/lighting, user posture, network/compute/memory budget, and safety/regulatory context.
2. **Choose the interaction model.** Spatial focus, direct touch, rotary/crown, physical buttons, voice, remote/controler, template host, passive glance, or multimodal hybrid. Do not emulate pointer semantics where none exist.
3. **Reduce scope per glance/turn.** Define the minimum usable task unit, default action, persistent escape/back path, and recoverable error state.
4. **Design focus/state explicitly.** Every interactive surface needs initial focus, directional movement, focus visibility, trapping prevention, idle/timeout behavior, disabled/loading/error states, and restoration after interruption.
5. **Verify on hardware or faithful emulation.** Simulator rendering is not evidence for legibility, focus, motion comfort, refresh artifacts, or physical reach. Label unavailable hardware checks `not-checked`.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| glanceability | Critical state/action must be understandable within the context's intended glance time; dense reading does not belong on TV/wearable/automotive surfaces. |
| focus truth | No invisible focus, unreachable controls, circular traps, diagonal ambiguity, or focus loss after content refresh. |
| input honesty | Do not require hover, precise touch, keyboard chords, drag, multitouch, or pointer input unless physically available. |
| physical safety | Automotive/kiosk/public interfaces must prioritize distraction, reach, privacy, timeout, and accessibility requirements over visual novelty. |
| hardware honesty | Respect refresh, memory, color, contrast, burn-in, frame-rate, and input latency budgets. |
| accessibility | Provide scaling/contrast/reduced-motion/voice or alternate-input paths appropriate to the platform. |
| anti-slop | Do not port dense dashboards, tiny text, hover-only menus, decorative motion, carousels without position control, or desktop dialogs onto constrained surfaces. |

## Pre-submit checklist

- [ ] physical/input/environment constraints are written down;
- [ ] initial focus/back/escape/idle-timeout behavior is explicit;
- [ ] type/target sizing is justified for distance, resolution, and input accuracy;
- [ ] all controls are reachable without forbidden input modalities;
- [ ] safety/regulatory constraints are cited or marked out of scope/`not-checked`;
- [ ] real hardware/emulator behavior was tested or explicitly labeled `not-checked`;
- [ ] empty/loading/error/offline/interruption states preserve orientation and input.
