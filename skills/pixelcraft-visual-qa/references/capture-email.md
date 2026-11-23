# Email render testing

Email clients mutate HTML. A browser screenshot of the source file is useful static/development evidence but is not proof of Outlook, Gmail, Apple Mail, or mobile-client rendering.

## Practical matrix

Prioritize actual audience analytics. Otherwise inspect at minimum:

- Outlook desktop/Win32 where enterprise users matter (Word rendering engine constraints);
- Gmail web and Gmail mobile clipping behavior;
- Apple Mail/iOS Mail dark-mode treatment;
- plain-text output;
- images blocked and images loaded;
- narrow mobile width and desktop reading pane.

Commercial render matrices (Litmus, Email on Acid) can broaden coverage. Manual test accounts are weaker but honest evidence. Label provider/account/client/version/date because behavior changes.

## What to inspect

- subject/preheader parity and no hidden-content dependence;
- alt text meaningful when images are blocked;
- background images absent or gracefully degraded;
- dark-mode inversion does not destroy logos, icons, or contrast;
- CTA bulletproof enough in target clients;
- table layout does not collapse or horizontally scroll essential content;
- plaintext version preserves links and meaning;
- clipping threshold: avoid oversized MIME/HTML weight; measure rather than guessing.

## Rules

- Never claim cross-client compatibility from one browser render.
- Never depend on external CSS, scripting, video, or forms in email clients.
- Redact recipient data before storing screenshots.
- Compare content with the plaintext version for semantic parity.
