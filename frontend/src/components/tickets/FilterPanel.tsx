import type { UserSummary } from '../../api/types';
import type { TicketListFilterValues } from '../../utils/ticketListFilters';
import { PriorityFilter } from './PriorityFilter';
import { SearchBar } from './SearchBar';
import { StatusFilter } from './StatusFilter';
import { UserFilter } from './UserFilter';

type FilterPanelProps = {
  filters: TicketListFilterValues;
  users: UserSummary[];
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: TicketListFilterValues['status']) => void;
  onPriorityChange: (priority: TicketListFilterValues['priority']) => void;
  onAssignedToChange: (assignedTo: string) => void;
  onClearFilters: () => void;
  disabled?: boolean;
  usersLoading?: boolean;
};

export function FilterPanel({
  filters,
  users,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssignedToChange,
  onClearFilters,
  disabled = false,
  usersLoading = false,
}: FilterPanelProps) {
  return (
    <div className="mb-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <SearchBar
          value={filters.search}
          onChange={onSearchChange}
          disabled={disabled}
        />

        <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatusFilter
            value={filters.status}
            onChange={onStatusChange}
            disabled={disabled}
          />
          <PriorityFilter
            value={filters.priority}
            onChange={onPriorityChange}
            disabled={disabled}
          />
          <UserFilter
            value={filters.assignedTo}
            users={users}
            onChange={onAssignedToChange}
            disabled={disabled}
            isLoading={usersLoading}
          />
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            disabled={disabled}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
