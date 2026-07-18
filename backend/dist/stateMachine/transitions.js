import { TICKET_STATUS, TICKET_STATUS_VALUES, } from '../constants/enums.js';
/**
 * Authoritative ticket status transition table.
 * Terminal states (`closed`, `cancelled`) have no outgoing transitions.
 */
export const TICKET_TRANSITIONS = {
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
];
export function isTicketStatus(value) {
    return TICKET_STATUS_VALUES.includes(value);
}
//# sourceMappingURL=transitions.js.map