import { z } from 'zod';

import {
  editAssignedToField,
  editTicketDescriptionField,
  editTicketTitleField,
  ticketPriorityField,
} from './ticketFields';

export const ticketFormSchema = z.object({
  title: editTicketTitleField,
  description: editTicketDescriptionField,
  priority: ticketPriorityField,
  assignedTo: editAssignedToField,
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
