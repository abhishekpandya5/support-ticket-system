import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import { getTicket, listTickets } from '../../api/tickets';
import type {
  GetTicketResponse,
  ListTicketsParams,
  ListTicketsResponse,
} from '../../api/types';
import { ticketKeys } from './keys';
import { getTicketQueryState } from './state';

type UseTicketsOptions = Omit<
  UseQueryOptions<ListTicketsResponse, ApiError, ListTicketsResponse>,
  'queryKey' | 'queryFn'
>;

export type UseTicketsResult = UseQueryResult<
  ListTicketsResponse,
  ApiError
> & {
  tickets: ListTicketsResponse['tickets'] | undefined;
  queryState: ReturnType<typeof getTicketQueryState>;
};

export function useTickets(
  params: ListTicketsParams = {},
  options?: UseTicketsOptions,
): UseTicketsResult {
  const query = useQuery<ListTicketsResponse, ApiError>({
    queryKey: ticketKeys.list(params),
    queryFn: () => listTickets(params),
    ...options,
  });

  return {
    ...query,
    tickets: query.data?.tickets,
    queryState: getTicketQueryState(
      query.isLoading,
      query.isFetching,
      query.error,
    ),
  };
}

type UseTicketOptions = Omit<
  UseQueryOptions<GetTicketResponse, ApiError, GetTicketResponse>,
  'queryKey' | 'queryFn' | 'enabled'
> & {
  enabled?: boolean;
};

export type UseTicketResult = UseQueryResult<GetTicketResponse, ApiError> & {
  ticket: GetTicketResponse['ticket'] | undefined;
  comments: GetTicketResponse['comments'] | undefined;
  queryState: ReturnType<typeof getTicketQueryState>;
};

export function useTicket(
  id: string,
  options?: UseTicketOptions,
): UseTicketResult {
  const enabled = options?.enabled ?? Boolean(id);

  const query = useQuery<GetTicketResponse, ApiError>({
    queryKey: ticketKeys.detail(id),
    queryFn: () => getTicket(id),
    enabled: enabled && Boolean(id),
    ...options,
  });

  return {
    ...query,
    ticket: query.data?.ticket,
    comments: query.data?.comments,
    queryState: getTicketQueryState(
      query.isLoading,
      query.isFetching,
      query.error,
    ),
  };
}
