import type { TicketQueryState } from './tickets/state';

/**
 * Distinguishes the first load (show skeleton) from background refetches (keep content).
 */
export function useQueryPageState(queryState: TicketQueryState) {
  return {
    isInitialLoading: queryState.isLoading,
    isRefreshing: queryState.isFetching && !queryState.isLoading,
    error: queryState.error,
  };
}
