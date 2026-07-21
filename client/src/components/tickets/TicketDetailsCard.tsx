import type { Ticket } from '../../api/types';
import { Card } from '../common/Card';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

type TicketDetailsCardProps = {
  ticket: Ticket;
};

export function TicketDetailsCard({ ticket }: TicketDetailsCardProps) {
  return (
    <Card as="article">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="min-w-0 text-lg font-semibold break-words text-slate-900 sm:text-xl">
          {ticket.title}
        </h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {ticket.description}
      </p>
    </Card>
  );
}
