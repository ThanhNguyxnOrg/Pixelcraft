# Hand-authored HTML tables

## Accessible table skeleton

Always include `lang`, `dir`, `<title>`, dark-mode meta opt-in, a hidden preheader with zero-width padding, `role="presentation"` on every layout table, and semantic headings/paragraphs:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Invoice #2026-041 due 15 Dec</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;">
  <!-- Repeat &#847;&zwnj;&nbsp; 50–90 times (~140–200+ rendered chars); 3–5 repeats only pad ~9–15 chars and leak "View in browser" or logo alt text into 120-char inbox snippets -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;" aria-hidden="true">
    Invoice #2026-041 due 15 Dec — €1,420.50&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" dir="ltr" style="background-color:#f4f5f7;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:6px;">
          <tr>
            <td style="padding:28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
              <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">Invoice #2026-041</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.5;">Amount due: €1,420.50 by 15 Dec 2026.</p>
              <!-- Bulletproof Dual-Engine CTA: VML roundrect for Classic Outlook Word + table/td bgcolor + padded <a> for New Outlook, Gmail, and Apple Mail -->
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
                href="https://example.com/pay/2026-041"
                style="height:44px;v-text-anchor:middle;width:220px;" arcsize="14%" stroke="f" fillcolor="#0f5132">
                <w:anchorlock/>
                <center style="color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;">
                  Review and pay invoice
                </center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" bgcolor="#0f5132" style="border-radius:6px;background-color:#0f5132;">
                    <a href="https://example.com/pay/2026-041"
                       style="display:inline-block;padding:12px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;font-size:15px;font-weight:600;line-height:20px;color:#ffffff;text-decoration:none;border-radius:6px;border:1px solid #0f5132;">
                      Review and pay invoice
                    </a>
                  </td>
                </tr>
              </table>
              <!--<![endif]-->
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Token mapping

Email clients inconsistently support CSS variables. Treat generated token output as source-of-truth values, then inline final 6-digit hex colors and `px` measurements into attributes and `style` props. Keep a build-time constants map so semantic names remain meaningful before compilation.

## Layout and responsive idioms

Use table structure as the baseline: outer background table, `max-width: 600px` centered container, single-column-first modules, `role="presentation"` on every layout `<table>`, explicit `cellspacing="0" cellpadding="0" border="0"`, inline CSS, and narrowly scoped MSO conditional comments only when Classic Outlook requires them. Never hide the primary HTML button inside `<!--[if mso]>`—New Outlook ignores MSO comments and VML. Design mobile stacking through fluid-hybrid `max-width` + `display: inline-block` ghost tables rather than CSS Grid or Flexbox.

## Typography and custom fonts

Use robust websafe fallback stacks. Custom fonts are progressive enhancement only; never let meaning or layout depend on them. Set explicit `font-size`, `line-height`, and `color` directly on text containers (`<p>`, `<h1>`–`<h3>`, `<td>`) because Classic Outlook resets font inheritance across nested tables.

## Motion and reduced motion

Assume animation is unsupported or stripped. Never require animation to communicate state or meaning. Static fallback is the baseline.

## Accessibility specifics

- Always set `lang` and `dir` on `<html>` and repeat `dir` on the root content table.
- Always include `<title>` and `role="presentation"` on every layout table (never on real data tables).
- Mark decorative spacers with `aria-hidden="true"` and decorative images with `alt=""`.
- Use real `<h1>`–`<h3>` headings, `<p>` copy, descriptive links, 4.5:1+ contrast, padded CTA hit areas, and matching `text/plain` MIME parity.

## States and forms

Critical email states are: images off, dark-mode inversion, Gmail 102 KB clipping, remote-content warning, plaintext-only, forwarded/quoted, print, narrow mobile viewport, and high-contrast mode. Do not depend on embedded HTML forms—link to a secure, context-preserving web destination instead.

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `lang`, `dir`, `<title>`, and `role="presentation"` on every layout `<table>` | Omit `role="presentation"`, forcing screen readers to announce layout table rows/columns |
| Inline 6-digit hex and `px` values on table cells and text elements | Rely on external stylesheets, CSS variables, `oklch()`, Flexbox, or Grid |
| Use a Bulletproof Dual-Engine CTA (`<!--[if mso]><v:roundrect>` + `<!--[if !mso]><!--><table role="presentation"><tr><td bgcolor>` wrapping styled `<a>`) | Ship a bare `<a style="padding:...">` (loses padding/radius in Classic Outlook) or a VML-only button (invisible in New Outlook) |
| Pad hidden preheaders with 50–90 repeats (`~140+` chars) of `&#847;&zwnj;&nbsp;` | Use 3–5 repeats that let `"View in browser"` or header alt text leak into 120-char inbox previews |
| Add a `1–2px` light keyline/halo or translucent pill to dark logos alongside `.light-img`/`.dark-img` swaps | Export pure black transparent PNG logos that vanish on forced `#121212` dark backgrounds (`Gmail Android` / `Outlook Windows`) |
| Keep compiled HTML `< 80 KB` (`< 102 KB` hard Gmail clip cap) and wire `RFC 8058` one-click unsubscribe on promotional mail | Ship bloated nested tables that clip legal/unsubscribe footers or gate unsubscribe behind a login wall |

## Known traps

New Outlook vs Classic Outlook divergence, Gmail 102 KB clipping (`< 80 KB` target before ESP tracking URLs) and `<style>` stripping on syntax errors, GANGA dropping `<style>`, forced dark-mode logo disappearance, Apple MPP proxy open inflation, forwarding mutations, and plaintext divergence.

## Verification commands

Run the repository's email build/template validation pipeline without suppressing failures:

```sh
npm run build
```

Inspect compiled HTML byte size (`< 80 KB` target / `< 102 KB` cap, `static`), validate `lang`/`dir`/`role="presentation"` and plaintext parity (`static`), and test real client previews across New Outlook, Classic Outlook, Gmail (Web/iOS/Android), and Apple Mail across all 3 dark-mode regimes with images off (`rendered`).
