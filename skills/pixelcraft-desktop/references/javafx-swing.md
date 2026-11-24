# Java desktop: JavaFX (22+) and Swing (FlatLaf)

## Token mapping & modern theming

- **JavaFX**: map DTCG semantic tokens to CSS custom properties in an application stylesheet (`.root { -pc-action: #0074ca; }`) or adopt **AtlantaFX** (`PrimerLight`, `PrimerDark`, `NordLight`, `NordDark`, `CupertinoLight`, `CupertinoDark`) which builds modern desktop themes cleanly on semantic CSS variables.
- **Swing**: adopt **FlatLaf** (`FlatLightLaf`, `FlatDarkLaf`, `FlatMacLightLaf`, `FlatMacDarkLaf`) rather than legacy Metal/Nimbus Look-and-Feels. FlatLaf provides crisp HiDPI vector icons, modern dark/light themes, native macOS/Windows titlebar integration, and semantic UI defaults via `FlatLaf.setGlobalExtraDefaults(...)` / `.properties` files.

```java
// Swing + FlatLaf modern theme initialization (before constructing any Swing frames):
FlatLaf.setGlobalExtraDefaults(Map.of("@accentColor", "#0074CA"));
FlatLightLaf.setup(); // or FlatDarkLaf.setup() / FlatMacDarkLaf.setup()
```

Never scatter inline `-fx-background-color` strings or per-component `new Color(...)` literals across views.

## JavaFX 22+ `Platform.Preferences` (system dark mode, accent, reduced motion)

JavaFX 22+ natively exposes OS theme, accent color, reduced motion, and reduced transparency preferences through **`Platform.getPreferences()`**—observe these properties directly instead of guessing with OS-specific hacks:

```java
import javafx.application.ColorScheme;
import javafx.application.Platform;
import atlantafx.base.theme.PrimerDark;
import atlantafx.base.theme.PrimerLight;

var prefs = Platform.getPreferences();
Runnable syncTheme = () -> {
    boolean dark = prefs.getColorScheme() == ColorScheme.DARK;
    Application.setUserAgentStylesheet(
        dark ? new PrimerDark().getUserAgentStylesheet()
             : new PrimerLight().getUserAgentStylesheet()
    );
};
syncTheme.run();
prefs.colorSchemeProperty().addListener((obs, oldVal, newVal) -> syncTheme.run());
// Also inspect prefs.reducedMotionProperty() and prefs.accentColorProperty()
```

## Layout, typography, & motion idioms

- **JavaFX**: use scene-graph layout panes (`BorderPane`, `VBox`, `HBox`, `GridPane`, `SplitPane`, `VirtualFlow`/`ListView`) with explicit `minWidth`/`minHeight`, resize persistence, and multi-monitor bounds clamping.
- **Swing**: always use layout managers (`BorderLayout`, `GridBagLayout`, `MigLayout`, `JSplitPane`)—never absolute `setBounds(...)` pixel placement.
- Register bundled TTF/OTF fonts (`Font.loadFont` in JavaFX; `GraphicsEnvironment.registerFont` in Swing) and verify fractional HiDPI rendering (`125%`/`150%`/`200%`), glyph fallback, and localized text expansion.
- Bind JavaFX `Timeline`/`Transition` duration or skip non-essential motion when `Platform.getPreferences().isReducedMotion()` is `true`; cancel Swing `Timer` and JavaFX animations on view close.

## Accessibility, states, & forms idioms

- **JavaFX**: built-in controls expose native OS accessibility trees; for custom `Node`/`Pane` controls, always set `setAccessibleRole(AccessibleRole.BUTTON)` and `setAccessibleText(...)` (plus `setAccessibleHelp(...)` sparingly).
- **Swing**: set `JLabel.setLabelFor(field)`, `getAccessibleContext().setAccessibleName(...)`, keyboard mnemonics (`setMnemonic`), and accelerators (`KeyStroke`).
- Never block the **JavaFX Application Thread** or **Swing EDT (Event Dispatch Thread)** with disk, database, or network I/O: use `javafx.concurrent.Task` / `Service` or `SwingWorker` / virtual threads with explicit cancellation and `Platform.runLater` / `SwingUtilities.invokeLater` handoff. Guard `setOnCloseRequest` / `WindowListener.windowClosing` for unsaved documents.

## Native packaging (`jlink` & `jpackage`)

Do not ask end users to install a matching system JDK manually. Build a stripped runtime image with `jlink` and package native signed OS installers/bundles with **`jpackage`** (`.dmg`/`.pkg` on macOS, `.msi`/`.exe` on Windows, `.deb`/`.rpm` on Linux) including app icons, file associations, and launcher metadata.

## Do/don't pairs

| Do | Don't |
|---|---|
| Observe JavaFX 22+ `Platform.getPreferences()` for dark mode, accent, and reduced motion | Hard-code a light-only stylesheet or ignore system reduced motion |
| Use **AtlantaFX** (JavaFX) or **FlatLaf** (Swing) with semantic variables/defaults | Ship legacy 2000s Metal/Caspian themes or inline hex strings everywhere |
| Set `AccessibleRole` + `accessibleText` / `JLabel.setLabelFor` on controls | Use a clickable `Pane` or `JPanel` with no keyboard focus or screen-reader name |
| Run I/O in `Task`/`SwingWorker` off the FX thread / EDT with cancellation | Freeze the window by calling HTTP/SQL synchronously inside an `ActionListener` |
| Bundle self-contained native installers with `jlink` + `jpackage` | Ship a bare `.jar` requiring users to configure `JAVA_HOME` |

## Known traps

Blocking the FX Application Thread or Swing EDT, leaking strong listeners on `Platform.getPreferences()` or observable properties across closed windows, blurry bitmap icons under Windows `150%` scaling (use SVG/FlatSVGIcon or multi-resolution images), `setBounds` clipping localized strings, Swing/JavaFX interop (`JFXPanel`) focus/DPI bugs, missing macOS notarization or Windows signing on `jpackage` bundles.

## Verification commands

```sh
# Run the build tool configured in the repository (Maven or Gradle):
./mvnw verify
./gradlew test build
./gradlew run
# Packaging smoke test (requires JDK 21+ with jpackage):
jpackage --type app-image --name App --input build/libs --main-jar app.jar
```

`verify`/`test`/`build` provide `static` / logic evidence. Run the launched desktop app (and `jpackage` bundle) on target OSes across Light/Dark/High Contrast modes, fractional HiDPI, keyboard-only Tab/mnemonic traversal, VoiceOver/Narrator/Orca, and dirty-close recovery for `rendered` evidence; label untested OSes `not-checked`.
