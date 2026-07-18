import { commentRepository, } from '../repositories/CommentRepository.js';
import { ticketRepository, } from '../repositories/TicketRepository.js';
import { invalidObjectIdError, notFoundError, validationError } from '../utils/errors.js';
import { isValidObjectId, toObjectId } from '../utils/objectId.js';
import { userService } from './UserService.js';
export class CommentService {
    comments;
    tickets;
    users;
    constructor(comments = commentRepository, tickets = ticketRepository, users = userService) {
        this.comments = comments;
        this.tickets = tickets;
        this.users = users;
    }
    async getCommentsByTicketId(ticketId) {
        this.assertValidObjectId(ticketId, 'ticket ID');
        return this.comments.findByTicketId(ticketId);
    }
    async addComment(ticketId, input) {
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
            createdBy: author._id,
        });
    }
    assertValidObjectId(value, fieldLabel) {
        if (!isValidObjectId(value)) {
            throw invalidObjectIdError(fieldLabel);
        }
    }
}
export const commentService = new CommentService();
//# sourceMappingURL=CommentService.js.map