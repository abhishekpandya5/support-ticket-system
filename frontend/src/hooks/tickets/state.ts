import { isApiError, type ApiError } from '../../api/errors';

/**
 * Normalizes React Query `error` values to `ApiError` when possible.
 */
export function toApiError(error: unknown): ApiError | null {
  return isApiError(error) ? error : null;
}

export type TicketQueryState = {
  /** True while the initial request has no data yet. */
  isLoading: boolean;
  /** True while any fetch (including background refetch) is in flight. */
  isFetching: boolean;
  /** Normalized API error from the query, if any. */
  error: ApiError | null;
};

export function getTicketQueryState(
  isLoading: boolean,
  isFetching: boolean,
  error: unknown,
): TicketQueryState {
  return {
    isLoading,
    isFetching,
    error: toApiError(error),
  };
}

export type TicketMutationState = {
  /** True while the mutation request is in flight. */
  isPending: boolean;
  /** Normalized API error from the mutation, if any. */
  error: ApiError | null;
};

export function getTicketMutationState(
  isPending: boolean,
  error: unknown,
): TicketMutationState {
  return {
    isPending,
    error: toApiError(error),
  };
}
