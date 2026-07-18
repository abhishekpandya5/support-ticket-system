/**
 * Success response bodies from `api-contract.md` §5–§7.
 */

import type { Comment, Ticket, User } from './entities';

/** `GET /api/tickets` — `200 OK` */
export interface ListTicketsResponse {
  tickets: Ticket[];
}

/** `GET /api/tickets/:id` — `200 OK` */
export interface GetTicketResponse {
  ticket: Ticket;
  comments: Comment[];
}

/** `POST /api/tickets` — `201 Created` */
export interface CreateTicketResponse {
  ticket: Ticket;
}

/** `PATCH /api/tickets/:id` — `200 OK` */
export interface UpdateTicketResponse {
  ticket: Ticket;
}

/** `PATCH /api/tickets/:id/status` — `200 OK` */
export interface ChangeTicketStatusResponse {
  ticket: Ticket;
}

/** `POST /api/tickets/:id/comments` — `201 Created` */
export interface AddCommentResponse {
  comment: Comment;
}

/** `GET /api/users` — `200 OK` */
export interface ListUsersResponse {
  users: User[];
}

/** `GET /api/users/:id` — `200 OK` */
export interface GetUserResponse {
  user: User;
}
