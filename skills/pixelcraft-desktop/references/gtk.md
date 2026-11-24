# GTK 4 & libadwaita

## Token mapping & `AdwStyleManager` / `AdwAccentColor`

Prefer libadwaita 1.4–1.8 semantic CSS variables (`--window-bg-color`, `--view-bg-color`, `--accent-bg-color`, `--accent-color`, `--destructive-bg-color`) and built-in style classes (`suggested-action`, `destructive-action`, `boxed-list`, `card`, `dimmed`) over hard-coded hex values so dark mode, high contrast, and system accent colors work automatically.

- Inspect **`AdwStyleManager`** (`style_manager.get_dark()`, `get_high_contrast()`, `set_color_scheme(ADW_COLOR_SCHEME_DEFAULT)`) and **`AdwAccentColor`** (libadwaita 1.6+, reflecting desktop accent preferences via `AdwStyleManager:accent-color`).
- Scope custom application tokens in one CSS resource loaded at `GTK_STYLE_PROVIDER_PRIORITY_APPLICATION` so user accessibility themes still override when needed.

## Modern GTK4 / libadwaita 1.4–1.8 widgets & Blueprint (`.blp`)

Replace deprecated GTK3 and early libadwaita widgets (`AdwLeaflet`, `AdwFlap`, `AdwSqueezer`, `GtkMessageDialog`, `AdwMessageDialog`) with modern adaptive primitives:

- **`AdwNavigationSplitView`** + **`AdwBreakpoint`**: automatically collapses sidebar + content into a stacked navigation view below your chosen width threshold (`max-width: 600sp`).
- **`AdwDialog` / `AdwAlertDialog`**: adaptive dialogs that present as centered overlays on desktop and bottom sheets on narrow/mobile Linux form factors.
- **`AdwStatusPage`**: structured empty, loading, error, and onboarding states with icon, title, description, and action button.
- **Blueprint (`.blp`)**: prefer Blueprint compiler syntax over verbose hand-written GtkBuilder XML for readable, type-checked declarative UI:

```blp
using Gtk 4.0;
using Adw 1;

template $InvoiceWindow : Adw.ApplicationWindow {
  default-width: 960;
  default-height: 640;
  width-request: 360;

  Adw.Breakpoint {
    condition ("max-width: 600sp")
    setters { split_view.collapsed: true; }
  }

  content: Adw.NavigationSplitView split_view {
    sidebar: Adw.NavigationPage { title: _("Folders"); child: Gtk.ListBox {}; };
    content: Adw.NavigationPage {
      title: _("Invoices");
      child: Adw.StatusPage {
        icon-name: "document-open-symbolic";
        title: _("No Invoices Yet");
        description: _("Create an invoice or import a CSV.");
      };
    };
  };
}
```

## Wayland, XDG Desktop Portals, & Flatpak

- **Wayland has no global window positioning**: Wayland intentionally prevents apps from querying or setting absolute `(x, y)` desktop coordinates. Persist `default-width`, `default-height`, and `maximized` state only; use `AdwDialog`, `GtkPopover`, and `transient-for` relationships rather than manual screen coordinate math.
- **XDG Desktop Portals & Flatpak**: use portal-backed GTK4 APIs (`GtkFileDialog`, `GtkUriLauncher`, `GtkFileLauncher`, `GNotification`) or `libportal` / Rust `ashpd` so file open/save, print, notifications, and dark-mode settings work cleanly inside Flatpak sandboxes without granting broad `--filesystem=home` permissions.

## States, `close-request`, & async main-loop discipline

GTK4 replaced GTK3's removed `delete-event` with the **`close-request`** signal on `GtkWindow`. Return `true` (`GDK_EVENT_STOP`) to defer closing while presenting an `AdwAlertDialog` for unsaved documents:

```c
static gboolean on_close_request(GtkWindow *win, gpointer user_data) {
  if (!app_has_unsaved_changes(user_data)) return FALSE; // allow close
  show_unsaved_changes_dialog(win, user_data);
  return TRUE; // hold window open until user decides
}
```

Never block the GLib main loop (`GMainContext`) with synchronous disk or network I/O; run work via `GTask` / `GIO` async APIs (or Rust `gio::spawn_blocking` / Python `GLib.idle_add` handoff) with `GCancellable` cancellation and visible progress.

## Typography, motion, accessibility, & forms idioms

Use Pango text layout with semantic style classes (`title-1`, `heading`, `body`, `caption`); always escape dynamic user strings with `g_markup_escape_text` before passing into Pango markup. Honor `gtk-enable-animations` (`GtkSettings`) for custom motion—libadwaita animations honor it automatically.

Use `GtkAccessible` properties (`GTK_ACCESSIBLE_PROPERTY_LABEL`, `DESCRIPTION`), keyboard shortcuts (`GtkShortcutController` + `AdwShortcutsDialog`), mnemonics (`_Save`), and `AdwEntryRow` / `AdwComboRow` / `AdwSwitchRow` inside `AdwPreferencesGroup` for clean, accessible forms. Verify with **Orca** screen reader, keyboard-only traversal, and High Contrast mode.

## Do/don't pairs

| Do | Don't |
|---|---|
| Connect `GtkWindow::close-request` to prompt on dirty documents | Reference removed GTK3 `delete-event` or lose edits on window close |
| Use `AdwNavigationSplitView` + `AdwBreakpoint` + `AdwDialog` | Use deprecated `AdwLeaflet`, `GtkMessageDialog`, or fixed desktop widths |
| Use `GtkFileDialog` / XDG Portals inside Flatpak | Request unrestricted `--filesystem=host` just to pick a file |
| Persist `width`/`height`/`maximized` on Wayland | Attempt to save/restore global `(x, y)` screen coordinates on Wayland |
| Escape dynamic strings with `g_markup_escape_text` before Pango markup | Interpolate raw filenames into `<b>%s</b>` markup strings |

## Known traps

Blocking `GMainContext` during I/O, using deprecated GTK3/libadwaita 1.0 APIs, breaking Flatpak sandboxes instead of using portals, assuming X11 global window positioning under Wayland, hard-coding light colors that fail `AdwStyleManager` High Contrast, custom `GtkDrawingArea` widgets missing `GtkAccessible` roles/labels.

## Verification commands

```sh
# Run the test suite matching your language binding:
meson test -C build          # C / Vala / Blueprint projects
cargo test                   # gtk4-rs / Relm4 Rust projects
python -m pytest             # PyGObject projects
# Inspect live GTK4 widget tree, CSS, and accessibility:
GTK_DEBUG=interactive ./build/your-app
```

Build and unit tests are `static` evidence. Inspect live GTK Inspector (`GTK_DEBUG=interactive`), Wayland/tiling resize across breakpoints, Dark & High Contrast themes, Orca screen reader, keyboard-only navigation, and Flatpak sandbox portal behavior for `rendered` evidence; label untested desktop environments `not-checked`.
