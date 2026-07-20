import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { UserSummary } from '../api/types';
import {
  ACTING_AS_STORAGE_KEY,
  getActingAsUserId,
  setActingAsUserId,
} from '../utils/actingAs';
import { getActingAsWarning } from '../utils/actingAsMessages';
import { useUsers } from '../hooks/users/useUsers';

const EMPTY_USERS: readonly UserSummary[] = [];

type ActingAsContextValue = {
  users: UserSummary[];
  usersLoading: boolean;
  actingAsUser: UserSummary | null;
  actingAsUserId: string | null;
  actingAsWarning: string | null;
  selectActingAsUser: (userId: string) => void;
};

const ActingAsContext = createContext<ActingAsContextValue | null>(null);

export function ActingAsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useUsers();
  const users = data?.users ?? EMPTY_USERS;

  const [actingAsUserId, setActingAsUserIdState] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(ACTING_AS_STORAGE_KEY);
  });

  useEffect(() => {
    if (users.length === 0) {
      return;
    }

    setActingAsUserIdState((current) => {
      if (current && users.some((user) => user.id === current)) {
        return current;
      }

      const resolved = getActingAsUserId(users);

      if (resolved) {
        setActingAsUserId(resolved);
      }

      return resolved;
    });
  }, [users]);

  const selectActingAsUser = useCallback((userId: string) => {
    if (!userId) {
      return;
    }

    setActingAsUserId(userId);
    setActingAsUserIdState(userId);
  }, []);

  const value = useMemo<ActingAsContextValue>(
    () => ({
      users,
      usersLoading: isLoading,
      actingAsUser: users.find((user) => user.id === actingAsUserId) ?? null,
      actingAsUserId,
      actingAsWarning: getActingAsWarning(users, isLoading),
      selectActingAsUser,
    }),
    [users, isLoading, actingAsUserId, selectActingAsUser],
  );

  return (
    <ActingAsContext.Provider value={value}>{children}</ActingAsContext.Provider>
  );
}

export function useActingAsUser(): ActingAsContextValue {
  const context = useContext(ActingAsContext);

  if (!context) {
    throw new Error('useActingAsUser must be used within ActingAsProvider');
  }

  return context;
}
