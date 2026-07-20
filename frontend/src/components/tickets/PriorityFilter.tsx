import type { TicketPriority } from '../../api/types';
import { formInputClassName } from '../common/FormField';
import { TICKET_PRIORITIES } from '../../utils/ticketListFilters';
import { formatTicketPriority } from '../../utils/ticketDisplay';

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
        className={formInputClassName}
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
