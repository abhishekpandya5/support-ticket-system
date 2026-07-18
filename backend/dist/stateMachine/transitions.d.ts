import { type TicketStatus } from '../constants/enums.js';
export type TicketTransitionMap = Readonly<Record<TicketStatus, readonly TicketStatus[]>>;
/**
 * Authoritative ticket status transition table.
 * Terminal states (`closed`, `cancelled`) have no outgoing transitions.
 */
export declare const TICKET_TRANSITIONS: TicketTransitionMap;
export declare const TERMINAL_TICKET_STATUSES: readonly ["closed", "cancelled"];
export declare function isTicketStatus(value: string): value is TicketStatus;
//# sourceMappingURL=transitions.d.ts.map