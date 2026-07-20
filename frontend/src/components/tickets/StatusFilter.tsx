import type { TicketStatus } from '../../api/types';
import { filterLabelClassName, formInputClassName } from '../common/FormField';
import { TICKET_STATUSES } from '../../utils/ticketListFilters';
import { formatTicketStatus } from '../../utils/ticketDisplay';

const STATUS_FILTER_ID = 'ticket-status-filter';

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
    <div className="block w-full min-w-0">
      <label htmlFor={STATUS_FILTER_ID} className={filterLabelClassName}>
        Status
      </label>
      <select
        id={STATUS_FILTER_ID}
        value={value}
        onChange={(event) =>
          onChange(event.target.value as TicketStatus | '')
        }
        disabled={disabled}
        className={formInputClassName}
      >
        <option value="">All statuses</option>
        {TICKET_STATUSES.map((status) => (
          <option key={status} value={status}>
            {formatTicketStatus(status)}
          </option>
        ))}
      </select>
    </div>
  );
}
