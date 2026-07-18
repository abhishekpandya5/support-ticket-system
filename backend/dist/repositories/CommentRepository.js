import { Comment, } from '../models/Comment.js';
const USER_SUMMARY_FIELDS = 'name email';
export class CommentRepository {
    model;
    constructor(model = Comment) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findByTicketId(ticketId) {
        return this.model
            .find({ ticketId })
            .sort({ createdAt: 1 })
            .populate('createdBy', USER_SUMMARY_FIELDS)
            .exec();
    }
    async create(data) {
        return this.model.create(data);
    }
    async createPopulated(data) {
        const comment = await this.model.create(data);
        await comment.populate('createdBy', USER_SUMMARY_FIELDS);
        return comment;
    }
}
export const commentRepository = new CommentRepository();
//# sourceMappingURL=CommentRepository.js.map