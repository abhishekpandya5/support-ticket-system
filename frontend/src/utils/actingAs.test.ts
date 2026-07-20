import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getActingAsUserId, getCommentAuthorId } from './actingAs';

describe('actingAs', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    });
  });
  const users = [
    { id: 'user-1', name: 'Alice', email: 'alice@example.com', role: 'agent' as const },
    { id: 'user-2', name: 'Bob', email: 'bob@example.com', role: 'agent' as const },
  ];

  it('falls back to the first user when storage is empty', () => {
    localStorage.clear();
    expect(getActingAsUserId(users)).toBe('user-1');
  });

  it('uses a stored acting-as user when valid', () => {
    localStorage.setItem('actingAsUserId', 'user-2');
    expect(getActingAsUserId(users)).toBe('user-2');
  });

  it('resolves comment author from ticket creator', () => {
    expect(
      getCommentAuthorId({
        createdBy: { id: 'user-2' },
      }),
    ).toBe('user-2');
  });
});
