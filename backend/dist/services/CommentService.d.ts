import type { CommentDocument } from '../models/Comment.js';
import { type CommentRepository } from '../repositories/CommentRepository.js';
import { type TicketRepository } from '../repositories/TicketRepository.js';
import { type UserService } from './UserService.js';
export type AddCommentInput = {
    message: string;
    createdBy: string;
};
export declare class CommentService {
    private readonly comments;
    private readonly tickets;
    private readonly users;
    constructor(comments?: CommentRepository, tickets?: TicketRepository, users?: UserService);
    getCommentsByTicketId(ticketId: string): Promise<CommentDocument[]>;
    addComment(ticketId: string, input: AddCommentInput): Promise<CommentDocument>;
    private assertValidObjectId;
}
export declare const commentService: CommentService;
//# sourceMappingURL=CommentService.d.ts.map