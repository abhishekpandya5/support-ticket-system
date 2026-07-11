import { Router } from 'express';

import {
  getDatabaseConnectionState,
  isDatabaseConnected,
} from '../config/database.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const databaseState = getDatabaseConnectionState();
  const databaseConnected = isDatabaseConnected();

  const body = {
    status: databaseConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: databaseState,
    },
  };

  res.status(databaseConnected ? 200 : 503).json(body);
});
