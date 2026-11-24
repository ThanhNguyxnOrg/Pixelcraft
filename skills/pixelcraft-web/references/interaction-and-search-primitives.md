# Micro-interaction, search, icon, font, and image primitives

Stop hand-rolling fragile command palettes, swipeable drawers, toast queues, carousels, date grids, split panes, or search highlighters from scratch. Use native HTML primitives where sufficient (`<dialog>`, `[popover]`, `<input type="date">`, CSS Scroll Snap) and vetted, accessible libraries when interaction physics, keyboard navigation, or search ranking exceeds native HTML.

## Micro-interaction primitives

| Primitive | Recommended libraries | Core capabilities & accessibility contract | Avoid hand-rolling when |
|---|---|---|---|
| **Command palette** | **`cmdk`** (React), **`kbar`** (React) | ARIA `combobox` + `listbox`, `aria-activedescendant`, keyboard Arrow/Home/End/Enter/Esc, focus restoration to trigger, `shouldFilter={false}` for async server search, nested shortcut actions (`kbar`) | Any `⌘K`/`Ctrl+K` launcher, action menu, or multi-source quick-switcher |
| **Drawer / bottom sheet** | **`vaul`** (React; Radix Dialog core) | Touch velocity & drag physics, `snapPoints` / `activeSnapPoint`, `Escape` dismiss, inert background, focus trap & restoration, `prefers-reduced-motion` instant snap | Mobile sheets, filter drawers, or gesture-dismissible trays |
| **Toast notifications** | **`sonner`** (React; `vue-sonner`, `svelte-sonner`) | Stacked expansion, pause-on-hover and pause-on-focus, `aria-live="polite"`, swipe dismiss, built-in `action` button for reversible **Undo** flows | Any transient feedback; **never** put blocking form validation or critical errors solely inside an auto-dismissing toast |
| **Carousels** | **Embla Carousel** (default), **Splide**, **Swiper** | **Embla**: ~7 KB headless physics, plugin ecosystem, zero CSS lock-in; **Splide**: zero-dep with built-in accessible live-region controls; **Swiper**: heavy feature set (3D coverflow, virtual slides, synced thumbs) | Media galleries or horizontal shelves needing keyboard Prev/Next, `role="region" aria-roledescription="carousel"`, pauseable autoplay, and `prefers-reduced-motion` instant jumps |
| **Date pickers** | **`react-day-picker`** (v9), **React Aria `DatePicker`** | `locale` + `timeZone` support, single/range/multiple selection, full keyboard calendar grid (`Arrow`, `PageUp`/`PageDown`, `Home`/`End`), screen-reader date announcements | Date ranges, disabled-date calendars, or multi-locale pickers (use native `<input type="date">` for simple single dates like birthdates) |
| **Split panes** | **`react-resizable-panels`** | Keyboard-resizable `role="separator"` handles (`Arrow`, `Home`/`End`), `minSize`/`maxSize`/collapsible constraints, `autoSaveId` persisted layout without hydration flash | IDE panes, master-detail inspectors, or diff views |

### Command palette (`cmdk`) + Undo toast (`sonner`) idiom

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { toast } from 'sonner';

