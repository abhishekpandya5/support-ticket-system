import {
  ButtonLink,
  EmptyState,
  ErrorState,
  PageHeader,
} from '../../components/common';
import {
  FilterPanel,
  TicketList,
  TicketTableSkeleton,
} from '../../components/tickets';
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
  const isListLoading = queryState.isLoading || queryState.isFetching;

  return (
    <section>
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
        disabled={isListLoading}
        usersLoading={usersLoading}
      />

      {isListLoading ? <TicketTableSkeleton /> : null}

      {queryState.error ? (
        <ErrorState
          error={queryState.error}
          title="Unable to load tickets"
          onRetry={() => refetch()}
        />
      ) : null}

      {!isListLoading && !queryState.error && tickets?.length === 0 ? (
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

      {!isListLoading && !queryState.error && tickets && tickets.length > 0 ? (
        <TicketList tickets={tickets} />
      ) : null}
    </section>
  );
}
