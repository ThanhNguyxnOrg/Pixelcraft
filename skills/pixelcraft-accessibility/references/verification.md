# Accessibility verification split

Evidence: WCAG, axe-core, generated-code accessibility repair research.

## Automated evidence (`rendered` in live browser/emulator vs. `static` in source)

Distinguish where the tool executes when assigning Pixelcraft evidence labels:

- **Browser/renderer-executed scans** (`@axe-core/playwright`, Storybook `@storybook/addon-a11y`, Lighthouse accessibility, Playwright `toMatchAriaSnapshot()`, Xcode Accessibility Inspector, Android Accessibility Scanner) inspect a live rendered DOM or platform accessibility tree → label **`rendered` (automated subset — not manual proof)**.
- **Source linters and static scanners** (`eslint-plugin-jsx-a11y`, `svelte-check`, `slop-scan.mjs`, template AST checks) inspect source files without rendering → label **`static`**.

| Tool / surface | Evidence label | Detects | Does not prove |
|---|---|---|---|
| `@axe-core/playwright` / live axe-core scan | `rendered` (automated subset) | missing labels/names, computed contrast, invalid ARIA, landmarks, duplicate IDs in real browser states | task usability, logical focus order, meaningful copy, screen-reader ergonomics |
| Playwright `toMatchAriaSnapshot()` | `rendered` (regression) | unintended accessibility-tree role/name/hierarchy regressions across states | visual contrast, focus visibility, or whether the snapshot itself is good UX |
| Storybook `@storybook/addon-a11y` | `rendered` (isolated component) | per-variant/state axe violations during component development | page-level landmark hierarchy, keyboard focus restoration across flows |
| `eslint-plugin-jsx-a11y` / static scanners | `static` | missing `alt`/labels, click-on-div without keyboard handler, banned patterns at edit time | computed contrast, CSS hiding/occlusion, runtime focus management |
| Accessibility Inspector (Xcode) / Accessibility Scanner (Android) | `rendered` (automated subset) | native accessibility tree, touch target size, label/trait audits | real VoiceOver/TalkBack task completion |

Automated zero means “no detected violations in scanned scope,” never “accessible.” Empirical **W3C ACT** rule-mapping shows automated scanners cover only **~31% of WCAG 2.2 A/AA success criteria**—they systematically miss conditionally mounted live-region silence, focus loss on delete or `"Load more"`, logical focus order, Focus Not Obscured (`2.4.11`), single-pointer drag alternatives (`2.5.7`), split-text screen-reader fragmentation, and end-to-end keyboard task completion. This directly reinforces **Golden Evidence Rule (`Rule #0.3`)**: never count `static` linters or automated-only scan zeros as a `pass` for interactive or assistive accessibility requirements; pair them with manual rendered checks or record the unchecked manual scope honestly as `not-checked`.

## Forbidden shortcut: accessibility overlay widgets

**Never install, recommend, or accept third-party Accessibility Overlay widgets** (`accessiBe`, `AudioEye`, `UserWay`, or similar injected toolbar scripts) as a substitute for source-level remediation. Overlays cannot repair broken DOM/tree semantics, unmounted live regions, focus traps, form error associations, or composite widget contracts; they frequently conflict with users' own assistive technology and confer zero conformance under WCAG 2.2 AA, EAA/`EN 301 549`, or ADA Title II. Remediate every defect directly in source markup, design tokens, and interaction code.

## Manual protocol

1. Keyboard/controller only: complete primary task (stopping before final payment or other irreversible commit unless running in an explicitly isolated sandbox, mock, or test mode), reverse direction, close/escape, recover after error.
2. Screen reader: inspect name/role/value/order/status/error/form behavior. Use the platform pairing realistically (NVDA/JAWS+Chrome/Edge, VoiceOver+Safari/iOS, TalkBack+Android/Chrome, Orca+Linux).
3. Zoom/reflow/text scaling: 200% or platform largest text where practical; verify clipping/overlap/truncation.
4. Visual modes: dark/light/high contrast/increased contrast/forced colors; inspect state boundaries and focus.
5. Input modalities: touch target one-hand, keyboard, mouse, controller/switch/voice where applicable.
6. Motion/audio: reduced motion, captions/subtitles, flashing, autoplay control.
7. Forms/auth: paste/password manager/autofill, preserve input, error association/recovery, redundant entry.
8. Record scope: build/commit, OS/browser/assistive tech versions, viewport/device, locale/direction, test data, exact task path.

## Reporting language

Use: “`eslint-plugin-jsx-a11y` passed on `<scope>` `static`; `@axe-core/playwright` scan of rendered checkout states reported zero violations `rendered` (automated subset); keyboard checkout flow verified up to final payment confirmation `rendered`; live payment submission `not-checked` (no isolated sandbox/test mode); VoiceOver screen-reader walkthrough `not-checked`.”

Never use: “WCAG compliant” unless the full scoped conformance process actually happened and legal/conformance language is intended.

## Composite-widget scripts

For custom dialogs, menus, tabs, comboboxes, disclosures, grids, trees, carousels, live regions, tooltips, and drag/drop, write the expected interaction contract before manual testing. At minimum verify:

- entry: how focus/attention enters the widget and whether context is announced;
- movement: arrows/tab/home/end/escape/controller equivalents and direction reversal;
- activation vs selection: when each happens and whether async state is pending;
- exit/restoration: where focus goes after close, delete, submit, error, or route change;
- hidden state: inactive content is neither focusable nor announced as active;
- async refresh: focus does not disappear and status is concise/truthful;
- mode stress: text scaling, RTL, high contrast/forced colors, reduced motion, touch target behavior.

Record exact assistive technology/platform versions when available. If only keyboard inspection is possible, do not infer screen-reader quality from it.

## Regression minimum

When fixing one accessibility defect, retest:

1. the original failing task path;
2. reverse navigation/focus restoration;
3. one error/recovery path;
4. smallest supported geometry or text scaling;
5. relevant dark/high-contrast/forced-colors mode;
6. any composite-widget state touched by the fix.

Do not close a defect because the automated scanner became quiet.
