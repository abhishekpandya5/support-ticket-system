import express from 'express';

import { configureCors } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { apiRouter } from './routes/index.js';
import { healthRouter } from './routes/health.js';

/**
 * Creates and configures the Express application.
 * API routes are mounted here as they are implemented.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(configureCors());
  app.use(express.json({ limit: '1mb' }));

  app.use(healthRouter);
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
