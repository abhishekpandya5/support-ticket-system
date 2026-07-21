# Code Review Notes

> **Remediation note (2026-07-20):** Frontend findings F-C-01, F-C-02, and most F-M / F-N items were addressed. See [`review-fixes.md`](review-fixes.md). The frontend section below reflects the pre-remediation review snapshot.

**Reviewer role:** Senior Staff Engineer (PR review)  
**Scope:** Entire `server/src` implementation + `server/tests`  
**Date:** 2026-07-19  
**Verdict:** **Approve with comments** — solid layered MVP with strong error/validation foundations; address concurrency, validation duplication, and scalability gaps before production or high-volume use.

---

## Executive Summary

The backend follows a conventional **routes → controllers → services → repositories → models** architecture with a **pure state machine** module, **Zod validation at the HTTP boundary**, and a **consistent API error envelope**. Constructor injection with default singletons supports testability without a DI framework.

Core ticket workflows (CRUD, status transitions, comments, search/filter) are implemented coherently. Integration tests (21 cases, Vitest + Supertest + `mongodb-memory-server`) cover the state machine and primary API paths.

Main concerns for a staff-level review: **non-atomic status updates** (race risk), **triple validation** (Zod + service + Mongoose) creating drift, **no pagination** on list endpoints, **repository pattern without contracts**, and **inconsistent 404/error handling** across layers. Authentication is absent by Core-tier design (`requirements-analysis.md` A-02); client-supplied `createdBy` is an accepted trade-off for the assessment but must not ship to production unchanged.

---

## Strengths

| Area | Observation |
|------|-------------|
| **Architecture** | Clear layer boundaries; business logic concentrated in services, not routes. |
| **State machine** | Pure `TicketStateMachine` with explicit transition table; enforced via dedicated `PATCH /:id/status` endpoint; status blocked on field-update route (`forbiddenFields` + service guard). |
| **Error handling** | Central `errorHandler` + `mapErrorToResponse`; stable `{ requestId, error: { code, message, details? } }` envelope; sensible mapping for Zod, Mongoose, and domain errors. |
| **Validation** | Zod schemas with ObjectId refinement, enum constraints, and field-length limits; `escapeRegex` on search mitigates regex injection. |
| **MongoDB modeling** | Sensible schemas, refs, compound comment index (`ticketId + createdAt`), status/assignee indexes on tickets, unique email on users. |
| **TypeScript** | Strict mode; no `any` in `server/src`; `satisfies` on enum arrays; Mongoose `InferSchemaType` for model types. |
| **Testing** | Isolated integration suite with per-test DB reset; state transition matrix exercised end-to-end. |
| **Ops** | Graceful shutdown in `index.ts`; health endpoint with DB check; env validated via Zod in `config/env.ts`. |

---

## Findings by Severity

### Critical

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| C-01 | State machine | **Status changes are non-atomic (read-modify-write).** `changeStatus` loads the document, mutates `ticket.status` in memory, then `save()`. Concurrent requests can race; last write wins and may skip intermediate states or overwrite a concurrent valid transition without detection. | `services/TicketService.ts` (`changeStatus`, ~L223–244) |
| C-02 | State machine | **No DB-level guard on status transitions.** Any code path calling `ticketRepository.save()` or a future direct `findByIdAndUpdate` with `status` could bypass the state machine. Only convention protects integrity today. | `repositories/TicketRepository.ts` (`save` is public); no Mongoose pre-save hook |

> **Scope note:** C-02 is mitigated for the current codebase because only `TicketService.changeStatus` calls `save()`, and field updates exclude `status` at the type and route level. Risk is **latent** — becomes Critical if new code paths are added without discipline.

---

