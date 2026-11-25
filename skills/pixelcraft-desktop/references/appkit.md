# AppKit & SwiftUI for macOS

macOS desktop craft depends on menu-bar architecture, multi-window/document lifecycle, keyboard acceleration, and platform chrome—whether authored in **AppKit**, **SwiftUI for macOS**, or a hybrid (`NSHostingView` / `NSViewRepresentable`).

## Token mapping

Store light, dark, and increased-contrast colors in Asset Catalogs and access them via Xcode-generated `ColorResource` symbols (`NSColor(resource: .semanticAction)` / `Color(.semanticAction)`). Respect system vibrancy (`NSVisualEffectView` / `.background(.ultraThinMaterial)`), system accent colors (`NSColor.controlAccentColor`), and **macOS 26 Tahoe Liquid Glass** (`NSGlassEffectView` in AppKit; `.glassEffect(_:in:)` + `GlassEffectContainer` in SwiftUI) for floating toolbars, sidebars, and controls—never apply translucent glass to primary reading/editing canvases.

## SwiftUI for macOS scene & command idioms

Use native macOS scene primitives instead of hand-rolling single-window shells:

- **`WindowGroup`** (multi-window data views) and **`DocumentGroup`** (file-based apps with open/save/recent-documents/titlebar proxy icon).
- **`Settings`** scene (`Cmd+,` automatically wired into the app menu).
- **`MenuBarExtra`** (`.menu` style for quick status menus; `.window` style for compact interactive popovers).
- **`.commands` + `CommandMenu` + `@FocusedValue` / `@FocusedBinding`** so menu-bar commands route cleanly to whichever document window currently owns focus:

```swift
@main
struct InvoiceStudioApp: App {
  var body: some Scene {
    DocumentGroup(newDocument: InvoiceDocument()) { file in
      InvoiceEditorView(document: file.$document)
    }
    .commands {
      CommandGroup(after: .newItem) {
        ExportCommands()
      }
    }
    Settings { SettingsView() }
    MenuBarExtra("Sync Status", systemImage: "arrow.triangle.2.circlepath") {
      SyncPopoverView()
    }
    .menuBarExtraStyle(.window)
  }
}
```

On macOS 26 Tahoe, combine `.glassEffect(.regular, in: .capsule)` / `NSGlassEffectView` with explicit Reduce Transparency and Increase Contrast fallbacks so floating controls stay legible over dense documents.

## AppKit idioms (`NSDocument`, `NSStatusItem`, `NSWorkspace`)

- Use **`NSDocument` / `NSDocumentController`** for automatic autosave-in-place, Versions browser, dirty close dot (`isDocumentEdited`), and safe Quit/Logout prompting.
- Use **`NSStatusItem`** (`NSStatusBar.system.statusItem(withLength:)`) with vector SF Symbols (`isTemplate = true`) for menu-bar utility agents; always provide a discoverable Quit item and keyboard shortcut.
- Read macOS accessibility display preferences directly from **`NSWorkspace.shared`** (and observe `NSWorkspace.accessibilityDisplayOptionsDidChangeNotification`) to adapt motion, glass/vibrancy, and contrast:

```swift
let ws = NSWorkspace.shared
let reduceMotion = ws.accessibilityDisplayShouldReduceMotion
let reduceTransparency = ws.accessibilityDisplayShouldReduceTransparency
let increaseContrast = ws.accessibilityDisplayShouldIncreaseContrast
```

In SwiftUI for macOS, read `@Environment(\.accessibilityReduceMotion)`, `@Environment(\.accessibilityReduceTransparency)`, and `@Environment(\.colorSchemeContrast)`.

## Layout, typography, & accessibility specifics

