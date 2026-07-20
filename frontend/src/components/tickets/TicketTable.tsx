import { Link } from 'react-router-dom';

import type { Ticket } from '../../api/types';
import { Badge } from '../common/Badge';
import { ROUTES } from '../../routes/paths';
import { formatDateTime } from '../../utils/formatDate';
import {
  formatTicketPriority,
  formatTicketStatus,
  getTicketPriorityClassName,
  getTicketStatusClassName,
} from '../../utils/ticketDisplay';

type TicketTableProps = {
  tickets: Ticket[];
};

const headerCellClass =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600';
const bodyCellClass = 'px-4 py-3 text-sm text-slate-700';

export function TicketTable({ tickets }: TicketTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className={headerCellClass}>Title</th>
            <th className={headerCellClass}>Priority</th>
            <th className={headerCellClass}>Status</th>
            <th className={headerCellClass}>Assigned To</th>
            <th className={headerCellClass}>Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-slate-50">
              <td className={bodyCellClass}>
                <Link
                  to={ROUTES.ticketDetail(ticket.id)}
                  className="font-medium text-slate-900 hover:text-slate-700 hover:underline"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className={bodyCellClass}>
                <Badge className={getTicketPriorityClassName(ticket.priority)}>
                  {formatTicketPriority(ticket.priority)}
                </Badge>
              </td>
              <td className={bodyCellClass}>
                <Badge className={getTicketStatusClassName(ticket.status)}>
                  {formatTicketStatus(ticket.status)}
                </Badge>
              </td>
              <td className={bodyCellClass}>
                {ticket.assignedTo?.name ?? 'Unassigned'}
              </td>
              <td className={bodyCellClass}>{formatDateTime(ticket.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
