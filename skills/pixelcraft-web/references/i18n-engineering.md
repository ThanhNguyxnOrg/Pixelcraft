# Internationalization and localization engineering

Internationalization is not string replacement. Ship locale-aware formatting (`Intl`), ICU plurals/selects, lazy-loaded translation chunks, explicit fallback chains, locale routing, RTL layout mirroring, and script-appropriate font fallback. For UX copy expansion, pseudo-localization, and RTL layout checks, see `pixelcraft-ux`.

## Library decision matrix

| Library | Model | Message format | Best fit | Primary trade-off |
|---|---|---|---|---|
| **i18next** (`react-i18next`) | Runtime key/namespace lookup + backend plugins | i18next JSON (`_one`/`_other` CLDR) or ICU plugin | Multi-framework apps, CMS/TMS-driven runtime loading, React Native | Requires explicit `fallbackLng` (defaults to `false` in v27+) and `intl-pluralrules` polyfill on Hermes |
| **FormatJS / React Intl** | Runtime / pre-compiled AST | Standard **ICU MessageFormat** | Enterprise React apps needing strict ICU plurals, selects, and `Intl` skeletons | Larger runtime unless pre-compiling ASTs at build time |
| **Lingui** (v5+) | Compile-time macros + compiled `.po`/JSON catalogs | **ICU MessageFormat** (via macros) | React/RSC/Vite/Next.js apps wanting tiny runtime + clean source-text IDs | Requires Babel/SWC macro plugin + `lingui extract` / `lingui compile` pipeline |
| **Paraglide JS** | Compiler-first ESM functions | Compiled JS functions (`m.greeting(...)`) | Vite, SvelteKit, Astro, React Router apps prioritizing tree-shaking & type safety | Rebuild/compile step when messages change; best for static/build-time catalogs |
| **Vue I18n** (v11) | Framework-native Composition API (`legacy: false`) | Vue I18n / linked messages + `Intl` formats | Vue 3 / Nuxt (`@nuxtjs/i18n`) apps | Must set `legacy: false` for Composition API `useI18n()` |
| **Angular `@angular/localize`** | Compile-time AOT bundle-per-locale | XLIFF / JSON + ICU | Angular apps prioritizing zero runtime translation overhead | Switching locale reloads the app to the target locale bundle |

## Implementation idioms

### i18next (namespaces, lazy loading, fallback chains)

- Split translations by route/feature namespace and lazy-load via `i18next-resources-to-backend` or `i18next-http-backend` so the initial bundle does not ship every locale.
- Always configure `fallbackLng` explicitly (including regional/script fallbacks like `'zh-Hant': ['zh-Hans', 'en']`). Since i18next v24, pluralization depends on `Intl.PluralRules` with no legacy fallback; polyfill `import 'intl-pluralrules'` on runtimes lacking it (such as React Native Hermes).

```ts
import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18next
  .use(resourcesToBackend((lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`)))
  .init({
    fallbackLng: {
      'zh-Hant': ['zh-Hans', 'en'],
      default: ['en'],
    },
    ns: ['common'],
    defaultNS: 'common',
  });
```

### FormatJS / React Intl (ICU MessageFormat & `Intl` skeletons)

- Always include the required `other` branch in ICU `{plural}` and `{select}` expressions (omitting `other` throws at runtime).
- Let the formatter own currency symbols, decimal separators, and placement (`::currency/USD` or `intl.formatNumber`)—never concatenate `$` or `%` in template strings.

```ts
intl.formatMessage(
  {
    id: 'cart.summary',
    defaultMessage:
      '{count, plural, one {# item} other {# items}} — total {total, number, ::currency/USD}',
  },
  { count, total },
);
```

### Lingui v5+ (macros, lazy catalogs, RSC)

- Import macros from `@lingui/core/macro` (`t`, `plural`, `select`, `msg`) and `@lingui/react/macro` (`Trans`, `useLingui`)—not the deprecated `@lingui/macro`.
- Never call `t` / `plural` / `select` at module top level (they freeze to the initial locale); use `msg` for module-level descriptors and translate with `i18n._(descriptor)` inside render.
- Lazy-load compiled catalogs with `i18n.loadAndActivate({ locale, messages })`. In React Server Components, call `setI18n` from `@lingui/react/server` in every page and layout.

```ts
import { i18n } from '@lingui/core';

