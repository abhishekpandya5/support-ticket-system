import type { ListTicketsParams } from '../../api/types';

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: ListTicketsParams = {}) =>
    [...ticketKeys.lists(), params] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
} as const;

export type TicketListQueryKey = ReturnType<typeof ticketKeys.list>;
export type TicketDetailQueryKey = ReturnType<typeof ticketKeys.detail>;
