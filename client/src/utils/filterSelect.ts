import type { TicketPriority, TicketStatus } from '../api/types';
import { TICKET_PRIORITIES, TICKET_STATUSES } from './ticketListFilters';

export function parseStatusFilterValue(value: string): TicketStatus | '' {
  return TICKET_STATUSES.includes(value as TicketStatus)
    ? (value as TicketStatus)
    : '';
}

export function parsePriorityFilterValue(value: string): TicketPriority | '' {
  return TICKET_PRIORITIES.includes(value as TicketPriority)
    ? (value as TicketPriority)
    : '';
}
