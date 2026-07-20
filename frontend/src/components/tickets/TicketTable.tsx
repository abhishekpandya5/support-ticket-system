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

export function TicketTable({ tickets }: TicketTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="hover:bg-slate-50">
            <TableCell>
              <Link
                to={ROUTES.ticketDetail(ticket.id)}
                className="font-medium text-slate-900 hover:text-slate-700 hover:underline"
              >
                {ticket.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge className={getTicketPriorityClassName(ticket.priority)}>
                {formatTicketPriority(ticket.priority)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getTicketStatusClassName(ticket.status)}>
                {formatTicketStatus(ticket.status)}
              </Badge>
            </TableCell>
            <TableCell>{ticket.assignedTo?.name ?? 'Unassigned'}</TableCell>
            <TableCell>{formatDateTime(ticket.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
