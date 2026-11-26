# Working context: linked panes, persistence, and multi-monitor safety

In desktop editors, debuggers, CAD tools, and inspectors, secondary panes exist to act on a specific subject in the primary canvas or source view. Never let a detached inspector or result pane leave its subject ambiguous.

## Linked source, canvas, & inspector context

- **Mark the active subject in both places**: a debugger marks the paused source line with an icon + highlight while the call-stack pane names the selected frame and file:line; a document inspector names the selected layer/node in its header while the canvas renders selection handles. Never rely on color alone—pair visual selection with a text label, icon, or breadcrumb.
- **Explicit empty & multi-selection states**: when nothing is selected, show document/page properties or a clear `"No item selected"` state rather than stale fields from the previous item. When N items are selected, show `"3 layers selected"`, display shared values, and label divergent fields `"Mixed"` rather than silently overwriting differing values on blur.
- **Bi-directional synchronization**: navigating to an error/search result focuses and scrolls the primary pane without stealing keyboard focus unintentionally; editing a property in the inspector updates the primary view with a single coherent undo step (`Cmd/Ctrl+Z`).

## Pane focus-ring traversal (`F6`)

Keyboard-only users must traverse major workspace regions without tabbing through 200 toolbar or tree items:

| Shortcut | Action |
|---|---|
| `F6` / `Shift+F6` (Windows/Linux) or `Ctrl+F6` / documented landmark key (macOS) | Cycle focus between primary landmark panes (Sidebar → Editor/Canvas → Inspector → Bottom Output/Console) while restoring the last focused item inside each pane. |
| `Escape` | Return focus from a secondary inspector, search bar, or quick-filter input back to the primary working canvas/editor without clearing the active selection. |
| `Cmd/Ctrl+B`, `Cmd/Ctrl+Alt+I`, etc. | Toggle sidebar/inspector visibility via discoverable menu commands so collapsed panes remain reachable when hidden. |

## Minimum-width disclosure fallback

Define a tested minimum window width (e.g., `720–900 px` logical) and split-pane minimum widths so panes cannot be dragged to an irreversible `0 px` slit:

- Below the multi-pane threshold, collapse the secondary inspector into a tab, slide-over drawer, or temporary sheet—preserving the active selection and keeping all inspector commands accessible in menus and the command palette.
- Provide a visible re-open button and menu toggle whenever a pane is collapsed; persist collapsed/expanded state independently of last known width so reopening restores a usable width.

## Full workspace session restoration & multi-monitor clamping

Store workspace and session state in a versioned schema (JSON/SQLite/Preferences) so restarts restore **open windows, tabs, split ratios, active/dirty documents, scroll offsets, and selection** without crashing across schema upgrades:

```json
{
  "schemaVersion": 2,
  "windows": [{
    "width": 1280, "height": 800, "x": 120, "y": 80, "maximized": false, "displayId": "DELL-U2723QE",
    "openTabs": ["doc-1", "doc-2"], "activeTab": "doc-2",
    "panes": { "sidebarOpen": true, "sidebarWidth": 260, "inspectorOpen": true, "inspectorWidth": 320 }
  }]
}
```

**Multi-monitor & mixed-DPI (`100%` ↔ `200%`) clamping rule**: users unplug external monitors, drag windows between `100%` 1080p and `200%` 4K/Retina displays, and rearrange display layouts. Persist logical DIPs alongside display scale/ID, handle live `PerMonitorV2` / backing-scale changes cleanly, and on restore (on X11/Windows/macOS where coordinates apply; on Wayland persist only `width`/`height`/maximized because Wayland disallows global positioning):

1. Enumerate all currently connected displays' **usable work areas** (excluding taskbar/dock/menu bar).
2. Verify that at least the window's titlebar drag band and a usable portion (e.g., ≥ `120×80 px`) intersect a connected display's work area.
3. If the saved bounds fall off-screen or exceed the current display's work area, clamp `width`/`height` to the primary display's work area and re-center the window—**never restore an unreachable off-screen window**.

## Performance envelope, OS-standard paths, clean uninstall & support logs

- **Startup, idle CPU & 30-minute active RAM budgets**: hit **`< 300–500 ms`** cold start on Native/Tauri/Rust/C++/Qt/AppKit/WinUI/GTK apps and **`< 1.0–1.2 s`** on Electron (whose Chromium memory footprint must be explicitly justified in the project brief). Maintain **`~0%` idle CPU** when minimized, occluded, or unfocused, **measure RSS/private RAM after 30 minutes of active editing/navigation** to confirm zero unbounded leaks against the agreed ceiling, and run heavy file/Git/SQLite/indexing work on background worker threads or utility processes.
- **High-contrast OS modes**: honor **Windows `forced-colors` / High Contrast themes** (`SystemColors` / `@media (forced-colors: active)`) and **macOS `Increase Contrast` + `Reduce Transparency`** so borders, focus rings, selection states, and translucent sidebars stay unmistakable.
- **OS-standard storage paths**: **never** write user config, caches, databases, or logs next to the application binary (`Program Files`, `/Applications`, `/usr/bin` are read-only or invalidate code signatures). Resolve platform-standard directories (`directories` crate in Rust, `app.getPath()` in Electron, `QStandardPaths` in Qt, `os.UserConfigDir()` in Go):
  - **macOS**: `~/Library/Application Support/<AppId>`, `~/Library/Caches/<AppId>`, `~/Library/Logs/<AppId>`
  - **Windows**: `%APPDATA%\<AppId>` (roaming config), `%LOCALAPPDATA%\<AppId>` (local DB, cache, logs)
  - **Linux**: XDG Base Directory spec (`$XDG_CONFIG_HOME`, `$XDG_DATA_HOME`, `$XDG_STATE_HOME`, `$XDG_CACHE_HOME`)
