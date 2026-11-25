# AI-native frontend UI libraries and agent-UI protocols

Pair this reference with [agentic-workspace.md](agentic-workspace.md) for scroll-yield, branching, trust calibration, grounded citations, and approval-gate UX. Choose between a transport/state SDK, headless chat primitives, an in-app copilot framework, or a host-embedded agent-UI protocol based on your frontend framework and security boundary.

## Library and protocol decision matrix

| Tool / protocol | Layer | Framework support | Best fit | Primary trade-off |
|---|---|---|---|---|
| **Vercel AI SDK UI (v5/v6)** (`ai`, `@ai-sdk/{react,vue,svelte,angular}`) | Streaming transport & typed `message.parts` state | React, Vue, Svelte 5, Angular | Custom chat/agent UIs with full visual ownership, reasoning, sources, and tool approvals | You own thread scrolling, composer ergonomics, and branching (or layer `assistant-ui` / AI Elements) |
| **assistant-ui** (`@assistant-ui/react`) | Headless accessible AI primitives (`ThreadPrimitive`, `ComposerPrimitive`) | React | Production chat workbenches needing accessible streaming, editing, branching, and tool slots | React-only; requires wiring an AI SDK, LangGraph, or custom runtime adapter |
| **AI Elements / prompt-kit / shadcn AI** | Copy-owned accessible UI component collections | React + Tailwind | Rapid high-craft message bubbles, reasoning disclosures, tool cards, citations, prompt bars | Copy-owned code must still be adapted to project tokens so apps do not look identical |
| **CopilotKit (v2) + AG-UI** (`@copilotkit/react-core/v2`) | In-app agentic copilot SDK over **AG-UI** events | React (SDK) / any (AG-UI protocol) | Embedded copilots that read/mutate app state, render streaming tools, and pause for approvals | Higher framework coupling when a lightweight standalone chat suffices |
| **LangGraph SDK** (`@langchain/langgraph-sdk/react` `useStream`) | Stateful graph streaming, interrupts, time-travel | React & framework-agnostic JS client | Multi-step LangGraph agents with native `interrupt` approvals, checkpoints, and thread branching | Coupled to LangGraph Server / Agent Protocol backend |
| **MCP Apps / MCP-UI** | Sandboxed interactive UI resources returned by MCP tools | Host-agnostic (sandboxed iframe + JSON-RPC) | MCP servers exposing rich interactive widgets inside MCP-capable chat hosts | Strict CSP/sandbox boundaries; UI must adapt to host theme and viewport constraints |
| **OpenAI Apps SDK** (`window.openai`) | ChatGPT-hosted iframe widgets (`toolOutput`, `callTool`, `setWidgetState`) | Any web stack inside widget iframe | Third-party interactive apps running inline/fullscreen/PiP inside ChatGPT | Bound to ChatGPT host runtime; must degrade when `window.openai` APIs vary |
| **Google A2UI** | Declarative JSON agent-to-UI component catalog stream | Web, Flutter, native (host renderer) | Safe generative UI across platforms where agents emit only host-approved declarative widgets | Limited to components registered in the host's trusted catalog (no arbitrary JS) |

## Vercel AI SDK v5/v6 idioms (React, Svelte/Vue/Angular, and v4 -> v5 breaking changes)

**v4 -> v5/v6 breaking changes**: `useChat` removed flat `message.content`, `input`/`handleInputChange`, `handleSubmit`, and legacy `toolInvocations`. Pass `transport: new DefaultChatTransport({ api })`, manage composer state explicitly, call `sendMessage({ text })`, and render typed `message.parts` (`text`, `reasoning`, `source-url`, `source-document`, `tool-<name>`, `dynamic-tool`).

