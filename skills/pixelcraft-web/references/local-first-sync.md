# Local-first, realtime sync, and CRDT engines

Choose a sync/CRDT architecture when the UI requires **instant local writes, offline resilience, cross-tab consistency, or live multiplayer editing**—not for ordinary request/response CRUD where TanStack Query suffices ([state-architecture.md](state-architecture.md)).

## Sync engine decision matrix

| Engine | Data model | Offline / persistence | Presence / realtime | Best fit |
|---|---|---|---|---|
| **Yjs** (`yjs`, `y-indexeddb`, `y-websocket`, Hocuspocus) | Sequence & map CRDTs (`Y.Doc`, `Y.Text`, `Y.XmlFragment`) | `IndexeddbPersistence` (`y-indexeddb`) | Built-in Awareness protocol | Collaborative rich text (Tiptap, Lexical, CodeMirror, Monaco) and whiteboards |
| **Automerge** (`@automerge/automerge-repo`) | JSON-like document CRDT (WASM Rust core) + binary sync | `IndexedDBStorageAdapter` + `BroadcastChannel` | Ephemeral messages | Local-first structured documents, offline multi-device apps, git-like history |
| **Zero (Rocicorp)** | Postgres-backed client cache + ZQL reactive queries + custom mutators | IndexedDB / local query cache | Live incremental Postgres sync | Instant-UI SaaS apps backed by existing Postgres needing sub-frame optimistic writes |
| **ElectricSQL** | Postgres logical-replication HTTP **Shapes** streamed to clients | Pairs with local stores / **TanStack DB** / PGlite | Live Shape SSE/long-poll stream | Read-heavy sync of Postgres subsets into existing web apps without replacing Postgres |
| **TanStack DB** | Reactive client collections + differential dataflow live joins + optimistic mutations | Pluggable (TanStack Query, ElectricSQL, Zero, custom) | Driven by backing collection sync | Frontend-first reactive relational cache and instant optimistic UX across frameworks |
| **PowerSync** | SQLite-in-browser (WASM/OPFS) synced bi-directionally with Postgres/Mongo/MySQL | Full local SQLite (OPFS/IndexedDB) | Streaming sync buckets + upload queue | Offline-first SQL apps needing full local SQL queries and conflict-controlled server writes |
| **Jazz** | End-to-end encrypted collaborative values (`CoMap`, `CoList`, `CoFeed`) | Built-in IndexedDB / local-first | Realtime peer/mesh sync + group RBAC | Collaborative local-first apps wanting built-in E2E encryption and permissions |
| **InstantDB** | Realtime client graph DB (`InstaQL`) with declarative CEL permissions | Local IndexedDB cache + optimistic writes | Live WebSocket subscriptions + presence rooms | Realtime collaborative SaaS & multiplayer apps wanting Firebase-like ergonomics with relational queries |
| **Convex** | Reactive TypeScript backend (`useQuery`/`useMutation`) + transactional DB | Optimistic updates (online-first reactive) | Automatic live WebSocket query invalidation | Full-stack TypeScript apps wanting end-to-end reactive queries without hand-building sync |
| **TinyBase** | Lightweight reactive tabular/key-value store + optional CRDT/synchronizer | IndexedDB / OPFS / SQLite / `localStorage` persisters | WebSocket / BroadcastChannel / Durable Objects synchronizers | Small-footprint reactive local stores, local-first tools, and custom sync topologies |
| **Liveblocks** (`@liveblocks/react`) | Managed realtime rooms (`LiveObject`/`LiveList`/Yjs) + comments | Managed cloud + Yjs integration | First-class `useMyPresence` / `useOthers` | Turnkey multiplayer SaaS (live cursors, threads, collaborative React Flow/tldraw/Tiptap) |
| **RxDB** (`rxdb`) | Local-first reactive NoSQL database + replication | `getRxStorageDexie()` / IndexedDB / OPFS | Via replication | Offline-first collection apps needing reactive RxJS queries (`.find().$`) and JSON schemas |
| **PartyKit / Cloudflare Durable Objects** | Stateful edge WebSocket rooms (per-document actor) | Hibernatable WebSockets + SQLite DO storage | Direct room broadcasts (`y-partyserver`, custom presence) | Hosting your own low-latency multiplayer rooms or Yjs sync servers at the edge |

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

