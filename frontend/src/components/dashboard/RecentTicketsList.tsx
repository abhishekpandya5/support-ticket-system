import type { Ticket } from '../../api/types';
import { EmptyState, TextLink } from '../common';
import { ROUTES } from '../../routes/paths';
import { RecentTicketItem } from './RecentTicketItem';

type RecentTicketsListProps = {
  tickets: Ticket[];
};

export function RecentTicketsList({ tickets }: RecentTicketsListProps) {
  return (
    <section className="mt-8" aria-labelledby="recent-tickets-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="recent-tickets-heading" className="text-lg font-semibold text-slate-900">
          Recent Tickets
        </h2>
        <TextLink to={ROUTES.tickets}>View all</TextLink>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No recent activity"
          message="Tickets updated recently will appear here."
          compact
          action={<TextLink to={ROUTES.tickets}>View all tickets</TextLink>}
        />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <RecentTicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  );
}
