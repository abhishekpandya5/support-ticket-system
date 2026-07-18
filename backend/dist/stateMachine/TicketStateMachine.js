import { InvalidTransitionError } from './InvalidTransitionError.js';
import { TERMINAL_TICKET_STATUSES, TICKET_TRANSITIONS, isTicketStatus, } from './transitions.js';
/**
 * Pure ticket lifecycle state machine.
 * Validates status transitions only — no persistence or HTTP concerns.
 */
export class TicketStateMachine {
    transitions;
    constructor(transitions = TICKET_TRANSITIONS) {
        this.transitions = transitions;
    }
    /** Returns all valid ticket status values. */
    getStatuses() {
        return Object.keys(this.transitions);
    }
    /** Returns statuses with no outgoing transitions. */
    getTerminalStatuses() {
        return TERMINAL_TICKET_STATUSES;
    }
    isTerminal(status) {
        return (isTicketStatus(status) &&
            TERMINAL_TICKET_STATUSES.includes(status));
    }
    /**
     * Returns allowed next statuses for the given current status.
     * Unknown statuses yield an empty list.
     */
    getAllowedTransitions(currentStatus) {
        if (!isTicketStatus(currentStatus)) {
            return [];
        }
        return [...(this.transitions[currentStatus] ?? [])];
    }
    /**
     * Returns true when transitioning from `currentStatus` to `newStatus` is permitted.
     * Same-status transitions return false.
     */
    isTransitionAllowed(currentStatus, newStatus) {
        if (!isTicketStatus(currentStatus) || !isTicketStatus(newStatus)) {
            return false;
        }
        if (currentStatus === newStatus) {
            return false;
        }
        return this.getAllowedTransitions(currentStatus).includes(newStatus);
    }
    /**
     * Validates and applies a status transition.
     * @returns The new status when the transition is allowed.
     * @throws {@link InvalidTransitionError} when the transition is not permitted.
     */
    changeStatus(currentStatus, newStatus) {
        if (!isTicketStatus(currentStatus)) {
            throw new InvalidTransitionError(currentStatus, newStatus, [], `Unknown current status '${currentStatus}'.`);
        }
        if (!isTicketStatus(newStatus)) {
            throw new InvalidTransitionError(currentStatus, newStatus, this.getAllowedTransitions(currentStatus), `Unknown requested status '${newStatus}'.`);
        }
        const allowedTransitions = this.getAllowedTransitions(currentStatus);
        if (currentStatus === newStatus) {
            throw new InvalidTransitionError(currentStatus, newStatus, allowedTransitions, `Cannot transition from '${currentStatus}' to '${newStatus}'. Ticket is already in this status.`);
        }
        if (!allowedTransitions.includes(newStatus)) {
            throw new InvalidTransitionError(currentStatus, newStatus, allowedTransitions);
        }
        return newStatus;
    }
}
/** Default state machine instance using the authoritative transition map. */
export const ticketStateMachine = new TicketStateMachine();
//# sourceMappingURL=TicketStateMachine.js.map