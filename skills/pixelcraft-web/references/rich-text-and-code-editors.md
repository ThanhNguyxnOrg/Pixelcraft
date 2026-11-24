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

## Visual page builders (Puck / Craft.js / GrapesJS)

- **Puck**: define a typed `Config` mapping component names to `fields` and `render`, author via `<Puck config={config} data={data} onPublish={save} />`, and render the published page cleanly on the server with `<Render config={config} data={data} />` without shipping editor chrome to end users.

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
| Provide a `Tab` escape hatch and `role="toolbar"` roving focus | Trap keyboard focus inside `Tab`-indented editors |
| Sanitize persisted rich-text HTML or store structured JSON AST | Render unsanitized `dangerouslySetInnerHTML` from editor output |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify bundle chunk splitting (editor chunks lazy-loaded, `static`), and test typing, IME composition, undo/redo, copy-paste, and keyboard escape from `Tab` in a real browser (`rendered`).