- Use `NSSplitViewController` / `NavigationSplitView`, unified `NSToolbar` / `.toolbar`, minimum window sizes (`window.minSize` / `.frame(minWidth:minHeight:)`), `NSWindow.frameAutosaveName`, and Spaces/Fullscreen support. Never transplant an iOS bottom tab bar into a macOS window.
- Use macOS semantic text styles (`.body`, `.headline`, `.callout`) and verify Retina vector/SF Symbol sharpness.
- Implement `NSAccessibility` roles, labels, and custom actions on custom AppKit views; never suppress the system keyboard focus ring (`focusRingType = .none`) without a high-contrast replacement. Verify **Full Keyboard Access** (`System Settings → Keyboard → Keyboard navigation`) and **VoiceOver** across toolbars, sidebars, sheets, and modals.

## Storage, notarization, & `Ed25519` auto-updates

- **OS-standard paths & atomic writes**: store app support files in `FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)` (`~/Library/Application Support/<BundleId>`), caches in `~/Library/Caches`, and logs in `~/Library/Logs`—never inside `.app` bundles. Persist project/config files atomically (`try data.write(to: url, options: .atomic)` or temp file + `fsync` + `replaceItemAt`) and configure local SQLite in `WAL` mode with versioned migrations ([working-context.md](working-context.md)).
- **Two-way Finder drag-and-drop & inactive window dimming**: support dragging files in from and out to Finder/Desktop (`NSDraggingDestination` / `NSDraggingSource`, SwiftUI `.draggable` / `.dropDestination`), dim sidebar/toolbar prominence when `appearsActive == false` (`@Environment(\.controlActiveState)`), and maintain `< 300 ms` cold start + `~0%` idle CPU when occluded (`NSWindow.occlusionState`).
- **Sandbox, Universal binaries & notarization**: under **App Sandbox**, request minimal entitlements (`com.apple.security.files.user-selected.read-write`) and persist user-granted folder access with **security-scoped bookmarks**. For direct distribution outside the Mac App Store, build Universal (`arm64 + x86_64`) or explicit-arch bundles, enable **Hardened Runtime**, sign with **Developer ID Application**, notarize (`xcrun notarytool submit --wait`), staple (`xcrun stapler staple`), and ship **Sparkle 2** (`Ed25519` / `EdDSA`-signed) background delta updates that roll back cleanly on launch failure.

## Do/don't pairs

| Do | Don't |
|---|---|
| `DocumentGroup` / `NSDocument` with dirty dot, atomic `.atomic` saves, and Save prompt on close | Overwrite files non-atomically in place or discard edits on close |
| Wire active-window menu items via `.commands` + `@FocusedValue` or Responder Chain | Hard-code menu actions to a singleton window reference |
| Check `accessibilityDisplayShouldReduceTransparency` & `IncreaseContrast` around `NSGlassEffectView`/`.glassEffect` | Ship unreadable translucent glass toolbars over high-contrast documents |
| Sign Developer ID + Hardened Runtime + `notarytool` + `stapler` + Sparkle 2 `Ed25519` updates | Ship unnotarized `.dmg`s blocked by Gatekeeper or unsigned auto-updaters |
| Persist folder access via security-scoped bookmarks and store app data in `~/Library/Application Support` | Assume raw POSIX paths survive relaunch under App Sandbox |

## Known traps

Menu items staying enabled when no document window is key (missing `NSMenuItemValidation` / `@FocusedValue`), AppKit/SwiftUI `NSHostingView` sizing loops inside `NSTableView` cells, custom `NSWindow` titlebar removing drag/double-click zoom, keyboard shortcuts colliding with macOS system/IME bindings, unnotarized binaries failing Gatekeeper, unguarded `NSGlassEffectView` failing Reduce Transparency.

## Verification commands

```sh
xcodebuild -scheme App -destination 'platform=macOS' build
xcodebuild test -scheme App -destination 'platform=macOS'
# For Developer ID release validation:
codesign --verify --deep --strict build/App.app
spctl --assess --type execute --verbose build/App.app
```

`xcodebuild` and unit tests are `static` evidence. Run on real macOS across VoiceOver, Accessibility Inspector, Full Keyboard Access, Dark Mode, Increase Contrast, Reduce Transparency, Reduce Motion, multi-monitor/Retina resize, and document dirty-close flows for `rendered` evidence; label unavailable hardware/macOS versions `not-checked`.
