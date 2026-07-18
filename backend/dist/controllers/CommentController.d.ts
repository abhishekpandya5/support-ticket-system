import { type CommentService } from '../services/CommentService.js';
export declare class CommentController {
    private readonly comments;
    constructor(comments?: CommentService);
    create: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const commentController: CommentController;
//# sourceMappingURL=CommentController.d.ts.map