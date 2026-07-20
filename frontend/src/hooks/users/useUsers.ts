import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '../../api/errors';
import { listUsers } from '../../api/users';
import type { ListUsersResponse } from '../../api/types';
import {
  getActingAsUserId,
  setActingAsUserId,
} from '../../utils/actingAs';
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
  const [actingAsUserId, setActingAsUserIdState] = useState<string | null>(null);

  useEffect(() => {
    if (users.length === 0) {
      setActingAsUserIdState(null);
      return;
    }

    const resolved = getActingAsUserId(users);
    setActingAsUserIdState(resolved);

    if (resolved) {
      setActingAsUserId(resolved);
    }
  }, [users]);

  const selectActingAsUser = useCallback((userId: string) => {
    setActingAsUserId(userId);
    setActingAsUserIdState(userId);
  }, []);

  const actingAsUser =
    users.find((user) => user.id === actingAsUserId) ?? null;

  return {
    users,
    usersLoading: isLoading,
    actingAsUser,
    actingAsUserId,
    actingAsWarning: getActingAsWarning(users, isLoading),
    selectActingAsUser,
  };
}
