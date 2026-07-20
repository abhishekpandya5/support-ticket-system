import type { UserSummary } from '../../api/types';
import { ASSIGNED_TO_UNASSIGNED } from '../../utils/ticketListFilters';

const selectClassName =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50';

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
    <label className="block min-w-[12rem]">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
        Assigned User
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={isDisabled}
        className={selectClassName}
        aria-label="Filter by assigned user"
      >
        <option value="">All users</option>
        <option value={ASSIGNED_TO_UNASSIGNED}>Unassigned</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
