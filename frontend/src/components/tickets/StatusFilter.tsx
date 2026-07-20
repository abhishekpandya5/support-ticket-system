import type { TicketStatus } from '../../api/types';
import { TICKET_STATUSES } from '../../utils/ticketListFilters';
import { formatTicketStatus } from '../../utils/ticketDisplay';

const selectClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

type StatusFilterProps = {
  value: TicketStatus | '';
  onChange: (value: TicketStatus | '') => void;
  disabled?: boolean;
};

export function StatusFilter({
  value,
  onChange,
  disabled = false,
}: StatusFilterProps) {
  return (
    <label className="block min-w-[10rem]">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        Status
      </span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as TicketStatus | '')
        }
        disabled={disabled}
        className={selectClassName}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {TICKET_STATUSES.map((status) => (
          <option key={status} value={status}>
            {formatTicketStatus(status)}
          </option>
        ))}
      </select>
    </label>
  );
}
