import type { TicketPriority } from '../../api/types';
import { Badge } from '../common/Badge';
import {
  formatTicketPriority,
  getTicketPriorityClassName,
} from '../../utils/ticketDisplay';

type PriorityBadgeProps = {
  priority: TicketPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge className={getTicketPriorityClassName(priority)}>
      {formatTicketPriority(priority)}
    </Badge>
  );
}
