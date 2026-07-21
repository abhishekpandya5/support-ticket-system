# Debugging Notes

Real issues encountered during development, how they were investigated, and how they were resolved.

---

## Issue 1 — Backend `npm run dev` fails

### Problem

`npm run dev` in `server/` did not start the server.

### How I Investigated

`ts-node-dev --esm` reported `no script to run provided`; TypeScript 7 incompatibility.

### How AI Helped

Diagnosed script issue; recommended `tsx watch src/index.ts`.

### What I Validated

Server starts on Node 24; MongoDB connects with valid `MONGODB_URI`.

### Final Fix

`server/package.json`: dev script → `tsx watch src/index.ts`; added `tsx` devDependency.

*From `ai-prompts/debugging.md` (2026-07-12).*

---

## Issue 2 — Frontend "Network Error" and 502 on `/api/tickets`

### Problem

The ticket list showed **"Unable to load tickets — Network Error"**. Browser DevTools reported a **502** on `GET /api/tickets`.

### How I Investigated

1. Confirmed the Vite dev server was running on port 5173.
2. Checked the API base URL in `client/src/api/env.ts` and the Vite proxy in `vite.config.ts`.
3. Found the frontend proxy defaulted to `http://localhost:3001` while the backend was listening on **port 5000** (from `server/.env`).
4. Verified the backend was not running when MongoDB connection failed on startup.

### How AI Helped

Traced the request path (browser → Vite proxy → backend) and identified the port mismatch. Recommended configuring `VITE_API_PROXY_TARGET` and improving the client error message when the proxy cannot reach the backend.

### What I Validated

- With `client/.env.local` set to `VITE_API_PROXY_TARGET=http://localhost:5000`, tickets load correctly.
- With the backend stopped, the UI shows a clear connection error instead of a generic failure.
- No CORS issues when using the Vite proxy (same-origin `/api` requests).

### Final Fix

- Added Vite dev proxy for `/api` in `client/vite.config.ts`.
- Documented `VITE_API_PROXY_TARGET` in `client/.env.example`.
- Improved `api/client.ts` error message when the backend is unreachable.

*From `ai-prompts/debugging.md` (2026-07-20).*

---

## Issue 3 — Express 5 read-only `req.query` breaks ticket search/filter

### Problem

After wiring URL query params to `GET /api/tickets`, integration tests for search and status filter failed. Requests with `?search=...` or `?status=open` returned validation errors or did not apply filters.

### How I Investigated

1. Reproduced with Supertest: `GET /api/tickets?status=open` threw at runtime.
2. Traced failure to `middleware/validate.ts` when assigning parsed query back to `req.query`.
3. Confirmed Express 5 treats `req.query` as **read-only** in some code paths; replacing the object outright fails silently or throws.

### How AI Helped

Suggested mutating the existing query object in place (`delete` unknown keys, then `Object.assign`) instead of reassigning `req.query`.

### What I Validated

- All 21 integration tests pass, including search and status filter cases.
- `TicketController.list` receives correctly parsed query values from middleware.
- Invalid enum values in query strings are rejected with `400 VALIDATION_ERROR`.

### Final Fix

Updated `applyParsedTarget` in `server/src/middleware/validate.ts` to merge parsed query fields into the existing `req.query` object rather than replacing it.

*From `ai-prompts/testing.md` and `implementation.md` (2026-07-18).*

---

## Issue 4 — React Query cache not updating after mutations

### Problem

After creating or editing a ticket, navigating back to the list often showed **stale data** until the window was refocused or the 30s `staleTime` expired.

### How I Investigated

1. Confirmed mutations succeeded (network tab showed `201` / `200`).
2. Checked React Query Devtools (when enabled) — list query cache was not invalidated.
3. Read `hooks/tickets/useTicketMutations.ts` and found `onSuccess` defined with invalidation logic, then `...options` spread **after** it.
4. Every consumer (`useCreateTicketForm`, `EditTicketPage`, `CommentForm`, `useTicketStatusWorkflow`) passed its own `onSuccess`, which **replaced** the hook's handler entirely.

### How AI Helped

