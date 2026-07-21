import type { Request, Response } from 'express';

import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  commentService,
  type AddCommentInput,
  type CommentService,
} from '../services/CommentService.js';
import { serializeComment } from '../utils/serializers.js';

export class CommentController {
  constructor(private readonly comments: CommentService = commentService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as AddCommentInput;

    const comment = await this.comments.addComment(req.params.id as string, {
      message: body.message,
      createdBy: body.createdBy,
    });

    res.status(201).json({ comment: serializeComment(comment) });
  });
}

export const commentController = new CommentController();
