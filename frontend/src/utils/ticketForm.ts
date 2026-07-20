import type { Ticket, UpdateTicketRequest } from '../api/types';
import type { TicketFormValues } from '../schemas/ticketFormSchema';

export function mapTicketToFormValues(ticket: Ticket): TicketFormValues {
  return {
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo?.id ?? '',
  };
}

export function toUpdateTicketRequest(
  values: TicketFormValues,
): UpdateTicketRequest {
  return {
    title: values.title,
    description: values.description,
    priority: values.priority,
    assignedTo: values.assignedTo === '' ? null : values.assignedTo,
  };
}
