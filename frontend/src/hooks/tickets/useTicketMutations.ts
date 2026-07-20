import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import {
  addComment,
  changeTicketStatus,
  createTicket,
  updateTicket,
} from '../../api/tickets';
import type {
  AddCommentRequest,
  AddCommentResponse,
  ChangeTicketStatusRequest,
  ChangeTicketStatusResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from '../../api/types';
import {
  invalidateTicketCaches,
  invalidateTicketDetail,
  invalidateTicketLists,
} from './invalidation';
import { getTicketMutationState } from './state';

type MutationExtras<TData, TVariables> = {
  mutationState: ReturnType<typeof getTicketMutationState>;
} & UseMutationResult<TData, ApiError, TVariables, unknown>;

function withMutationState<TData, TVariables>(
  mutation: UseMutationResult<TData, ApiError, TVariables, unknown>,
): MutationExtras<TData, TVariables> {
  return {
    ...mutation,
    mutationState: getTicketMutationState(mutation.isPending, mutation.error),
  };
}

type UseCreateTicketOptions = Omit<
  UseMutationOptions<CreateTicketResponse, ApiError, CreateTicketRequest>,
  'mutationFn'
>;

export function useCreateTicket(options?: UseCreateTicketOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  const mutation = useMutation<CreateTicketResponse, ApiError, CreateTicketRequest>({
    mutationFn: createTicket,
    ...mutationOptions,
    onSuccess: async (...args) => {
      await invalidateTicketLists(queryClient);
      await onSuccess?.(...args);
    },
  });

  return withMutationState(mutation);
}

type UseUpdateTicketVariables = {
  id: string;
  body: UpdateTicketRequest;
};

type UseUpdateTicketOptions = Omit<
  UseMutationOptions<UpdateTicketResponse, ApiError, UseUpdateTicketVariables>,
  'mutationFn'
>;

export function useUpdateTicket(options?: UseUpdateTicketOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  const mutation = useMutation<
    UpdateTicketResponse,
    ApiError,
    UseUpdateTicketVariables
  >({
    mutationFn: ({ id, body }) => updateTicket(id, body),
    ...mutationOptions,
    onSuccess: async (data, variables, ...rest) => {
      await invalidateTicketCaches(queryClient, variables.id);
      await onSuccess?.(data, variables, ...rest);
    },
  });

  return withMutationState(mutation);
}

type UseChangeTicketStatusVariables = {
  id: string;
  body: ChangeTicketStatusRequest;
};

type UseChangeTicketStatusOptions = Omit<
  UseMutationOptions<
    ChangeTicketStatusResponse,
    ApiError,
    UseChangeTicketStatusVariables
  >,
  'mutationFn'
>;

export function useChangeTicketStatus(options?: UseChangeTicketStatusOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  const mutation = useMutation<
    ChangeTicketStatusResponse,
    ApiError,
    UseChangeTicketStatusVariables
  >({
    mutationFn: ({ id, body }) => changeTicketStatus(id, body),
    ...mutationOptions,
    onSuccess: async (data, variables, ...rest) => {
      await invalidateTicketCaches(queryClient, variables.id);
      await onSuccess?.(data, variables, ...rest);
    },
  });

  return withMutationState(mutation);
}

type UseAddCommentVariables = {
  ticketId: string;
  body: AddCommentRequest;
};

type UseAddCommentOptions = Omit<
  UseMutationOptions<AddCommentResponse, ApiError, UseAddCommentVariables>,
  'mutationFn'
>;

export function useAddComment(options?: UseAddCommentOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  const mutation = useMutation<
    AddCommentResponse,
    ApiError,
    UseAddCommentVariables
  >({
    mutationFn: ({ ticketId, body }) => addComment(ticketId, body),
    ...mutationOptions,
    onSuccess: async (data, variables, ...rest) => {
      await invalidateTicketDetail(queryClient, variables.ticketId);
      await onSuccess?.(data, variables, ...rest);
    },
  });

  return withMutationState(mutation);
}
