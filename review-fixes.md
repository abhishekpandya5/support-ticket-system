# Review Fixes

Tracked fixes from the staff code review (summary in `code-review-notes.md`).

---

## Backend

| ID | Finding | Fix | Status |
|----|---------|-----|--------|
| — | State machine method naming | Renamed public API methods (`isTransitionAllowed`, `changeStatus`, `getAllowedTransitions`) | Done |
| M-12 | User and health endpoints untested | Added `health.users.integration.test.ts` | Done |

---

## Frontend — Critical

| ID | Finding | Fix | Status |
|----|---------|-----|--------|
| F-C-01 | Mutation `onSuccess` overridden by consumer options; cache invalidation never ran | `useTicketMutations.ts` destructures `onSuccess` from options and chains invalidation before the consumer callback (all four mutation hooks) | Done |
| F-C-02 | Inconsistent page folder casing (`pages/Tickets/` vs `pages/tickets/`) | Moved `CreateTicketPage` to `pages/tickets/CreateTicketPage.tsx`; router import updated | Done |

---

## Frontend — Major

| ID | Finding | Fix | Status |
|----|---------|-----|--------|
| F-M-01 | Create vs edit validation diverged; duplicated Zod definitions | Extracted shared field builders in `schemas/ticketFields.ts`; create/edit schemas compose from shared fields. **Validation rules unchanged** (create still stricter than edit) | Done (partial — backend alignment deferred) |
| F-M-02 | `isFetching` drove full loading UI (skeleton flash on refetch) | Added `useQueryPageState`; dashboard and list pages use `isInitialLoading` (`isLoading` only) for skeletons and filter disable | Done |
| F-M-03 | No `keepPreviousData` on filtered ticket list | `useTickets` uses `placeholderData: keepPreviousData` | Done |
| F-M-04 | Dashboard aggregates client-side from full ticket list | — | Pending (requires backend aggregation endpoint) |
| F-M-05 | Duplicated create/edit form UIs | Consolidated under `components/tickets/forms/` with shared `PriorityField`, `AssignedUserField`, `FormActions`, `FormApiError`; removed `components/ticket/` | Done |
| F-M-06 | Acting-as half-implemented and inconsistent | Added `ActingAsSelector` in app header, `useActingAsUser` with `localStorage`, acting-as `createdBy` on creates/comments | Done |
| F-M-07 | TypeScript `strict` mode not enabled | Enabled `strict: true` in `tsconfig.app.json` | Done |
| F-M-08 | Zero frontend tests | Added Vitest, `vitest.config.ts`, `npm test` script; unit tests for `ticketListFilters`, `filterSelect`, `actingAs`, ticket schemas | Done |
| F-M-09 | No router error boundary | Added `RouteErrorBoundary` and `errorElement` on router | Done |
| F-M-10 | Router bypassed `ROUTES` for dynamic paths | Added `ROUTE_PATTERNS` in `paths.ts`; router uses `ROUTE_PATTERNS.ticketDetail` / `ROUTE_PATTERNS.ticketEdit` | Done |

---

## Frontend — Minor

