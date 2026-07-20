import type { TicketStatus } from '../../api/types';
import { formInputClassName } from '../common/FormField';
import { TICKET_STATUSES } from '../../utils/ticketListFilters';
import { formatTicketStatus } from '../../utils/ticketDisplay';

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
        className={formInputClassName}
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
