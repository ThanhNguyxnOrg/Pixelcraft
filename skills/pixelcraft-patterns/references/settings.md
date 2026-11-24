# Settings and preferences

Settings are high-trust operational surfaces. Predictability, scope clarity, and safe commit semantics beat visual novelty.

## Organization and scope inheritance

- Group settings by user goal or domain object (Account, Notifications, Security, Workspace), never by backend microservice or database table.
- In multi-level products (**Organization -> Workspace -> User**), expose inheritance explicitly:
  - Label every inherited value ("Inherited from Org default") and highlight local overrides with a one-action `Reset to default`.
  - When a higher-level policy locks a setting, render it read-only with a visible explanation ("Managed by Organization Admin") rather than silently disabling or hiding it.
- Settings search should jump directly to the matching section while preserving its scope breadcrumb and permission state.

## Save models and sticky dirty-save bars

Choose one explicit save model per section and never mix them ambiguously:

| Save model | Best for | Required feedback |
|---|---|---|
| Immediate toggle/auto-commit | Low-risk personal preferences (theme, compact density, mute sound) | Instant applied state + rollback toast on failure; no separate Save button |
| Explicit Save / Discard with sticky dirty bar | Multi-field forms, security/SSO configs, webhook URLs, retention policies | Sticky bottom/top bar showing unsaved change count, `Save changes` and `Discard`, plus unsaved-navigation guard on route leave |
| Staged apply / restart required | System configs requiring reload, worker restart, or re-indexing | Banner explaining pending change and when it takes effect |

## Controls and danger zones

- Match control to choice semantics: radio group for 2–5 mutually exclusive visible choices, select/combobox for larger sets, checkbox for independent booleans, switch/toggle strictly for immediate persistent preferences. Always expose accessible state labels alongside toggles.
- Isolate irreversible actions (delete workspace, revoke all tokens, purge data, transfer ownership) inside a clearly separated **Danger Zone** at the bottom or dedicated sub-tab:
  - State the exact blast radius (e.g., "Permanently deletes 14 projects, 320 files, and revokes 8 API keys").
  - Require **type-to-confirm** matching the concrete resource slug or name (not a generic "Are you sure?" click) plus re-authentication for account/org destruction.

## State matrix

| State | Required behavior |
|---|---|
| Unsaved edits (dirty) | Sticky dirty bar visible; warn before navigating away; allow one-click discard |
| Permission read-only | Show current value clearly with lock reason and who can change it |
| Validation failure | Keep dirty bar active, highlight inline errors, preserve every entered value |
| Concurrent edit conflict | Detect stale version (`ETag`/revision), show conflicting fields, never silently overwrite another admin's save |
| Failed destructive action | Preserve confirmation context, explain partial or full failure, and report audit ID if generated |

## Do/don't pairs

| Do | Don't |
|---|---|
| Show "Inherited from Org" badge + `Reset to default` action | Hide whether a value is global, workspace-wide, or personal |
| Sticky dirty-save bar + leave-page warning for multi-field settings | Silently discard 10 edited fields when the user clicks another tab |
| Type-to-confirm resource name with concrete blast radius in Danger Zone | One-click red Delete button next to Save |
| Confirm actual backend persistence before clearing dirty state | Show "Saved" optimistically and ignore failed writes |

## Verification

Test refresh/back/deep link, dirty-state leave guards, inherited vs overridden values, admin-locked read-only controls, concurrent two-window save conflicts, validation with preserved input, keyboard tab order, focus restoration after save/error, long localized labels, narrow layouts, and danger-zone type-to-confirm enforcement.
