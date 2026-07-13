import { Router } from 'express';

import { ticketController } from '../../../controllers/TicketController.js';
import { commentRouter } from '../comments/index.js';

export const ticketRouter = Router();

ticketRouter.get('/', ticketController.list);
ticketRouter.post('/', ticketController.create);
ticketRouter.get('/:id', ticketController.getById);
ticketRouter.patch('/:id/status', ticketController.changeStatus);
ticketRouter.patch('/:id', ticketController.update);
ticketRouter.use('/:id/comments', commentRouter);
