import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import { listUsers } from '../../api/users';
import type { ListUsersResponse } from '../../api/types';
import { getActingAsUser, getActingAsUserId } from '../../utils/actingAs';
import { getActingAsWarning } from '../../utils/actingAsMessages';
import { userKeys } from './keys';

export function useUsers() {
  return useQuery<ListUsersResponse, ApiError>({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });
}

export function useActingAsUser() {
  const { data, isLoading } = useUsers();
  const users = data?.users ?? [];

  return {
    users,
    usersLoading: isLoading,
    actingAsUser: getActingAsUser(users),
    actingAsUserId: getActingAsUserId(users),
    actingAsWarning: getActingAsWarning(users, isLoading),
  };
}
