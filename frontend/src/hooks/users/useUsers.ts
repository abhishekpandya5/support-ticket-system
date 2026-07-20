import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import { listUsers } from '../../api/users';
import type { ListUsersResponse } from '../../api/types';
import { userKeys } from './keys';

export function useUsers() {
  return useQuery<ListUsersResponse, ApiError>({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });
}
