---
name: pixelcraft-constrained
description: "Designs and verifies interfaces for constrained or nonstandard surfaces: TV/console/10-foot UI (Roku/BrightScript, Fire TV/Vega OS, tvOS, Compose for TV, webOS/Tizen), D-pad spatial focus, watchOS/Compose for Wear OS, e-ink displays, POS/ISA-101 HMI/kiosks, embedded MCU UI (LVGL, Slint MCU, TouchGFX, Qt for MCUs, embedded-graphics), automotive CarPlay/Android Auto/AAOS, and Realtime Voice AI/WebRTC voice agents/Siri App Intents/Alexa+. Use when viewing distance, input hardware, refresh physics, memory budgets, or safety fundamentally constrains the interface."
license: MIT
metadata:
  version: 0.1.0
---

# Pixelcraft constrained surfaces

Constraint is the primary design material. Do not shrink a desktop/mobile interface: determine viewing distance, input device, interruption cost, refresh capability, compute/memory budget, physical ergonomics, safety context, and failure recovery before layout.

## Surface craft

Prioritize the one task the physical situation allows: visible spatial focus from the sofa, an at-a-glance answer on the wrist, or a static acknowledgment on low-refresh displays. Verify at the actual viewing distance, input device and refresh class. If effects compete with guidance, remove the effects; do not infer hardware readiness from web emulation.

## Detection signals

Roku `manifest`/`.brs`/SceneGraph XML, Fire TV / Vega OS (`KeplerScript`, React Native for Vega), `react-native-tvos` / LightningJS, Android TV (`androidx.tv:tv-material`, `FEATURE_LEANBACK`, Leanback), tvOS SwiftUI/UIKit (`@FocusState`, `.focusSection`), LG webOS (`appinfo.json`, `@enact/sandstone`), Samsung Tizen (`config.xml`, `tizen.tvinputdevice`), Wear OS (`androidx.wear.compose`, `TileService`, Watch Face Format XML), watchOS (`WatchKit`, SwiftUI Watch, `WidgetKit` Smart Stack), E-Ink EPD vendor SDKs (Boox/Kindle/reMarkable), POS/kiosk lockdown (`LockTask`, Assigned Access, Single App Mode), ISA-101 HMI specs, embedded UI (`lv_conf.h` LVGL v9, Slint `#![no_std]` MCU, `embedded-graphics`, `.touchgfx` TouchGFX, `Qt Quick Ultralite` Qt for MCUs), automotive (`CPTemplateApplicationSceneDelegate`, CarPlay Ultra, `CarAppService`, `CarUxRestrictionsManager`), Realtime Voice AI (`@openai/realtime`, Gemini Live, LiveKit Agents, Pipecat, ElevenLabs), Apple `AppIntents`, Alexa APL/Alexa+, Google `AppFunctions`, and SSML templates.

## References

- Read [references/tv-wearables.md](references/tv-wearables.md) when building 10-foot TV/console UIs (Roku BrightScript, Fire TV/Vega OS, React Native TV/LightningJS, Compose for TV, tvOS 26, webOS Enact, Tizen), D-pad focus engines, Compose for Wear OS 5/6 Material 3 Expressive, or watchOS 10–26.
- Read [references/specialized-hardware.md](references/specialized-hardware.md) when designing for E-Ink (Boox/Kaleido 3/Gallery 3), POS & ISA-101 industrial HMIs, kiosk lockdown, embedded MCUs (LVGL v9, Slint MCU, `embedded-graphics`, TouchGFX, Qt for MCUs), or automotive CarPlay/CarPlay Ultra/Android Auto/AAOS.
- Read [references/voice-ui.md](references/voice-ui.md) when building classic SSML/IVR voice flows, 2025–2026 Realtime Voice AI / WebRTC voice agents (OpenAI Realtime, Gemini Live, LiveKit, Pipecat, ElevenLabs), Apple Siri App Intents, Alexa APL/Alexa+, or Google Gemini App Functions.

## Required workflow

1. **Measure the constraint.** Record viewing distance, screen size/resolution/color depth/refresh behavior, input sensors/buttons, orientation, environment noise/lighting, user posture, network/compute/memory budget, and safety/regulatory context.
2. **Choose the interaction model.** Spatial focus, direct touch, rotary/crown, physical buttons, voice, remote/controller, template host, passive glance, or multimodal hybrid. Do not emulate pointer semantics where none exist.
3. **Reduce scope per glance/turn.** Define the minimum usable task unit, default action, persistent escape/back path, and recoverable error state.
4. **Design focus/state explicitly.** Every interactive surface needs initial focus, directional movement, focus visibility, trapping prevention, idle/timeout behavior, disabled/loading/error states, and restoration after interruption.
5. **Verify on hardware or faithful emulation.** Simulator rendering is not evidence for legibility, focus, motion comfort, refresh artifacts, or physical reach. Label unavailable hardware checks `not-checked`.

## Non-negotiable rules

| Concern | Rule |
|---|---|
| glanceability | Critical state/action must be understandable within the context's intended glance time; dense reading does not belong on TV/wearable/automotive surfaces. |
| focus truth | No invisible focus, unreachable controls, circular traps, diagonal ambiguity, or focus loss after content refresh. |
| input honesty | Do not require hover, precise touch, keyboard chords, drag, multitouch, or pointer input unless physically available. |
| physical safety | Automotive/kiosk/POS/HMI/public interfaces must prioritize distraction, reach, privacy, timeout, alarm legibility, and safety interlocks over visual novelty. |
| hardware honesty | Respect refresh physics, memory/texture caps, color gamut, contrast, burn-in, frame-rate, and audio/input latency budgets. |
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
