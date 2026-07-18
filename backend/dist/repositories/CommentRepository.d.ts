import type { Types } from 'mongoose';
import { type IComment, type CommentDocument, type CommentModel } from '../models/Comment.js';
export type CreateCommentInput = Pick<IComment, 'ticketId' | 'message' | 'createdBy'>;
export declare class CommentRepository {
    private readonly model;
    constructor(model?: CommentModel);
    findById(id: Types.ObjectId | string): Promise<CommentDocument | null>;
    findByTicketId(ticketId: Types.ObjectId | string): Promise<CommentDocument[]>;
    create(data: CreateCommentInput): Promise<CommentDocument>;
    createPopulated(data: CreateCommentInput): Promise<CommentDocument>;
}
export declare const commentRepository: CommentRepository;
//# sourceMappingURL=CommentRepository.d.ts.map