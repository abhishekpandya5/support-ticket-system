import { describe, expect, it } from 'vitest';

import { TICKET_STATUS } from '../../src/constants/enums.js';
import { InvalidTransitionError } from '../../src/stateMachine/InvalidTransitionError.js';
import { TicketStateMachine } from '../../src/stateMachine/TicketStateMachine.js';
import { TICKET_TRANSITIONS } from '../../src/stateMachine/transitions.js';

describe('TicketStateMachine', () => {
  const machine = new TicketStateMachine();

  describe('getAllowedTransitions', () => {
    it('returns valid next statuses for open tickets', () => {
      expect(machine.getAllowedTransitions(TICKET_STATUS.OPEN)).toEqual([
        TICKET_STATUS.IN_PROGRESS,
        TICKET_STATUS.CANCELLED,
      ]);
    });

    it('returns an empty list for terminal statuses', () => {
      expect(machine.getAllowedTransitions(TICKET_STATUS.CLOSED)).toEqual([]);
      expect(machine.getAllowedTransitions(TICKET_STATUS.CANCELLED)).toEqual([]);
    });

    it('returns an empty list for unknown statuses', () => {
      expect(machine.getAllowedTransitions('archived')).toEqual([]);
    });
  });

  describe('isTransitionAllowed', () => {
    it.each([
      [TICKET_STATUS.OPEN, TICKET_STATUS.IN_PROGRESS, true],
      [TICKET_STATUS.OPEN, TICKET_STATUS.CANCELLED, true],
      [TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.RESOLVED, true],
      [TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED, true],
    ])('allows %s -> %s', (from, to, expected) => {
      expect(machine.isTransitionAllowed(from, to)).toBe(expected);
    });

    it.each([
      [TICKET_STATUS.OPEN, TICKET_STATUS.RESOLVED],
      [TICKET_STATUS.OPEN, TICKET_STATUS.CLOSED],
      [TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.OPEN],
      [TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.CLOSED],
      [TICKET_STATUS.RESOLVED, TICKET_STATUS.OPEN],
      [TICKET_STATUS.CLOSED, TICKET_STATUS.OPEN],
      [TICKET_STATUS.CANCELLED, TICKET_STATUS.OPEN],
    ])('blocks %s -> %s', (from, to) => {
      expect(machine.isTransitionAllowed(from, to)).toBe(false);
    });

    it('rejects same-status transitions', () => {
      expect(
        machine.isTransitionAllowed(TICKET_STATUS.OPEN, TICKET_STATUS.OPEN),
      ).toBe(false);
    });
  });

  describe('changeStatus', () => {
    it('returns the requested status for valid transitions', () => {
      expect(
        machine.changeStatus(
          TICKET_STATUS.OPEN,
          TICKET_STATUS.IN_PROGRESS,
        ),
      ).toBe(TICKET_STATUS.IN_PROGRESS);
    });

    it('throws InvalidTransitionError for invalid transitions', () => {
      expect(() =>
        machine.changeStatus(TICKET_STATUS.OPEN, TICKET_STATUS.RESOLVED),
      ).toThrow(InvalidTransitionError);
    });

    it('throws InvalidTransitionError for same-status requests', () => {
      expect(() =>
        machine.changeStatus(TICKET_STATUS.OPEN, TICKET_STATUS.OPEN),
      ).toThrow(InvalidTransitionError);
    });

    it('throws InvalidTransitionError with no allowed transitions from terminal states', () => {
      try {
        machine.changeStatus(TICKET_STATUS.CLOSED, TICKET_STATUS.OPEN);
        expect.fail('Expected InvalidTransitionError');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidTransitionError);
        expect((error as InvalidTransitionError).allowedTransitions).toEqual([]);
      }
    });
  });

  describe('terminal statuses', () => {
    it('identifies closed and cancelled as terminal', () => {
      expect(machine.isTerminal(TICKET_STATUS.CLOSED)).toBe(true);
      expect(machine.isTerminal(TICKET_STATUS.CANCELLED)).toBe(true);
      expect(machine.isTerminal(TICKET_STATUS.OPEN)).toBe(false);
    });

    it('exposes the configured transition map', () => {
      expect(machine.getStatuses()).toEqual(Object.keys(TICKET_TRANSITIONS));
      expect(machine.getTerminalStatuses()).toEqual([
        TICKET_STATUS.CLOSED,
        TICKET_STATUS.CANCELLED,
      ]);
    });
  });
});
