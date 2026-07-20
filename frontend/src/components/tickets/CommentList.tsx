import type { Comment } from '../../api/types';
import { EmptyState } from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatDate';
import { sortCommentsChronologically } from '../../utils/ticketComments';

type CommentListProps = {
  comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
  const sortedComments = sortCommentsChronologically(comments);

  if (sortedComments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        message="Comments added to this ticket will appear here."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      {sortedComments.map((comment) => (
        <li key={comment.id} className="p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-slate-900">
              {comment.createdBy.name}
            </p>
            <time
              className="text-xs text-slate-500"
              dateTime={comment.createdAt}
            >
              {formatDateTime(comment.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
            {comment.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
