import type { RequestHandler } from 'express';
export declare const REQUEST_ID_HEADER = "x-request-id";
/**
 * Assigns a request ID for tracing. Reuses the incoming header when present.
 */
export declare function requestIdMiddleware(): RequestHandler;
//# sourceMappingURL=requestId.d.ts.map