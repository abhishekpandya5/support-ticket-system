import type { Ticket } from '../../api/types';

import { TicketTable } from './TicketTable';

type TicketListProps = {
  tickets: Ticket[];
};

export function TicketList({ tickets }: TicketListProps) {
  return <TicketTable tickets={tickets} />;
}
