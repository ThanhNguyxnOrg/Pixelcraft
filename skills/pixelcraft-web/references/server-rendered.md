# Server-rendered web: Rails, Laravel/Filament, Symfony UX, WordPress, Django/FastAPI/FastHTML, Phoenix, Blazor, Go, Dart Jaspr

The common discipline: the server owns initial semantic HTML, routing, validation, authorization, and most state. Progressive enhancement must not break URLs, forms, back/forward, refresh, or no-/limited-JS behavior.

## Token mapping

Import generated CSS variables in the base layout/asset pipeline. Do not duplicate token values across framework-specific CSS build systems. In component ecosystems (Livewire/Flux/Filament, Symfony Twig Components, WordPress `theme.json`, Blazor, LiveView, ViewComponent, Phlex, Cotton, `templ`, Gomponents, Jaspr), pass semantic class names/state rather than raw visual constants.

## Rails 8 + Hotwire (Turbo 8, Stimulus, ViewComponent & Phlex)

- **Turbo 8 page refreshes**: enable morphing refreshes (`<meta name="turbo-refresh-method" content="morph">` and `<meta name="turbo-refresh-scroll" content="preserve">`) so form updates and broadcasts preserve scroll and input focus without hand-coding fine-grained Turbo Streams for every DOM node. Mark media players or stateful widgets `data-turbo-permanent` with a stable `id`.
- **ViewComponent**: encapsulate reusable UI in Ruby classes with typed **`renders_one`** / **`renders_many`** slots, preview every state variant in **`ViewComponent::Preview`** + **Lookbook**, and assert rendered HTML/ARIA semantics directly via `render_inline(AlertComponent.new(...))`.
- **Phlex**: author pure-Ruby HTML/SVG views (`class InvoiceCard < Phlex::HTML`) with compile-safe keyword arguments, explicit `whitespace`, streaming support, and zero ERB partial-local leaks.
- **Stimulus lifecycle**: bind listeners/observers in `connect()` and always tear them down in **`disconnect()`** (Turbo caches pages and reconnects controllers on back/forward). Honor `prefers-reduced-motion` in CSS.
- **Do**: `<a href="/invoices/4" data-turbo-frame="_top">View invoice</a>`, expose ViewComponent slots/Lookbook previews or Phlex components for every design-system primitive, and tear down observers in Stimulus `disconnect()`.
- **Don't**: swap a frame containing duplicate IDs, stuff complex conditionals into unencapsulated ERB partials, drop focus when removing a trigger, or leak Stimulus `window` listeners across Turbo cache restores.
- **Verify**: `bin/rails test`, `bin/rails test:system` (Capybara/Playwright for `rendered` evidence).

## Laravel Blade + Livewire 3 / 4, Filament, & Flux UI

- **Livewire navigation & security**: use `wire:navigate` with **`@persist('audio-player')`** for persistent chrome, cache derived lookups with **`#[Computed]`**, protect immutable IDs/foreign keys with **`#[Locked]`**, enforce Laravel Policies/Gates inside action methods (never `mount()` alone), key loops with `wire:key`, and guard buttons with `wire:loading.attr="disabled"`.
- **Laravel Filament** (TALL-stack admin, portals, and operational apps): build CRUD and workflows with declarative **`Resource`**, **`Schema`/`Form`**, **`Table`**, **`Action`**, and **`Notification`** classes; enforce authorization Policies per resource/action/bulk action; configure brand tokens cleanly through `Panel::colors(...)`, font setup, and a scoped custom Vite panel theme instead of brittle CSS overrides.
- **Livewire Flux UI**: use Flux's accessible primitives (`<flux:modal>`, `<flux:select>`, `<flux:command>`, `<flux:toast>`) backed by Tailwind semantic tokens rather than hand-rolling Alpine modals inside Livewire views.
- **Do**: keep Filament tables server-paginated/searchable with explicit empty-state actions (`emptyStateActions`) and use `#[Locked]` + Policy checks on every Livewire mutation.
- **Don't**: trust client-writable Livewire public properties without authorization, fight Filament's layout with `!important` overrides, or render validation errors only in a disappearing toast.
- **Verify**: `php artisan test` (Pest/PHPUnit + Filament Livewire tests), Laravel Dusk / Playwright (`rendered`).

