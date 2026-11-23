# Locale rendering test matrix

Use this reference when internationalization is in scope. The goal is not to test every locale; it is to choose a small representative matrix that exposes different writing-system, directionality, segmentation, formatting, plural, input, and font-fallback risks.

## Representative matrix

Select rows relevant to the product audience, but do not claim international readiness from English plus pseudo-localization alone.

| Risk family | Representative locales/scripts | Concrete stress cases |
|---|---|---|
| Latin diacritics and compaction/expansion | Vietnamese, Polish, Czech, German, Finnish, Turkish | stacked/combining marks; uppercase diacritics; long compounds; locale-sensitive casing; contraction/expansion of short labels |
| Cyrillic/Greek | Russian, Ukrainian, Bulgarian, Greek | native alphabet casing/sorting; italic/font coverage; stress marks; final sigma handled by text engine |
| RTL and mixed direction | Arabic, Hebrew, Persian | mirrored layout; bidi isolation; native digits where appropriate; punctuation ownership; mixed usernames/URLs/numbers; IME/keyboard input |
| CJK | Simplified Chinese, Traditional Chinese, Japanese, Korean | locale-specific glyphs; line breaking/prohibition rules; punctuation compression; no-space scanning; IME composition; font fallback variance |
| Mainland Southeast Asian scripts | Thai, Lao, Khmer | dictionary-aware wrapping/selection; combining vowels/tone marks; no spaces between words; clipping in fixed line heights |
| Indic scripts | Hindi/Devanagari plus relevant Bengali/Tamil/Telugu/Kannada/Malayalam or other target script | reordering, conjuncts, matras, grapheme clusters, font shaping, caret movement, truncation by grapheme |
| Emoji and symbols | any target locale plus emoji-heavy input | ZWJ families/professions, flags, skin tones, variation selectors, keycaps, wide-cell terminal behavior |
| Plural/gender richness | Arabic, Polish, Russian, Czech, Irish or other audience-relevant examples | zero/one/two/few/many/other categories; gender/select agreement; unknown or large counts |
| Locale formatting | Germany, France, Japan, India, Arabic-locale examples, audience-specific regions | decimal/grouping separators, currency placement, calendars/time zones, 12/24-hour time, week start, list punctuation, collation |
| Pseudolocalized structural stress | pseudo-locale/RTL transform where supported | hard-coded strings, concatenation, missing boundaries, expansion clipping, incorrect mirroring, placeholder corruption |

## Minimum test data

Build fixtures using realistic content rather than repeating one glyph:

- short label, long sentence, and paragraph in each selected script;
- mixed-direction user-generated string containing a URL/handle/file name;
- plural counts `0`, `1`, `2` where meaningful, a few/many category value, a large formatted number, and an unknown/null count;
- localized date/time/currency/list examples;
- names/addresses that do not fit ASCII-only or given/family-name assumptions;
- emoji sequence and combining-mark sequence for truncation/caret tests;
- real translated copy where available plus deterministic pseudo-localized copy.

Do not use culturally inappropriate imagery, names, or stereotypes as filler. Synthetic fixtures must be marked synthetic.

## Verification procedure

For each selected row:

1. render the primary flow at the smallest supported geometry and typical geometry;
2. inspect shaping, clipping, line breaking, baseline/line-height behavior, font fallback, truncation, and text direction;
3. exercise input/paste/IME composition/autocomplete and validation errors;
4. verify plural/message output across count/gender/select cases;
5. verify dates, numbers, currency, lists, sorting/search, and collation with platform locale APIs;
6. test focus/order/navigation mirroring and bidi isolation in RTL rows;
7. inspect accessible names/status messages because concatenation errors often appear there first;
8. record actual locale/tag, font/runtime/platform, and evidence label.

## Failure classification

- **hard-coded string:** visible text does not change in pseudo-locale;
- **concatenation defect:** grammar/order cannot be fixed by translating the whole message;
- **layout defect:** clipping/overlap/target compression caused by expansion or line breaking;
- **font defect:** missing glyph, synthetic slant/bold, wrong regional glyph preference, baseline clipping;
- **segmentation defect:** caret/selection/wrapping/counting splits a grapheme or word incorrectly;
- **directionality defect:** wrong mirroring, punctuation jump, unreadable mixed-direction string;
- **format defect:** hand-assembled date/number/currency/list/collation contradicts locale behavior;
- **translation-quality gap:** mechanics pass but real wording/tone is unknown or incorrect; mark native review `not-checked` rather than guessing.

A matrix row is incomplete until failures are classified; “looks okay” does not identify what was verified.
