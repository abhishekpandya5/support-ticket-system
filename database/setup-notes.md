# Database Setup Notes

**Model reference:** [`data-model.md`](../data-model.md)

## Connection

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Required MongoDB connection string |
| `NODE_ENV` | `development` \| `test` \| `production` |

Copy `backend/.env.example` → `backend/.env`.

**Code:** `backend/src/config/env.ts`, `backend/src/config/database.ts`

## Seed

```bash
cd backend && npm run seed
```

Users only (idempotent). See [`seed-data/README.md`](seed-data/README.md).

## Schema

Mongoose models in `backend/src/models/` — see [`schema-or-migrations/README.md`](schema-or-migrations/README.md).

<!-- TODO: Document db-init / syncIndexes script if added. -->
