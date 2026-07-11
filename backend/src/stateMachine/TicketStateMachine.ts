import type { TicketStatus } from '../constants/enums.js';

import { InvalidTransitionError } from './InvalidTransitionError.js';
import {
  TERMINAL_TICKET_STATUSES,
  TICKET_TRANSITIONS,
  isTicketStatus,
  type TicketTransitionMap,
} from './transitions.js';

/**
 * Pure ticket lifecycle state machine.
 * Validates status transitions only — no persistence or HTTP concerns.
 */
export class TicketStateMachine {
  private readonly transitions: TicketTransitionMap;

  constructor(transitions: TicketTransitionMap = TICKET_TRANSITIONS) {
    this.transitions = transitions;
  }

  /** Returns all valid ticket status values. */
  getStatuses(): TicketStatus[] {
    return Object.keys(this.transitions) as TicketStatus[];
  }

  /** Returns statuses with no outgoing transitions. */
  getTerminalStatuses(): readonly TicketStatus[] {
    return TERMINAL_TICKET_STATUSES;
  }

  isTerminal(status: string): boolean {
    return (
      isTicketStatus(status) &&
      (TERMINAL_TICKET_STATUSES as readonly string[]).includes(status)
    );
  }

  /**
   * Returns allowed next statuses for the given current status.
   * Unknown statuses yield an empty list.
   */
  getAllowedTransitions(currentStatus: string): TicketStatus[] {
    if (!isTicketStatus(currentStatus)) {
      return [];
    }

    return [...(this.transitions[currentStatus] ?? [])];
  }

  /**
   * Returns true when transitioning from `currentStatus` to `newStatus` is permitted.
   * Same-status transitions return false.
   */
  isTransitionAllowed(currentStatus: string, newStatus: string): boolean {
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
  changeStatus(currentStatus: string, newStatus: string): TicketStatus {
    if (!isTicketStatus(currentStatus)) {
      throw new InvalidTransitionError(
        currentStatus,
        newStatus,
        [],
        `Unknown current status '${currentStatus}'.`,
      );
    }

    if (!isTicketStatus(newStatus)) {
      throw new InvalidTransitionError(
        currentStatus,
        newStatus,
        this.getAllowedTransitions(currentStatus),
        `Unknown requested status '${newStatus}'.`,
      );
    }

    const allowedTransitions = this.getAllowedTransitions(currentStatus);

    if (currentStatus === newStatus) {
      throw new InvalidTransitionError(
        currentStatus,
        newStatus,
        allowedTransitions,
        `Cannot transition from '${currentStatus}' to '${newStatus}'. Ticket is already in this status.`,
      );
    }

    if (!allowedTransitions.includes(newStatus)) {
      throw new InvalidTransitionError(
        currentStatus,
        newStatus,
        allowedTransitions,
      );
    }

    return newStatus;
  }
}

/** Default state machine instance using the authoritative transition map. */
export const ticketStateMachine = new TicketStateMachine();
