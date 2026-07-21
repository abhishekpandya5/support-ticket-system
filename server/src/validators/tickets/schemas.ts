import { z } from 'zod';

import {
  TICKET_PRIORITY_VALUES,
  TICKET_STATUS_VALUES,
} from '../../constants/enums.js';
import {
  nonEmptyTrimmedString,
  objectIdField,
  optionalNonEmptyTrimmedString,
} from '../shared.js';

const priorityEnum = z.enum(TICKET_PRIORITY_VALUES, {
  error: `Priority must be one of: ${TICKET_PRIORITY_VALUES.join(', ')}`,
});

const statusEnum = z.enum(TICKET_STATUS_VALUES, {
  error: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
});

export const createTicketSchema = z.object({
  title: nonEmptyTrimmedString('Title', 200),
  description: nonEmptyTrimmedString('Description', 5000),
  priority: priorityEnum,
  createdBy: objectIdField('createdBy ID'),
  assignedTo: z.union([objectIdField('assignedTo ID'), z.null()]).optional(),
});

export const updateTicketSchema = z
  .object({
    title: optionalNonEmptyTrimmedString('Title', 200).optional(),
    description: optionalNonEmptyTrimmedString('Description', 5000).optional(),
    priority: priorityEnum.optional(),
    assignedTo: z.union([objectIdField('assignedTo ID'), z.null()]).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.assignedTo !== undefined,
    {
      message: 'At least one field must be provided for update',
      path: ['_form'],
    },
  );

export const updateStatusSchema = z.object({
  status: statusEnum,
});

export type CreateTicketBody = z.infer<typeof createTicketSchema>;
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
