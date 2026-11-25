# Rich text, code editors, playgrounds, and visual page builders

Never build a rich-text or code editor on raw `contenteditable` with `document.execCommand` (deprecated and inconsistent across browsers). Choose an engine with an explicit document model, predictable undo/redo, IME composition support, and keyboard/screen-reader accessibility.

## Engine decision matrix

| Category | Tools | Document model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Rich-text core** | **ProseMirror**, **Tiptap** (v3), **BlockNote** | Immutable schema-validated node tree (ProseMirror) | Custom block/inline docs, Notion-like editors (**BlockNote** ships slash menus, drag handles, and Yjs blocks out of the box) | Bundle size & schema design discipline; SSR requires `immediatelyRender: false` |
| **React-first rich text** | **Lexical**, **Slate**, **Plate** | Double-buffered node tree (Lexical) or JSON AST (Slate/Plate) | React apps needing fine-grained custom nodes, mentions, slash commands, or shadcn-style blocks (Plate) | Lexical requires registering custom nodes upfront; Slate needs careful normalization & IME testing |
| **Full-featured turnkey** | **CKEditor 5**, **TinyMCE** | Proprietary rich model | CMS/enterprise forms needing turnkey tables, track changes, Word paste cleanup | Commercial licensing for advanced plugins; harder to restyle deeply |
| **Markdown / MDX** | **Milkdown** (ProseMirror-based), **MDXEditor** (Lexical-based) | Markdown AST + live WYSIWYG | Developer docs, Git-backed CMS, technical writing | Round-trip Markdown serialization edge cases with custom JSX/MDX |
| **Read-only syntax highlighting** | **Shiki** (`shiki`) | TextMate grammars → static HTML / CSS variables | Docs, changelogs, diff viewers, AI code blocks (0 KB client JS when rendered at build/SSR time) | Not an editable code editor—pair with CodeMirror 6 when editing is required |
| **Code editors** | **CodeMirror 6**, **Monaco Editor**, **Ace** | Line/rope immutable state (CM6) or VS Code text model (Monaco) | **CodeMirror 6**: lightweight, mobile-friendly, modular web apps; **Monaco**: desktop IDE features (TypeScript IntelliSense, diff editor, LSP) | Monaco is heavy (~2–4 MB + Web Workers) and weak on mobile touch; never bundle Monaco for a small JSON input or read-only snippet |
| **In-browser playgrounds** | **Sandpack**, **WebContainers** | Client bundler iframe (Sandpack) or WASM Node.js runtime (WebContainers) | **Sandpack**: live React/Vue/HTML sandboxes in docs; **WebContainers**: full Node CLI/dev-server in browser | WebContainers require `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers |
| **Visual page builders** | **Puck**, **Craft.js**, **GrapesJS** | JSON component tree (Puck/Craft.js) or HTML/CSS canvas (GrapesJS) | **Puck**: React/Next.js apps rendering your own design-system components; **GrapesJS**: standalone HTML/email template builders | GrapesJS outputs arbitrary HTML/CSS that can drift from design tokens |

## Rich-text implementation idioms

### Standalone ProseMirror (`Schema` → `EditorState` → `Transaction` → `EditorView`)

Choose standalone **ProseMirror** (`prosemirror-model`, `prosemirror-state`, `prosemirror-view`, `prosemirror-history`, `prosemirror-keymap`) over wrapper frameworks when you need tight bundle control, framework-agnostic state ownership, or strict custom document invariants:

- Define a closed `Schema` (allowed nodes, marks, and content expressions) so invalid DOM structures cannot enter editor state.
- Route every mutation through an immutable `Transaction` (`state.tr`) inside `dispatchTransaction(tr)`, apply it via `view.state.apply(tr)`, update the view with `view.updateState(nextState)`, and call `view.destroy()` on unmount.

```ts
import { Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

const schema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: { content: 'text*', toDOM: () => ['p', 0], parseDOM: [{ tag: 'p' }] },
    text: { group: 'inline' },
  },
  marks: {
    strong: { toDOM: () => ['strong', 0], parseDOM: [{ tag: 'strong' }] },
  },
});

