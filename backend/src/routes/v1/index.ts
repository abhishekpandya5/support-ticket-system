import { Router } from 'express';

import { commentRouter } from './comments/index.js';
import { ticketRouter } from './tickets/index.js';
import { userRouter } from './users/index.js';

export const v1Router = Router();

v1Router.use('/tickets', ticketRouter);
v1Router.use('/users', userRouter);

export { commentRouter, ticketRouter, userRouter };