### Major

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| M-01 | Security | **Client-controlled identity (`createdBy`).** Ticket and comment creation accept `createdBy` from the request body with no server-side binding to an authenticated principal. Acceptable for Core “acting-as” UI pattern per requirements, but enables impersonation on any exposed API. Must be replaced with server-derived identity before production. | `TicketController.create`, `CommentController.create`; `requirements-analysis.md` A-02 |
| M-02 | Scalability | **No pagination on list endpoints.** `GET /api/tickets` and `GET /api/users` return full collections. Unbounded memory and response size as data grows. | `TicketService.listTickets`, `UserService.listUsers`, repositories `findMany`/`findAll` |
| M-03 | Scalability | **Regex search without text index.** `$regex` on `title`/`description` will collection-scan at scale. | `TicketService.buildListFilter` |
| M-04 | Validation | **Triple validation (Zod → service → Mongoose)** with overlapping rules. Examples: create ticket title/description/priority checked in Zod and `collectCreateFieldErrors`; list `status` validated in Zod and `buildListFilter`; update “at least one field” in Zod `.refine()` and service `_form` check. Increases drift risk when rules change. | `validators/tickets/schemas.ts`, `TicketService.ts` |
| M-05 | TypeScript | **Validated request data not reflected in types.** Controllers cast `req.body as CreateTicketInput` instead of using `z.infer<typeof createTicketSchema>`. Zod-validated shapes and service input types are parallel, not linked. | All controllers |
| M-06 | Separation of concerns | **404 handling inconsistent across layers.** `TicketService` throws `notFoundError`; `UserController.getById` checks null and throws in the controller. Same concern handled at different layers. | `UserController.ts` vs `TicketService.ts` |
| M-07 | Error handling | **`serializeUserSummary` throws plain `Error`.** Unpopulated refs surface as **500 Internal Server Error** instead of a controlled 500/serialization guard with logging context. | `utils/serializers.ts` (~L49–52) |
| M-08 | Repository pattern | **Repositories are concrete classes without interfaces.** Constructor injection works, but there is no contract boundary; tests rely on duck typing. `CreateTicketInput` is **defined twice** with different shapes (service vs repository). | `TicketService.ts` vs `TicketRepository.ts` |
| M-09 | Controllers | **`TicketController.list` ignores Zod-parsed query.** Route uses `validateQuery(listTicketsQuerySchema)`, but controller manually rebuilds query via `queryParam()` instead of reading validated `req.query`. Redundant and bypasses the benefit of middleware parsing. | `TicketController.ts` (~L23–35) |
| M-10 | Controllers | **`TicketController.update` copies `status` into input** even though the route forbids it. Dead path if middleware works, but confusing and risky if middleware order changes. | `TicketController.ts` (~L94–96); route `forbiddenFields: ['status']` |
| M-11 | Testing | **No unit tests for pure domain logic.** `TicketStateMachine` and transition table are only covered via HTTP integration tests. A dedicated unit suite would give faster feedback and clearer failure isolation. | `tests/unit/index.ts` is empty |
| M-12 | Testing | **User and health endpoints untested.** Integration suite covers tickets/comments only. | `tests/integration/tickets.integration.test.ts` |

---

### Minor

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| N-01 | Architecture | **Incomplete domain-folder migration.** Flat `*Controller.ts` / `*Service.ts` files coexist with empty stub barrels (`controllers/tickets/index.ts`, `services/tickets/index.ts`, etc. exporting `{}`). Confusing navigation. | `server/src/controllers/*/index.ts`, `services/*/index.ts`, `repositories/*/index.ts` |
| N-02 | Code duplication | **`assertValidObjectId` duplicated** identically in `TicketService`, `UserService`, and `CommentService`. | Private 4-line methods in each service |
| N-03 | Code duplication | **`USER_SUMMARY_FIELDS` constant duplicated** in `TicketRepository` and `CommentRepository`. | Both repository files |
| N-04 | Code duplication | **`ListTicketsQuery` type duplicated** — manual type in `TicketService` vs `z.infer` in `validators/shared.ts`. | `TicketService.ts`, `validators/shared.ts` |
| N-05 | Dead code | **`registerDatabaseShutdownHandlers()` unused.** Shutdown is handled in `index.ts`; database module exports an alternate handler that is never called. | `config/database.ts` (~L136–167) |
| N-06 | Dead code | **`InvalidTransitionError` branch in `mapErrorToResponse` is unreachable** for HTTP responses — `TicketService` always wraps to `AppError` first. | `utils/errorResponse.ts` (~L141–149) |
| N-07 | Dead code | **`CreateTicketInput.status?` on service type is unused** — create always forces `TICKET_STATUS.OPEN`. | `TicketService.ts` (~L49, ~L106) |
| N-08 | Error handling | **`notFoundHandler` bypasses `errorHandler`.** Same envelope shape, but separate code path; future error-format changes must be updated in two places. | `middleware/notFoundHandler.ts` |
| N-09 | MongoDB | **Mongoose deprecation:** `findByIdAndUpdate(..., { new: true })` triggers deprecation warning; should use `returnDocument: 'after'`. | `TicketRepository.ts` (~L68, ~L77) |
| N-10 | Data model | **`User.role` stored but never enforced** in services or routes. Documented as future Stretch concern; currently inert data. | `models/User.ts`; no role checks in services |
| N-11 | Naming | **Repository type `CreateTicketInput` collides with service type name** but represents a different shape (ObjectId refs vs string IDs). | `TicketRepository.ts` vs `TicketService.ts` |

