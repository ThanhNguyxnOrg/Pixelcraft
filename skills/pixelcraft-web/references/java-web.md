# Java web: Vaadin and Thymeleaf

## Token mapping

Vaadin: map tokens to Lumo/custom CSS properties (`--lumo-primary-color`, application semantic variables) and theme folders; do not restyle every component instance. Thymeleaf: use generated CSS variables/semantic classes in templates. Keep server constants synchronized through token export rather than copying hex into Java/templates.

## Layout and responsive idioms

Vaadin Flow routes/layouts produce real web components but need responsive CSS/viewport design. Thymeleaf is server-rendered HTML: use progressive enhancement, semantic markup, template fragments, and standard browser layout. Choose based on application interaction depth, team Java ownership, SEO/initial-load needs—not because Java is familiar.

## Typography/custom fonts

Load fonts through static/theme CSS with fallback/subsetting. Vaadin theme typography should use documented custom properties; Thymeleaf remains ordinary CSS. Verify scaling/localization in actual browser.

## Motion/reduced motion

Use CSS `@media (prefers-reduced-motion: reduce)`. Vaadin component animation coverage varies by component/version, so inspect actual overlays/progress/dialog behavior and add reduced-motion overrides in the application theme. Thymeleaf has no motion model beyond browser/CSS/JS.

## Accessibility specifics

Vaadin states WCAG-oriented component support for current versions, but application composition can still break labels, landmarks, focus order, dialogs, grids, and screen-reader flow. Thymeleaf accessibility is exactly the emitted HTML. Manage server round-trip focus/error summary and keyboard behavior.

## States idiom

Vaadin: model loading/error/empty/permission/offline/push/session expiration explicitly; never leave dead UI after session disconnect. Thymeleaf: use HTTP semantics, redirects/flashes/form errors, no-js fallback, empty/error templates, and idempotency. Preserve deep links and scroll/back behavior.

## Forms idiom

Vaadin Binder/validators need labels, required indicators independent of color, validation timing, server error recovery, input preservation, autocomplete/inputmode equivalents where available. Thymeleaf uses native form semantics and constraint validation plus server-side field errors.

## Do/don't pairs

| Do | Don't |
|---|---|
| Vaadin `new Button("Save invoice")` | click listener on layout/div |
| semantic theme variables | per-instance inline colors everywhere |
| Thymeleaf `<label for="email">` | placeholder-only form fields |
| explicit session-expired state | dead controls after disconnect |

## Known traps

Vaadin version/theme breaking changes, session timeout/push behavior, grid density/accessibility, blocking server round trips, treating Thymeleaf as incapable of modern UX, CSRF/security regression while polishing forms, JavaScript interop ownership conflicts.

## Verification commands

```sh
./mvnw verify
./gradlew test build
npx playwright test
```

Inspect browser DOM/accessibility tree, session expiry/offline/push interruption, keyboard/focus order, screen readers where required, reduced motion, responsive/zoom/localization behavior.
