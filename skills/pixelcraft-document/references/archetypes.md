# Document archetypes

Archetypes are structural contracts, not visual templates. Start with legal/business/reading requirements and real content. Visual identity must never obscure correctness.

## Invoices, receipts, and billing documents

Required information depends on jurisdiction and business model. Verify legal/tax requirements instead of copying a template. Common data includes seller identity/contact, buyer identity, unique invoice number, issue date, due/payment date, currency, line items, quantity/unit price, discounts, subtotal, tax treatment, total, payment instructions, status, and credit/cancellation references.

Design rules:

| Concern | Rule |
|---|---|
| hierarchy | invoice number/status/total/due date must be findable immediately |
| line items | use a table with aligned quantities/prices/totals; repeat header across pages |
| totals | keep subtotal/tax/total block together and near the rows it summarizes; if it moves to a later page, repeat enough context |
| money | use explicit currency code/locale formatting; never round line items inconsistently with totals |
| status | draft/paid/void/overdue states need text and date, not color alone |
| payment | instructions must be actionable and truthful; expose missing/invalid payment data as a draft-blocking state |
| multilingual | tax labels, legal names, addresses, numerals, dates, and currency need locale-appropriate layout without truncating long translations |

Fragmentation checks: one-line invoice, many pages of line items, zero-rated/tax-exempt rows, discounts/credits, long addresses/legal notes, missing buyer fields, and last-page total placement.

Anti-slop: decorative oversized logo consuming the first third, fake “thank you” copy replacing payment clarity, blue gradient headers, and totals hidden in a floating card detached from line items.

## Reports, whitepapers, and manuals

Structure follows reading purpose:

1. cover/title with document scope/version/date;
2. abstract or executive summary for decision-makers;
3. table of contents when navigation cost justifies it;
4. sections with consistent heading hierarchy;
5. figures/tables numbered only when referenced or reusable;
6. citations/sources/footnotes;
7. appendices/supplemental detail;
8. document control/version/contact where appropriate.

Design rules:

- use running headers/footers for document title/section/page only when they aid navigation;
- keep figure/table captions with their objects and references accurate;
- distinguish author opinion, measured result, citation, and generated/draft content;
- use margins for notes only if the renderer/page size supports them without shrinking body text;
- provide meaningful metadata/title/author/language;
- verify text extraction and reading order.

Long-table/long-code behavior is a first-order design decision. A code block or table that silently clips at the page edge is a defect. Use wrapping, smaller semantic fragments, landscape pages, or appendices deliberately.

Anti-slop: stock-photo cover pages before any content, decorative pull quotes repeated as filler, charts without source/axis context, fake executive summaries, and excessive brand color pages that waste ink.

## CVs and résumés

Norms vary by country, industry, seniority, and submission channel. Do not impose one-page/photo/personal-detail rules universally.

Content rules:

- truthful names/titles/dates/claims; no invented metrics or credential inflation;
- concrete scope and outcomes over buzzword lists;
- machine-readable text for applicant-tracking systems;
- clear chronology and explanation of relevant gaps only when chosen by the user;
- contact links that are correct and appropriate;
- no skill “meters” or percentage bars unless the scale is meaningful (it usually is not);
- photo/age/marital status only when culturally/legal-context appropriate and user-requested.

Layout rules:

- scan order: name/target role/contact, experience, evidence, skills/education;
- avoid multi-column parsing ambiguity when ATS matters;
- preserve enough whitespace for annotation and print;
- use robust typography rather than decorative icons for every line;
- test PDF text extraction/copy order and one/two-page variants.

Anti-slop: black sidebar with portrait and dot ratings, generic adjectives (“detail-oriented team player”), QR codes without destination/context, and template sections left with placeholder text.

## Shared document QA

- inspect first/middle/last page and longest realistic content;
- print or preview at 100%;
- validate totals/references/page numbers/cross-references;
- search/copy extracted text;
- verify fonts/glyph fallback for actual names/locales;
- test grayscale and backgrounds-disabled output;
- mark missing legal/accessibility review explicitly rather than implying compliance.
