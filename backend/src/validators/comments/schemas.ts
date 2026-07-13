import { z } from 'zod';

import { nonEmptyTrimmedString, objectIdField } from '../shared.js';

export const addCommentSchema = z.object({
  message: nonEmptyTrimmedString('Message', 2000),
  createdBy: objectIdField('createdBy ID'),
});

export type AddCommentBody = z.infer<typeof addCommentSchema>;
