import type { TicketPriority } from '../../api/types';
import { TICKET_PRIORITIES } from '../../utils/ticketListFilters';
import { formatTicketPriority } from '../../utils/ticketDisplay';

const selectClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

type PriorityFilterProps = {
  value: TicketPriority | '';
  onChange: (value: TicketPriority | '') => void;
  disabled?: boolean;
};

export function PriorityFilter({
  value,
  onChange,
  disabled = false,
}: PriorityFilterProps) {
  return (
    <label className="block min-w-[10rem]">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        Priority
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as TicketPriority | '')
        }
        disabled={disabled}
        className={selectClassName}
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {formatTicketPriority(priority)}
          </option>
        ))}
      </select>
    </label>
  );
}
