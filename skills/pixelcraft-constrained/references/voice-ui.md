# Voice UI, Realtime Voice AI agents, and platform assistants

Voice is transient, linear, and invisible—users cannot visually scan a menu. Keep turns brief, state explicit, latency bounded, and recovery inexpensive across classic IVR/SSML, 2025–2026 Realtime Voice AI agents, and OS assistant surfaces.

## Conversation model & prompt design

- **Strict turn budget (`<= 3` options, `< 10–12 s` spoken duration)**: working memory collapses on long audio lists—lead with **state/result first**, cap every spoken prompt under **`10–12 seconds`** (~25–30 words), and present **at most `3` options** per turn:
  - Bad: *"Welcome to the Acme productivity assistant. How can I help you today?"*
  - Better: *"Three invoices are ready. Review them, approve urgent, or say a supplier name."*
- Ask one question per turn; preserve conversational context across corrections (*"the second one"* resolves against mentioned/visible candidates).
- Distinguish **no-input** (silence timeout) from **no-match** (recognition/intent miss), ambiguity (*"Acme Corp or Acme Labs?"*), backend failure, and microphone/permission failure.
- Escalate no-input / no-match recovery progressively—never loop the identical prompt:
  1. Targeted reprompt naming valid examples,
  2. Simplified binary yes/no choice,
  3. **Multimodal transcript / visual card fallback** (selectable list or text input),
  4. Warm handoff preserving captured slots.
- Never make voice the sole path for critical functionality unless hardware mandates it.

## Realtime Voice AI & WebRTC voice agents (2025–2026)

Modern speech-to-speech and streaming pipelines (**OpenAI Realtime API**, **Gemini Live API**, **LiveKit Agents**, **Pipecat**, **ElevenLabs Conversational AI**) replace turn-locked IVR trees with low-latency full-duplex audio—creating distinct UX failure modes that must be engineered explicitly:

| Concern | Concrete engineering & UX rule |
|---|---|
| **Transport (WebRTC vs WebSocket)** | Use **WebRTC** (Opus, adaptive jitter buffer, UDP/ICE) between end-user devices and the voice server/edge for low latency and packet-loss resilience; keep raw WebSockets strictly on reliable server-to-model hops. |
| **Acoustic VAD vs semantic turn detection** | Pure acoustic VAD (e.g., Silero energy/speech silence timeout) frequently cuts users off mid-sentence while pausing to think or read a number. Pair acoustic VAD with **semantic end-of-turn (EOT)** detection and tune silence timeouts per task (tight for commands, generous for dictating IDs/addresses). |
| **`< 300 ms` local barge-in cutoff & transcript truncation** | Detect speech onset locally on the client VAD and **halt local speaker output in `< 300 ms`** (never wait for a server round-trip to silence audio!), **AND** send `conversation.item.truncate` with exact played-audio milliseconds so the LLM never assumes the user heard unplayed words. |
| **AEC & mic privacy indicators** | Enable WebRTC/OS Acoustic Echo Cancellation (`echoCancellation: true`, `noiseSuppression: true`, `autoGainControl: true`) so speaker output never self-triggers false barge-in. Display an unmistakable, non-color-only state indicator (`Muted`, `Listening`, `Thinking`, `Speaking`) plus an always-reachable single-tap Mute / End Call control. |
| **Latency masking during tool calls** | When a backend tool call exceeds ~500–800 ms, emit one concise truthful status cue (*"Checking order 4821 now…"*) or subtle non-looping earcon—never leave >1.5 s of dead silence (users assume disconnection and repeat themselves) and never spam synthetic filler chatter. |
| **Irreversible-action read-back confirmation** | Before executing payment, deletion, booking, or external-message tools, perform an **explicit spoken read-back** of the exact entity, amount, and recipient (*"Send $420 to Northwind Supplies—say confirm or cancel"*) or require on-screen tap confirmation. Treat retrieved web/tool text as untrusted data against prompt injection. |

## Platform assistant integrations

