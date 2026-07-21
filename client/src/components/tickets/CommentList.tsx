import { useMemo } from 'react';

import type { Comment } from '../../api/types';
import { Card } from '../common/Card';
import { EmptyState } from '../common';
import { sortCommentsChronologically } from '../../utils/ticketComments';
import { CommentItem } from './CommentItem';

type CommentListProps = {
  comments: Comment[];
};

export function CommentList({ comments }: CommentListProps) {
  const sortedComments = useMemo(
    () => sortCommentsChronologically(comments),
    [comments],
  );

  if (sortedComments.length === 0) {
    return (
      <EmptyState
        title="No comments yet"
        message="Comments added to this ticket will appear here."
        compact
      />
    );
  }

  return (
    <Card as="ul" padding="none" className="divide-y divide-slate-200">
      {sortedComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Card>
  );
}