---

### Suggestion

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| S-01 | Security | Add `helmet` for standard security headers in production. | `app.ts` |
| S-02 | Security | Add rate limiting on write endpoints before external exposure. | N/A |
| S-03 | Security | Allow `x-request-id` in CORS `allowedHeaders` if clients need to correlate requests cross-origin. | `middleware/cors.ts` (`allowedHeaders: ['Content-Type']` only) |
| S-04 | Security | Validate format/length of inbound `x-request-id` to avoid log injection or oversized headers. | `middleware/requestId.ts` |
| S-05 | Maintainability | Introduce `req.validated` (or similar) typed bag populated by Zod middleware to eliminate body/query casts. | `middleware/validate.ts`, controllers |
| S-06 | Maintainability | Collapse validation to **Zod at boundary + Mongoose as safety net**; remove redundant service-layer re-validation except for cross-entity rules (user existence). | Services |
| S-07 | State machine | Consider atomic status update: `findOneAndUpdate({ _id, status: current }, { $set: { status: next } })` with transition check in service, or optimistic locking (`__v`). | `TicketService.changeStatus` |
| S-08 | State machine | Add Mongoose `pre('save')` hook on Ticket that rejects direct `status` mutation outside allowed transitions (defense in depth). | `models/Ticket.ts` |
| S-09 | Scalability | Add cursor/page-based pagination and sort contract to list endpoints. | Ticket/User list APIs |
| S-10 | Scalability | Add text index on `tickets.title` + `tickets.description` or migrate search to Atlas Search / dedicated index strategy. | `models/Ticket.ts` |
| S-11 | Repository | Extract `IUserRepository` / `ITicketRepository` interfaces; unify DTO types (`CreateTicketDto`) shared between service and repository. | Repository layer |
| S-12 | Testing | Add unit tests for `TicketStateMachine` (all valid/invalid transitions, same-status rejection, unknown status). | `tests/unit/` |
| S-13 | Testing | Add integration tests for `GET /api/users` and `/health`. | `tests/integration/` |
| S-14 | Ops | Document `npm test` requirement (Node 20+) in root `README.md` — Vitest 4 / Mongoose 9 require modern Node. | `README.md` |

---

## Review by Dimension

### Architecture

Layered monolith is appropriate for Core scope. Request flow is predictable:

```
requestId → CORS → JSON parser → route + Zod → controller → service → repository → Mongoose
→ notFoundHandler → errorHandler
```

**Concern:** Empty domain subfolder stubs suggest an unfinished refactor. Pick one layout (flat files or domain folders) and remove the other.

### SOLID Principles