## Symfony UX (Turbo, Live Components, Twig Components, Stimulus, Autocomplete)

- **Twig Components (`#[AsTwigComponent]`)**: encapsulate design-system primitives as typed PHP + Twig components (`<twig:Alert variant="danger">`) with strict prop defaults and slots.
- **Live Components (`#[AsLiveComponent]`)**: use for interactive server-driven filters, forms, and inline edits; mark mutable properties **`#[LiveProp(writable: true)]`** *only* when user-editable and validate/authorize inside **`#[LiveAction]`** methods.
- **UX Turbo, Stimulus & Autocomplete**: use Turbo Drive/Frames/Streams (`data-turbo-permanent` for media), tear down Stimulus controllers in `disconnect()`, and wire **UX Autocomplete** (`autocomplete: true` on Symfony Form types) for async searchable selects instead of loading 5,000 `<option>` tags into HTML.
- **Do**: keep `#[LiveProp]` read-only by default, return semantic Symfony Form validation errors inline, and preserve full-page SSR routes behind Turbo Frames.
- **Don't**: expose internal entity IDs/roles as `writable: true` `LiveProp`s or attach uncleaned Stimulus listeners across Turbo navigations.
- **Verify**: `php bin/phpunit` (Symfony Panther / Playwright for `rendered` evidence).

## WordPress Gutenberg Blocks & Interactivity API

- **Block contract (`block.json`)**: declare block metadata, `supports` (`color`, `spacing`, `typography`, `align`), editor assets, and server-side **`render.php`** (`render` field) so dynamic blocks output clean, crawlable HTML on first paint.
- **`@wordpress/interactivity`**: use declarative directives (**`data-wp-interactive`**, **`data-wp-context`**, **`data-wp-on--click`**, **`data-wp-bind--aria-expanded`**, **`data-wp-class--is-open`**) paired with `store(...)` for frontend interactivity (tabs, filters, disclosures, instant search) instead of hydrating full React trees or legacy jQuery scripts on public pages.
- **`theme.json` tokens**: map DTCG semantic tokens into `theme.json` (`settings.color.palette`, `settings.typography.fontFamilies`, `settings.spacing.spacingSizes`) and reference `var(--wp--preset--*)` in CSS so block-editor controls and frontend rendering stay in sync.
- **Do**: emit valid initial SSR markup in `render.php` with `wp_interactivity_data_wp_context(...)` and escape output via `esc_html`/`esc_attr`/`wp_kses_post`.
- **Don't**: ship a full React runtime to the public frontend just for an accordion/filter bar, or bypass `theme.json` with global `!important` resets.
- **Verify**: `npm run build` (`@wordpress/scripts`), `wp-env` + Playwright (`rendered`).

## Inertia.js v2 (React / Vue / Svelte over Laravel, Rails, Phoenix)

Choose **Inertia.js v2** when the server owns routing, controllers, auth, and database queries while the frontend needs rich React/Vue/Svelte interactivity without maintaining a separate REST/GraphQL API layer:

- **Deferred props (`Inertia::defer(...)` + `<Deferred data="metrics" fallback={...}>`)**: render the main page immediately and stream slow secondary data asynchronously without blocking TTFB.
- **Prefetching & viewport lazy loads**: use `<Link href="/invoices" prefetch>` (hover/mount prefetch) and **`<WhenVisible data="comments" fallback={...}>`** for below-the-fold data; use `usePoll()` for controlled live refresh.
- **Forms**: use `useForm()` (or `<Form>` in Inertia v2) so server validation errors (`errors.<field>`), `processing` state, scroll preservation, and browser history work seamlessly.
- **Do**: keep authorization and data shaping in controllers and return minimal serializable props (never leak raw ORM models).
- **Don't**: recreate a client-side router or duplicate server validation/auth logic inside Inertia page components.

## Python Web: Django (`django-htmx` / Cotton / Ninja / Unfold / Wagtail), FastAPI + Jinja2, & FastHTML

