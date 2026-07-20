import type { TicketStatusCounts } from '../../utils/dashboard';
import { ROUTES } from '../../routes/paths';
import { StatCard } from './StatCard';

type TicketStatsGridProps = {
  counts: TicketStatusCounts;
};

export function TicketStatsGrid({ counts }: TicketStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total Tickets" value={counts.total} to={ROUTES.tickets} />
      <StatCard
        label="Open Tickets"
        value={counts.open}
        to={`${ROUTES.tickets}?status=open`}
        tone="info"
      />
      <StatCard
        label="In Progress Tickets"
        value={counts.in_progress}
        to={`${ROUTES.tickets}?status=in_progress`}
        tone="primary"
      />
      <StatCard
        label="Resolved Tickets"
        value={counts.resolved}
        to={`${ROUTES.tickets}?status=resolved`}
        tone="success"
      />
      <StatCard
        label="Closed Tickets"
        value={counts.closed}
        to={`${ROUTES.tickets}?status=closed`}
        tone="muted"
      />
    </div>
  );
}
