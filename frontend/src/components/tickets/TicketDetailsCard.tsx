import type { Ticket } from '../../api/types';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type TicketDetailsCardProps = {
  ticket: Ticket;
};

export function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">{ticket.title}</h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {ticket.description}
      </p>
    </article>
  );
}