- **Django + `django-htmx` / Cotton**: use base template inheritance for the shell, **`django-cotton`** (`<c-card>`) or `django-template-partials` for reusable semantic components, and **`django-htmx`** (`if request.htmx:`) to return focused fragments on partial requests while returning the full page on direct loads/refreshes (always set `Vary: HX-Request`). Include `hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'`, render `form.field.errors` adjacent to `<label>`, and preserve bound values on HTTP 422/400 re-renders.
- **Django Ninja, Unfold, & Wagtail**: pair **Django Ninja** (typed Pydantic schemas) for island/API endpoints; adopt **Django Unfold** (`UNFOLD` semantic theme config, KPI/navigation helpers) when shipping a modern accessible Django Admin instead of hacking raw admin CSS; build editorial CMS pages in **Wagtail** using structured **`StreamField`** blocks mapped to design-system templates rather than freeform rich-text HTML blobs.
- **FastAPI + Jinja2 + htmx**: render SSR pages with `templates.TemplateResponse(request, "invoices.html", {...})`, return HTTP 422 HTML field-error fragments on Pydantic `ValidationError` for htmx requests, enforce explicit CSRF tokens on form/htmx mutations (FastAPI does not enable CSRF middleware by default), and set `Vary: HX-Request`.
- **FastHTML** (`fasthtml.common` + Starlette/ASGI + htmx): compose semantic FT components (`Main`, `Form`, `Label`, `Input`, `Button`) backed by static token CSS (`hdrs=(Link(rel='stylesheet', href='/tokens.css'),)`). Never pass untrusted user input to `NotStr(...)` (XSS risk).
- **Do**: serve the exact same URL as full HTML on refresh and as a fragment on `HX-Request` (with `Vary: HX-Request`) and preserve posted input on HTTP 422 errors.
- **Don't**: cache htmx fragments under full-page cache keys, omit CSRF protection in FastAPI form/htmx handlers, or dump unstyled `{{ form.as_p }}` / `NotStr(user_input)`.
- **Verify**: `python manage.py check`, `pytest` (`TestClient`), Playwright (`rendered`).

## Phoenix + LiveView 1.0+

- **Memory & async discipline**: render large or growing collections with **`stream/3`** + `phx-update="stream"` (so LiveView does not retain thousands of structs in process RAM) and load slow data non-blockingly via **`assign_async/3`** paired with `<.async_result :let={data} assign={@invoices}>` (`:loading`, `:failed`, ok states).
- **Zero-round-trip UI transitions**: use **`Phoenix.LiveView.JS`** commands (`JS.show`, `JS.hide`, `JS.toggle_class`, `JS.focus`) for modals, drawers, and disclosures so local interaction is instant and respects `prefers-reduced-motion`.
- **Forms & uploads**: use `to_form/1`, `phx-change`/`phx-submit` with `phx-debounce` and `phx-disable-with`, and explicit `live_file_input` progress/cancel/error UI. Keep dead-view (initial HTTP GET) HTML complete and semantic before the WebSocket connects.
- **Do**: clean up external observers/charts in JS Hook `destroyed()` and preserve focus across patches.
- **Don't**: assign giant lists directly to socket assigns (`assign(socket, :rows, huge_list)`) or ignore socket reconnect/offline states.
- **Verify**: `mix format --check-formatted`, `mix test` (LiveView tests), Wallaby/Playwright (`rendered`).

## Blazor (.NET 9 / 10) & Component Ecosystems

