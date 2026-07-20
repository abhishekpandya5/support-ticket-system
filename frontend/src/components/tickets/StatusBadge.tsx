import type { TicketStatus } from '../../api/types';
import { Badge } from '../common/Badge';
import {
  formatTicketStatus,
  getTicketStatusClassName,
} from '../../utils/ticketDisplay';

type StatusBadgeProps = {
  status: TicketStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={getTicketStatusClassName(status)}>
      {formatTicketStatus(status)}
    </Badge>
  );
}
