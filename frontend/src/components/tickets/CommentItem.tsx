import type { Comment } from '../../api/types';
import { formatDateTime } from '../../utils/formatDate';

type CommentItemProps = {
  comment: Comment;
};

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <li className="p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-slate-900">
          {comment.createdBy.name}
        </p>
        <time className="text-xs text-slate-500" dateTime={comment.createdAt}>
          {formatDateTime(comment.createdAt)}
        </time>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
        {comment.message}
      </p>
    </li>
  );
}
