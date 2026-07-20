import type { UserSummary } from '../api/types';

export const ACTING_AS_STORAGE_KEY = 'actingAsUserId';

export function setActingAsUserId(userId: string): void {
  localStorage.setItem(ACTING_AS_STORAGE_KEY, userId);
}

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

/**
 * Resolves the user ID for new comments from the acting-as selection,
 * falling back to the ticket creator when no user is available.
 */
export function getCommentAuthorId(
  users: UserSummary[],
  ticket: { createdBy: { id: string } },
): string {
  return getActingAsUserId(users) ?? ticket.createdBy.id;
}