export function mountProseMirror(parent: HTMLElement, onDocChange: (json: unknown) => void) {
  const state = EditorState.create({
    schema,
    plugins: [history(), keymap({ 'Mod-z': undo, 'Mod-Shift-z': redo }), keymap(baseKeymap)],
  });

  const view = new EditorView(parent, {
    state,
    attributes: { role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Document body' },
    dispatchTransaction(tr: Transaction) {
      const next = view.state.apply(tr);
      view.updateState(next);
      if (tr.docChanged) onDocChange(next.doc.toJSON());
    },
  });

  return () => view.destroy();
}
```

### Tiptap v3 (ProseMirror) & BlockNote

- **SSR safety**: always set `immediatelyRender: false` in `useEditor()` inside Next.js/Remix/SSR apps so server and client HTML do not mismatch.
- **Undo/Redo footgun**: keep `StarterKit`'s built-in undo/redo **enabled** for single-user editors! Disable it (`undoRedo: false` in Tiptap v3) **only** when `@tiptap/extension-collaboration` (Yjs) owns history—copying `undoRedo: false` into a standalone editor silently breaks `Ctrl+Z` / `Cmd+Z`.
- **BlockNote**: use `@blocknote/react` (`useCreateBlockNote` + `<BlockNoteView>`) when a Notion-style block editor with slash menus, block drag handles, and optional Yjs sync is desired without assembling 15 Tiptap extensions by hand.
- **Persistence & XSS**: store canonical JSON (or sanitize HTML server-side with DOMPurify/allowlist before rendering read-only views).

```tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import type * as Y from 'yjs';

export function DocumentEditor({ initialHtml, ydoc }: { initialHtml: string; ydoc?: Y.Doc }) {
  const isCollaborative = Boolean(ydoc);
  const editor = useEditor({
    extensions: [
      // ONLY disable built-in undoRedo when Yjs Collaboration provides history!
      StarterKit.configure(isCollaborative ? { undoRedo: false } : {}),
      ...(ydoc ? [Collaboration.configure({ document: ydoc })] : []),
    ],
    content: isCollaborative ? undefined : initialHtml,
    immediatelyRender: false,
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
```

### Lexical

- Register every custom node class in `initialConfig.nodes` up front—unregistered nodes throw at runtime when parsed.
- Always pass `ErrorBoundary={LexicalErrorBoundary}` to `<RichTextPlugin>` and wrap every programmatic state mutation inside `editor.update(() => { ... })`.

```tsx
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/RichTextPlugin';
import { ContentEditable } from '@lexical/react/ContentEditable';
import { HistoryPlugin } from '@lexical/react/HistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

const initialConfig = {
  namespace: 'NotesEditor',
  onError(error: Error) {
    throw error;
  },
};

export function NotesEditor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable aria-label="Document body" className="editor-input" />}
        placeholder={<div className="editor-placeholder">Write a note…</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
```

## Code editors and read-only highlighting

### Shiki (read-only code blocks)

- Never ship CodeMirror or Monaco just to display read-only code snippets. Use **`shiki`** (`codeToHtml(code, { lang, themes: { light, dark } })`) at build time or inside Server Components / `.server.vue` / Astro for VS Code-accurate syntax highlighting with zero client JavaScript, using dual light/dark CSS variables so themes switch without re-highlighting.

### CodeMirror 6

- Use `Compartment` to reconfigure dynamic settings (theme, language, `readOnly`, `tabSize`) via `view.dispatch({ effects: compartment.reconfigure(...) })` instead of destroying and recreating `EditorView` on every prop change (which loses undo history, scroll, and cursor selection).
- Always call `view.destroy()` on component unmount.

```ts
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

const tabSize = new Compartment();

const view = new EditorView({
  state: EditorState.create({
    doc: 'const x = 1;\n',
    extensions: [tabSize.of(EditorState.tabSize.of(2))],
  }),
  parent: containerEl,
});

export function setTabSize(size: number) {
  view.dispatch({ effects: tabSize.reconfigure(EditorState.tabSize.of(size)) });
}
```

### Monaco Editor

- Always lazy-load Monaco (`React.lazy` / dynamic `import()`) and configure its Web Workers (`MonacoEnvironment.getWorker`) so TypeScript/JSON language services do not run on the main thread.
- Dispose both the editor instance and created `ITextModel` instances on unmount to avoid multi-megabyte memory leaks.

## Visual page builders & client-proof CMS authoring guardrails

- **Puck**: define a typed `Config` mapping component names to `fields` and `render`, author via `<Puck config={config} data={data} onPublish={save} />`, and render the published page cleanly on the server with `<Render config={config} data={data} />` without shipping editor chrome to end users.
- **Raw camera upload auto-transcode & focal-point crop**: non-technical editors routinely upload raw `10–15 MB` camera/phone photos (`4000×3000+` JPEG/PNG/HEIC). Enforce an upload/CDN pipeline (Sharp, Cloudflare Images, Sanity, Payload, Strapi, Imgix) that auto-rotates EXIF, strips sensitive GPS metadata, transcodes into responsive `AVIF`/`WebP` `srcset` widths, and honors **hotspot / focal-point coordinates** (`object-position: calc(var(--fp-x, 0.5) * 100%) calc(var(--fp-y, 0.5) * 100%)` or CDN `fp-x`/`fp-y` crop params) so portraits and product shots never get decapitated across card aspect ratios.
- **Word / Google Docs / Notion paste sanitization**: configure ProseMirror `editorProps.transformPastedHTML` (or Lexical `PASTE_COMMAND` + server allowlist) to strip inline `style="font-family: Calibri; color: #000000; font-size: 11pt"`, `<font>`, `MsoNormal` classes, arbitrary `<span>` soup, and accidental `<h1>` tags—converting pasted content cleanly into semantic `<h2>`–`<h4>`, `<p>`, `<ul>`/`<ol>`, `<blockquote>`, `<strong>`/`<em>`, and safe `<a>` nodes styled exclusively by design tokens.
- **Schema guardrails, alt-text enforcement & Draft Live Preview**: configure CMS field schemas (Sanity, Payload, Strapi, Contentful, Directus, Tina, Keystatic, Wagtail, Gutenberg) with soft/hard character limits and live counters on titles, card teasers, and SEO descriptions so long copy cannot shatter layouts; require explicit `alt` text (or an intentional `"Decorative"` checkbox emitting `alt=""`) before publishing media; and wire **Draft Mode / Live Preview** so editors inspect unpublished responsive pages in real templates prior to publish.

```ts
// ProseMirror / Tiptap: strip Word & Google Docs inline style/font soup on paste
const cleanWordPaste = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('style, meta, link, script, xml, o\\:p').forEach((el) => el.remove());
  doc.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('face');
    el.removeAttribute('color');
    el.removeAttribute('size');
    if (el.tagName === 'H1') {
      const h2 = doc.createElement('h2');
      h2.innerHTML = el.innerHTML;
      el.replaceWith(h2);
    }
  });
  return doc.body.innerHTML;
};
```

## Accessibility, IME, and collaborative CRDT rules for editors

- Every editor must have an accessible name (`aria-label` or `aria-labelledby`) and a documented keyboard escape hatch from `Tab` indentation (for example, `Esc` then `Tab` or a visible toggle) so keyboard users are never trapped (WCAG 2.1.2).
- Toolbars must use roving `tabindex` (`role="toolbar"`) with `aria-pressed` on formatting toggles (`Bold`, `Italic`, `Code`).
- Never break IME composition (CJK/Vietnamese/accented input) by rewriting editor content synchronously on `keydown`/`input` during `isComposing`. For custom canvas or virtualized code editors in Chromium 121+, feature-detect the W3C **EditContext API** (`'EditContext' in window`) to decouple OS/IME composition (`textupdate`, `updateControlBounds`) from hidden DOM hacks, with a fallback for Safari/Firefox.
- **Collaborative rich text**: never roll ad-hoc string diffing or last-write-wins patches for concurrent document editing—use proven CRDT/OT engines (Yjs/YATA, Peritext-style rich-text mark CRDTs, or Fugue non-interleaving sequence CRDTs) so concurrent insertions at the same cursor do not corrupt or interleave characters.

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `immediatelyRender: false` in Tiptap `useEditor()` for SSR apps | Mount Tiptap immediately on the server and ship hydration mismatches |
| Disable `StarterKit` `undoRedo` **only** when Yjs Collaboration is attached | Copy `undoRedo: false` into a standalone single-user editor (silently breaks Undo/Redo) |
| Use **Shiki** (build/SSR) for read-only code blocks and CodeMirror 6 (`Compartment`) for editable inputs | Ship Monaco or CodeMirror just to highlight static code examples, or recreate `EditorView` on prop change |
| Lazy-load Monaco and configure Web Workers for desktop IDE surfaces | Bundle full Monaco synchronously into a mobile form or settings modal |
| Auto-transcode `10–15 MB` CMS uploads to AVIF/WebP `srcset` with focal-point crop, sanitize Word/Docs paste, and wire Draft Live Preview | Serve raw camera uploads directly, allow pasted `style="font-family: Calibri"` soup into production HTML, or publish blind without preview |
| Provide a `Tab` escape hatch and `role="toolbar"` roving focus | Trap keyboard focus inside `Tab`-indented editors |
| Sanitize persisted rich-text HTML or store structured JSON AST | Render unsanitized `dangerouslySetInnerHTML` from editor output |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify bundle chunk splitting (editor chunks lazy-loaded, `static`), and test typing, IME composition, undo/redo, Word/Google Docs paste cleanup, CMS focal-point crop, Draft Live Preview, and keyboard escape from `Tab` in a real browser (`rendered`).
