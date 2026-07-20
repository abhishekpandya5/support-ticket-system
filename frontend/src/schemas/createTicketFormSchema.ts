import { z } from 'zod';

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

export const createTicketFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  priority: z.enum(PRIORITIES, {
    error: 'Priority is required',
  }),
  assignedTo: z.string().min(1, 'Assigned user is required'),
});

export type CreateTicketFormValues = z.infer<typeof createTicketFormSchema>;

export const CREATE_TICKET_DEFAULT_VALUES: CreateTicketFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  assignedTo: '',
};
