import { asyncHandler } from '../middleware/asyncHandler.js';
import { commentService, } from '../services/CommentService.js';
import { serializeComment } from '../utils/serializers.js';
export class CommentController {
    comments;
    constructor(comments = commentService) {
        this.comments = comments;
    }
    create = asyncHandler(async (req, res) => {
        const body = req.body;
        const comment = await this.comments.addComment(req.params.id, {
            message: body.message,
            createdBy: body.createdBy,
        });
        res.status(201).json({ comment: serializeComment(comment) });
    });
}
export const commentController = new CommentController();
//# sourceMappingURL=CommentController.js.map