```tsx
'use client';

import { useState, type FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function AssistantChat({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    addToolOutput,
    addToolApprovalResponse,
    regenerate,
    status,
    stop,
    error,
  } = useChat({
    id: chatId,
    resume: true, // reconnect to an active server stream across reloads
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput('');
  }

  return (
    <section aria-label="Assistant workspace">
      {messages.map((m) => (
        <article key={m.id}>
          {m.parts.map((part, i) => {
            if (part.type === 'text') return <p key={i}>{part.text}</p>;
            if (part.type === 'reasoning') {
              return (
                <details key={i}>
                  <summary>Reasoning trace</summary>
                  <pre>{part.text}</pre>
                </details>
              );
            }
            if (part.type === 'source-url') {
              return <a key={i} href={part.url} rel="noreferrer">{part.title ?? part.url}</a>;
            }
            if (part.type === 'source-document') {
              return <span key={i} className="citation-chip">{part.title}</span>;
            }
            if (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) {
              if (part.state === 'input-streaming') return <p key={i}>Preparing tool call…</p>;
              if (part.state === 'approval-requested' && 'approval' in part && part.approval) {
                const inputSummary = 'input' in part ? JSON.stringify(part.input) : '';
                return (
                  <div key={i} role="region" aria-label="Tool approval required">
                    <p><strong>Confirm action:</strong> {part.type.replace(/^tool-/, '')}</p>
                    <p>Target &amp; parameters (Before → After): <code>{inputSummary}</code></p>
                    <button type="button" onClick={() => addToolApprovalResponse({ id: part.approval.id, approved: true })}>Approve once</button>
                    <button type="button" onClick={() => addToolApprovalResponse({ id: part.approval.id, approved: false })}>Reject</button>
                  </div>
                );
              }
              if (part.state === 'output-error') return <p key={i} role="alert">Tool failed: {part.errorText} — retry or edit parameters.</p>;
              if (part.state === 'output-available') return <pre key={i}>{JSON.stringify(part.output)}</pre>;
              // For client-executed tools awaiting output: call addToolOutput({ tool, toolCallId, output })
            }
            return null;
          })}
        </article>
      ))}

      {error && (
        <div role="alert">
          <p><strong>Response interrupted:</strong> {error.message} — your draft and history are preserved.</p>
          <button type="button" onClick={() => regenerate()}>Retry last response</button>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label htmlFor="chat-prompt" className="sr-only">Message</label>
        {/* Never lock input with disabled={isBusy}; guard Enter-to-send against CJK/Vietnamese IME composition */}
        <input
          id="chat-prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) {
              e.preventDefault();
            }
          }}
          placeholder={isBusy ? 'Draft next turn or steer while streaming…' : 'Ask anything…'}
        />
        {isBusy ? (
          <>
            <button type="button" onClick={() => stop()} aria-label="Stop active stream">
              Stop
            </button>
            {input.trim() && (
              <button
                type="button"
                onClick={() => {
                  const next = input.trim();
                  stop();
                  sendMessage({ text: next });
                  setInput('');
                }}
              >
                Steer now
              </button>
            )}
          </>
        ) : (
          <button type="submit" disabled={!input.trim()}>
            Send
          </button>
        )}
      </form>
    </section>
  );
}
```

### Non-React AI SDK & framework-agnostic SSE / AG-UI idioms

Do not assume React—Vercel AI SDK ships official first-class `Chat` classes for **Svelte 5 (`@ai-sdk/svelte`)**, **Vue (`@ai-sdk/vue`)**, and **Angular (`@ai-sdk/angular`)**, and any web/desktop stack can consume **AG-UI** SSE directly with `fetch` + `AbortController`:

```svelte
<!-- Svelte 5 (@ai-sdk/svelte) -->
<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { DefaultChatTransport } from 'ai';

  const chat = new Chat({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
  let draft = $state('');

  function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    chat.sendMessage({ text: draft.trim() });
    draft = '';
  }
</script>

{#each chat.messages as msg (msg.id)}
  {#each msg.parts as part}
    {#if part.type === 'text'}<p>{part.text}</p>{/if}
  {/each}
{/each}
<form onsubmit={submit}>
  <input bind:value={draft} aria-label="Prompt" />
  <button type="submit">Send</button>
</form>
```

