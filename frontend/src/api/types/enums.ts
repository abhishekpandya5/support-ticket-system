/**
 * Domain enumerations from `api-contract.md` §2.5 and `backend/src/constants/enums.ts`.
 */

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus =
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'cancelled';

export type UserRole = 'agent' | 'admin' | 'viewer';
