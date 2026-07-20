import type { UserSummary } from '../../api/types';
import { filterLabelClassName, formInputClassName } from '../common/FormField';
import { ASSIGNED_TO_UNASSIGNED } from '../../utils/ticketListFilters';

const USER_FILTER_ID = 'ticket-assigned-user-filter';
const USER_FILTER_LOADING_ID = 'ticket-assigned-user-filter-loading';

type UserFilterProps = {
  value: string;
  users: UserSummary[];
  onChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export function UserFilter({
  value,
  users,
  onChange,
  disabled = false,
  isLoading = false,
}: UserFilterProps) {
  const isDisabled = disabled || isLoading;

  return (
    <div className="block w-full min-w-0">
      <label htmlFor={USER_FILTER_ID} className={filterLabelClassName}>
        Assigned User
      </label>
      {isLoading ? (
        <p id={USER_FILTER_LOADING_ID} className="sr-only">
          Loading users
        </p>
      ) : null}
      <select
        id={USER_FILTER_ID}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isDisabled}
        className={formInputClassName}
        aria-busy={isLoading}
        aria-describedby={isLoading ? USER_FILTER_LOADING_ID : undefined}
      >
        <option value="">
          {isLoading ? 'Loading users...' : 'All users'}
        </option>
        <option value={ASSIGNED_TO_UNASSIGNED}>Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
