import type { Ticket } from '../../api/types';
import { formatDateTime } from '../../utils/formatDate';

type MetadataItemProps = {
  label: string;
  value: string;
};

function MetadataItem({ label, value }: MetadataItemProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

type TicketMetadataProps = {
  ticket: Ticket;
};

export function TicketMetadata({ ticket }: TicketMetadataProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetadataItem
        label="Assigned To"
        value={ticket.assignedTo?.name ?? 'Unassigned'}
      />
      <MetadataItem label="Created By" value={ticket.createdBy.name} />
      <MetadataItem label="Created" value={formatDateTime(ticket.createdAt)} />
      <MetadataItem label="Updated" value={formatDateTime(ticket.updatedAt)} />
    </dl>
  );
}
