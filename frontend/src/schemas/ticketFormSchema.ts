import { z } from 'zod';

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

export const ticketFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z.enum(PRIORITIES, {
    error: 'Priority is required',
  }),
  assignedTo: z.string(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
