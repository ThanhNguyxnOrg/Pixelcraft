# Server-rendered web: Rails, Laravel, Inertia, Django, FastHTML, Phoenix, Blazor, Go templ

The common discipline: the server owns initial semantic HTML, routing, validation, authorization, and most state. Progressive enhancement must not break URLs, forms, back/forward, refresh, or no-/limited-JS behavior.

## Token mapping

Import generated CSS variables in the base layout/asset pipeline. Do not duplicate token values across framework-specific CSS build systems. In component ecosystems (Livewire, Blazor, LiveView, ViewComponent, Phlex, Cotton, templ), pass semantic class names/state rather than raw visual constants.

## Rails 8 + Hotwire (Turbo 8, Stimulus, ViewComponent / Phlex)

- **Turbo 8 page refreshes**: enable morphing refreshes (`<meta name="turbo-refresh-method" content="morph">` and `<meta name="turbo-refresh-scroll" content="preserve">`) so form updates and broadcasts preserve scroll and input focus without hand-coding fine-grained Turbo Streams for every DOM node. Mark media players or stateful widgets `data-turbo-permanent` with a stable `id`.
- **ViewComponent / Phlex**: encapsulate reusable UI pieces in ViewComponent or Phlex Ruby classes so markup, ARIA attributes, and semantic tokens stay testable and centralized.
- **Stimulus lifecycle**: bind listeners/observers in `connect()` and always tear them down in **`disconnect()`** (Turbo caches pages and reconnects controllers on back/forward). Honor `prefers-reduced-motion` in CSS.
- **Do**: `<a href="/invoices/4" data-turbo-frame="_top">View invoice</a>` and clean up observers/timers in Stimulus `disconnect()`.
- **Don't**: swap a frame containing duplicate IDs, drop focus when removing a trigger, or leak Stimulus `window` listeners across Turbo cache restores.
- **Verify**: `bin/rails test`, `bin/rails test:system` (Capybara/Playwright for `rendered` evidence).

## Laravel Blade + Livewire 3 / 4

- **Navigation & persistence**: use `wire:navigate` for SPA-like full-page transitions and **`@persist('audio-player')`** to keep persistent chrome/media alive across navigations.
- **Performance & security**: cache derived lookups with **`#[Computed]`**, protect immutable IDs/foreign keys with **`#[Locked]`**, and always enforce Laravel Policies/Gates inside Livewire action methods (do not rely on `mount()` alone).
- **Forms & DOM identity**: use `wire:key` on every `@foreach` item so morphing preserves focus; render validation error bags adjacent to fields with preserved input; use `wire:loading.attr="disabled"` to prevent duplicate submits.
- **Do**: `<button wire:click="save" wire:loading.attr="disabled">Save invoice</button>` plus `#[Computed]` / `#[Locked]` and policy checks in `save()`.
- **Don't**: trust client-writable Livewire public properties without `#[Locked]`/authorization, or show validation only in a disappearing toast.
- **Verify**: `php artisan test` (Pest/PHPUnit), Laravel Dusk / Playwright (`rendered`).

## Inertia.js v2 (React / Vue / Svelte over Laravel, Rails, Phoenix)

Choose **Inertia.js v2** when the server owns routing, controllers, auth, and database queries while the frontend needs rich React/Vue/Svelte interactivity without maintaining a separate REST/GraphQL API layer:

- **Deferred props (`Inertia::defer(...)` + `<Deferred data="metrics" fallback={...}>`)**: render the main page immediately and stream slow secondary data asynchronously without blocking TTFB.
- **Prefetching & viewport lazy loads**: use `<Link href="/invoices" prefetch>` (hover/mount prefetch) and **`<WhenVisible data="comments" fallback={...}>`** for below-the-fold data; use `usePoll()` for controlled live refresh.
- **Forms**: use `useForm()` (or `<Form>` in Inertia v2) so server validation errors (`errors.<field>`), `processing` state, scroll preservation, and browser history work seamlessly.
- **Do**: keep authorization and data shaping in controllers and return minimal serializable props (never leak raw ORM models).
- **Don't**: recreate a client-side router or duplicate server validation/auth logic inside Inertia page components.

## Django + `django-htmx` / Cotton

- **Template composition**: use base template inheritance for the shell, **`django-cotton`** (`<c-card>`) or `django-template-partials` for reusable semantic components, and **`django-htmx`** (`if request.htmx:`) to return focused fragments on partial requests while returning the full page on direct loads/refreshes.
- **CSRF & forms**: include `hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'` on `<body>` (or standard `{% csrf_token %}` inside forms); render `form.field.errors` adjacent to `<label>` (`label_tag`) instead of dumping unstyled `{{ form.as_p }}`; preserve bound values on HTTP 422/400 validation re-renders.
- **Do**: serve the exact same URL as full HTML on refresh and as a fragment when `request.htmx` is true (with `Vary: HX-Request`).
- **Don't**: cache htmx fragment responses under the same key as full HTML pages without `Vary: HX-Request`, or drop posted input on validation failure.
- **Verify**: `python manage.py check`, `python manage.py test` / `pytest`, Playwright (`rendered`).

