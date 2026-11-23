# UX laws as operational checks

Evidence: established UX laws, usability heuristics, and response-time limits.

| Principle | Operational check | Misuse to avoid |
|---|---|---|
| Hick | reduce simultaneous choices; group/progressively disclose genuinely secondary options | hiding critical controls behind mystery disclosure |
| Fitts | size/spacing/position match frequency and input precision; edge/corner value depends on platform | scaling web pixel rules blindly to pt/dp/controller |
| Jakob | use familiar platform/domain conventions unless differentiation is worth learning cost | copying patterns across OS/input modalities |
| Doherty | preserve momentum around ~400ms feedback/work cycles where possible | artificial speed that sacrifices correctness or truth |
| recognition over recall | visible options, autocomplete, recent/saved context, meaningful labels | exposing every option at once |
| progressive disclosure | reveal detail as confidence/need increases | nested menus/modals that lose context |
| smart defaults | choose reversible likely value and make it visible | dark-pattern defaults or hidden consent |
| chunking/grouping | group by meaning/proximity; use whitespace/hierarchy | arbitrary visual cards for unrelated controls |
| peak-end | make critical completion/recovery clear and humane | optimizing only visual first impression |
| aesthetic-usability | polish can increase perceived usability but cannot compensate for failed tasks | using delight to excuse floor violations |

Use laws to generate hypotheses and tradeoff questions, not as pseudo-mathematical proof. Validate with the state matrix, real content, platform conventions, and evidence-labeled review.
