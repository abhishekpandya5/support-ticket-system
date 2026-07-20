import type { UserSummary } from '../api/types';
import { getActingAsUser, getActingAsUserId } from '../utils/actingAs';

export function getActingAsWarning(
  users: UserSummary[],
  usersLoading: boolean,
): string | null {
  if (usersLoading) {
    return null;
  }

  if (users.length > 0 && !getActingAsUser(users)) {
    return 'Unable to determine the acting user. Refresh the page and try again.';
  }

  if (users.length === 0) {
    return 'No users are available. Tickets cannot be created until users exist.';
  }

  return null;
}

export function getActingAsUserIdOrNull(users: UserSummary[]): string | null {
  return getActingAsUserId(users);
}