export async function dynamicActivate(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.mjs`);
  i18n.loadAndActivate({ locale, messages });
}
```

### Paraglide JS & Vue I18n

- **Paraglide JS**: configure `paraglideVitePlugin({ project, outdir, strategy: ['url', 'cookie', 'baseLocale'] })`, call tree-shaken `m.greeting({ name })`, and switch locales via `setLocale('de')`.
- **Vue I18n**: initialize `createI18n({ legacy: false, locale, fallbackLocale })`, lazy-load locale JSON in `router.beforeEach` via `i18n.global.setLocaleMessage(locale, mod.default)`, and sync `<html lang>` and `dir`.

## Locale routing, RTL, bidirectional isolation, and script/font fallback

- **Document attributes**: update both `<html lang="ar">` and `<html dir="rtl">` (or `dir="ltr"`) whenever the active locale changes; emit `<link rel="alternate" hreflang="...">` for SEO-indexed localized routes.
- **Mixed-direction isolation (Unicode UAX #9)**: wrap interpolated user-generated or unknown-direction text (usernames, product titles, file paths) in `<bdi>` or set `dir="auto"` / `unicode-bidi: isolate` (never legacy `unicode-bidi: embed`) so opposite-direction characters do not bleed into surrounding punctuation and numbers.
- **Logical CSS & selective mirroring**: use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`). Mirror directional navigation icons (back/forward arrows, chevrons) in RTL, but **never** mirror clocks, media playback scrubbers, checkmarks, or mathematical/time-series graphs.
- **Locale-aware formatting & MF2 evolution**: use `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`, `Intl.ListFormat`, and `Intl.Collator` (for sorting) instead of hardcoded `MM/DD/YYYY`, `.toFixed(2)`, or `.sort()`. Track **Unicode MessageFormat 2 (LDML Part 9 / TC39 `Intl.MessageFormat`)** as the evolving standard successor to ICU MessageFormat 1 when planning long-lived TMS/localization pipelines.
- **Font and script fallback**: pair Latin display/body fonts with explicit script-specific fallbacks (`@font-face` with `unicode-range` for Arabic, Devanagari, Thai, CJK) and increase `line-height` slightly for tall/diacritic scripts (Arabic, Vietnamese, Thai) so ascenders/descenders do not clip.

## Do/don't pairs

| Do | Don't |
|---|---|
| Use ICU `{plural}` / `{select}` with an `other` branch | Concatenate `count + (count === 1 ? ' item' : ' items')` (breaks Slavic/Arabic plural rules) |
| Format dates, currencies, lists, and sorting with `Intl.*` | Hardcode `$`, `MM/DD/YYYY`, or ASCII `.sort()` |
| Lazy-load per-locale / per-namespace translation chunks | Bundle all 15 language JSON files into the initial main chunk |
| Use `msg` at module scope in Lingui and `@lingui/core/macro` imports | Call `t` at module top level or import deprecated `@lingui/macro` |
| Sync `<html lang>` + `<html dir>` and use CSS logical properties | Use physical `left`/`right` margins or flip media scrubbers in RTL |
| Configure `fallbackLng` explicitly in i18next v27+ and `legacy: false` in Vue I18n | Assume i18next defaults to `'en'` or use Vue I18n legacy mode with `useI18n()` |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify that unused locale chunks are split out of the initial bundle (`static`), and test pseudo-localized / long-string locales (e.g. German +35% width), RTL (`ar`/`he`), and CJK/Vietnamese diacritic rendering in a real browser (`rendered`).
