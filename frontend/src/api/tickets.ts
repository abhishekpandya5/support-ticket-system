import { apiClient } from './client';
import type {
  AddCommentRequest,
  AddCommentResponse,
  ChangeTicketStatusRequest,
  ChangeTicketStatusResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketResponse,
  ListTicketsParams,
  ListTicketsResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
} from './types';

export async function listTickets(
  params: ListTicketsParams = {},
): Promise<ListTicketsResponse> {
  const { data } = await apiClient.get<ListTicketsResponse>('/tickets', {
    params,
  });

  return data;
}

export async function getTicket(id: string): Promise<GetTicketResponse> {
  const { data } = await apiClient.get<GetTicketResponse>(`/tickets/${id}`);
  return data;
}

export async function createTicket(
  body: CreateTicketRequest,
): Promise<CreateTicketResponse> {
  const { data } = await apiClient.post<CreateTicketResponse>('/tickets', body);
  return data;
}

export async function updateTicket(
  id: string,
  body: UpdateTicketRequest,
): Promise<UpdateTicketResponse> {
  const { data } = await apiClient.patch<UpdateTicketResponse>(
    `/tickets/${id}`,
    body,
  );

  return data;
}

export async function changeTicketStatus(
  id: string,
  body: ChangeTicketStatusRequest,
): Promise<ChangeTicketStatusResponse> {
  const { data } = await apiClient.patch<ChangeTicketStatusResponse>(
    `/tickets/${id}/status`,
    body,
  );

  return data;
}

export async function addComment(
  ticketId: string,
  body: AddCommentRequest,
): Promise<AddCommentResponse> {
  const { data } = await apiClient.post<AddCommentResponse>(
    `/tickets/${ticketId}/comments`,
    body,
  );

  return data;
}
