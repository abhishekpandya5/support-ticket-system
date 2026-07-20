import { describe, expect, it } from 'vitest';

import { createTicketFormSchema } from './createTicketFormSchema';
import { ticketFormSchema } from './ticketFormSchema';

describe('ticket form schemas', () => {
  it('keeps create validation stricter than edit', () => {
    const shortCreate = createTicketFormSchema.safeParse({
      title: 'Bug',
      description: 'Too short',
      priority: 'low',
      assignedTo: 'user-1',
    });

    expect(shortCreate.success).toBe(false);

    const shortEdit = ticketFormSchema.safeParse({
      title: 'Bug',
      description: 'Short',
      priority: 'low',
      assignedTo: '',
    });

    expect(shortEdit.success).toBe(true);
  });

  it('accepts valid create payloads', () => {
    const result = createTicketFormSchema.safeParse({
      title: 'Valid ticket title',
      description: 'This is a long enough description.',
      priority: 'high',
      assignedTo: 'user-1',
    });

    expect(result.success).toBe(true);
  });
});