- Combine `BroadcastChannelNetworkAdapter` (instant cross-tab sync), `WebSocketClientAdapter` (remote sync), and `IndexedDBStorageAdapter` (offline persistence) in one `Repo`.
- **Mutation API**: in core `@automerge/automerge-repo`, mutate via **`handle.change((d) => { ... })`** on a `DocHandle` (never mutate `handle.docSync()` snapshots in place). When using `@automerge/automerge-repo-react-hooks`, `useDocument(docUrl)` returns `[doc, changeDoc]` which delegates to `handle.change(...)` under the hood.

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

const handle = repo.create<{ title: string }>({ title: 'Draft' });
handle.change((d) => {
  d.title = 'Q4 Plan';
});
```

### Database-backed sync (Zero / ElectricSQL + TanStack DB / PowerSync / Convex / InstantDB)

- **Authorization boundary**: client sync caches cannot enforce security—always enforce row-level permissions on the sync server (Zero permissions/custom mutators, Electric auth proxy + Shape filters, PowerSync sync rules, Convex server mutations, InstantDB permission rules).
- **Optimistic mutation reconciliation**: show immediate local updates, attach clear rollback/conflict recovery if the server rejects a custom mutator, and avoid syncing unbounded tables into browser storage (scope Shapes/queries to the active workspace or time window).

### Liveblocks, RxDB, TinyBase, and Durable Objects

- **Liveblocks**: use `authEndpoint="/api/liveblocks-auth"` (never expose a `publicApiKey` for private rooms) and wrap room consumers in `<ClientSideSuspense fallback={...}>` so SSR never crashes.
- **RxDB**: declare `indexes` on sorted/filtered fields in the collection JSON schema and unsubscribe from reactive `query.$` observables on unmount.
- **PartyKit / Cloudflare Durable Objects**: enable WebSocket Hibernation on room DOs and persist snapshots/WALs to DO storage so idle rooms scale to zero without losing edits.

## Multiplayer & offline UX contract

- **Explicit sync state**: surface `Saved locally (offline)`, `Syncing…`, `Synced`, and `Sync error (retry)` calmly—never hide offline unsynced edits behind a fake "Saved" checkmark.
- **Presence restraint**: throttle pointer/cursor broadcasts (`~30–60 ms`), fade idle cursors, and respect `prefers-reduced-motion` on remote cursor interpolation.
- **Per-user undo**: in collaborative docs, scope Undo/Redo to the local user's operations (`Y.UndoManager` / collaborative history), never rolling back a teammate's edits.

## Do/don't pairs

| Do | Don't |
|---|---|
| Batch multi-field Yjs edits inside `doc.transact()` and call `doc.destroy()` on unmount | Emit 50 individual network updates in a loop or leak IndexedDB/WebSocket providers |
| Mutate Automerge docs via `handle.change((d) => ...)` (or `changeDoc` from `useDocument`) | Mutate frozen Automerge `doc` snapshots in place |
| Scope Electric Shapes / Zero queries / PowerSync buckets to authorized workspace slices | Replicate an entire multi-tenant database into browser IndexedDB/OPFS |
| Use `authEndpoint` for private Liveblocks rooms + `<ClientSideSuspense>` | Ship `publicApiKey` on private collaborative documents |
| Scope Undo/Redo to the local user (`Y.UndoManager`) and show honest offline sync status | Let `Ctrl+Z` revert another collaborator's work or display "Saved" while offline |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify offline edit → reload → reconnect merge convergence and authorization rejection rollback across two browser contexts (simulating two collaborators + offline mode) in Playwright (`rendered`).
