# Hand-authored HTML tables

## Token mapping

Email clients inconsistently support CSS variables. Treat generated token output as source-of-truth values but inline final literal colors/spacing into attributes/styles. Keep a build-time constants map so semantic names remain meaningful before compilation.

## Layout and responsive idioms

Use table structure because it remains the most reliable baseline: outer background table, fixed/max-width container, single-column-first modules, aligned cells, inline CSS, `role="presentation"` where appropriate, MSO conditional comments only when justified. Design mobile behavior through width/max-width/fluid-hybrid techniques rather than modern grid assumptions.

## Typography/custom fonts

Use robust websafe fallback stacks. Custom fonts may be progressive enhancement in supporting clients only; never let meaning/layout depend on them. Use real text, explicit line-height/measure constraints, and localization expansion tolerance.

## Motion/reduced motion

Assume animation is unsupported/inconsistent. Never require animation to communicate state or meaning. Static fallback is the baseline, not an alternate version.

## Accessibility specifics

Real text, meaningful alt text, empty alt for decorative imagery where honored, heading-like structure where clients permit, logical reading order, sufficient contrast, padded visible CTA hit area, descriptive links, plaintext parity. Tables should not expose layout noise to screen readers where roles are supported.

## States idiom

Email is mostly asynchronous communication, not live application state. Critical states are: images off, dark-mode inversion, clipped message, blocked/remote-content warning, plaintext-only, forwarded/quoted, print, narrow mobile viewport, high-contrast mode. Design each deliberately.

## Forms idiom

Do not depend on interactive forms inside email. Link to a preauthenticated/preferences page or clearly labeled web destination. Preserve user context safely; never expose sensitive tokens or require re-entering information already known when a secure flow can carry it.

## Do/don't pairs

| Do | Don't |
|---|---|
| inline critical CSS plus table-based baseline | relying on external stylesheets/grid/flex support |
| real HTML text for primary copy/CTA | image-only hero containing essential content |
| explicit alt/plaintext fallback | blank white boxes when images are blocked |
| single-column-first information order | fragile multi-column design dependent on exact viewport |
| MSO conditional workaround narrowly scoped | Outlook hacks scattered through every module |

## Known traps

Outlook Word renderer, Gmail clipping/style stripping, image blocking, dark-mode color inversion, forwarding mutations, padding/margin inconsistency, button border-radius/background-image support, linked-image dimensions disappearing, plaintext divergence, tracking pixels misrepresenting engagement.

## Verification commands

```sh
# depends on pipeline
npm run build 2>/dev/null || true
python -m compileall . 2>/dev/null || true
```

Use actual client previews/screenshots or a testing service; inspect source size/clipping, plaintext MIME, image-off rendering, dark mode, narrow/wide layouts, high contrast, links, spam/deliverability checks where available.
