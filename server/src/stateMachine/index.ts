/**
 * Ticket status state machine — pure transition rules.
 */

export { InvalidTransitionError } from './InvalidTransitionError.js';

export { TicketStateMachine, ticketStateMachine } from './TicketStateMachine.js';

export {
  TERMINAL_TICKET_STATUSES,
  TICKET_TRANSITIONS,
  isTicketStatus,
  type TicketTransitionMap,
} from './transitions.js';
