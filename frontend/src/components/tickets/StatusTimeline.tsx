import type { TicketStatus } from '../../api/types';
import { formatTicketStatus } from '../../utils/ticketDisplay';
import {
  getTimelineStepState,
  STATUS_TIMELINE_STEPS,
} from '../../utils/statusTimeline';
import { StatusBadge } from './StatusBadge';

type StatusTimelineProps = {
  currentStatus: TicketStatus;
};

const stepCircleClass: Record<
  ReturnType<typeof getTimelineStepState> | 'cancelled',
  string
> = {
  complete: 'border-slate-900 bg-slate-900 text-white',
  current: 'border-slate-900 bg-white text-slate-900 ring-2 ring-slate-900',
  upcoming: 'border-slate-300 bg-white text-slate-400',
  cancelled: 'border-slate-300 bg-slate-100 text-slate-400',
};

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-3">
      <ol className="flex flex-wrap items-start gap-3 sm:items-center sm:gap-2">
        {STATUS_TIMELINE_STEPS.map((step, index) => {
          const state = isCancelled
            ? 'cancelled'
            : getTimelineStepState(step, currentStatus);

          return (
            <li key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${stepCircleClass[state]}`}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    state === 'current'
                      ? 'text-slate-900'
                      : state === 'complete'
                        ? 'text-slate-700'
                        : 'text-slate-400'
                  }`}
                >
                  {formatTicketStatus(step)}
                </span>
              </div>
              {index < STATUS_TIMELINE_STEPS.length - 1 ? (
                <span
                  className="mx-2 hidden h-px w-8 bg-slate-300 sm:block"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      {isCancelled ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Current status:</span>
          <StatusBadge status="cancelled" />
        </div>
      ) : null}
    </div>
  );
}
