import { Link } from 'react-router-dom';

import type { Ticket } from '../../api/types';
import { Badge } from '../common/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../common/Table';
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

const HIDDEN_MD = 'hidden md:table-cell';
const HIDDEN_LG = 'hidden lg:table-cell';

export function TicketTable({ tickets }: TicketTableProps) {
  return (
    <Table caption="Support tickets">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="whitespace-nowrap">Priority</TableHead>
          <TableHead className="whitespace-nowrap">Status</TableHead>
          <TableHead className={HIDDEN_MD}>Assigned To</TableHead>
          <TableHead className={HIDDEN_LG}>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="hover:bg-slate-50">
            <TableCell className="max-w-[10rem] sm:max-w-xs lg:max-w-md">
              <Link
                to={ROUTES.ticketDetail(ticket.id)}
                className="block truncate font-medium text-slate-900 hover:text-slate-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                title={ticket.title}
              >
                {ticket.title}
              </Link>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge className={getTicketPriorityClassName(ticket.priority)}>
                {formatTicketPriority(ticket.priority)}
              </Badge>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Badge className={getTicketStatusClassName(ticket.status)}>
                {formatTicketStatus(ticket.status)}
              </Badge>
            </TableCell>
            <TableCell className={`${HIDDEN_MD} max-w-[8rem] truncate sm:max-w-none`}>
              {ticket.assignedTo?.name ?? 'Unassigned'}
            </TableCell>
            <TableCell className={`${HIDDEN_LG} whitespace-nowrap`}>
              {formatDateTime(ticket.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