| ID | Finding | Fix | Status |
|----|---------|-----|--------|
| F-N-01 | `ticket` vs `tickets` component folders | Merged into `components/tickets/forms/`; removed `components/ticket/` | Done |
| F-N-02 | `TicketList` pass-through component | Removed; `TicketListPage` renders `TicketTable` directly | Done |
| F-N-03 | Inconsistent hook import paths | `CreateTicketPage` and `StatusFeedbackBanner` use barrel exports from `hooks/tickets` | Done |
| F-N-04 | Duplicated enum/constants (`TICKET_STATUSES`, `PRIORITIES`) | `statusErrors.ts` imports `TICKET_STATUSES` from `ticketListFilters.ts`; schemas use `ticketFields.ts` with `TICKET_PRIORITIES` | Done |
| F-N-05 | Unsafe select value casts in filters | Added `parseStatusFilterValue` / `parsePriorityFilterValue` in `utils/filterSelect.ts` | Done |
| F-N-06 | `TextLink` `to` prop untyped | `to` prop typed as `AppRoutePath \| string` | Done |
| F-N-07 | Inconsistent form ownership patterns | Create uses `useCreateTicketForm`; edit/comment keep in-component `useForm` (intentional — no over-abstraction) | Deferred |
| F-N-08 | Redundant Zod `.min(1)` before `.min(5)` on create title | Removed dead constraint; create title uses `.min(5)` only via `createTicketTitleField` | Done |
| F-N-09 | `userKeys` not colocated with tickets key pattern | Extracted to `hooks/users/keys.ts` | Done |
| F-N-10 | Parallel Tailwind color systems | — | Pending |
| F-N-11 | Mobile menu lacks focus trap / Escape | — | Pending |
| F-N-12 | Heading hierarchy skips levels on detail page | — | Pending |
| F-N-13 | `StatusFeedbackBanner` success may not be announced | — | Pending |
| F-N-14 | `mutationState` naming overlap | — | Pending |
| F-N-15 | `CommentForm` couples data fetching to presentation | — | Pending |
| F-N-16 | `sortCommentsChronologically` runs every render | Memoized with `useMemo` in `CommentList` | Done |

---

## Frontend — Suggestions (not addressed)

| ID | Finding | Status |
|----|---------|--------|
| F-S-01 | Shared page loading boundary (`QueryBoundary`) | Deferred |
| F-S-02 | Shared select primitives for filters | Partial — form selects consolidated; filter selects unchanged |
| F-S-03 | Optimistic updates for mutations | Deferred |
| F-S-04 | React Query Devtools in development | Deferred |
| F-S-05 | Prefetch on navigation hover | Deferred |
| F-S-06 | `clsx` / `cn` utility | Deferred |
| F-S-07 | Design tokens / theme layer | Deferred |
| F-S-08 | Remove or implement `getUser()` API | Deferred |
| F-S-09 | Responsive table column mobile alternative | Deferred |

---

## New files (frontend refactor)

| File | Purpose |
|------|---------|
| `schemas/ticketFields.ts` | Shared Zod field builders |
| `utils/filterSelect.ts` | Safe filter select value parsing |
| `utils/actingAsMessages.ts` | Acting-as warning messages |
| `hooks/useQueryPageState.ts` | Initial load vs background refresh |
| `hooks/users/keys.ts` | User query key factory |
| `hooks/users/useActingAsUser.ts` | Acting-as user hook |
| `components/tickets/forms/PriorityField.tsx` | Shared priority select field |
| `components/tickets/forms/AssignedUserField.tsx` | Shared assigned-user select field |
| `components/tickets/forms/FormActions.tsx` | Shared submit/cancel buttons |
| `components/tickets/forms/FormApiError.tsx` | Shared API error display |
| `components/tickets/forms/CreateTicketForm.tsx` | Create ticket form (moved from `components/ticket/`) |
| `components/common/RouteErrorBoundary.tsx` | Router error boundary |
| `src/utils/actingAs.test.ts` | Acting-as unit tests |
| `src/utils/ticketListFilters.test.ts` | Filter URL sync unit tests |
| `src/utils/filterSelect.test.ts` | Filter select parser tests |
| `src/schemas/ticketSchemas.test.ts` | Schema validation unit tests |
| `vitest.config.ts` | Vitest configuration |

---

## Removed files (frontend refactor)

- `components/ticket/` (entire folder)
- `components/tickets/TicketList.tsx`
- `pages/Tickets/CreateTicketPage.tsx`

---

## Pending (project-wide)

- [ ] F-M-04 — Server-side dashboard aggregation / pagination
- [ ] F-M-01 — Align create form validation with backend (behavior change — needs product decision)
- [ ] F-M-06 — Acting-as selector UI (write `localStorage`, use for comments)
- [ ] F-N-10 through F-N-15 — Minor hygiene items
- [ ] F-S-01 through F-S-09 — Suggestions
- [ ] Backend C-01/C-02 — Atomic status updates, DB-level transition guard
- [ ] Backend M-01 through M-12 — See `code-review-notes.md`
- [ ] Integration tests (`test-strategy.md`)
- [ ] Complete `candidate-info.md`
