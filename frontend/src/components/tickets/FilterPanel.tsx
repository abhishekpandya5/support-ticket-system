import type { UserSummary } from '../../api/types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
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
    <Card padding="sm" className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <SearchBar
          value={filters.search}
          onChange={onSearchChange}
          disabled={disabled}
        />

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <Button
            type="button"
            variant="secondary"
            onClick={onClearFilters}
            disabled={disabled}
            className="w-full sm:w-auto"
          >
            Clear filters
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
