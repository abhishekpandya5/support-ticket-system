import type { QueryClient } from '@tanstack/react-query';

import { ticketKeys } from './keys';

/**
 * Invalidates ticket list queries after mutations that affect list data.
 */
export function invalidateTicketLists(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
}

/**
 * Invalidates a single ticket detail query (ticket + comments).
 */
export function invalidateTicketDetail(
  queryClient: QueryClient,
  ticketId: string,
): Promise<void> {
  return queryClient.invalidateQueries({
    queryKey: ticketKeys.detail(ticketId),
  });
}

/**
 * Invalidates both list and detail caches for a ticket.
 */
export async function invalidateTicketCaches(
  queryClient: QueryClient,
  ticketId: string,
): Promise<void> {
  await Promise.all([
    invalidateTicketLists(queryClient),
    invalidateTicketDetail(queryClient, ticketId),
  ]);
}
