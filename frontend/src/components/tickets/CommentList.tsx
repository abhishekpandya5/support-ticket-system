import type { Comment } from '../../api/types';
import { EmptyState } from '../common/EmptyState';
import { sortCommentsChronologically } from '../../utils/ticketComments';
import { CommentItem } from './CommentItem';

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
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
