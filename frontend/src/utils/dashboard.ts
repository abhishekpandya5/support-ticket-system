import type { Ticket } from '../api/types';

export type TicketStatusCounts = {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
};

const EMPTY_COUNTS: TicketStatusCounts = {
  total: 0,
  open: 0,
  in_progress: 0,
  resolved: 0,
  closed: 0,
};

export function computeTicketStatusCounts(tickets: Ticket[]): TicketStatusCounts {
  const counts = { ...EMPTY_COUNTS };

  for (const ticket of tickets) {
    counts.total += 1;

    switch (ticket.status) {
      case 'open':
        counts.open += 1;
        break;
      case 'in_progress':
        counts.in_progress += 1;
        break;
      case 'resolved':
        counts.resolved += 1;
        break;
      case 'closed':
        counts.closed += 1;
        break;
      default:
        break;
    }
  }

  return counts;
}

export function getRecentTickets(tickets: Ticket[], limit = 5): Ticket[] {
  return [...tickets]
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    )
    .slice(0, limit);
}