Identified the object-spread order bug during code review. Recommended destructuring `onSuccess` from options and chaining: invalidate first, then call the consumer callback.

### What I Validated

- Create ticket → navigate to list → new ticket appears immediately.
- Edit ticket → detail page shows updated fields without manual refresh.
- Add comment → comment list updates after submit.
- Status change → detail and list reflect new status.

### Final Fix

All four mutation hooks in `useTicketMutations.ts` now use:

```ts
const { onSuccess, ...mutationOptions } = options ?? {};
// ...
onSuccess: async (...args) => {
  await invalidateTicketCaches(...);
  await onSuccess?.(...args);
},
```

*From `code-review-notes.md` F-C-01; fixed in maintainability refactor (2026-07-20).*

---

## Issue 5 — Ticket list skeleton flashes on every filter change

### Problem

Changing a filter (status, priority, assigned user) or triggering a background refetch caused the **entire table to disappear** and the skeleton loader to flash, even when previous data was still valid.

### How I Investigated

1. Observed `TicketListPage` used `queryState.isLoading || queryState.isFetching` for skeleton visibility.
2. Noted each filter change creates a new query key in React Query, setting `isLoading: true` with no previous data retained.
3. Window-focus refetches also set `isFetching: true`, re-disabling the filter panel unnecessarily.

### How AI Helped

Recommended separating **initial load** from **background refresh** and using `placeholderData: keepPreviousData` on the tickets query.

### What I Validated

- First visit to `/tickets` still shows skeleton until data arrives.
- Changing filters keeps the previous table visible while the new request loads.
- Background refetches no longer hide the table or disable filters.
- Empty state still appears correctly when filters match no tickets.

### Final Fix

- Added `useQueryPageState` hook exposing `isInitialLoading` (`isLoading` only).
- `useTickets` sets `placeholderData: keepPreviousData`.
- `TicketListPage` and `DashboardPage` use `isInitialLoading` for skeletons and filter disable state.

*From `code-review-notes.md` F-M-02, F-M-03; fixed in maintainability refactor (2026-07-20).*

---

## Issue 6 — Create ticket page import fails on Linux (case-sensitive paths)

### Problem

The app built and ran on macOS/Windows but the **Create Ticket** route failed to load on Linux CI with a module resolution error.

### How I Investigated

1. Compared file path to router import in `routes/router.tsx`.
2. Found the page at `pages/Tickets/CreateTicketPage.tsx` (capital **T**) while all other ticket pages lived under `pages/tickets/`.
3. Router lazy import used `../pages/Tickets/CreateTicketPage` — works on case-insensitive filesystems, fails on Linux.

### How AI Helped

Flagged as F-C-02 in frontend code review. Recommended normalizing to lowercase `pages/tickets/` to match the rest of the project.

### What I Validated

- `npx tsc -b` passes after the move.
- Lazy route loads correctly on Linux.
- All ticket routes (`/tickets`, `/tickets/new`, `/tickets/:id`, `/tickets/:id/edit`) resolve as expected.

### Final Fix

Moved `CreateTicketPage.tsx` to `client/src/pages/tickets/CreateTicketPage.tsx` and updated the router import.

*From `code-review-notes.md` F-C-02; fixed in maintainability refactor (2026-07-20).*

---

## Quick Reference

| Issue | Symptom | Root cause | Key file(s) |
|-------|---------|------------|-------------|
| 1 | `npm run dev` fails | `ts-node-dev` + TS 7 incompatibility | `server/package.json` |
| 2 | Network Error / 502 | Proxy port mismatch (3001 vs 5000) | `vite.config.ts`, `.env.local` |
| 3 | Search/filter API broken | Express 5 read-only `req.query` | `middleware/validate.ts` |
| 4 | Stale list after mutation | `onSuccess` overridden by spread | `useTicketMutations.ts` |
| 5 | Skeleton flash on filter | `isFetching` + no `keepPreviousData` | `useTicketQueries.ts`, `useQueryPageState.ts` |
| 6 | Create route fails on Linux | `pages/Tickets/` vs `pages/tickets/` casing | `routes/router.tsx` |
