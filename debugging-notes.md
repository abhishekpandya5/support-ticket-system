# Debugging Notes

## Issue 1 — Backend `npm run dev` fails

### Problem

`npm run dev` in `backend/` did not start the server.

### How I Investigated

`ts-node-dev --esm` reported `no script to run provided`; TypeScript 7 incompatibility.

### How AI Helped

Diagnosed script issue; recommended `tsx watch src/index.ts`.

### What I Validated

Server starts on Node 24; MongoDB connects with valid `MONGODB_URI`.

### Final Fix

`backend/package.json`: dev script → `tsx watch src/index.ts`; added `tsx` devDependency.

*From `ai-prompts/debugging.md` (2026-07-12).*

---

## Issue 2

<!-- TODO -->
