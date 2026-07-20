import type { TicketPriority } from '../../api/types';
import { filterLabelClassName, formInputClassName } from '../common/FormField';
import { parsePriorityFilterValue } from '../../utils/filterSelect';
import { TICKET_PRIORITIES } from '../../utils/ticketListFilters';
import { formatTicketPriority } from '../../utils/ticketDisplay';

const PRIORITY_FILTER_ID = 'ticket-priority-filter';

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
    <div className="block w-full min-w-0">
      <label htmlFor={PRIORITY_FILTER_ID} className={filterLabelClassName}>
        Priority
      </label>
      <select
        id={PRIORITY_FILTER_ID}
        value={value}
        onChange={(event) =>
          onChange(parsePriorityFilterValue(event.target.value))
        }
        disabled={disabled}
        className={formInputClassName}
      >
        <option value="">All priorities</option>
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {formatTicketPriority(priority)}
          </option>
        ))}
      </select>
    </div>
  );
}
