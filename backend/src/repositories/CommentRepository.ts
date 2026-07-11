import type { Types } from 'mongoose';

import {
  Comment,
  type IComment,
  type CommentDocument,
  type CommentModel,
} from '../models/Comment.js';

export type CreateCommentInput = Pick<
  IComment,
  'ticketId' | 'message' | 'createdBy'
>;

const USER_SUMMARY_FIELDS = 'name email';

export class CommentRepository {
  constructor(private readonly model: CommentModel = Comment) {}

  async findById(
    id: Types.ObjectId | string,
  ): Promise<CommentDocument | null> {
    return this.model.findById(id).exec();
  }

  async findByTicketId(
    ticketId: Types.ObjectId | string,
  ): Promise<CommentDocument[]> {
    return this.model
      .find({ ticketId })
      .sort({ createdAt: 1 })
      .populate('createdBy', USER_SUMMARY_FIELDS)
      .exec();
  }

  async create(data: CreateCommentInput): Promise<CommentDocument> {
    return this.model.create(data);
  }

  async createPopulated(data: CreateCommentInput): Promise<CommentDocument> {
    const comment = await this.model.create(data);
    await comment.populate('createdBy', USER_SUMMARY_FIELDS);
    return comment;
  }
}

export const commentRepository = new CommentRepository();
