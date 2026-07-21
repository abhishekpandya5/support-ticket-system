/**
 * Root API router — mounts versioned route modules.
 */

import { Router } from 'express';

import { v1Router } from './v1/index.js';

export const apiRouter = Router();

apiRouter.use('/', v1Router);

export { v1Router } from './v1/index.js';