## Python FastHTML

Choose **FastHTML** (`fasthtml.common` + Starlette/ASGI + htmx) for Python-native server-rendered web apps without a JS build pipeline:

- Build semantic HTML directly with FT components (`Main`, `Form`, `Label`, `Input`, `Button`) and htmx attributes (`hx_post`, `hx_target`, `hx_swap`), loading semantic design tokens from a static CSS file in `hdrs=(Link(rel='stylesheet', href='/tokens.css'),)`.
- Treat every route as a real HTTP handler returning either a full `Titled(...)` document or a semantic fragment with preserved values and explicit empty/error states.
- **Do**: separate domain logic from FT view functions, use explicit `id`/`for` label wiring, and test HTML output + browser interaction with `Starlette` `TestClient` and Playwright.
- **Don't**: embed untrusted user strings via `NotStr(...)` (XSS risk) or skip `aria-live`/focus management on swapped fragments.

## Phoenix + LiveView 1.0+

- **Memory & async discipline**: render large or growing collections with **`stream/3`** + `phx-update="stream"` (so LiveView does not retain thousands of structs in process RAM) and load slow data non-blockingly via **`assign_async/3`** paired with `<.async_result :let={data} assign={@invoices}>` (`:loading`, `:failed`, ok states).
- **Zero-round-trip UI transitions**: use **`Phoenix.LiveView.JS`** commands (`JS.show`, `JS.hide`, `JS.toggle_class`, `JS.focus`) for modals, drawers, and disclosures so local interaction is instant and respects `prefers-reduced-motion`.
- **Forms & uploads**: use `to_form/1`, `phx-change`/`phx-submit` with `phx-debounce` and `phx-disable-with`, and explicit `live_file_input` progress/cancel/error UI. Keep dead-view (initial HTTP GET) HTML complete and semantic before the WebSocket connects.
- **Do**: clean up external observers/charts in JS Hook `destroyed()` and preserve focus across patches.
- **Don't**: assign giant lists directly to socket assigns (`assign(socket, :rows, huge_list)`) or ignore socket reconnect/offline states.
- **Verify**: `mix format --check-formatted`, `mix test` (LiveView tests), Wallaby/Playwright (`rendered`).

## Blazor (.NET 9 / 10)

- **Render modes**: keep content-heavy routes **Static SSR** by default and opt into interactivity selectively via **`@rendermode InteractiveServer`**, **`InteractiveWebAssembly`**, or **`InteractiveAuto`** only on components that require live stateful interaction.
- **Streaming & Enhanced Forms**: apply **`[StreamRendering]`** on async Static SSR pages so structured loading skeletons render immediately while queries resolve, and use **Enhanced Forms** (`<EditForm Enhance ...>` + `[SupplyParameterFromForm]`) so Static SSR forms validate and update smoothly without opening a SignalR circuit.
- **Accessibility & reconnects**: `<InputText id="email" @bind-Value="model.Email" autocomplete="email" />` must still pair with `<label for="email">` and `<ValidationMessage>`; design explicit SignalR circuit-reconnecting/failed UX and dispose JS interop `IJSObjectReference` in `DisposeAsync()`.
- **Verify**: `dotnet build`, `dotnet test` (bUnit), Playwright (`rendered`).

## Go `templ` + `html/template` + htmx

- **Typed templates**: use **`templ`** (`templ generate`) for compile-time type-checked HTML components with automatic contextual escaping and `templ.SafeURL` for user-supplied links. Pair with htmx 2 (`hx-boost`, `hx-swap="morph"`) for partial updates while preserving full-page SSR routes.
- **Forms & errors**: return an HTTP 422 field-error component containing the preserved posted values, adjacent field messages, and a focusable summary; never print raw Go validation structs as user copy.
- **Verify**: `templ generate`, `go vet ./...`, `go test ./...`, Playwright (`rendered`).

## Cross-stack traps

- fragment swaps duplicating IDs/landmarks or destroying keyboard focus;
- caching partial responses without `Vary: HX-Request` / `Vary: X-Inertia`;
- hidden divergence between enhanced (Turbo/htmx/Livewire/Enhanced Forms) and no-JS behavior;
- validation rendered only in toast/console or dropping posted input on error;
- authorization checked only on initial GET render, not inside Livewire/LiveView/Turbo/Inertia POST mutations;
- timezone/locale rendering mismatch between server and browser;
- pagination/filter state absent from URLs and lost on back/share/refresh.