| Principle | Assessment |
|-----------|------------|
| **S** (Single responsibility) | Good — state machine is pure; serializers separate; repositories are data-only. `TicketService` is large but cohesive. |
| **O** (Open/closed) | State machine accepts injected transition map — extensible. Services are concrete, not easily extended without modification. |
| **L** (Liskov) | N/A — no inheritance hierarchy. |
| **I** (Interface segregation) | Weak — no repository interfaces; services depend on concrete repos. |
| **D** (Dependency inversion) | Partial — constructor injection with defaults enables testing, but high-level modules depend on low-level Mongoose documents, not abstractions. |

### Separation of Concerns

| Layer | Responsibility | Adherence |
|-------|----------------|-----------|
| Routes | HTTP mapping + validation attachment | ✅ |
| Controllers | HTTP I/O, serialization | ⚠️ Some manual body shaping; inconsistent 404 |
| Services | Business rules, orchestration | ✅ Primary logic home |
| Repositories | Persistence | ✅ No business rules |
| State machine | Transition rules only | ✅ Excellent isolation |

### Controller Responsibilities

Controllers are mostly thin. Issues: redundant query parsing (`TicketController.list`), manual field copying that mirrors Zod schemas, and `UserController` owning 404 logic that `TicketController` delegates to the service.

### Service Responsibilities

Services own validation of cross-entity rules (user existence), state transitions, and search/filter construction. Appropriate. Service-layer re-validation of fields already checked by Zod is the main maintainability concern.

### Repository Pattern

Repositories wrap Mongoose with populate conventions. **Pattern is pragmatic, not classical:** no interfaces, no mapping to domain entities, returns hydrated documents. `save()` on `TicketRepository` is a bypass vector for status if misused.

### Error Handling

Strong overall. Error codes are stable and documented. Gaps: dual 404 paths (`notFoundHandler` vs `errorHandler`), serializer throwing generic `Error`, and dead `InvalidTransitionError` mapping branch.

### Validation

Zod middleware is well-structured (`validateBody`, `validateParams`, `validateQuery`, `forbiddenFields`). Express 5 query immutability handled via in-place merge in `validate.ts`. Service and Mongoose layers duplicate enum and length checks.

### State Machine

Authoritative transition table in `stateMachine/transitions.ts`. Public API (`isTransitionAllowed`, `changeStatus`, `getAllowedTransitions`) is clean. Same-status transitions correctly rejected. Enforcement is **single-point** (service) — adequate for MVP, insufficient for defense-in-depth without atomic updates or DB hooks.

### MongoDB Modeling

Three collections with appropriate refs and indexes. Comment compound index supports chronological fetch. Missing text/search index. No soft-delete or audit trail (acceptable for Core).

### Naming Conventions

Generally consistent: `*Controller`, `*Service`, `*Repository`, `camelCase` methods, `SCREAMING_SNAKE` enums. **Exception:** duplicate `CreateTicketInput` name across layers with different semantics.

### Code Duplication

See findings N-02 through N-04. Validation duplication (M-04) is the highest-impact form.

### TypeScript Usage

Strong — strict, no `any`, good enum typing. Main gap is the disconnect between Zod-inferred types and service/controller types (M-05).

### Security

| Control | Status |
|---------|--------|
| Input validation | ✅ Strong (Zod + Mongoose) |
| Regex injection | ✅ `escapeRegex` used |
| AuthN / AuthZ | ❌ Absent (Core by design) |
| CORS | ✅ Configurable; restrictive in prod default |
| Rate limiting | ❌ |
| Security headers | ❌ No helmet |
| IDOR | ⚠️ All resources accessible by ID |
| Body size limit | ✅ 1 MB |

### Scalability

Stateless API — horizontally scalable. Bottlenecks: unbounded list responses, unindexed regex search, non-atomic status updates under concurrency.

### Maintainability

Good documentation in JSDoc on key modules. Error envelope and enum centralization aid consistency. Risks: validation drift, duplicate types, incomplete folder structure, and latent state-machine bypass via `save()`.

---

## Test Coverage Assessment

