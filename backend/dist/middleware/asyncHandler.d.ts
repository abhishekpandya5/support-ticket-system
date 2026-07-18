import type { NextFunction, Request, RequestHandler, Response } from 'express';
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Wraps async route handlers so rejected promises reach the global error middleware.
 */
export declare function asyncHandler(handler: AsyncRequestHandler): RequestHandler;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map