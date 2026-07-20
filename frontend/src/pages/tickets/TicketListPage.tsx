import { Link } from 'react-router-dom';

import {
  EmptyState,
  ErrorState,
  PageHeader,
} from '../../components/common';
import {
  TicketList,
  TicketTableSkeleton,
} from '../../components/tickets';
import { useTickets } from '../../hooks/tickets';
import { ROUTES } from '../../routes/paths';

export default function TicketListPage() {
  const { tickets, queryState, refetch } = useTickets();

  return (
    <section>
      <PageHeader
        title="Tickets"
        action={
          <Link
            to={ROUTES.ticketCreate}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Create Ticket
          </Link>
        }
      />

      {queryState.isLoading ? <TicketTableSkeleton /> : null}

      {queryState.error ? (
        <ErrorState error={queryState.error} onRetry={() => refetch()} />
      ) : null}

      {!queryState.isLoading && !queryState.error && tickets?.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          message="Create a ticket to get started."
        />
      ) : null}

      {!queryState.isLoading && !queryState.error && tickets && tickets.length > 0 ? (
        <TicketList tickets={tickets} />
      ) : null}
    </section>
  );
}
