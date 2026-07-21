/**
 * Request validators barrel (Zod schemas).
 */

export {
  addCommentSchema,
  type AddCommentBody,
} from './comments/index.js';

export {
  formatZodFieldErrors,
  idParamSchema,
  isObjectIdFieldError,
  listTicketsQuerySchema,
  nonEmptyTrimmedString,
  objectIdField,
  objectIdLabelFromMessage,
  optionalNonEmptyTrimmedString,
  type ListTicketsQuery,
} from './shared.js';

export {
  createTicketSchema,
  updateStatusSchema,
  updateTicketSchema,
  type CreateTicketBody,
  type UpdateStatusBody,
  type UpdateTicketBody,
} from './tickets/index.js';
