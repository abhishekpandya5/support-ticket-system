import type {
  ListTicketsParams,
  TicketPriority,
  TicketStatus,
} from '../api/types';
import { ASSIGNED_TO_UNASSIGNED } from '../api/types';

export { ASSIGNED_TO_UNASSIGNED };

export const TICKET_STATUSES: TicketStatus[] = [
  'open',
  'in_progress',
  'resolved',
  'closed',
  'cancelled',
];

export const TICKET_PRIORITIES: TicketPriority[] = [
  'low',
  'medium',
  'high',
  'critical',
];

export type TicketListFilterValues = {
  search: string;
  status: TicketStatus | '';
  priority: TicketPriority | '';
  assignedTo: string;
};

const STATUS_SET = new Set<string>(TICKET_STATUSES);
const PRIORITY_SET = new Set<string>(TICKET_PRIORITIES);

function isTicketStatus(value: string): value is TicketStatus {
  return STATUS_SET.has(value);
}

function isTicketPriority(value: string): value is TicketPriority {
  return PRIORITY_SET.has(value);
}

export function parseTicketListFilters(
  searchParams: URLSearchParams,
): TicketListFilterValues {
  const statusParam = searchParams.get('status') ?? '';
  const priorityParam = searchParams.get('priority') ?? '';

  return {
    search: searchParams.get('search') ?? '',
    status: isTicketStatus(statusParam) ? statusParam : '',
    priority: isTicketPriority(priorityParam) ? priorityParam : '',
    assignedTo: searchParams.get('assignedTo') ?? '',
  };
}

export function toListTicketsParams(
  filters: TicketListFilterValues,
): ListTicketsParams {
  const params: ListTicketsParams = {};
  const search = filters.search.trim();

  if (search) {
    params.search = search;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.priority) {
    params.priority = filters.priority;
  }

  if (filters.assignedTo) {
    params.assignedTo = filters.assignedTo;
  }

  return params;
}

export function hasActiveTicketListFilters(
  filters: TicketListFilterValues,
): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.status !== '' ||
    filters.priority !== '' ||
    filters.assignedTo !== ''
  );
}

export function buildTicketListSearchParams(
  filters: TicketListFilterValues,
): URLSearchParams {
  const next = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    next.set('search', search);
  }

  if (filters.status) {
    next.set('status', filters.status);
  }

  if (filters.priority) {
    next.set('priority', filters.priority);
  }

  if (filters.assignedTo) {
    next.set('assignedTo', filters.assignedTo);
  }

  return next;
}
