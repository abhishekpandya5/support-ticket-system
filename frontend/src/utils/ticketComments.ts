import type { Comment } from '../api/types';

export function sortCommentsChronologically(comments: Comment[]): Comment[] {
  return [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
