import { Router } from 'express';

import { commentController } from '../../../controllers/CommentController.js';

export const commentRouter = Router({ mergeParams: true });

commentRouter.post('/', commentController.create);
