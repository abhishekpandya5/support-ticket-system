import {
  TICKET_STATUS,
  TICKET_STATUS_VALUES,
  type TicketStatus,
} from '../constants/enums.js';

export type TicketTransitionMap = Readonly<
  Record<TicketStatus, readonly TicketStatus[]>
>;

/**
 * Authoritative ticket status transition table.
 * Terminal states (`closed`, `cancelled`) have no outgoing transitions.
 */
export const TICKET_TRANSITIONS: TicketTransitionMap = {
  [TICKET_STATUS.OPEN]: [
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.CANCELLED,
  ],
  [TICKET_STATUS.IN_PROGRESS]: [
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.CANCELLED,
  ],
  [TICKET_STATUS.RESOLVED]: [TICKET_STATUS.CLOSED],
  [TICKET_STATUS.CLOSED]: [],
  [TICKET_STATUS.CANCELLED]: [],
};

export const TERMINAL_TICKET_STATUSES = [
  TICKET_STATUS.CLOSED,
  TICKET_STATUS.CANCELLED,
] as const satisfies readonly TicketStatus[];

export function isTicketStatus(value: string): value is TicketStatus {
  return (TICKET_STATUS_VALUES as readonly string[]).includes(value);
}
