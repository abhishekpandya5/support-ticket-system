/**
 * Request payloads and query params from `api-contract.md` §5–§7
 * and `backend/src/validators/`.
 */

import type { TicketPriority, TicketStatus } from './enums';

/** `GET /api/tickets` — `listTicketsQuerySchema` */
export interface ListTicketsParams {
  search?: string;
  status?: TicketStatus;
}

/** `POST /api/tickets` — `createTicketSchema` */
export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  createdBy: string;
  assignedTo?: string | null;
}

/** `PATCH /api/tickets/:id` — `updateTicketSchema` */
export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: string | null;
}

/** `PATCH /api/tickets/:id/status` — `updateStatusSchema` */
export interface ChangeTicketStatusRequest {
  status: TicketStatus;
}

/** `POST /api/tickets/:id/comments` — `addCommentSchema` */
export interface AddCommentRequest {
  message: string;
  createdBy: string;
}
