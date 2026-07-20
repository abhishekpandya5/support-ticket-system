import { Link } from 'react-router-dom';

import {
  DashboardSkeleton,
  RecentTicketsList,
  TicketStatsGrid,
} from '../components/dashboard';
import { EmptyState, ErrorState, PageHeader } from '../components/common';
import { useTickets } from '../hooks/tickets';
import { ROUTES } from '../routes/paths';
import {
  computeTicketStatusCounts,
  getRecentTickets,
} from '../utils/dashboard';

export default function DashboardPage() {
  const { tickets, queryState, refetch } = useTickets();
  const isLoading = queryState.isLoading || queryState.isFetching;

  const counts = computeTicketStatusCounts(tickets ?? []);
  const recentTickets = getRecentTickets(tickets ?? []);

  return (
    <section>
      <PageHeader
        title="Dashboard"
        action={
          <Link
            to={ROUTES.ticketCreate}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Create Ticket
          </Link>
        }
      />

      {isLoading ? <DashboardSkeleton /> : null}

      {queryState.error ? (
        <ErrorState
          error={queryState.error}
          title="Unable to load dashboard data"
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !queryState.error && tickets?.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          message="Create your first support ticket to get started."
          action={
            <Link
              to={ROUTES.ticketCreate}
              className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Create Ticket
            </Link>
          }
        />
      ) : null}

      {!isLoading && !queryState.error && tickets && tickets.length > 0 ? (
        <>
          <TicketStatsGrid counts={counts} />
          <RecentTicketsList tickets={recentTickets} />
        </>
      ) : null}
    </section>
  );
}
