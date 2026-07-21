/**
 * Shared resource shapes from `api-contract.md` §2 and `server/src/utils/serializers.ts`.
 */

import type { TicketPriority, TicketStatus, UserRole } from './enums';

/** `api-contract.md` §2.1 — populated user reference in ticket/comment responses. */
export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

/** `api-contract.md` §2.2 — full user returned by user endpoints. */
export interface User extends UserSummary {
  role: UserRole;
}

/** `api-contract.md` §2.3 */
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: UserSummary | null;
  createdBy: UserSummary;
  createdAt: string;
  updatedAt: string;
}

/** `api-contract.md` §2.4 */
export interface Comment {
  id: string;
  ticketId: string;
  message: string;
  createdBy: UserSummary;
  createdAt: string;
}
