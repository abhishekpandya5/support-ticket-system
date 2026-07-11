import type { Types } from 'mongoose';

import type { CommentDocument } from '../models/Comment.js';
import {
  commentRepository,
  type CommentRepository,
} from '../repositories/CommentRepository.js';
import {
  ticketRepository,
  type TicketRepository,
} from '../repositories/TicketRepository.js';
import { invalidObjectIdError, notFoundError, validationError } from '../utils/errors.js';
import { isValidObjectId, toObjectId } from '../utils/objectId.js';
import { userService, type UserService } from './UserService.js';

export type AddCommentInput = {
  message: string;
  createdBy: string;
};

export class CommentService {
  constructor(
    private readonly comments: CommentRepository = commentRepository,
    private readonly tickets: TicketRepository = ticketRepository,
    private readonly users: UserService = userService,
  ) {}

  async getCommentsByTicketId(ticketId: string): Promise<CommentDocument[]> {
    this.assertValidObjectId(ticketId, 'ticket ID');
    return this.comments.findByTicketId(ticketId);
  }

  async addComment(
    ticketId: string,
    input: AddCommentInput,
  ): Promise<CommentDocument> {
    this.assertValidObjectId(ticketId, 'ticket ID');

    const message = input.message?.trim() ?? '';

    if (!message) {
      throw validationError('Validation failed', {
        message: 'Message is required',
      });
    }

    const ticket = await this.tickets.findById(ticketId);

    if (!ticket) {
      throw notFoundError('Ticket');
    }

    const author = await this.users.assertUserExists(input.createdBy);

    return this.comments.createPopulated({
      ticketId: toObjectId(ticketId),
      message,
      createdBy: author._id as Types.ObjectId,
    });
  }

  private assertValidObjectId(value: string, fieldLabel: string): void {
    if (!isValidObjectId(value)) {
      throw invalidObjectIdError(fieldLabel);
    }
  }
}

export const commentService = new CommentService();
