# Debugging

Prompt history for **Debugging** activity.

Each entry uses: Objective, Prompt, AI Response Summary, Accepted, Modified, Rejected, Reason.

---

## 2026-07-12 — Bugfix

**Objective:** Fix the backend `npm run dev` script so the development server starts reliably.

**Prompt:** `npm run dev` in the backend folder is not running.

**AI Response Summary:** Diagnosed `ts-node-dev --esm` swallowing the entry file (`no script to run provided`) and incompatibility with TypeScript 7. Replaced dev runner with `tsx watch src/index.ts`, added `tsx` as a devDependency, and set `"engines": { "node": ">=18" }` in `backend/package.json`. Verified server starts and connects to MongoDB on Node 24.

**Accepted:** Switched dev runner to `tsx watch`.

**Modified:** None.

**Rejected:** Keeping `ts-node-dev`.

**Reason:** `tsx` works reliably with ESM and TypeScript 7.

---

## 2026-07-20 — Bugfix

**Objective:** Fix frontend network error and 502 when loading tickets.

**Prompt:** UI showed "Unable to load tickets — Network Error" and 502 on `/api/tickets`.

**AI Response Summary:** Found port mismatch (frontend called 3001, backend on 5000) and backend not running when MongoDB failed. Added Vite dev proxy, `frontend/.env.local` with proxy target, and clearer 502 error message.

**Accepted:** Vite proxy and `.env.local` for backend port.

**Modified:** None.

**Rejected:** Hardcoding port 5000 as the only default.

**Reason:** Proxy avoids CORS issues; backend port stays configurable per environment.
