# Platform accessibility translations

Evidence: Apple HIG, Material, WCAG, generated-code accessibility research.

## Web/HTML

- Use button/input/select/a/label/dialog/table/list/heading semantics before div/ARIA. First rule of ARIA: don't use it when native HTML exists.
- Labels are programmatically associated; errors use accessible description/live status where appropriate.
- Dialogs: initial focus inside, logical containment/inert background, Escape close where safe, restore focus to invoker. Follow APG only as pattern guidance.
- Never remove outline without visible replacement. Manage focus on route/content deletion; preserve scroll restoration separately.
- Do not use positive tabindex. Use DOM order and roving tabindex only for composite widgets that need it.

## iOS / macOS

- VoiceOver: accessibility label, traits, value, hint only when useful; correct ordering/grouping; custom actions/rotor where relevant.
- Dynamic Type: scale text without clipping essential content; use system text styles where appropriate. Touch baseline 44×44 pt.
- Honor Reduce Motion, Increase Contrast, Differentiate Without Color, Bold Text, Reduce Transparency, Voice Control, Switch Control, Full Keyboard Access.
- Respect safe areas/focus engine on tvOS and keyboard shortcuts/modified-state semantics on macOS.

## Android

- TalkBack: contentDescription only where needed, correct traversal order, state descriptions, live regions/assertive politeness sparingly.
- Use sp for text and dp for layout; preserve scaling. Touch baseline 48×48 dp.
- Support keyboard/d-pad/controller focus, predictive back, color contrast, reduced animation, magnification, switch access, and autofill.

## Flutter / React Native / LynxJS

- Flutter: Semantics widgets/labels/liveRegion/button/header flags; test TalkBack/VoiceOver rather than trusting compile-time semantics. TextScaler and focus traversal must survive custom painters.
- React Native: accessibilityRole/Label/State/Hint, importantForAccessibility, accessibilityLiveRegion; native components first. Do not strip focus or rely on nested text hacks.
- LynxJS: set native accessibility attributes (`accessibility-element`, `accessibility-label`, `accessibility-traits`) on interactive views so VoiceOver/TalkBack receive real native traits rather than opaque host containers.

## Data-app UIs

marimo, Solara, Mesop, Taipy, Streamlit, Gradio, Reflex, NiceGUI, Dash, Panel, Shiny, Jupyter widgets/anywidget, R Shiny, Genie, Observable Framework, and Evidence expose varying semantic control. Inspect actual rendered DOM/native output where possible; label every input/filter, preserve keyboard traversal across reactive reruns, avoid canvas/image-only outputs, provide data-table/text alternatives for charts, and record framework accessibility limits honestly.

## Desktop

- Qt/QML/PySide: accessible names/descriptions/roles where exposed; keyboard focus chain, shortcuts/mnemonics, platform high-contrast themes, scalable fonts. Test NVDA/JAWS/Narrator/Orca/VoiceOver by platform where possible.
- Electron/Tauri are web inside but must also honor desktop keyboard/window conventions (menu bar, focus return after closing dialogs/windows, OS reduced-motion and high-contrast themes).
- **Rust GUIs & AccessKit:** egui, iced, Slint, GPUI, Dioxus Desktop, and Bevy UI should expose semantic trees through **AccessKit** (bridging natively to Windows UI Automation, macOS NSAccessibility, and Linux AT-SPI); never ship custom-painted desktop controls invisible to platform screen readers.
- WinUI/WPF/AppKit/GTK/Avalonia/Uno: use native accessibility APIs/control patterns; never draw custom controls without exposing UI Automation/Accessibility/AT-SPI equivalents.

## TUI

- Do not rely on color alone; provide symbols/text state and honor `NO_COLOR`/terminal contrast.
- Mouse support is optional enhancement; complete keyboard path is mandatory.
- Announce/preserve meaningful focus/cursor location where screen readers can interpret terminal output; avoid rapid full-screen redraw noise.
- Provide non-Unicode/limited-color fallback for box glyphs/braille/sparklines when applicable.

## Email

- Semantic heading structure where clients permit, real text rather than image-only copy, meaningful alt text, table roles/layout isolation, visible focus, sufficient contrast, dark-mode resilience, plaintext parity, and no tiny clustered tap targets.
- Do not depend on background images, custom fonts, animation, forms, or exact pixel layout.

## Documents and PDF/UA

- Export tagged PDFs conforming to **PDF/UA** (ISO 14289): logical reading order, real heading hierarchy (`H1`–`H6`), language tag (`/Lang`), table headers (`TH` + `Scope`), alt text on figures, and artifact tagging on decorative headers/footers/page rules.
- Never rasterize text or tables into flat images inside PDFs or slide decks; verify selectable text and reading order with `pdftotext` and accessibility tag inspection.

## Chat UI and Mini-Apps

- Author concise, self-contained fallback text (`text` / notification preview) alongside rich cards/blocks so screen readers, watch notifications, and compact clients convey full meaning.
- Respect host modal/form focus management, avoid emoji-only button labels, and keep payload structures shallow so keyboard/assistive users do not traverse dozens of redundant dividers.

## Extensions and Plugins

- **Shadow DOM focus crossing:** in browser content-script overlays using closed/open Shadow DOM, enable `delegatesFocus: true` where appropriate, manage `Tab`/`Shift+Tab` boundaries cleanly, and ensure `aria-labelledby`/`aria-describedby` references stay within the same shadow root (IDREFs do not cross shadow boundaries natively without Element Internals/ARIA Reflection).
- **Host integration:** honor host theme/high-contrast tokens (VS Code `--vscode-*`, Figma, Raycast), avoid colliding with host keyboard shortcuts, and keep popups/sidebars operable at 200% zoom.

## Spatial / XR

- Support gaze + pinch, hand tracking, controller pointer, voice commands, and dwell/switch alternatives; never require sustained arm elevation (“gorilla arm”) or wide physical head rotation for routine tasks.
- Size targets generously (`≥ 60 pt` angular equivalent at comfortable viewing distance), maintain high foreground contrast against variable passthrough environments via adaptive backing/scrims, and provide comfort-mode/reduced-motion alternatives (snap turn, teleport, disable world-locked drift).

## Constrained surfaces (TV, Wearables, E-Ink, Kiosk, Automotive)

- **TV / 10-foot UI:** unmistakable focus highlight (`≥ 3:1` + scale/outline) for directional D-pad navigation, logical 2D spatial focus map, legible distance typography, and closed-caption controls.
- **Wearables / E-Ink:** glanceable high-contrast typography, large tap/crown/bezel targets, minimal nested scrolling, and crisp non-color indicators on monochrome e-ink displays.
- **Kiosk / Hardware:** physical reach/height ergonomics, audio jack/screen-reader mode where mandated, generous timeout extension prompts, and zero silent dead-ends.

## Game UI

- Subtitles/captions: speaker, sound cues where useful, size/background/contrast controls.
- Input remapping, hold/toggle options, sensitivity/dead zones, controller/keyboard/mouse parity, no mandatory rapid repeated input where avoidable.
- Colorblind-safe team/status differentiation using shape/icon/text; scalable HUD; screenreader/menu narration where platform supports it.
- Photosensitivity: avoid high-frequency flashes (`≤ 3 flashes/s`); provide reduction options. Motion sickness settings for camera/UI movement.
