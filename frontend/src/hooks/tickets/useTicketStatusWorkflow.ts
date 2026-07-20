import { useState } from 'react';

import type { TicketStatus } from '../../api/types';
import { formatTicketStatus } from '../../utils/ticketDisplay';
import { useChangeTicketStatus } from './useTicketMutations';

export type StatusFeedback = {
  type: 'success' | 'error';
  message: string;
};

export function useTicketStatusWorkflow(ticketId: string) {
  const [feedback, setFeedback] = useState<StatusFeedback | null>(null);
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | null>(null);

  const mutation = useChangeTicketStatus({
    onSuccess: (data) => {
      setPendingStatus(null);
      setFeedback({
        type: 'success',
        message: `Status updated to ${formatTicketStatus(data.ticket.status)}.`,
      });
    },
    onError: (error) => {
      setPendingStatus(null);
      setFeedback({
        type: 'error',
        message: error.message,
      });
    },
  });

  const changeStatus = (status: TicketStatus) => {
    setFeedback(null);
    setPendingStatus(status);
    mutation.mutate({
      id: ticketId,
      body: { status },
    });
  };

  const clearFeedback = () => {
    setFeedback(null);
  };

  return {
    changeStatus,
    clearFeedback,
    feedback,
    pendingStatus,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
