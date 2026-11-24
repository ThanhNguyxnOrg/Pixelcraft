# Java web: Vaadin Flow / Hilla, Thymeleaf + htmx, JTE, Quarkus Qute

## Stack selection

| Stack | Rendering model | Best fit | Primary watch-out |
|---|---|---|---|
| **Vaadin Flow** | Server-side Java UI driving Web Components over XHR/WebSocket | Internal enterprise apps owned purely by Java teams | Stateful server session memory and disconnect/reconnect UX |
| **Vaadin Hilla** | React + TypeScript frontend + auto-generated typed RPC from Spring `@BrowserCallable` endpoints | Java/Spring Boot backends needing modern React/Vite UI and offline/client responsiveness | Treat frontend with full React/WCAG/token discipline; never bypass `@RolesAllowed` / `@AnonymousAllowed` on endpoints |
| **Spring Boot + Thymeleaf + htmx** | Server-rendered HTML templates + `htmx-spring-boot` (`@HxRequest`) fragment controllers | Public web apps, CRUD portals, progressive enhancement | Include `Vary: HX-Request` on dual full-page/fragment routes and wire Spring Security CSRF header |
| **JTE (Java Template Engine)** | Precompiled, type-safe `.jte` templates with contextual HTML/JS/CSS escaping | High-throughput Spring Boot / Javalin / Ktor server HTML with compile-time checking | Keep business logic out of templates; configure precompiled mode for production |
| **Quarkus Qute** | Build-time type-checked reactive templates (native-image friendly) | Quarkus microservices rendering HTML/htmx fragments with low memory footprint | Validate template parameter types at build time (`@CheckedTemplate`) |

## Token mapping

Vaadin Flow/Hilla: map semantic tokens to Lumo/Aura custom CSS properties (`--lumo-primary-color`, application semantic variables) in the application theme folder (`frontend/themes/<name>/styles.css`); do not restyle every component instance. Thymeleaf, JTE, and Qute: import generated CSS variables in the shared base layout and consume semantic classes rather than copying hex into Java or templates.

## Layout and responsive idioms

Vaadin Flow/Hilla routes and layouts produce real DOM/web components but still need intentional responsive CSS and narrow-viewport restructuring. Thymeleaf, JTE, and Qute are server-rendered HTML: design complete semantic pages first, compose fragments cleanly, and pair with htmx 2 (`htmx-alpine.md`) when partial updates improve task flow.

## Typography/custom fonts

Load fonts through static/theme CSS with explicit fallback/subsetting. Vaadin theme typography should use documented custom properties; Thymeleaf/JTE/Qute use ordinary CSS. Verify scaling/localization in a real browser.

## Motion/reduced motion

Use CSS `@media (prefers-reduced-motion: reduce)`. Vaadin component animation coverage varies by component/version—inspect overlays, drawers, dialogs, and progress bars in reduced-motion emulation and override in the theme stylesheet.

## Accessibility specifics

Vaadin provides WCAG-oriented component primitives, but application composition can still break labels, landmarks, focus order, dialogs, grids, and screen-reader flow. In Thymeleaf/JTE/Qute, accessibility is exactly the emitted HTML—manage server round-trip focus, error summaries, and `aria-live` updates after htmx fragment swaps.

## States & Forms idiom

- **Vaadin Flow**: model loading/error/empty/permission/offline/push/session-expiration explicitly; never leave dead controls after session disconnect. Pair `Binder` validators with visible persistent labels and non-color required indicators.
- **Vaadin Hilla**: annotate every `@BrowserCallable` service with explicit Spring Security rules (`@RolesAllowed`, `@PermitAll`), consume generated TypeScript models/hooks with `useForm` (Hilla React Form) or `forms-validation.md` idioms, and preserve input across validation failures.
- **Spring + Thymeleaf / JTE / Qute + htmx**: return full pages on normal requests and partial fragments on `@HxRequest` (with `Vary: HX-Request`), expose CSRF tokens via hidden inputs or `hx-headers`, return HTTP 422 error fragments preserving posted values, and keep filter/pagination state in URLs.

## Do/don't pairs

| Do | Don't |
|---|---|
| Vaadin Flow `new Button("Save invoice")` or semantic `<button type="submit">` | Click listener on a layout `Div` with no keyboard semantics |
| Explicit `@RolesAllowed` on every Vaadin Hilla `@BrowserCallable` endpoint | Assuming frontend route guards protect generated Hilla RPC endpoints |
| Spring `@HxRequest` + `Vary: HX-Request` returning semantic error fragments with preserved values | Caching partial htmx fragments under the same cache key as full pages or losing POST input |
| Precompiled JTE / `@CheckedTemplate` Qute with contextual auto-escaping | String-concatenated HTML or bypassing template escaping on user text |
| Semantic CSS theme variables in `styles.css` | Per-instance inline hex colors scattered across Java views/templates |

## Known traps

Missing Spring Security annotations on Hilla `@BrowserCallable` endpoints, caching htmx fragments without `Vary: HX-Request`, Vaadin session timeout leaving silent dead buttons, bypassing JTE/Qute/Thymeleaf escaping, grid density clipping at 200% zoom, CSRF failures on htmx `hx-post` requests.

## Verification commands

```sh
./mvnw verify
./gradlew test build
npx playwright test
```

Inspect browser DOM/accessibility tree, session expiry/offline/push interruption, htmx no-JS + enhanced paths, keyboard/focus order, reduced motion, and zoom/localization behavior (`rendered`); Maven/Gradle builds and template checks are `static`.