```ts
// Framework-agnostic AG-UI / SSE stream consumer (TypeScript / vanilla / Lit / Solid / WebView)
export async function streamAgUiRun(url: string, body: unknown, onEvent: (ev: Record<string, unknown>) => void) {
  const controller = new AbortController();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(body),
    signal: controller.signal,
  });
  if (!res.ok || !res.body) throw new Error(`Stream HTTP ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    for (const chunk of buf.split('\n\n')) {
      if (chunk.startsWith('data: ')) onEvent(JSON.parse(chunk.slice(6)));
    }
    buf = buf.slice(buf.lastIndexOf('\n\n') + 2);
  }
  return controller;
}
```

## CopilotKit v2 (`useFrontendTool` & `useHumanInTheLoop`)

- `useFrontendTool` accepts Standard Schema v1 validators (`Zod`, `Valibot`, `ArkType`). While `status === 'inProgress'`, `args` is **partial**—guard every property before reading nested fields.
- `useHumanInTheLoop` transitions through `'inProgress'` -> `'executing'` -> `'complete'` (lowercase string values in v2 render props) and supplies `respond(...)` strictly during `'executing'` (call `respond` once per invocation).

```tsx
import { useHumanInTheLoop } from '@copilotkit/react-core/v2';
import { z } from 'zod';

useHumanInTheLoop({
  name: 'confirmRefund',
  description: 'Request approval before issuing a customer refund',
  parameters: z.object({ orderId: z.string(), amountUsd: z.number() }),
  render: ({ args, respond, status }) => {
    if (status === 'inProgress') return <p>Preparing refund details…</p>;
    if (status !== 'executing' || !respond) return null;
    return (
      <div role="region" aria-label="Refund approval">
        <p>Refund ${args.amountUsd} for order {args.orderId}?</p>
        <button type="button" onClick={() => respond({ approved: true })}>Approve refund</button>
        <button type="button" onClick={() => respond({ approved: false })}>Decline</button>
      </div>
    );
  },
});
```

## LangGraph SDK (`useStream`), MCP Apps, OpenAI Apps SDK, and Google A2UI

- **LangGraph SDK (`@langchain/langgraph-sdk/react`)**: Use `const thread = useStream({ apiUrl, assistantId, threadId })`. Render `thread.interrupt` as an inline approval/input card and resume execution via `thread.submit(undefined, { command: { resume: userDecision } })`. Support checkpoint **time-travel / branching** by submitting with a prior `checkpoint` so edits fork cleanly without mutating history.
- **MCP Apps / MCP-UI**: When an MCP tool returns an interactive UI resource (`ui://...`), render it inside a sandboxed iframe (`sandbox="allow-scripts"`) with strict CSP, bridge tool invocations through the host JSON-RPC/postMessage channel, and sync host light/dark theme tokens into the frame.
- **OpenAI Apps SDK (ChatGPT widgets `window.openai`)**: Read initial tool results from `window.openai.toolOutput`, invoke follow-up MCP tools with `await window.openai.callTool(name, args)`, persist compact UI state via `window.openai.setWidgetState(state)`, and adapt layout cleanly to `window.openai.theme` and `window.openai.displayMode` (`inline`, `fullscreen`, `pip`).
- **Google A2UI**: Validate every streamed A2UI JSON surface/component message against your client's registered widget catalog, resolve JSON Pointer data bindings safely, and dispatch user actions back as structured events—never evaluate raw HTML or code strings from the agent.

## Do/don't pairs

| Do | Don't |
|---|---|
| Wire controlled composer input -> `sendMessage({ text })` and render `message.parts` | Use removed v4 `message.content`/`handleSubmit` or leave unused `input` state |
| Handle `'input-streaming'`, `'approval-requested'`, `'output-error'`, and `error` + `regenerate()` | Render only happy-path `'output-available'` and ignore tool/stream errors |
| Match CopilotKit v2 `'inProgress'` / `'executing'` / `'complete'` status checks consistently | Mix PascalCase enum names and mismatched strings or dereference partial `args` |
| Use `@ai-sdk/{svelte,vue,angular}` or native SSE/AG-UI when the repo is not React | Force React into a Vue, Svelte, Angular, or vanilla workspace |
| Sandbox MCP Apps / OpenAI Apps iframes with explicit CSP and host theme sync | Inject untrusted agent HTML/JS directly into the host document |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify streaming abort (`stop()`), `resume: true` reload recovery, partial-arg tool states, `'output-error'` + `regenerate()`, approval accept/deny idempotency, and scroll-yield in a real browser (`rendered` evidence).