| Area | Covered | Gap |
|------|---------|-----|
| Ticket CRUD | ✅ Integration | — |
| State transitions (valid + invalid) | ✅ Integration | — |
| Comments | ✅ Integration | — |
| Search / status filter | ✅ Integration | — |
| Validation failures | ✅ Integration | — |
| Invalid ObjectIds | ✅ Integration | — |
| State machine (unit) | ❌ | S-12 |
| User endpoints | ❌ | M-12 |
| Health endpoint | ❌ | S-13 |
| Concurrent status change | ❌ | C-01 |

---

## Prior Review Follow-Up

| Date | Prior finding | Status |
|------|---------------|--------|
| 2026-07-12 | State machine public API: `isTransitionAllowed()`, `changeStatus()`, `getAllowedTransitions()` | ✅ **Resolved** — implemented in `TicketStateMachine.ts` |

---

## Changes Made After Review

| Date | Area | Change |
|------|------|--------|
| 2026-07-12 | TicketStateMachine | Method rename per service contract |
| 2026-07-18 | validate middleware | Express 5 query merge fix (in-place) — unblocks search/filter |
| 2026-07-18 | Integration tests | 21 Vitest + Supertest tests added |

---

## Suggestions Rejected (and why)

| Suggestion | Reason |
|------------|--------|
| *(none yet)* | — |

---

## Recommended Merge Blockers vs Follow-Ups

**Before production / Stretch:**

1. C-01 — Atomic status updates or optimistic locking
2. M-01 — Server-derived user identity (replace client `createdBy`)
3. M-02 — Pagination on list endpoints
4. M-04 / S-06 — Consolidate validation layers

**Acceptable for Core merge (document as known debt):**

- M-01 (acting-as pattern per requirements)
- M-10, N-01, N-05, N-06 (code hygiene)
- S-01 through S-04 (hardening)

---

*This review covers `server/src` and `server/tests` as of 2026-07-19. No application code was modified during this review.*

---

# Frontend Code Review Notes

**Reviewer role:** Senior Staff Frontend Engineer (PR review)  
**Scope:** Entire `client/src` implementation  
**Date:** 2026-07-20  
**Verdict:** **Request changes** — solid layered MVP with strong API/hook foundations and intentional a11y work; fix mutation cache invalidation and path casing before merge; address schema drift and loading UX immediately after.

---

## Executive Summary

The frontend follows a clear **api → hooks → pages → components** architecture with lazy-loaded routes, a centralized Axios client, React Query wrappers, React Hook Form + Zod validation, and thoughtful shared primitives (`FormField`, `Button`, `Table`, `SkipLink`).

Core flows (ticket list with URL-synced filters, dashboard, create/edit, detail with status workflow and comments) are implemented coherently. URL-synced filters with debounced search and shared error normalization (`ApiError`) are production-quality patterns.

Main concerns: **mutation `onSuccess` composition likely breaks cache invalidation**, **create vs edit validation diverges from each other and the backend**, **inconsistent page folder casing**, **no frontend tests**, and **loading UI tied to `isFetching`** causing unnecessary skeleton flashes. Authentication/acting-as is half-implemented by design for Core tier but creates attribution risk for comments.

---

## Strengths

| Area | Observation |
|------|-------------|
| **Architecture** | Clean bootstrap (`main.tsx` → `QueryProvider` → `App` → `RouterProvider`); thin pages; domain logic in `utils/`. |
| **React Query** | Hierarchical query keys (`keys.ts`), dedicated invalidation helpers (`invalidation.ts`), smart retry in `queryClient.ts`. |
| **Forms** | Zod schemas in `schemas/`; `FormField` + `getFieldErrorProps` wires a11y attributes; API field errors merged with Zod errors. |
| **API layer** | Typed client, `ApiError` with `fieldErrors` extraction, thin resource modules. |
| **Accessibility** | `SkipLink`, table captions/`scope`, decorative spinner mode, landmark structure, filter/form label associations. |
| **Tailwind** | Cohesive slate palette, responsive layouts, shared class constants (`formInputClassName`, `getButtonClassName`). |
| **Routing** | Route constants in `paths.ts`; lazy loading via `lazyRoute.tsx`. |

---

## Findings by Severity

