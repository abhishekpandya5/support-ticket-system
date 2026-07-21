import type { CreateTicketRequest } from '../api/types';
import type { CreateTicketFormValues } from '../schemas/createTicketFormSchema';

export function toCreateTicketRequest(
  values: CreateTicketFormValues,
  createdBy: string,
): CreateTicketRequest {
  return {
    title: values.title,
    description: values.description,
    priority: values.priority,
    createdBy,
    assignedTo: values.assignedTo,
  };
}
