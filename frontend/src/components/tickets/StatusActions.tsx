import type { TicketStatus } from '../../api/types';
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
          <button
            key={status}
            type="button"
            disabled={isPending}
            onClick={() => onTransition(status)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? 'Updating...'
              : `Mark as ${formatTicketStatus(status)}`}
          </button>
        );
      })}
    </div>
  );
}
