# Narrative systems

Narrative surfaces guide a reader through an ordered argument, process, or dataset (editorial explainers, interactive reports, product walkthroughs, exhibitions). These rules apply across web, native tablet/desktop editorial apps, and interactive document surfaces.

## Story before choreography

Write the complete linear outline before designing pinned visuals or stage transitions. Each chapter must specify:
1. One primary claim or question.
2. Concrete evidence or visual artifact (chart, diagram, photo, specimen, quote).
3. Concise explanatory prose tied directly to the artifact.
4. Transition rationale (what changes between this chapter and the next).
5. Clear orientation and next-step cue.

If the narrative does not hold together as linear text plus static figures, motion choreography will not rescue it.

## Narrative model matrix

| Model | Progression | Best fit | Primary risk |
|---|---|---|---|
| **Artifact + annotations** | One persistent visual (product, diagram, map) with chapter-linked callouts | Architecture explainers, anatomy breakdowns, spatial context | Callouts obscuring key detail on narrow or zoomed viewports |
| **Journey / process** | Origin -> milestones -> outcome | Supply chain, user workflow, place-based reporting | Forcing irrelevant intermediate steps just to fill length |
| **Chronological sequence** | Ordered eras, versions, or timestamps | History, release evolution, incident postmortems | Ambiguous time intervals (linear spacing for uneven gaps) |
| **Before / after** | Baseline condition -> intervention -> measured change | Redesign case studies, impact reports, optimization proofs | Changing scales or crops between baseline and result |
| **Guided exploration** | Reader selects chapters in any order with reset to overview | Portfolios, exhibitions, interactive curricula | Losing track of visited vs unvisited chapters |
| **Data narrative** | Claim -> chart/table -> provenance -> takeaway | Analytical essays, annual reports, investigative pieces | Animating charts in ways that obscure axes, units, or outliers |

## Chapter state contract

Every narrative chapter must model explicit states cleanly across devices:

| State | Required UX behavior |
|---|---|
| **Inactive / upcoming** | Readable in normal document/reading order without hiding text permanently behind opacity traps |
| **Active** | Visual artifact reflects this chapter's exact annotation/state; chapter indicator updates truthfully |
| **Completed / passed** | Reversing scroll or navigating backward cleanly restores prior artifact state |
| **Deep-linked** | Opening a chapter link/anchor lands directly on the chapter prose with its matching visual state synced immediately |
| **Reduced-motion / narrow fallback** | Renders linear chapters with discrete inline static figures—zero hidden content and zero broken pins |

## Structural rules

- Assign every chapter a stable ID, heading, concise label for table-of-contents navigation, source provenance where claims cite data, and direct linkability.
- Never equate scroll depth with comprehension or task completion; provide a visible table of contents, skip-narrative option, and linear path through every piece of evidence.
