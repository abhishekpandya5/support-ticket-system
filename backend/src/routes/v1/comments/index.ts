import { Router } from 'express';

import { commentController } from '../../../controllers/CommentController.js';
import { validateBody, validateParams } from '../../../middleware/validate.js';
import { addCommentSchema } from '../../../validators/comments/schemas.js';
import { idParamSchema } from '../../../validators/shared.js';

export const commentRouter = Router({ mergeParams: true });

commentRouter.post(
  '/',
  validateParams(idParamSchema('ticket ID')),
  validateBody(addCommentSchema),
  commentController.create,
);
