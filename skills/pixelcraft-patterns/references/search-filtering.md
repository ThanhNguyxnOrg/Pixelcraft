# Search and filtering

Search quality is measured by recovery as much as result relevance.

## Query input

- Use a persistent label or accessible name; placeholder is hint only.
- Support paste, clear, keyboard submission, autocomplete/IME composition, and cancellation of stale requests.
- Debounce without hiding that work is pending; preserve typed query through errors/navigation.
- Advanced syntax/filter UI must not expose implementation jargon unless users know it.

## Results

- Show count/scope/time freshness where meaningful; never claim zero means absence when permissions hide data.
- Sorting/filter state must be visible, reversible, shareable where possible, and preserved on back/refresh.
- Empty results diagnose likely cause and offer concrete recovery: remove filter, broaden query, correct spelling, change scope.
- Large results need pagination/virtualization/stable ordering and selection semantics that users understand.

## Faceting/filtering

Show applied filters as removable objects. Avoid cascading dependent dropdowns when direct filters or grouped controls communicate better. Do not hide counts in ways that dead-end users. Explain incompatible combinations.

## Empty-result diagnosis

Classify the cause before writing copy:

| Cause | UI response |
|---|---|
| filters too restrictive | show removable active filters and a one-action clear/loosen path |
| spelling/ambiguous query | suggest correction or broader matching without pretending certainty |
| scope too narrow | offer visible scope change such as folder/project/team/date range |
| permission-hidden data | state that restricted objects may not appear; provide request/sign-in path where appropriate |
| indexing/sync delay | show freshness/pending state and retry; do not claim absence |
| malformed/unsupported query | identify the syntax problem and preserve the typed query |
| system/network failure | distinguish failure from legitimate zero results; provide retry and preserve state |
| collection genuinely empty | teach/create/import the first useful object when that is the correct next action |

Order recovery actions by likelihood and cost. Never use “No results found” as the complete state, never show fake suggested results, and never silently broaden the query/scope in a way that violates user intent.

## Verification

Test no query, no results, one result, thousands, slow network, aborted stale response, malformed query, Unicode/IME/case/diacritic behavior, locale sort expectations, keyboard focus into results, screen-reader status announcements, narrow layout, saved/deep-linked state, permission-hidden objects, indexing lag, filter combinations that mutually exclude, and recovery after clearing only one filter versus all filters.
