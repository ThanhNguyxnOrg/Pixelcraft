# React Email and component email ecosystems

## React Email (v3/v4+) core idioms

React Email compiles JSX primitives (`Html`, `Head`, `Body`, `Preview`, `Container`, `Section`, `Row`, `Column`, `Heading`, `Text`, `Button`, `Img`, `Font`, `CodeBlock`, `Markdown`, `Tailwind`) to table-safe HTML. Component abstraction does not turn email into browser React—CSS variables, Grid, and client-side hooks do not exist in inboxes.

```tsx
import {
  Html, Head, Body, Preview, Container, Section,
  Heading, Text, Button, Font, Tailwind, pixelBasedPreset, render,
} from '@react-email/components';

export function InvoiceEmail({ invoiceId, total }: { invoiceId: string; total: string }) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{ url: 'https://example.com/fonts/inter-v18.woff2', format: 'woff2' }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Invoice {invoiceId} due — {total}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-[#f4f5f7] font-sans m-0 p-6">
          <Container className="bg-white max-w-[600px] p-6 rounded">
            <Section>
              <Heading as="h1" className="text-[22px] text-[#111827] m-0 mb-3">
                Invoice {invoiceId}
              </Heading>
              <Text className="text-[15px] text-[#374151] m-0 mb-5">
                Total due: {total}.
              </Text>
              <Button
                href={`https://example.com/pay/${invoiceId}`}
                className="bg-[#0f5132] text-white px-5 py-3 rounded font-semibold"
              >
                Review and pay invoice
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// React Email v3+: render() is async; generate HTML + plaintext from the exact same tree
const html = await render(<InvoiceEmail invoiceId="2026-041" total="€1,420.50" />);
const text = await render(<InvoiceEmail invoiceId="2026-041" total="€1,420.50" />, {
  plainText: true,
});
```

Key v3/v4+ patterns:

- **`<Tailwind>` + `pixelBasedPreset`**: Tailwind v4 defaults to `rem` units, CSS custom properties, and `oklch()` colors, which break Outlook and trigger Gmail `<style>` stripping. Pass `config={{ presets: [pixelBasedPreset] }}` so spacing/type emit `px` and colors emit email-safe hex/RGB.
- **Async `render()` + `{ plainText: true }`**: always `await render(element)` and derive the `text/plain` MIME part via `await render(element, { plainText: true })` from the same component tree so links, amounts, and legal text stay in sync.
- **`<Font fallbackFontFamily=...>`**: always specify a websafe `fallbackFontFamily` (`Arial`, `Helvetica`, `Georgia`, `Verdana`) because Classic Outlook and Gmail ignore `@font-face` and otherwise fall back to Times New Roman.
- **`<CodeBlock>` & `<Markdown>`**: use for developer notifications, release digests, or API key instructions while verifying line wrapping on 320px viewports and total HTML size against Gmail's 102 KB clipping limit.

## Related component frameworks and ESP platforms

- **Vue Email / Svelte Email**: in Vue/Nuxt or SvelteKit stacks, use `@vue-email/components` (Vue Email) or `svelte-email` / `better-svelte-email` with the same inline-style, table-baseline, and plaintext-parity rules rather than shipping raw SPA templates.
- **Sending & authoring platforms**: **Resend** accepts React Email components natively (`react: <InvoiceEmail />` alongside `text`); **Loops** targets SaaS lifecycle/transactional workflows with MJML/API templates; **Postmark** focuses on high-deliverability transactional streams with Mustachio templates; **Stripo** offers visual + code hybrid authoring with AMP and Outlook export. Regardless of ESP, inspect the **delivered** HTML after link-tracking rewrites.
- **Can I email (`caniemail.com`)**: check support matrices before using any non-trivial CSS property (`gap`, `border-radius`, `aspect-ratio`, `@media (prefers-color-scheme)`).

## Accessibility, states, and forms

- Set `lang` and `dir` on `<Html>`, use real `<Heading as="h1"|"h2">` and `<Text>`, meaningful `alt` on `<Img>`, explicit `<Preview>`, and verify rendered HTML contains `role="presentation"` on layout tables.
- Test images blocked, dark-mode inversion, Gmail 102 KB clipping, plaintext-only, forwarding/quoting, narrow mobile widths, and destination-page error states (expired/already-used transactional links).
- Never embed interactive forms inside email; link to a secure web route.

## Do/don't pairs

| Do | Don't |
|---|---|
| Wrap `<Tailwind config={{ presets: [pixelBasedPreset] }}>` when using Tailwind utilities | Ship raw Tailwind v4 `rem`, `oklch()`, or `@layer` rules into email `<style>` blocks |
| Generate HTML and plaintext via `await render(el)` and `await render(el, { plainText: true })` | Manually maintain divergent plaintext templates or call v2 synchronous `render()` |
| Always set `fallbackFontFamily` on `<Font>` and `lang`/`dir` on `<Html>` | Let Classic Outlook collapse missing web fonts into Times New Roman |
| Inspect exported HTML byte size and real client renders (New Outlook + Classic Outlook + Gmail + Apple Mail) | Treat `npx email dev` local browser preview as proof of inbox rendering |

## Verification commands

Run static lint, build, and non-blocking static HTML export without suppressing failures:

```sh
npm run lint
npm run build
npx email export
```

Inspect exported HTML size against Gmail's 102 KB clipping threshold and validate plaintext output (`static`), then verify real client previews with dark mode and images off (`rendered`).
