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

## Flutter / React Native

- Flutter: Semantics widgets/labels/liveRegion/button/header flags; test TalkBack/VoiceOver rather than trusting compile-time semantics. TextScaler and focus traversal must survive custom painters.
- React Native: accessibilityRole/Label/State/Hint, importantForAccessibility, accessibilityLiveRegion; native components first. Do not strip focus or rely on nested text hacks.

## Data-app UIs

Streamlit/Gradio/Reflex/NiceGUI/Dash/Panel/Shiny/Jupyter widgets/R Shiny/Genie/Observable Framework/Evidence expose varying semantic control. Inspect actual DOM/native output where possible; label inputs, preserve keyboard path, avoid canvas/image-only output, provide tables/text alternatives, and state framework limits honestly.

## Desktop

- Qt/QML/PySide: accessible names/descriptions/roles where exposed; keyboard focus chain, shortcuts/mnemonics, platform high-contrast themes, scalable fonts. Test NVDA/JAWS/Narrator/orca/VoiceOver by platform where possible.
- Electron/Tauri are web inside but must also honor desktop keyboard/window conventions.
- WinUI/WPF/AppKit/GTK/Avalonia/Rust GUIs: use native accessibility APIs/control patterns; never draw custom controls without exposing UI Automation/Accessibility/AT-SPI equivalents.

## TUI

- Do not rely on color alone; provide symbols/text state and honor `NO_COLOR`/terminal contrast.
- Mouse support is optional enhancement; complete keyboard path is mandatory.
- Announce/preserve meaningful focus/cursor location where screen readers can interpret terminal output; avoid rapid full-screen redraw noise.
- Provide non-Unicode/limited-color fallback for box glyphs/braille/sparklines when applicable.

## Email

- Semantic heading structure where clients permit, real text rather than image-only copy, meaningful alt text, table roles/layout isolation, visible focus, sufficient contrast, dark-mode resilience, plaintext parity, and no tiny clustered tap targets.
- Do not depend on background images, custom fonts, animation, forms, or exact pixel layout.

## Game UI

- Subtitles/captions: speaker, sound cues where useful, size/background/contrast controls.
- Input remapping, hold/toggle options, sensitivity/dead zones, controller/keyboard/mouse parity, no mandatory rapid repeated input where avoidable.
- Colorblind-safe team/status differentiation using shape/icon/text; scalable HUD; screenreader/menu narration where platform supports it.
- Photosensitivity: avoid high-frequency flashes; provide reduction options. Motion sickness settings for camera/UI movement.
