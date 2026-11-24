# Rich text, code editors, playgrounds, and visual page builders

Never build a rich-text or code editor on raw `contenteditable` with `document.execCommand` (deprecated and inconsistent across browsers). Choose an engine with an explicit document model, predictable undo/redo, IME composition support, and keyboard/screen-reader accessibility.

## Engine decision matrix

| Category | Tools | Document model | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Rich-text core** | **ProseMirror**, **Tiptap** (v3) | Immutable schema-validated node tree (ProseMirror) | Custom block/inline docs, Notion-like editors, Yjs collaboration | Bundle size & schema design discipline; SSR requires `immediatelyRender: false` |
| **React-first rich text** | **Lexical**, **Slate**, **Plate** | Double-buffered node tree (Lexical) or JSON AST (Slate/Plate) | React apps needing fine-grained custom nodes, mentions, slash commands, or shadcn-style blocks (Plate) | Lexical requires registering custom nodes upfront; Slate needs careful normalization & IME testing |
| **Full-featured turnkey** | **CKEditor 5**, **TinyMCE** | Proprietary rich model | CMS/enterprise forms needing turnkey tables, track changes, Word paste cleanup | Commercial licensing for advanced plugins; harder to restyle deeply |
| **Markdown / MDX** | **Milkdown** (ProseMirror-based), **MDXEditor** (Lexical-based) | Markdown AST + live WYSIWYG | Developer docs, Git-backed CMS, technical writing | Round-trip Markdown serialization edge cases with custom JSX/MDX |
| **Code editors** | **CodeMirror 6**, **Monaco Editor**, **Ace** | Line/rope immutable state (CM6) or VS Code text model (Monaco) | **CodeMirror 6**: lightweight, mobile-friendly, modular web apps; **Monaco**: desktop IDE features (TypeScript IntelliSense, diff editor, LSP) | Monaco is heavy (~2–4 MB + Web Workers) and weak on mobile touch; never bundle Monaco for a small JSON input |
| **In-browser playgrounds** | **Sandpack**, **WebContainers** | Client bundler iframe (Sandpack) or WASM Node.js runtime (WebContainers) | **Sandpack**: live React/Vue/HTML sandboxes in docs; **WebContainers**: full Node CLI/dev-server in browser | WebContainers require `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers |
| **Visual page builders** | **Puck**, **Craft.js**, **GrapesJS** | JSON component tree (Puck/Craft.js) or HTML/CSS canvas (GrapesJS) | **Puck**: React/Next.js apps rendering your own design-system components; **GrapesJS**: standalone HTML/email template builders | GrapesJS outputs arbitrary HTML/CSS that can drift from design tokens |

## Rich-text implementation idioms

### Tiptap v3 (ProseMirror)

- **SSR safety**: always set `immediatelyRender: false` in `useEditor()` inside Next.js/Remix/SSR apps so server and client HTML do not mismatch.
- **Yjs collaboration**: when adding `@tiptap/extension-collaboration`, disable `StarterKit`'s built-in undo/redo (`StarterKit.configure({ undoRedo: false })` in v3) so local history does not fight collaborative Yjs history.
- **Persistence & XSS**: store canonical JSON (or sanitize HTML server-side with DOMPurify/allowlist before rendering read-only views).

```tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function DocumentEditor({ initialHtml }: { initialHtml: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable built-in undoRedo when pairing with Yjs Collaboration
        undoRedo: false,
      }),
    ],
    content: initialHtml,
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

## Code editor implementation idioms

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

## Accessibility & keyboard rules for editors

- Every editor must have an accessible name (`aria-label` or `aria-labelledby`) and a documented keyboard escape hatch from `Tab` indentation (for example, `Esc` then `Tab` or a visible toggle) so keyboard users are never trapped (WCAG 2.1.2).
- Toolbars must use roving `tabindex` (`role="toolbar"`) with `aria-pressed` on formatting toggles (`Bold`, `Italic`, `Code`).
- Never break IME composition (CJK/Vietnamese/accented input) by rewriting editor content synchronously on `keydown`/`input` during `isComposing`.

## Do/don't pairs

| Do | Don't |
|---|---|
| Set `immediatelyRender: false` in Tiptap `useEditor()` for SSR apps | Mount Tiptap immediately on the server and ship hydration mismatches |
| Disable `StarterKit` `undoRedo` when using Tiptap Yjs Collaboration | Run local undo/redo alongside Yjs collaborative history |
| Use CodeMirror 6 `Compartment.reconfigure()` for theme/language switches | Recreate `EditorView` on prop change and wipe cursor/undo history |
| Lazy-load Monaco and configure Web Workers; use CM6 for lightweight/mobile views | Bundle full Monaco synchronously into a mobile form or settings modal |
| Provide a `Tab` escape hatch and `role="toolbar"` roving focus | Trap keyboard focus inside `Tab`-indented editors |
| Sanitize persisted rich-text HTML or store structured JSON AST | Render unsanitized `dangerouslySetInnerHTML` from editor output |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify bundle chunk splitting (editor chunks lazy-loaded, `static`), and test typing, IME composition, undo/redo, copy-paste, and keyboard escape from `Tab` in a real browser (`rendered`).
