# Form frameworks and schema validation

Pair this engineering reference with `pixelcraft-ux` (`forms.md`) for UX rules. Choose a form framework by **rendering model (progressive server actions vs client SPA), framework ecosystem, and field-array/async-validation complexity**.

## Form framework decision matrix

| Library | Frameworks | Validation & schema model | Best fit |
|---|---|---|---|
| **TanStack Form (v1)** | React, Vue, Solid, Svelte, Angular, Lit | Native **Standard Schema** (`Zod v3.24+`, `Valibot`, `ArkType`, `Effect/Schema`) with built-in `onChangeAsyncDebounceMs` | Multi-framework or deeply typed TypeScript apps with nested/async validation |
| **React Hook Form (v7/v8)** | React | `@hookform/resolvers` (`zodResolver`, `valibotResolver`, `yupResolver`, `ajvResolver`) | Client-heavy React forms needing minimal re-renders via uncontrolled `register()` |
| **Conform** | React (Next.js Server Actions, Remix, React Router) | `parseWithZod` / `parseWithValibot` + `getZodConstraint` | Server-first forms requiring progressive enhancement, `FormData`, and auto-wired ARIA (`getFormProps`/`getInputProps`) |
| **VeeValidate (v4)** | Vue 3 | `toTypedSchema(zod/valibot/yup)` + Composition API `useForm` / `defineField` | Vue 3 apps needing typed Composition API bindings and repeatable `useFieldArray` |
| **Formik** | React (legacy) | Yup / custom validate | Maintenance of existing codebases only; prefer TanStack Form, RHF, or Conform for greenfield |

## Schema libraries and Standard Schema

Prefer **Standard Schema** (`standard-schema.dev` v1) compatible validators so form and server layers share one schema without custom glue:

- **Zod (`v3.24+` / `v4`)**: broadest ecosystem support; ideal default when server/client share TypeScript.
- **Valibot**: modular tree-shakeable functions—choose when client bundle size is tight.
- **ArkType**: high-performance TypeScript-syntax runtime validation for dense/complex objects.
- **Ajv**: JSON Schema (Draft 2020-12) compliance when schemas are language-agnostic or contract-driven.
- **Yup**: legacy ecosystems already standardized on it.

## Verified implementation patterns

```tsx
// TanStack Form: sync + debounced async Standard Schema validation
<form.Field
  name="username"
  validators={{
    onChange: z.string().min(3, 'Enter at least 3 characters'),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.string().refine(checkUsernameAvailable, {
      message: 'Username is already taken',
    }),
  }}
>
  {(field) => (
    <>
      <input
        name={field.name}
        value={field.state.value}
        aria-invalid={field.state.meta.errors.length > 0 || undefined}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors[0] && <p role="alert">{field.state.meta.errors[0].message}</p>}
    </>
  )}
</form.Field>
```

```tsx
// React Hook Form: preserve record `id` with `keyName` and never use array `index` as key
const { fields } = useFieldArray({ control, name: 'items', keyName: 'key' });
// Render with key={field.key} (RHF v8 uses `field.key` by default; v7 defaults to `field.id`)
```

```ts
// Conform + Next.js Server Action: single schema validates both client & server
'use server';
export async function saveProfile(_prev: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: profileSchema });
  if (submission.status !== 'success') return submission.reply();
  // persist and redirect or return clean status
}
```

## Multi-step, server errors, and draft recovery

- **Multi-step wizards**: keep one typed parent schema (or per-step sub-schemas merged on final submit); validate only the active step on `Next`, allow stepping backward without losing values, and mirror step progress in URL/state.
- **Server validation errors**: map field-level backend errors back to their exact field (`setError` in RHF, `submission.reply({ fieldErrors })` in Conform) and focus the first invalid field or error summary while preserving every entered value.
- **Async validation**: always debounce (`300–500 ms`), cancel stale in-flight checks (`AbortSignal` / request token), and show pending state without blocking unrelated fields.
- **Autosave & draft recovery**: debounce draft writes to `IndexedDB`/Dexie (or `sessionStorage` for tiny non-sensitive drafts), clear the draft on confirmed submit, and offer explicit `Restore draft` / `Discard` when reloading an unfinished form.

## Do/don't pairs

| Do | Don't |
|---|---|
| Key `useFieldArray` rows by generated `field.key` / `field.id` (`keyName: 'key'` if records have `id`) | Key repeatable form rows by array `index` (corrupts values on delete/reorder) |
| Share one Standard Schema between client form validation and server action/endpoint | Duplicate regexes manually in client inputs and backend handlers |
| Use `defineField` in VeeValidate v4 to bind `aria-invalid` dynamically from field state | Use deprecated `defineComponentBinds` or omit `aria-invalid` / `aria-describedby` |
| Debounce async validators (`300–500 ms`) and ignore stale responses | Fire an API check on every keystroke without debounce or race protection |
