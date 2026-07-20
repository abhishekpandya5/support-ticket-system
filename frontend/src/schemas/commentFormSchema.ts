import { z } from 'zod';

export const commentFormSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message is required')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
