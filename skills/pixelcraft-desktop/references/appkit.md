# AppKit / macOS desktop

## Token mapping

Use asset catalog colors with semantic names for light/dark/high-contrast variants and typed constants in Swift:

```swift
enum PCSemantic { static let action = NSColor(named: "Semantic/Action") }
```

Do not copy raw RGB through views/windows/menus. Respect system accent/vibrancy/contrast behavior where appropriate.

## Layout and responsive idioms

Use Auto Layout, stack views, safe/content layout guides, split views, toolbar/sidebar idioms, window resizing/minimum size/restoration, spaces/fullscreen behavior, and high-DPI vector assets. macOS desktop UI depends on menu bar/window/document conventions; do not transplant mobile navigation.

## Typography/custom fonts

Use system text styles and Dynamic Type-like scaling expectations appropriate to macOS. Register custom fonts in bundle/target correctly and verify baseline alignment in controls. Respect increased contrast/bold text/smart inversion behaviors where applicable.

## Motion/reduced motion

Use AppKit/Core Animation purposefully and check system reduce-motion settings through platform accessibility APIs. Window resize/fullscreen/keyboard input must remain interruptible; do not animate every state change.

## Accessibility specifics

Use NSAccessibility labels/roles/descriptions, keyboard shortcuts/menu equivalents, Full Keyboard Access, VoiceOver ordering/custom actions, focus ring behavior, toolbar/sidebar semantics, modified document state, Escape/cancel behavior. Custom controls must implement accessibility protocol behavior rather than drawing only.

## States idiom

Model document/app/window state: dirty document, autosave/versioning, loading/error/offline/permission, update/restart, background agent/menu-bar lifecycle, file access/security-scoped bookmarks where relevant, crash restoration, multiwindow state. Preserve work on close/logout/restart.

## Forms idiom

Use real controls, labels/title/accessibility relationships, key equivalents, focus ring/initial first responder, input validation timing, paste/autofill/IME behavior, undo integration, and keyboard focus occlusion awareness. Dialogs/sheets should not trap unrelated document windows unnecessarily.

## Do/don't pairs

| Do | Don't |
|---|---|
| real `NSButton`/menu command with keyboard equivalent | custom clickable image pretending to be a control |
| toolbar/sidebar/menu conventions appropriate to app type | mobile tab bar pasted into macOS window |
| document dirty/autosave/close flow | silently discarding edits on red close button |
| VoiceOver/Full Keyboard Access verification | assuming pointer testing covers accessibility |
| vector/PDF/high-resolution assets | blurry bitmap-only icons at Retina scale |

## Known traps

Window restoration/state duplication, key equivalent conflicts, menu validation ownership, sheet/modal scope confusion, AppKit/SwiftUI interop lifecycle, custom focus ring removal, sandbox file permission failure, high-DPI asset mismatch, vibrancy/contrast legibility.

## Verification commands

```sh
xcodebuild -scheme App -destination 'platform=macOS' build
xcodebuild test -scheme App -destination 'platform=macOS'
```

Use real macOS runs, VoiceOver/Accessibility Inspector/Full Keyboard Access, resize/fullscreen/multiple-display tests, dark/high contrast/increased contrast modes, keyboard shortcuts, document close/crash flows, and menu validation inspection.