- **Render modes & streaming**: keep content-heavy routes **Static SSR** by default, apply **`[StreamRendering]`** for immediate loading skeletons, use **Enhanced Forms** (`<EditForm Enhance ...>` + `[SupplyParameterFromForm]`), and opt into `@rendermode InteractiveServer`, `InteractiveWebAssembly`, or `InteractiveAuto` only on components requiring live stateful interaction.
- **Component suites (choose ONE per app)**:
  - **FluentUI Blazor** (`Microsoft.FluentUI.AspNetCore.Components`): built on Fluent Web Components with strong WCAG/keyboard/RTL parity and `<FluentDesignTheme>` live light/dark/accent tokens—strong default for accessible business/enterprise apps.
  - **MudBlazor**: Material-based C#-first library; mount `<MudThemeProvider Theme="_theme" />`, `<MudPopoverProvider />`, `<MudDialogProvider />`, and `<MudSnackbarProvider />` once in `MainLayout.razor` and map semantic tokens into `MudTheme`.
  - **Radzen Blazor**: data-dense enterprise `RadzenDataGrid`/scheduler/chart suite—bind server-side `LoadData` paging/sorting/filtering for large datasets and customize theme CSS tokens cleanly.
- **Accessibility & reconnects**: pair `<InputText id="email" ... />` with `<label for="email">` and `<ValidationMessage>`; design explicit SignalR circuit-reconnecting/failed UX and dispose `IJSObjectReference` in `DisposeAsync()`.
- **Do**: pick one suite (FluentUI, MudBlazor, or Radzen), mount its overlay providers once in `MainLayout`, and dispose JS interop handles.
- **Don't**: mix MudBlazor and FluentUI overlay providers on the same layout, or force `InteractiveServer` globally on static content routes.
- **Verify**: `dotnet build`, `dotnet test` (bUnit), Playwright (`rendered`).

## Go `templ`, Gomponents, `html/template`, & htmx

- **`templ`**: compile-time type-checked HTML components (`templ generate`) with automatic contextual escaping and `templ.SafeURL` for user-supplied links.
- **Gomponents** (`maragudk/gomponents`): pure-Go functional HTML composition (`html.Div`, `html.Form`, `g.Text`) with zero code-generation step and automatic HTML escaping—pairs cleanly with **Echo**, **Chi**, or **Fiber** plus htmx (`hx-boost`, `hx-swap="morph"`) for partial fragments.
- **Forms & errors**: return an HTTP 422 field-error component containing preserved posted values, adjacent field messages, and a focusable summary; set `Vary: HX-Request` on fragment endpoints; never print raw Go validation structs as user copy.
- **Do**: escape text with `templ` / `g.Text` and pass `http.ResponseWriter` cleanly through middleware (CSRF, auth, `Vary: HX-Request`).
- **Don't**: concatenate raw HTML strings with `fmt.Sprintf` or pass untrusted strings to `g.Raw(...)` / `templ.Raw(...)`.
- **Verify**: `templ generate`, `go vet ./...`, `go test ./...`, Playwright (`rendered`).

## Dart Jaspr (SSR & Islands)

Choose **Jaspr** when a Dart/Flutter team needs true semantic HTML/CSS web sites, SEO-crawlable SSR, or static pages without shipping Flutter Web's CanvasKit canvas runtime:

- Author server-rendered shells (`@document`) with semantic HTML components (`div`, `nav`, `main`, `form`, `button`) and mark only interactive islands with **`@client`** so client JS stays minimal.
- Map DTCG semantic CSS custom properties into global stylesheets (or Jaspr typed CSS) rather than duplicating Flutter `ThemeData` inline styles on every node.
- **Do**: keep static/content routes server-rendered (`static` or `server` mode) and hydrate small `@client` islands.
- **Don't**: embed Flutter Web's canvas inside a Jaspr marketing/docs page for text content, or ship unstyled interactive controls without keyboard/ARIA semantics.
- **Verify**: `dart analyze`, `dart test`, `jaspr build`, Playwright (`rendered`).

## Cross-stack traps

- fragment swaps duplicating IDs/landmarks or destroying keyboard focus;
- caching partial responses without `Vary: HX-Request` / `Vary: X-Inertia`;
- hidden divergence between enhanced (Turbo/htmx/Livewire/Interactivity API/Enhanced Forms) and no-JS behavior;
- validation rendered only in toast/console or dropping posted input on error;
- authorization checked only on initial GET render, not inside Livewire/Live Component/Filament/LiveView/Turbo/Inertia POST mutations;
- timezone/locale rendering mismatch between server and browser;
- pagination/filter state absent from URLs and lost on back/share/refresh.
