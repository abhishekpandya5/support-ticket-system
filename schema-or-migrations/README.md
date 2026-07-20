# Schema & Indexes

Mongoose schemas and indexes live in [`backend/src/models/`](../backend/src/models/).

Sync indexes after schema changes:

```bash
node scripts/db-init.js
# or: cd backend && npm run db:init
```

See [`data-model.md`](../data-model.md) for collection definitions.
