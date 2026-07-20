import { Link } from 'react-router-dom';

import type { Ticket } from '../../api/types';
import { ROUTES } from '../../routes/paths';
import { formatRelativeTime } from '../../utils/formatDate';
import { Badge } from '../common/Badge';
import {
  formatTicketPriority,
  formatTicketStatus,
  getTicketPriorityClassName,
  getTicketStatusClassName,
} from '../../utils/ticketDisplay';

type RecentTicketItemProps = {
  ticket: Ticket;
};

export function RecentTicketItem({ ticket }: RecentTicketItemProps) {
  const assignedLabel = ticket.assignedTo?.name ?? 'Unassigned';

  return (
    <Link
      to={ROUTES.ticketDetail(ticket.id)}
      aria-label={`${ticket.title}, ${formatTicketPriority(ticket.priority)} priority, ${formatTicketStatus(ticket.status)}, assigned to ${assignedLabel}`}
      className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">{ticket.title}</p>
        <p className="mt-1 text-sm text-slate-600">
          Assigned to {ticket.assignedTo?.name ?? 'Unassigned'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Badge className={getTicketPriorityClassName(ticket.priority)}>
          {formatTicketPriority(ticket.priority)}
        </Badge>
        <Badge className={getTicketStatusClassName(ticket.status)}>
          {formatTicketStatus(ticket.status)}
        </Badge>
        <span className="text-sm text-slate-500">
          {formatRelativeTime(ticket.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
