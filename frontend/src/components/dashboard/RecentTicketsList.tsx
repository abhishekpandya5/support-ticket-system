import { Link } from 'react-router-dom';

import type { Ticket } from '../../api/types';
import { EmptyState } from '../common';
import { ROUTES } from '../../routes/paths';
import { RecentTicketItem } from './RecentTicketItem';

type RecentTicketsListProps = {
  tickets: Ticket[];
};

export function RecentTicketsList({ tickets }: RecentTicketsListProps) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
        <Link
          to={ROUTES.tickets}
          className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
        >
          View all
        </Link>
      </div>

      {tickets.length === 0 ? (
        <EmptyState
          title="No recent activity"
          message="Tickets updated recently will appear here."
          compact
          action={
            <Link
              to={ROUTES.tickets}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              View all tickets
            </Link>
          }
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
