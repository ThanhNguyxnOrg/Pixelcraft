# Server-rendered web: Rails/Hotwire, Laravel/Blade/Livewire, Django/Jinja, Phoenix/LiveView, Blazor, Go templ

The common discipline: the server owns initial semantic HTML, routing, validation, authorization, and most state. Progressive enhancement must not break URLs, forms, back/forward, refresh, or no-/limited-JS behavior.

## Token mapping

Import generated CSS variables in the base layout/asset pipeline. Do not duplicate token values across framework-specific CSS build systems. In component ecosystems (Livewire/Blazor/LiveView), pass semantic class names/state rather than raw visual constants.

## Rails + Hotwire

- Layout/response: Turbo Frames/Drive preserve shell navigation; fragments must have stable IDs and complete semantics in context.
- Forms: Rails form helpers generate labels/error associations only when used deliberately. Preserve input after validation failure and use status/pending behavior.
- Motion/a11y: Turbo replacement can destroy focus. Manage focus explicitly and honor reduced motion in CSS.
- Do: `<a href="/invoices/4" data-turbo-frame="_top">View invoice</a>`.
- Don't: swap a frame containing duplicate heading IDs or remove the element that had focus without restoration.
- Verify: `bin/rails test`, system tests/browser, `bin/rails test:system` where configured.

## Laravel Blade + Livewire

- Layout/response: Blade layouts own shell; Livewire components own interactive regions. Keep URLs/authorization consistent with server routes.
- Forms: use validation error bags adjacent to fields, preserve old input/model state, correct autocomplete/input types.
- Motion/a11y: Livewire DOM diffing can reuse elements/focus unexpectedly; use wire:key deliberately and explicit loading states (`wire:loading` with restraint).
- Do: `<button wire:click="save" wire:loading.attr="disabled">Save invoice</button>` plus visible status.
- Don't: silent background mutation or validation only as disappearing toast.
- Verify: `php artisan test`, Pest/PHPUnit, browser/Dusk where present.

## Django + Jinja/templates

- Layout/response: template inheritance owns shell; partials/fragments must remain valid in context. CSRF/auth behavior is core UX/security.
- Forms: Django form rendering can associate labels/errors, but customize deliberately rather than dumping `{{ form.as_p }}` without design. Preserve bound values after errors.
- Motion/a11y: enhancement fragments require focus/status ownership just like any DOM replacement.
- Do: render `form.field.errors` adjacent and use `label_tag` correctly.
- Don't: hide validation behind generic “invalid form” or lose posted values.
- Verify: `python manage.py test`, `python manage.py check`, browser tests where configured.

## Phoenix + LiveView

- Layout/response: LiveView state/diffing is powerful but must preserve URLs, focus, scroll, and process failure semantics. Dead-view initial render matters.
- Forms: `phx-change`/`phx-submit` validation must not be premature; assign errors visibly and preserve input. uploads need progress/failure/cancel behavior.
- Motion/a11y: LiveView patches can move/remove focus. JS hooks must clean up and honor reduced motion.
- Do: use `phx-disable-with` and explicit async_result/state assignment.
- Don't: use a spinner-only LV state or reconnect behavior that loses in-progress work silently.
- Verify: `mix test`, `mix format --check-formatted`, browser/LiveView tests.

## Blazor

- Layout/response: Server/prerendering/interactive modes have different hydration latency and circuit behavior. Preserve semantic initial HTML and do not leave visible controls dead while interactivity starts.
- Forms: `EditForm`/`Input*` components provide validation only when model annotations/custom logic are correct; use persistent labels and error summaries.
- Motion/a11y: circuit reconnect/dispose state matters; JS interop must honor reduced motion and clean up.
- Do: `<InputText id="email" @bind-Value="model.Email" autocomplete="email" />` with matching label/validation message.
- Don't: assume validation summary replaces adjacent recovery copy.
- Verify: `dotnet test`, `dotnet build`, browser Playwright/bUnit tests.

## Go templ/html/template

- Layout/response: compositional templates must produce valid complete HTML; use explicit template ownership to avoid duplicated IDs/headings in partials.
- Forms: handlers must preserve posted values/errors explicitly; use correct escaping and do not bypass html/template protections.
- Motion/a11y: any htmx/Alpine enhancement follows the hypermedia rules; server response status/fragment design owns state truth.
- Do: return a field-error partial containing the preserved value and recovery text.
- Don't: print raw validation structs as user copy or drop POST input on failure.
- Verify: `go test ./...`, `go vet ./...`, browser tests where configured.

## Cross-stack traps

- fragment swaps duplicating IDs/landmarks or destroying focus;
- hidden divergence between enhanced and no-JS behavior;
- validation rendered only in toast/console;
- cached fragments leaking user/session-specific data;
- timezone/locale rendering mismatch between server/client;
- CSRF/session expiry losing form input;
- pagination/filter state absent from URLs and therefore lost on back/share/refresh.
