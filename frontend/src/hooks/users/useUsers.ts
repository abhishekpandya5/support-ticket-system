import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import { listUsers } from '../../api/users';
import type { ListUsersResponse } from '../../api/types';

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
};

export function useUsers() {
  return useQuery<ListUsersResponse, ApiError>({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });
}
