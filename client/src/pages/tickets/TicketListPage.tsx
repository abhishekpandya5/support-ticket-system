import {
  ButtonLink,
  EmptyState,
  ErrorState,
  PageHeader,
} from '../../components/common';
import {
  FilterPanel,
  TicketTable,
  TicketTableSkeleton,
} from '../../components/tickets';
import { useQueryPageState } from '../../hooks/useQueryPageState';
import { useTicketListFilters, useTickets } from '../../hooks/tickets';
import { useUsers } from '../../hooks/users';
import { ROUTES } from '../../routes/paths';

export default function TicketListPage() {
  const {
    filters,
    listParams,
    hasActiveFilters,
    setSearch,
    setStatus,
    setPriority,
    setAssignedTo,
    clearFilters,
  } = useTicketListFilters();
  const { tickets, queryState, refetch } = useTickets(listParams);
  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { isInitialLoading, error } = useQueryPageState(queryState);

  return (
    <section className="min-w-0">
      <PageHeader
        title="Tickets"
        action={
          <ButtonLink to={ROUTES.ticketCreate}>Create Ticket</ButtonLink>
        }
      />

      <FilterPanel
        filters={filters}
        users={usersData?.users ?? []}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onAssignedToChange={setAssignedTo}
        onClearFilters={clearFilters}
        disabled={isInitialLoading}
        usersLoading={usersLoading}
      />

      {isInitialLoading ? <TicketTableSkeleton /> : null}

      {error ? (
        <ErrorState
          error={error}
          title="Unable to load tickets"
          onRetry={() => refetch()}
        />
      ) : null}

      {!isInitialLoading && !error && tickets?.length === 0 ? (
        <EmptyState
          title={
            hasActiveFilters ? 'No matching tickets' : 'No tickets yet'
          }
          message={
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Create a ticket to get started.'
          }
          action={
            hasActiveFilters ? undefined : (
              <ButtonLink to={ROUTES.ticketCreate}>Create Ticket</ButtonLink>
            )
          }
        />
      ) : null}

      {!isInitialLoading && !error && tickets && tickets.length > 0 ? (
        <TicketTable tickets={tickets} />
      ) : null}
    </section>
  );
}
