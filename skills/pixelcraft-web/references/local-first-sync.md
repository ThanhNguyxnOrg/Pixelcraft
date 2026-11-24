# Local-first, realtime sync, and CRDT engines

Choose a sync/CRDT architecture when the UI requires **instant local writes, offline resilience, cross-tab consistency, or live multiplayer editing**—not for ordinary request/response CRUD where TanStack Query suffices (`references/state-architecture.md`).

## Sync engine decision matrix

| Engine | Data model | Offline persistence | Presence / cursors | Best fit |
|---|---|---|---|---|
| **Yjs** (`yjs`, `y-indexeddb`, `y-websocket`, Hocuspocus) | Sequence & map CRDTs (`Y.Doc`, `Y.Text`, `Y.XmlFragment`, `Y.Map`, `Y.Array`) | `IndexeddbPersistence` (`y-indexeddb`) | Built-in Awareness protocol | Collaborative rich text (Tiptap, Lexical, ProseMirror, CodeMirror, Monaco) and whiteboards |
| **Automerge** (`@automerge/automerge-repo`) | JSON-like document CRDT (WASM Rust core) + binary sync protocol | `IndexedDBStorageAdapter` + `BroadcastChannelNetworkAdapter` | Ephemeral messages | Local-first structured documents, offline-capable multi-device apps, git-like history |
| **Liveblocks** (`@liveblocks/react`) | Managed realtime rooms (`LiveObject`/`LiveList`/Yjs) + comments/notifications | Managed cloud + Yjs integration | First-class `useMyPresence` / `useOthers` | Turnkey multiplayer SaaS (live cursors, threads, collaborative React Flow/tldraw/Tiptap) |
| **RxDB** (`rxdb`) | Local-first reactive NoSQL database + replication protocol | `getRxStorageDexie()` / IndexedDB / OPFS | Via replication | Offline-first record/collection apps needing reactive queries (`.find().$`), indexes, and schema validation |

## Verified implementation idioms

### Yjs + `y-indexeddb` lifecycle

- Always group related mutations inside `ydoc.transact(() => { ... })` so observers and network providers emit a single atomic update.
- Calling `ydoc.destroy()` automatically tears down attached `IndexeddbPersistence` providers (preserving stored IndexedDB data). If a provider may be destroyed before opening completes, guard `provider.whenSynced.catch(() => {})`.

```ts
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

const doc = new Y.Doc();
const persistence = new IndexeddbPersistence('doc-123', doc);

await persistence.whenSynced;
doc.transact(() => {
  doc.getMap('meta').set('title', 'Q4 Plan');
});

// Cleanup on unmount (closes DB connection without deleting stored data)
doc.destroy();
```

### Automerge Repo (`@automerge/automerge-repo`)

- Combine `BroadcastChannelNetworkAdapter` (instant cross-tab sync), `WebSocketClientAdapter` (remote sync), and `IndexedDBStorageAdapter` (offline persistence) in one `Repo`, and mutate documents inside `changeDoc((d) => { ... })` (never mutate returned `doc` snapshots directly).

```ts
import { Repo } from '@automerge/automerge-repo';
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel';
import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket';
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb';

export const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new WebSocketClientAdapter('wss://sync.example.com'),
  ],
  storage: new IndexedDBStorageAdapter(),
});
```

### Liveblocks (production auth & suspense boundaries)

- Use `authEndpoint="/api/liveblocks-auth"` (never expose a `publicApiKey` for private/authenticated rooms) and wrap room consumers in `<ClientSideSuspense fallback={...}>` so loading states stay explicit and SSR never crashes.

### RxDB (local reactive collections)

- Always declare `indexes` on sorted/filtered fields in the collection JSON schema and unsubscribe from reactive `query.$` observables on component unmount.

## Multiplayer & offline UX contract

- **Explicit sync state**: surface `Saved locally (offline)`, `Syncing…`, `Synced`, and `Sync error (retry)` calmly—never hide offline unsynced edits behind a fake "Saved" checkmark.
- **Presence restraint**: throttle pointer/cursor broadcasts (`~30–60 ms`), fade idle cursors, and respect `prefers-reduced-motion` on remote cursor interpolation.
- **Per-user undo**: in collaborative docs, scope Undo/Redo to the local user's operations (`Y.UndoManager` / collaborative history), never rolling back a teammate's edits.

## Do/don't pairs

| Do | Don't |
|---|---|
| Batch multi-field Yjs edits inside `doc.transact()` and call `doc.destroy()` on unmount | Emit 50 individual network updates in a loop or leak IndexedDB/WebSocket providers |
| Mutate Automerge state only inside `changeDoc((d) => ...)` | Mutate frozen Automerge `doc` objects in place |
| Use `authEndpoint` for private Liveblocks rooms + `<ClientSideSuspense>` | Ship `publicApiKey` on private collaborative documents |
| Scope Undo/Redo to the local user (`Y.UndoManager`) and show honest offline sync status | Let `Ctrl+Z` revert another collaborator's work or display "Saved" while offline |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify offline edit → reload → reconnect merge convergence across two browser contexts (simulating two collaborators + offline mode) in Playwright (`rendered`).
