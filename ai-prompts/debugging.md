# Debugging

Prompt history for **Debugging** activity. Entries migrated from legacy `docs/prompt-history.md` (2026-07-18).

Each entry uses: Objective, Prompt, AI Response Summary, Accepted, Modified, Rejected, Reason.
Fields marked `TODO` were not recorded at the time of the work.

---

## 2026-07-12 — Bugfix

**Objective:** Fix the backend `npm run dev` script so the development server starts reliably.

**Prompt:** `npm run dev` in the backend folder is not running.

**AI Response Summary:** Diagnosed `ts-node-dev --esm` swallowing the entry file (`no script to run provided`) and incompatibility with TypeScript 7. Replaced dev runner with `tsx watch src/index.ts`, added `tsx` as a devDependency, and set `"engines": { "node": ">=18" }` in `backend/package.json`. Verified server starts and connects to MongoDB on Node 24.

**Accepted:** TODO

**Modified:** TODO

**Rejected:** TODO

**Reason:** TODO