### Critical

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| F-C-01 | React Query | **Mutation `onSuccess` is overridden by consumer options.** All four mutation hooks define `onSuccess` with cache invalidation, then spread `...options` after it. When callers pass `onSuccess` (and they do), the spread replaces the hook's handler entirely. | `hooks/tickets/useTicketMutations.ts` (all 4 hooks); consumers: `useCreateTicketForm.ts`, `EditTicketPage.tsx`, `CommentForm.tsx`, `useTicketStatusWorkflow.ts` |
| F-C-02 | Architecture | **Inconsistent page folder casing.** Create page lives under `pages/Tickets/` while other ticket pages use `pages/tickets/`. Router imports from capitalized path. | `routes/router.tsx:10`, `pages/Tickets/CreateTicketPage.tsx` vs `pages/tickets/*` |

> **Verify F-C-01:** Create a ticket → navigate to list without refocusing window → confirm whether new ticket appears immediately (likely won't within 30s `staleTime` window).

---

### Major

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| F-M-01 | React Hook Form | **Create vs edit validation diverges from each other and backend.** Create: title max 100/min 5, description min 10, `assignedTo` required. Edit: title max 200/min 1, description max 5000, `assignedTo` optional. Backend create: title max 200, description max 5000, `assignedTo` optional. | `schemas/createTicketFormSchema.ts`, `schemas/ticketFormSchema.ts`, `server/validators/tickets/schemas.ts` |
| F-M-02 | React Query / Performance | **`isFetching` drives full loading UI.** `isLoading \|\| isFetching` shows skeletons and disables filters on background refetches. | `pages/tickets/TicketListPage.tsx:29`, `pages/DashboardPage.tsx:21` |
| F-M-03 | React Query | **No `placeholderData` / `keepPreviousData` on filtered list.** Filter changes create new query keys; table disappears on every change. | `pages/tickets/TicketListPage.tsx`, `hooks/tickets/useTicketQueries.ts` |
| F-M-04 | Architecture / Performance | **Dashboard aggregates client-side from full ticket list.** No server-side aggregation or pagination strategy. | `pages/DashboardPage.tsx`, `utils/dashboard.ts` |
| F-M-05 | Component structure | **Duplicated form UIs with different contracts.** Create (`CreateTicketForm`, `PrioritySelect`, `AssignedUserSelect`) vs edit (`TicketForm`) duplicate fields with different schemas, IDs, and required semantics. | `components/ticket/`, `components/tickets/TicketForm.tsx` |
| F-M-06 | Architecture | **Acting-as user is half-implemented and inconsistent.** Reads `localStorage` key `actingAsUserId` but nothing writes it; falls back to `users[0]`. Create uses `getActingAsUserId`; comment form uses `ticket.createdBy.id`. | `utils/actingAs.ts`, `useCreateTicketForm.ts`, `TicketDetailPage.tsx:94` |
| F-M-07 | TypeScript | **`strict` mode not enabled.** No `strict`, `noImplicitAny`, or `strictNullChecks` in `tsconfig.app.json`. | `tsconfig.app.json` |
| F-M-08 | Maintainability | **Zero frontend tests.** No test script in `package.json`; no `*.test.ts` or `*.spec.ts` files. High-risk areas (filter URL sync, schemas, mutation invalidation, `actingAs`) untested. | `client/package.json`, `client/src/` |
| F-M-09 | Architecture | **No router error boundary.** No `errorElement` or React error boundary; unhandled render errors white-screen the app. | `routes/router.tsx`, `App.tsx` |
| F-M-10 | Architecture / Naming | **Router bypasses `ROUTES` for dynamic paths.** Hardcoded `'/tickets/:id/edit'` and `'/tickets/:id'` instead of `ROUTES.ticketEdit(':id')` / `ROUTES.ticketDetail(':id')`. | `routes/router.tsx:37-41`, `routes/paths.ts` |

---

### Minor

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| F-N-01 | Naming | **`ticket` vs `tickets` component folders.** Singular holds create-only pieces; plural holds everything else. Intent not obvious from naming. | `components/ticket/`, `components/tickets/` |
| F-N-02 | Component structure | **`TicketList` is a pass-through.** Only renders `TicketTable` with no added behavior. | `components/tickets/TicketList.tsx` |
| F-N-03 | Maintainability | **Inconsistent import paths for hooks.** Some files deep-import instead of using barrel exports. | `pages/Tickets/CreateTicketPage.tsx`, `components/tickets/StatusFeedbackBanner.tsx` |
| F-N-04 | Reusability / Naming | **Duplicated enum/constants.** `TICKET_STATUSES` and `PRIORITIES` defined in multiple places. | `utils/ticketListFilters.ts`, `utils/statusErrors.ts`, `schemas/*.ts`, `PrioritySelect.tsx`, `TicketForm.tsx` |
| F-N-05 | TypeScript | **Unsafe select value casts in filters.** `event.target.value as TicketStatus \| ''` without runtime validation. | `StatusFilter.tsx`, `PriorityFilter.tsx` |
| F-N-06 | TypeScript | **`TextLink` `to` prop is untyped `string`.** Loses route type safety from `AppRoutePath`. | `components/common/TextLink.tsx` |
| F-N-07 | React Hook Form | **Inconsistent form ownership patterns.** Create lifts form into hook; edit and comment forms instantiate `useForm` inside components. | `useCreateTicketForm.ts` vs `TicketForm.tsx`, `CommentForm.tsx` |
| F-N-08 | React Hook Form | **Redundant Zod constraint in create schema.** Title has `.min(1)` then `.min(5)` — first is dead code. | `schemas/createTicketFormSchema.ts` |
| F-N-09 | React Query | **`userKeys` not colocated with tickets key pattern.** Lives inside `useUsers.ts` vs dedicated `keys.ts`. | `hooks/users/useUsers.ts` vs `hooks/tickets/keys.ts` |
| F-N-10 | Tailwind | **Parallel color systems.** Tone maps in `ticketDisplay.ts`, `StatCard.tsx`, and inline in `StatusFeedbackBanner`. | Multiple files |
| F-N-11 | Accessibility | **Mobile menu lacks focus trap and Escape handling.** Keyboard users can tab behind open menu. | `components/layout/AppHeader.tsx` |
| F-N-12 | Accessibility | **Heading hierarchy skips levels on detail page.** `h1` → `h3` with no `h2`. | `pages/tickets/TicketDetailPage.tsx` |
| F-N-13 | Accessibility | **`StatusFeedbackBanner` success state may not be announced.** `role="status"` without explicit `aria-live`. | `components/tickets/StatusFeedbackBanner.tsx` |
| F-N-14 | Naming | **`MutationExtras` / `mutationState` naming overlap.** Duplicates `isPending` and `error` on mutation result. | `hooks/tickets/useTicketMutations.ts`, `hooks/tickets/state.ts` |
| F-N-15 | Component structure | **`CommentForm` couples data fetching to presentation.** Calls `useAddComment` inside form vs page/hook layer. | `components/tickets/CommentForm.tsx` |
| F-N-16 | Performance | **`sortCommentsChronologically` runs every render.** Unmemoized; fine for small lists. | `components/tickets/CommentList.tsx`, `utils/ticketComments.ts` |

---

### Suggestion

| ID | Area | Finding | Location / Evidence |
|----|------|---------|---------------------|
| F-S-01 | Reusability | **Shared page loading boundary.** Dashboard, list, detail, and edit pages repeat `loading → skeleton → error → empty → content`. | All page components |
| F-S-02 | Reusability | **Shared select primitives.** Priority dropdown in 3 places; user select in 3 variants (create, edit, filter). | `PrioritySelect`, `TicketForm`, `PriorityFilter`, `AssignedUserSelect`, `UserFilter` |
| F-S-03 | React Query / Performance | **Optimistic updates for mutations.** Status changes, comments, and edits wait for round-trip. | Mutation hooks |
| F-S-04 | Maintainability | **React Query Devtools in development.** Would aid cache debugging. | `providers/QueryProvider.tsx` |
| F-S-05 | Performance | **Prefetch on navigation hover.** Lazy routes are good; prefetch ticket detail on row hover. | `lazyRoute.tsx`, `TicketTable.tsx` |
| F-S-06 | Tailwind | **`clsx` / `cn` utility for class merging.** String templates work today; utility scales better. | Throughout |
| F-S-07 | Tailwind | **Design tokens / theme layer.** Fine for internal tool; extract if branding changes. | N/A |
| F-S-08 | Architecture | **Remove or implement `getUser()` API surface.** Dead API function with no hook. | `api/users.ts` |
| F-S-09 | Accessibility | **Responsive table column hiding.** Hidden columns have no in-row alternative for sighted mobile users. | `components/tickets/TicketTable.tsx` |

---

## Review by Dimension

### Architecture

Layered SPA is appropriate for Core scope. Request flow:

```
Router (lazy pages) → page (hooks) → components → api/client → backend
QueryProvider wraps entire app; no auth provider yet.
```

**Concerns:** `pages/Tickets/` vs `pages/tickets/` casing split; half-implemented acting-as; no error boundary.

### Component Structure

`components/common/` is a solid design-system-lite. Pages are thin orchestrators. **Concern:** `ticket` vs `tickets` folder split and duplicated create/edit form UIs.

### React Query Usage

Query key factory and invalidation helpers are architecturally correct. **Critical bug:** `onSuccess` composition in mutation hooks. **UX issue:** `isFetching` conflated with initial load; no `keepPreviousData` on filter changes.

### React Hook Form Usage

Zod resolvers and `getFieldErrorProps` are well-applied. **Concern:** create vs edit schema divergence; inconsistent form ownership (hook vs in-component); `CommentForm` hand-rolls error display.

### TypeScript

`verbatimModuleSyntax` and `noUnusedLocals` enabled. **Gap:** `strict` not on; unsafe filter casts; `TextLink` loses route typing.

### Tailwind CSS

Consistent slate palette, responsive breakpoints, shared class constants. Minor duplication of tone/color maps.

### Naming

Hooks prefixed `use*`; API functions verb-noun; components PascalCase. **Confusion:** `ticket`/`tickets` folders; `mutationState` vs mutation fields; `actingAs` implies UI that doesn't exist.

### Reusability

`FormField`, `Badge`, `Table`, `Button`/`ButtonLink` compose well. **Gap:** no shared priority/user select primitives; `TicketList` pass-through.

### Performance

Lazy routes good. **Concerns:** full-list dashboard aggregation; skeleton flash on refetch/filter; unmemoized comment sort.

### Accessibility

Strong intentional investment (`SkipLink`, `FormField`, table semantics, timeline ARIA). **Gaps:** mobile menu focus trap; heading hierarchy; success banner live region.

### Maintainability

Good inline API type docs. **Risks:** zero tests; validation drift; acting-as incomplete; no React Query Devtools.

---

## Summary Counts

| Category | Count |
|----------|-------|
| Critical | 2 |
| Major | 10 |
| Minor | 16 |
| Suggestion | 9 |

---

## Recommended Merge Blockers vs Follow-Ups

**Before merge:**

1. F-C-01 — Fix mutation `onSuccess` composition (cache invalidation)
2. F-C-02 — Normalize `pages/Tickets/` → `pages/tickets/`

**Immediately after merge:**

3. F-M-01 — Align create/edit Zod schemas with backend
4. F-M-02 / F-M-03 — Separate initial load from refetch; add `keepPreviousData`
5. F-M-06 — Decide acting-as scope (complete or remove)
6. F-M-08 — Add smoke tests for filters, schemas, invalidation

**Acceptable for Core merge (document as known debt):**

- F-M-04 (client-side dashboard aggregation)
- F-M-07 (TypeScript strict — can be incremental)
- F-N-01 through F-N-16 (hygiene and polish)
- F-S-01 through F-S-09 (improvements)

---

*This review covers `client/src` as of 2026-07-20. No application code was modified during this review.*