### Apple Siri & App Intents
Expose structured app actions natively via **`AppIntent`** and zero-setup natural phrases via **`AppShortcutsProvider`**, returning concise spoken **`IntentDialog`** paired with a glanceable SwiftUI **`ShowsSnippetView`** for multimodal devices:

```swift
import AppIntents
import SwiftUI

struct CheckNextInvoiceIntent: AppIntent {
  static let title: LocalizedStringResource = "Check Next Invoice"

  func perform() async throws -> some IntentResult & ProvidesDialog & ShowsSnippetView {
    let invoice = try await InvoiceStore.shared.nextDue()
    return .result(
      dialog: "Invoice \(invoice.number) for \(invoice.formattedAmount) is due \(invoice.dueLabel).",
      view: InvoiceSnippetView(invoice: invoice)
    )
  }
}

struct InvoiceShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: CheckNextInvoiceIntent(),
      phrases: ["Check my next invoice in \(.applicationName)"],
      shortTitle: "Next Invoice",
      systemImageName: "doc.text"
    )
  }
}
```

### Amazon Alexa / APL / Alexa+
- Pair voice responses with **Alexa Presentation Language (APL)** responsive templates on Echo Show / Fire TV screens while ensuring every primary flow still completes cleanly on screenless Echo speakers.
- For **Alexa+** agentic/LLM-backed skills and actions, publish strict typed tool/action schemas with unambiguous confirmation rules for stateful actions and concise structured outputs the assistant can summarize naturally.

### Google Gemini App Functions (Android)
- Expose typed app capabilities via Android **AppFunctions** (`@AppFunction` / `androidx.appfunctions`) so on-device and Gemini assistants invoke deterministic, permission-scoped app actions directly rather than relying on fragile UI screen scraping.

## SSML basics (classic TTS & telephony)

SSML (W3C Speech Synthesis Markup Language) controls pronunciation, pacing, and data formatting in classic TTS/IVR engines. Validate every tag on the exact target engine—tag support varies widely across Polly, Azure Speech, Google Cloud TTS, and telephony gateways:

```xml
<speak>
  Invoice <say-as interpret-as="characters">INV</say-as>
  <say-as interpret-as="digits">1042</say-as>
  is due <say-as interpret-as="date" format="mdy">03/14/2026</say-as>.
  <break time="300ms"/>
  Say approve or review.
</speak>
```

Use `say-as` for digits/characters/dates/currencies, `break` for breathing rhythm, `sub` for acronym pronunciation, `lang` for inline language switches, and `emphasis`/`phoneme` sparingly.

## Do/don't pairs

| Do | Don't |
|---|---|
| Flush audio AND truncate unplayed assistant text from LLM context on barge-in | Leave interrupted sentences in transcript history causing phantom confirmations |
| Use WebRTC + AEC + semantic EOT turn detection for live voice agents | Rely on raw silence timers over lossy WebSockets that cut users off mid-number |
| Restate concrete parameters and require confirmation for irreversible tool calls | Execute payments, deletes, or emails silently from noisy ASR or tool data |
| Expose native `AppIntent` / `AppShortcutsProvider` / Android `@AppFunction` hooks | Force users through brittle screen-scraping or multi-level IVR menus |
| Emit a brief truthful cue when tool latency exceeds ~600 ms | Leave 3 seconds of dead silence or endlessly loop *"Hold on…"* filler |

## Verification

Test live audio paths on target hardware/networks (`rendered`; label untested acoustics/telephony `not-checked`):
- measure **TTFA** (time to first audio) from end-of-speech under normal and 3G/jittery networks;
- verify **barge-in truncation** (interrupt mid-sentence, then ask *"What did you just say?"*—the agent must only recall words actually played);
- test speakerphone **AEC** (verify agent audio does not trigger false self-interruption), background noise, accents, microphone permission denial, and mute toggle honesty;
- verify irreversible-action confirmations, multimodal screen fallback (APL / Siri snippet / in-app UI), and SSML rendering on the actual speech engine.
