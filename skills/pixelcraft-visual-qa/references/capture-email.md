# Email render testing

Email clients mutate HTML. A browser screenshot of the source file is useful static/development evidence but is not proof of Outlook, Gmail, Apple Mail, or mobile-client rendering.

## Practical matrix

Prioritize actual audience analytics. Otherwise inspect at minimum:

- **Classic Outlook for Windows (Word HTML engine)** when enterprise Win32 clients remain in scope (`mso-*` conditionals, VML buttons, strict table widths);
- **New Outlook for Windows / Outlook on the Web (WebView2 / modern Chromium)** — renders modern CSS differently from Classic Outlook; verify both rather than assuming one proves the other;
- **Gmail web & mobile** — strips unsupported `<style>` rules and **clips any email whose HTML payload exceeds `102 KB`** (`[Message clipped] View entire message`), hiding footers and unsubscribe links;
- **Apple Mail / iOS Mail** dark-mode treatment (`prefers-color-scheme: dark` + `color-scheme` meta tags);
- plain-text multipart output;
- images blocked and images loaded;
- narrow mobile width (`375–390 px`) and desktop reading pane.

### Local SMTP inspection and cross-client render matrices

- **Local SMTP capture (`Mailpit` or `Mailhog`):** send real MIME messages locally during development to inspect rendered HTML preview, plain-text parity, headers, link targets, spam/HTML checks, and **exact HTML byte size (`< 102 KB`)** before touching external inboxes.
- **Commercial render matrices (Litmus, Email on Acid):** use for broad live client screenshots across OS/client combinations. Manual test accounts are weaker but honest evidence. Always label provider, client, version, and date because email rendering changes without notice.

## What to inspect

- subject/preheader parity and no hidden-content dependence;
- alt text meaningful when images are blocked;
- background images absent or gracefully degraded;
- dark-mode inversion does not destroy logos, icons, or contrast;
- CTA bulletproof enough in both Classic Outlook (Word) and New Outlook (WebView2) / Gmail / Apple Mail;
- table layout does not collapse or horizontally scroll essential content;
- plaintext version preserves links and meaning;
- **Gmail `102 KB` clipping gate:** measure compiled HTML byte size (e.g., `wc -c email.html`) and keep safely under `102 KB` (target `< 90 KB` to leave headroom for ESP tracking/rewriting).

## Rules

- Never claim cross-client compatibility from one browser render or Mailpit preview alone (label browser/Mailpit preview honestly and mark untested clients `not-checked`).
- Never depend on external CSS, scripting, video, or forms in email clients.
- Redact recipient data before storing screenshots.
- Compare content with the plaintext version for semantic parity.
