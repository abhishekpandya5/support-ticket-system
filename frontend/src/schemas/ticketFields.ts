import { z } from 'zod';

import { TICKET_PRIORITIES } from '../utils/ticketListFilters';

export const ticketPriorityField = z.enum(TICKET_PRIORITIES, {
  error: 'Priority is required',
});

/** Create flow: stricter title rules (unchanged product behavior). */
export const createTicketTitleField = z
  .string()
  .trim()
  .min(5, 'Title must be at least 5 characters')
  .max(100, 'Title cannot exceed 100 characters');

/** Edit flow: matches update form limits (unchanged product behavior). */
export const editTicketTitleField = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(200, 'Title cannot exceed 200 characters');

/** Create flow: stricter description minimum (unchanged product behavior). */
export const createTicketDescriptionField = z
  .string()
  .trim()
  .min(10, 'Description must be at least 10 characters');

/** Edit flow: matches update form limits (unchanged product behavior). */
export const editTicketDescriptionField = z
  .string()
  .trim()
  .min(1, 'Description is required')
  .max(5000, 'Description cannot exceed 5000 characters');

export const createAssignedToField = z
  .string()
  .min(1, 'Assigned user is required');

export const editAssignedToField = z.string();
