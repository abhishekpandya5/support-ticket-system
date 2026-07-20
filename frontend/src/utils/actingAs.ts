import type { UserSummary } from '../api/types';

const ACTING_AS_STORAGE_KEY = 'actingAsUserId';

export function getActingAsUserId(users: UserSummary[]): string | null {
  const storedUserId = localStorage.getItem(ACTING_AS_STORAGE_KEY);

  if (storedUserId && users.some((user) => user.id === storedUserId)) {
    return storedUserId;
  }

  return users[0]?.id ?? null;
}

export function getActingAsUser(users: UserSummary[]): UserSummary | null {
  const userId = getActingAsUserId(users);

  if (!userId) {
    return null;
  }

  return users.find((user) => user.id === userId) ?? null;
}
