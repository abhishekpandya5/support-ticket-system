# Database Setup Notes

**Model reference:** [`data-model.md`](../data-model.md)

## Connection

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Required MongoDB connection string |
| `NODE_ENV` | `development` \| `test` \| `production` |

Copy `server/.env.example` → `server/.env`.

**Code:** `server/src/config/env.ts`, `server/src/config/database.ts`

## Initialize indexes

Sync Mongoose indexes (users, tickets, comments):

```bash
node scripts/db-init.js
```

Or from the server package:

```bash
cd server && npm run db:init
```

## Seed

```bash
cd server && npm run seed
```

Users only (idempotent). See [`database/seed-data/README.md`](seed-data/README.md).

## Schema

Mongoose models in `server/src/models/` — see [`database/schema-or-migrations/README.md`](schema-or-migrations/README.md).