export function QuickSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<{ id: string; title: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Search request failed');
        setItems(await res.json());
        setStatus('idle');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setStatus('error');
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  function archiveItem(item: { id: string; title: string }) {
    onOpenChange(false);
    toast(`Archived "${item.title}"`, {
      action: { label: 'Undo', onClick: () => fetch(`/api/items/${item.id}/restore`, { method: 'POST' }) },
    });
  }

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange} label="Global search" shouldFilter={false}>
      <Command.Input value={query} onValueChange={setQuery} placeholder="Search invoices or actions…" />
      <Command.List>
        {status === 'loading' && <Command.Loading>Searching…</Command.Loading>}
        {status === 'error' && <div role="alert">Search failed. Retry or check your connection.</div>}
        {status === 'idle' && items.length === 0 && (
          <Command.Empty>
            No results for “{query}”.{' '}
            <button type="button" onClick={() => setQuery('')}>Clear search</button>
          </Command.Empty>
        )}
        {items.map((item) => (
          <Command.Item key={item.id} value={item.id} onSelect={() => archiveItem(item)}>
            {item.title}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
```

### Accessible carousel (`Embla`) & drawer (`vaul`) guardrails

- **Embla Carousel**: pair `useEmblaCarousel({ loop: false, duration: prefersReducedMotion ? 0 : 25 })` with explicit Previous/Next `<button>` controls, a visible slide indicator (`aria-current="true"`), and a live announcement (`aria-live="polite"`) only when the user explicitly advances slides—never auto-advance without a Pause button (WCAG 2.2.2).
- **Vaul Drawer**: always provide `<Drawer.Title>` and `<Drawer.Description>` (visually hidden only when redundant) so screen readers announce the dialog name; set `repositionInputs` thoughtfully on iOS Safari keyboards; respect `prefers-reduced-motion` by disabling spring overshoots.
- **Resizable panels**: give every `<PanelResizeHandle>` an explicit `aria-label` (e.g., `aria-label="Resize sidebar"`) and a visible `:focus-visible` indicator with at least a 4px interactive hit target.

## Search UI engineering

Choose the search architecture by **index size, freshness, hosting budget, and ranking needs**:

| Engine / UI layer | Execution model | Best fit | Critical constraints |
|---|---|---|---|
| **Pagefind** | Build-time static WASM index chunked on demand | Astro, static docs, marketing sites, blogs (0 backend cost, scales to tens of thousands of pages) | Static build-time freshness only; run `npx pagefind --site dist` in build pipeline |
| **Orama** | In-browser or edge JS/TS full-text + vector hybrid | Interactive client/edge search, local-first docs, semantic + keyword blending | Budget serialized index download size for large corpora |
| **Fuse.js** | Lightweight client fuzzy matching | Small in-memory datasets (< ~5,000 short records) like command palettes or local filter lists | Main-thread CPU degrades sharply on large text bodies—move to a Web Worker or Pagefind/Orama beyond small sets |
| **Algolia InstantSearch** | Hosted typo-tolerant search + UI widgets/hooks | E-commerce catalogs, multi-facet directories, instant federated search | Metered hosted billing; keep public search-only API key strictly scoped |
| **Meilisearch** / **Typesense** | Self-hosted or cloud open-source engines + InstantSearch adapters (`instant-meilisearch`, `typesense-instantsearch-adapter`) | Fast typo-tolerant faceted search with predictable infrastructure costs and InstantSearch UI parity | Enforce tenant/filter security via server-issued scoped search keys, never expose master keys |

### Mandatory search UX contract

1. **Abort stale requests**: use `AbortController` (or monotonic request IDs) so a slow earlier query never overwrites a newer result set.
2. **Safe match highlighting**: render highlights from structured match indices/tokens into React/framework `<mark>` elements—never feed raw HTML strings into `dangerouslySetInnerHTML` without strict sanitization.
3. **URL synchronization**: sync query (`?q=`) and active facets to URL search params (`replaceState` while typing, `pushState` on facet toggles) so back/forward and shared links preserve results.
4. **Empty-result recovery**: state what was searched, show active filters that may have over-constrained the result, and offer a one-click reset or broader suggestion.

## Icon, font, and image craft

### Icons (`Lucide`, `Phosphor`, `Tabler`, `Iconify`)

- **Lucide**: clean 24px geometric 2px-stroke baseline for modern web apps.
- **Phosphor Icons**: 6 weights (`thin`, `light`, `regular`, `bold`, `fill`, `duotone`)—strong choice when brand tone or active-nav filled states need optical weight variation.
- **Tabler Icons**: 5,000+ crisp icons suited to technical, data, and operational dashboards.
- **Iconify**: unified schema across 150+ open sets—compile icons at build time (`unplugin-icons` / SVG sprites) rather than fetching icons at runtime from a third-party CDN on critical interactive controls.
- **Craft rules**: pick **one** icon library and consistent stroke weight per surface; tree-shake named imports (never import an entire icon barrel); mark decorative icons `aria-hidden="true"` and give icon-only buttons a concise `aria-label` or visually hidden text.

### Fonts (`Fontsource`)

- Prefer **`@fontsource-variable/*`** (or static `@fontsource/*`) self-hosted packages over third-party Google Fonts `<link>` tags: automatic unicode-range subsetting, same-origin HTTP/2+ caching, zero external DNS/TLS hop, and zero third-party IP leakage.
- Pair `font-display: swap` with metric-matched fallback stacks (`size-adjust`, `ascent-override`, `descent-override` or framework font helpers like `next/font`) to eliminate layout shift (CLS).

### Responsive images & low-byte placeholders (`Unpic`, `ThumbHash`, `BlurHash`)

- **Unpic** (`@unpic/react`, `@unpic/svelte`, `@unpic/vue`, `@unpic/astro`): detects major image CDNs (Cloudflare, Cloudinary, Imgix, Shopify, Vercel, Netlify) and emits responsive `srcset`, `sizes`, explicit `width`/`height`, and `priority` (`fetchPriority="high"`, `loading="eager"`) for LCP hero images without writing brittle URL math.
- **ThumbHash** (preferred over **BlurHash**): encodes aspect ratio, alpha channel, and richer color gradients in ~25 bytes (stored directly in the DB/API payload alongside the image URL) and decodes synchronously to an instant placeholder data URL with zero extra network round-trips.

```tsx
import { Image } from '@unpic/react';
import { thumbHashToDataURL } from 'thumbhash';

export function ProductPhoto({ src, alt, width, height, thumbhashBytes, isLcp }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  thumbhashBytes?: Uint8Array;
  isLcp?: boolean;
}) {
  const placeholder = thumbhashBytes ? thumbHashToDataURL(thumbhashBytes) : undefined;
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={isLcp}
      background={placeholder}
      sizes="(max-width: 768px) 100vw, 480px"
    />
  );
}
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Use `cmdk`/`kbar`, `vaul`, `sonner`, Embla, `react-day-picker`, and `react-resizable-panels` when native HTML falls short | Hand-roll `keydown` command palettes, touch drag sheets, or custom toast timers from scratch |
| Set `shouldFilter={false}` in `cmdk` and abort stale fetches with `AbortController` | Mix client fuzzy filtering with async server results or let slow responses overwrite newer keystrokes |
| Use `sonner` with an Undo action for reversible non-blocking confirmations | Put form validation errors or critical failures only in auto-dismissing toasts |
| Use Pagefind (static SSG), Orama (in-browser/edge), or InstantSearch (Algolia/Meilisearch/Typesense) | Ship a 10 MB JSON blob into `Fuse.js` on the main thread |
| Compile/tree-shake one icon family (`Lucide`/`Phosphor`/`Tabler`/`unplugin-icons`) and self-host subsets with `Fontsource` | Mix three icon stroke styles, fetch icons from runtime CDNs on critical controls, or ship unsubsetted multi-MB font files |
| Emit responsive `srcset`/`sizes` + `priority` on LCP images (`Unpic`) and ~25-byte `ThumbHash` placeholders | Serve raw 4K PNGs with `loading="lazy"` on the LCP image or trigger CLS without `width`/`height` |

## Verification commands

```sh
npm run build
npx playwright test
```

Inspect bundle chunk sizes and verify no whole-library icon barrels or raw JSON search indices bloat the initial payload (`static`). In a real browser, test `⌘K` open/filter/Esc focus restoration, swipeable drawer + keyboard dismissal, toast pause-on-focus + Undo, carousel keyboard/reduced-motion behavior, empty search recovery, and zero-CLS image/font loading (`rendered`).
