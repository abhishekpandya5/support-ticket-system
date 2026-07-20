import {
  DashboardSkeleton,
  RecentTicketsList,
  TicketStatsGrid,
} from '../components/dashboard';
import {
  ButtonLink,
  EmptyState,
  ErrorState,
  PageHeader,
} from '../components/common';
import { useQueryPageState } from '../hooks/useQueryPageState';
import { useTickets } from '../hooks/tickets';
import { ROUTES } from '../routes/paths';
import {
  computeTicketStatusCounts,
  getRecentTickets,
} from '../utils/dashboard';

export default function DashboardPage() {
  const { tickets, queryState, refetch } = useTickets();
  const { isInitialLoading, error } = useQueryPageState(queryState);

  const counts = computeTicketStatusCounts(tickets ?? []);
  const recentTickets = getRecentTickets(tickets ?? []);

  return (
    <section className="min-w-0">
      <PageHeader
        title="Dashboard"
        action={
          <ButtonLink to={ROUTES.ticketCreate}>Create Ticket</ButtonLink>
        }
      />

      {isInitialLoading ? <DashboardSkeleton /> : null}

      {error ? (
        <ErrorState
          error={error}
          title="Unable to load dashboard data"
          onRetry={() => refetch()}
        />
      ) : null}

      {!isInitialLoading && !error && tickets?.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          message="Create your first support ticket to get started."
          action={
            <ButtonLink to={ROUTES.ticketCreate}>Create Ticket</ButtonLink>
          }
        />
      ) : null}

      {!isInitialLoading && !error && tickets && tickets.length > 0 ? (
        <>
          <TicketStatsGrid counts={counts} />
          <RecentTicketsList tickets={recentTickets} />
        </>
      ) : null}
    </section>
  );
}
