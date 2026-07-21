import type { TicketStatus } from '../../api/types';
import { Button } from '../common/Button';
import { formatTicketStatus } from '../../utils/ticketDisplay';

type StatusActionsProps = {
  allowedTransitions: TicketStatus[];
  pendingStatus: TicketStatus | null;
  isPending: boolean;
  onTransition: (status: TicketStatus) => void;
};

export function StatusActions({
  allowedTransitions,
  pendingStatus,
  isPending,
  onTransition,
}: StatusActionsProps) {
  if (allowedTransitions.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No further status changes are available.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allowedTransitions.map((status) => {
        const isLoading = isPending && pendingStatus === status;

        return (
          <Button
            key={status}
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            aria-busy={isLoading}
            onClick={() => onTransition(status)}
          >
            {isLoading
              ? 'Updating...'
              : `Mark as ${formatTicketStatus(status)}`}
          </Button>
        );
      })}
    </div>
  );
}
