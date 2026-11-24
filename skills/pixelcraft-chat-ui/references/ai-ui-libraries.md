# AI-native frontend UI libraries

Pair this implementation reference with `references/agentic-workspace.md` for streaming scroll-yield, trust calibration, grounded citations, and approval-gate UX. Choose between a transport/hook SDK, headless chat primitives, or an in-app copilot/AG-UI framework based on how deeply the agent interacts with existing application state.

## Library decision matrix

| Tool | Layer | Best fit | Primary trade-off |
|---|---|---|---|
| **Vercel AI SDK UI (v5/v6)** (`@ai-sdk/react`, `ai`) | Streaming transport & typed state hooks (`useChat`, `DefaultChatTransport`) | Custom chat/agent UIs with typed `message.parts`, generative UI tool cards, and full visual ownership | You build thread scrolling, composer ergonomics, and branching yourself (or pair with `assistant-ui`) |
| **assistant-ui** (`@assistant-ui/react`, `@assistant-ui/react-ai-sdk`) | Headless composable AI primitives (`ThreadPrimitive`, `ComposerPrimitive`, `MessagePrimitive`) | Production chat/assistant workspaces needing accessible streaming threads, editing, branching, and tool UIs styled with your tokens | React-focused; requires wiring a runtime adapter (`useChatRuntime`, LangGraph, or custom) |
| **CopilotKit (v2) + AG-UI** (`@copilotkit/react-core/v2`) | In-app agentic copilot SDK over the **AG-UI** event protocol | Embedded copilots that read/mutate app state, render streaming frontend tools, and pause for human-in-the-loop approvals | Higher framework coupling when you only need a standalone chat window |
| **AG-UI Protocol** | Open event-stream protocol (JSON-SSE / WebSocket) | Decoupling frontend agent UIs from backend agent frameworks (LangGraph, Mastra, CrewAI, PydanticAI) | Requires protocol-compliant backend adapter |

## Verified implementation idioms

### Vercel AI SDK v5/v6 (`@ai-sdk/react`)

- In v5/v6, `useChat` uses `transport: new DefaultChatTransport({ api })`, `sendMessage({ text })`, `status` (`'ready' | 'submitted' | 'streaming' | 'error'`), and `stop()` (which aborts the in-flight request). Render `message.parts`—not a legacy flat `message.content` string—so text, reasoning, and tool outputs compose cleanly.
- Always render a visible **Stop** button wired to `stop()` while `status === 'submitted' || status === 'streaming'`.

```tsx
'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function AssistantChat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');
  const isBusy = status === 'submitted' || status === 'streaming';

  return (
    <div>
      {messages.map((m) => (
        <article key={m.id}>
          {m.parts.map((part, i) => {
            if (part.type === 'text') return <p key={i}>{part.text}</p>;
            if (part.type === 'tool-searchDocs' && part.state === 'output-available') {
              return <SearchResultsCard key={i} output={part.output} />;
            }
            return null;
          })}
        </article>
      ))}

      {isBusy && (
        <button type="button" onClick={() => stop()}>
          Stop generating
        </button>
      )}
    </div>
  );
}
```

### assistant-ui (headless primitives over Vercel AI SDK)

- Pair `useChatRuntime()` from `@assistant-ui/react-ai-sdk` with `<AssistantRuntimeProvider>` and headless `ThreadPrimitive`, `ComposerPrimitive`, and `MessagePrimitive.Parts` so you get accessible streaming scroll, message editing, and tool UI slots while owning 100% of the CSS/tokens.

### CopilotKit v2 (`useFrontendTool` & `useHumanInTheLoop`)

- `useFrontendTool` accepts any Standard Schema v1 validator (`Zod`, `Valibot`, `ArkType`) for `parameters`—remember that `args` is **partial** while the model is still streaming the tool call, so guard optional fields in `render`.
- For destructive or high-stakes actions, use `useHumanInTheLoop`: it pauses agent execution across `InProgress` → `Executing` → `Complete` and supplies `respond(...)` during `Executing` (call `respond` once per invocation).

```tsx
import { useHumanInTheLoop } from '@copilotkit/react-core/v2';
import { z } from 'zod';

useHumanInTheLoop({
  name: 'confirmAction',
  description: 'Ask the user to approve a destructive action',
  parameters: z.object({ summary: z.string() }),
  render: ({ args, respond, status }) => {
    if (status !== 'executing' || !respond) return null;
    return (
      <div role="region" aria-label="Action approval">
        <p>{args.summary}</p>
        <button type="button" onClick={() => respond({ approved: true })}>Approve</button>
        <button type="button" onClick={() => respond({ approved: false })}>Deny</button>
      </div>
    );
  },
});
```

## Do/don't pairs

| Do | Don't |
|---|---|
| Render typed `message.parts` and guard `part.state === 'output-available'` in AI SDK v5/v6 | Assume `message.content` is a plain string or render unvalidated partial tool outputs as final |
| Expose a `stop()` abort control whenever `status` is `submitted` or `streaming` | Trap users watching a runaway generation with no cancel button |
| Guard partial `args` while `ToolCallStatus.InProgress` in `useFrontendTool` | Destructure nested properties on streaming `args` without null checks |
| Gate destructive agent actions with `useHumanInTheLoop` and server-side authorization | Auto-execute irreversible mutations from a model tool call |
| Announce stream completion cleanly without spamming `aria-live="assertive"` per token | Put `aria-live="assertive"` on a token-by-token streaming container |

## Verification commands

```sh
npm run build
npx playwright test
```

Verify streaming cancellation (`stop()`), partial-arg rendering, human-in-the-loop approve/deny states, scroll-yield when user scrolls up, and error/retry recovery in a real browser (`rendered`).
