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

| Domain | Mandatory hardware & human-factors contract |
|---|---|
| **10-Foot TV** | Deterministic 4-way D-pad spatial graph with **column-index memory across vertical rows**, visible focus halo (`scale 1.04–1.08` + high-contrast ring), **`5%` action / `10%` title overscan safe zones**, and **QR Code / `RFC 8628` Device Authorization Flow** (never force 32-char remote password entry). |
| **Wearables** | True **`#000000` OLED** canvas (**`< 15–20%` On-Pixel Ratio** in Always-On Display), **`<= 2–3 s` single-glance micro-task**, **`1` primary CTA per screen**, and rotary Crown/Bezel haptic detents. |
| **Kiosk & POS (`ADA` / `EN 301 549`)** | Wheelchair reach **`38–122 cm` (`15–48"`)** or persistent **"Lower Screen / Reachability Mode"** toggle, **`>= 60×60 px` (`12–15 mm`)** touch targets, tactile audio-jack keypad nav with **auto volume/locale reset between sessions**, **`30–60 s` idle timeout with `"Still there?"` countdown (`WCAG 2.2.1`) before purging PII/cart state**, receipt-printer paper-low/offline queue, and **`72 h+` zero-leak soak stability**. |
| **Automotive IVI (`NHTSA` / `ISO 15005`)** | **`< 2.0 s` single glance / `< 12.0 s` cumulative glance** budget, **`>= 15×15 mm`** touch targets, **lock complex typing/video while `speed > 0`** (handoff to voice/wheel controls), and **instant zero-flash Day <-> Night theme switch** on tunnel ambient-light transitions. |
| **Embedded MCU & E-Ink** | Compile-time static `Flash`/`SRAM` budget (**`0` runtime heap fragmentation**), **`VSYNC` / Tearing-Effect (`TE`) double-buffered DMA transfer**, `15–30 ms` physical button debounce, and scheduled partial vs full E-Ink waveforms (`1-bit`/`4-bit` crisp black-white type, zero gradient soup). |
| **Voice UI (`VUI`)** | **`< 300 ms` local barge-in audio cutoff** + assistant transcript truncation on user speech, **`<= 3` options / `< 10–12 s` spoken turns**, explicit read-back confirmation before irreversible actions, progressive reprompts, and multimodal transcript fallback. |

## Pre-submit checklist

- [ ] physical distance, input modality, refresh physics, `Flash`/`SRAM`/texture caps, and regulatory gates (`ADA`/`EN 301 549`/`NHTSA`/`ISA-101`) documented;
- [ ] **TV / Wearables**: 4-way D-pad column memory + `scale 1.04–1.08` focus halo + `5%/10%` safe zone + `RFC 8628` QR login (TV); `#000000` OLED `< 15–20%` AOD OPR + `1` CTA + rotary detents (Wear);
- [ ] **Kiosk / POS / IVI**: `38–122 cm` reachability toggle + `>= 60×60 px` targets + `"Still there?"` PII wipe + `72 h+` soak (Kiosk); `< 2 s / < 12 s` glance + `>= 15×15 mm` targets + `speed > 0` lockout + zero-flash tunnel Day/Night switch (IVI);
- [ ] **MCU / E-Ink / Voice**: `0` runtime heap churn + `VSYNC`/`TE` DMA + `15–30 ms` button debounce + E-Ink waveform schedule; `< 300 ms` VUI barge-in cutoff + `<= 3` options / `< 10–12 s` turns + read-back confirmation;
- [ ] real hardware/emulator verification (`rendered`) separated honestly from `static` checks and `not-checked` regulatory sign-off.
