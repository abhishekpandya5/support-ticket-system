import type { ApiError } from '../api/errors';
import type { TicketStatus } from '../api/types';

const TICKET_STATUSES: TicketStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
];

function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === 'string' && TICKET_STATUSES.includes(value as TicketStatus);
}

export function getAllowedTransitionsFromError(
  error: ApiError,
): TicketStatus[] | null {
  const allowed = error.details?.allowedTransitions;

  if (!Array.isArray(allowed)) {
    return null;
  }

  return allowed.filter(isTicketStatus);
}