- **Atomic file persistence (`write temp → fsync → rename`) & SQLite `WAL`**: never `truncate` + overwrite project files or `settings.json` in place; write to `<target>.tmp.<pid>` in the same directory, flush kernel buffers (`File::sync_all()` / `fsync` / `FlushFileBuffers`), and atomically `rename` onto `<target>`. Configure SQLite with `PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;` and numbered migrations.
- **Clean uninstaller & opt-in support log export**: ensure uninstallers cleanly remove binaries, background helpers/daemons, `LaunchAgents`, Windows Services, file associations, and registry keys (prompting before deleting user workspaces), and provide a one-click **opt-in diagnostic/support log export** (`Help → Export Diagnostic Logs…`) with auth tokens, secrets, and PII automatically redacted.

## 2026 code signing, clean-VM install proof & live `v(N-1) -> vN` update rollback

- **macOS**: sign with **Developer ID Application** + **Hardened Runtime** + minimal audited Entitlements, submit via **`xcrun notarytool submit --wait`**, staple (`xcrun stapler staple`), and capture a **clean-VM install screenshot** verifying Gatekeeper opens the app cleanly without `"unidentified developer"` blocks.
- **Windows (post-2024 EV SmartScreen reality)**: sign `.exe`/`.msi`/`.msix` via **Azure Artifact Signing (Trusted Signing)** or FIPS 140-2 Level 2+ HSM-backed OV/EV certificates, and capture a **clean-VM install screenshot** documenting exact SmartScreen/publisher behavior (**since 2024, Microsoft removed instant EV certificate SmartScreen bypass**, so reputation builds across consistent signed CI releases under one stable publisher identity).
- **Linux**: ship `.deb`/`.rpm`, **Flatpak** (with XDG Portals + valid AppStream metainfo XML), or GPG-signed **AppImage**.
- **Live `v(N-1) -> vN` delta auto-update + rollback verification**: sign update manifests and delta bundles with **`Ed25519` / `minisign`** (`tauri-plugin-updater`, Sparkle 2 `EdDSA`, Velopack, or verified `electron-updater`), stage silently in the background, prompt before restarting dirty windows, and **test a live upgrade AND simulated crash rollback across 2 consecutive packaged versions (`v(N-1) -> vN`)** before release.

## Do/don't pairs

| Do | Don't |
|---|---|
| Show selected object name/breadcrumb in the inspector header AND mark it on canvas | Leave stale fields in a detached inspector when selection clears |
| Support `F6`/`Shift+F6` pane hopping, `Esc` back to canvas, and Windows `forced-colors` + macOS `Increase Contrast` | Force keyboard users to `Tab` through 100 tree rows or hide borders in High Contrast mode |
| Restore full workspace sessions (windows, tabs, active docs) and clamp bounds across mixed-DPI (`100%` ↔ `200%`) work areas | Restore `x: 2800, y: 100` onto an unplugged monitor or drop open tabs on restart |
| Store data in XDG / `Application Support` / `%APPDATA%` with atomic writes, clean uninstallers, and redacted support log export | Write `config.json` beside the binary or leave orphan daemons/registry keys after uninstall |
| Capture clean-VM Gatekeeper/SmartScreen install proofs and test live `v(N-1) -> vN` updates + rollback | Assume a Windows EV cert buys instant SmartScreen bypass or ship an untested auto-updater |
| Hold `~0%` idle CPU and verify steady RAM after **30 minutes of active usage** | Spin background timers in minimized windows or ignore slow memory leaks |

## Verification checks

Verify in a real running desktop app (`rendered`; static showcase screenshots never prove keyboard traversal, clamping, signing, or restoration—label untested OSes `not-checked`):

1. Select an item, press `F6` to move to the inspector, edit a field, press `Esc` back to canvas, and undo (`Cmd/Ctrl+Z`): verify selection, focus ring, High Contrast / `Increase Contrast` visibility, and undo agree (`rendered`).
2. Open multiple windows/tabs/documents, resize down to minimum width, drag between `100%` and `200%` DPI displays, seed off-screen coordinates (`x: 9999`), relaunch, and verify full session restoration + on-screen clamping (`rendered`).
3. Measure `~0%` idle CPU and **RAM after 30 minutes of active usage**, verify atomic save + clean uninstall + redacted log export, walk `NVDA`/`JAWS`/`Narrator`, `VoiceOver`, and `Orca`, and attach **clean-VM Gatekeeper/SmartScreen install screenshots** plus **live `v(N-1) -> vN` update + rollback** evidence (`rendered` / `static`).
