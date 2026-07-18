import { apiClient } from './client';
import type { GetUserResponse, ListUsersResponse } from './types';

export async function listUsers(): Promise<ListUsersResponse> {
  const { data } = await apiClient.get<ListUsersResponse>('/users');
  return data;
}

export async function getUser(id: string): Promise<GetUserResponse> {
  const { data } = await apiClient.get<GetUserResponse>(`/users/${id}`);
  return data;
}
