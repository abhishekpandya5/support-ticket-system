import { Router } from 'express';

import { ticketController } from '../../../controllers/TicketController.js';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../../../middleware/validate.js';
import {
  createTicketSchema,
  updateStatusSchema,
  updateTicketSchema,
} from '../../../validators/tickets/schemas.js';
import {
  idParamSchema,
  listTicketsQuerySchema,
} from '../../../validators/shared.js';
import { commentRouter } from '../comments/index.js';

const ticketIdParams = validateParams(idParamSchema('ticket ID'));

export const ticketRouter = Router();

ticketRouter.get(
  '/',
  validateQuery(listTicketsQuerySchema),
  ticketController.list,
);
ticketRouter.post('/', validateBody(createTicketSchema), ticketController.create);
ticketRouter.get('/:id', ticketIdParams, ticketController.getById);
ticketRouter.patch(
  '/:id/status',
  ticketIdParams,
  validateBody(updateStatusSchema),
  ticketController.changeStatus,
);
ticketRouter.patch(
  '/:id',
  ticketIdParams,
  validateBody(updateTicketSchema, { forbiddenFields: ['status'] }),
  ticketController.update,
);
ticketRouter.use('/:id/comments', commentRouter);
