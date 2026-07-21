import { z } from 'zod';

import {
  createAssignedToField,
  createTicketDescriptionField,
  createTicketTitleField,
  ticketPriorityField,
} from './ticketFields';

export const createTicketFormSchema = z.object({
  title: createTicketTitleField,
  description: createTicketDescriptionField,
  priority: ticketPriorityField,
  assignedTo: createAssignedToField,
});

export type CreateTicketFormValues = z.infer<typeof createTicketFormSchema>;

export const CREATE_TICKET_DEFAULT_VALUES: CreateTicketFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  assignedTo: '',
};
