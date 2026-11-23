# Basic voice UI

Voice is transient, linear, and invisible. Users cannot scan a menu. Keep turns short, state explicit, and recovery inexpensive.

## Conversation model

- state the available action in concrete language instead of asking “What would you like?” without context;
- ask one question per turn;
- use confirmations only for high-impact, irreversible, ambiguous, or privacy-sensitive actions; excessive confirmation trains dismissal;
- distinguish recognition failure (“I didn’t hear you”), understanding failure (“I don’t know which file”), backend failure, and permission failure;
- preserve context across a correction: “the second one” must resolve against visible/mentioned candidates;
- allow barge-in/cancel/repeat/help where platform supports it;
- never make voice the only path for critical functionality unless the platform itself guarantees it.

## Prompt design

Bad prompt: “Welcome to the Acme productivity assistant. How can I help you today?”

Better prompt: “Three invoices are ready. Review them, or say a supplier name.”

Rules:

- lead with state/result before options;
- name at most two or three likely actions;
- use examples only when the command grammar is unpredictable;
- avoid literal repetition after failure; progressively simplify or switch modality;
- speak numbers/dates/units unambiguously;
- localize grammar, honorifics, numerals, dates, and interruption conventions rather than translating word-for-word.

## Error recovery

Escalate in this order:

1. targeted reprompt with missing slot (“Which invoice—Acme or Northwind?”);
2. simplified choices or yes/no confirmation;
3. multimodal fallback (show list/type selection);
4. graceful handoff/end state preserving progress.

Never loop the same prompt. Never blame the user. Log confidence/intent/slots for debugging without recording sensitive audio unnecessarily.

## SSML basics

SSML is an XML vocabulary for speech synthesis control standardized by the W3C. Common tags include:

```xml
<speak>
  Invoice <say-as interpret-as="characters">INV</say-as>
  <say-as interpret-as="digits">1042</say-as>
  is due <say-as interpret-as="date" format="mdy">03/14/2026</say-as>.
  <break time="300ms"/>
  Say approve or review.
</speak>
```

Use `say-as` for dates/digits/characters/telephone formats, `break` for rhythm, `emphasis` sparingly, `sub` for pronunciation substitution, `phoneme` only when necessary, and `lang` for language changes. Actual tag support depends on the speech engine/platform—validate output rather than assuming SSML portability.

## Verification

- test noisy/quiet environments, accents, microphone denial, network loss, partial utterance, interruption, and timeout;
- inspect transcripts/recognition confidence where available;
- test screen readers/visual fallback and privacy behavior;
- measure latency from end-of-speech to useful response;
- validate SSML on the target engine, not merely schema correctness.
