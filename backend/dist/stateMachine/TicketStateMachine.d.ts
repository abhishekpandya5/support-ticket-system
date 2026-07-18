import type { TicketStatus } from '../constants/enums.js';
import { type TicketTransitionMap } from './transitions.js';
/**
 * Pure ticket lifecycle state machine.
 * Validates status transitions only — no persistence or HTTP concerns.
 */
export declare class TicketStateMachine {
    private readonly transitions;
    constructor(transitions?: TicketTransitionMap);
    /** Returns all valid ticket status values. */
    getStatuses(): TicketStatus[];
    /** Returns statuses with no outgoing transitions. */
    getTerminalStatuses(): readonly TicketStatus[];
    isTerminal(status: string): boolean;
    /**
     * Returns allowed next statuses for the given current status.
     * Unknown statuses yield an empty list.
     */
    getAllowedTransitions(currentStatus: string): TicketStatus[];
    /**
     * Returns true when transitioning from `currentStatus` to `newStatus` is permitted.
     * Same-status transitions return false.
     */
    isTransitionAllowed(currentStatus: string, newStatus: string): boolean;
    /**
     * Validates and applies a status transition.
     * @returns The new status when the transition is allowed.
     * @throws {@link InvalidTransitionError} when the transition is not permitted.
     */
    changeStatus(currentStatus: string, newStatus: string): TicketStatus;
}
/** Default state machine instance using the authoritative transition map. */
export declare const ticketStateMachine: TicketStateMachine;
//# sourceMappingURL=TicketStateMachine.d.ts.map