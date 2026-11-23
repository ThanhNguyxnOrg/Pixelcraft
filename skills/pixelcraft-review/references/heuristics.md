# Nielsen heuristics as concrete checks

Use 0–4 severity/confidence-aware scoring only as a communication aid; do not average away a P0.

| Heuristic | Concrete checks |
|---|---|
| visibility of system status | immediate input acknowledgment; progress truthfulness; sync/save/upload state; background completion; stale/offline indication |
| match system and real world | domain vocabulary, ordering, units, symbols, cultural fit; no implementation jargon |
| user control/freedom | undo/cancel/escape/back; reversible defaults; no trapped modal/navigation; interruption recovery |
| consistency/standards | same action/name/icon/component behavior; platform back/gesture/shortcut conventions |
| error prevention | constraints, forgiving input, destructive friction proportional to cost, defaults/autocomplete |
| recognition rather than recall | visible options/context; persistent labels; recent/saved items; no hidden command dependency |
| flexibility/efficiency | keyboard shortcuts, bulk actions, filters, expert acceleration without harming novice path |
| minimalist design | every element supports task/meaning; no duplicate decoration/noise competing with content |
| recognize/diagnose/recover errors | plain-language problem, preserved data, exact corrective action, no blame/raw exception |
| help/documentation | contextual help where needed, searchable/recoverable, consistent location; no documentation as substitute for broken UX |

Translate each heuristic into observable evidence. “System is inconsistent” is not a finding; “the same archive action is labeled Archive in list but Remove in detail at file:line” is.
