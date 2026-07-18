import { randomUUID } from 'node:crypto';
export const REQUEST_ID_HEADER = 'x-request-id';
/**
 * Assigns a request ID for tracing. Reuses the incoming header when present.
 */
export function requestIdMiddleware() {
    return (req, res, next) => {
        const incoming = req.header(REQUEST_ID_HEADER);
        const requestId = incoming !== undefined && incoming.trim().length > 0
            ? incoming.trim()
            : randomUUID();
        req.requestId = requestId;
        res.setHeader('X-Request-Id', requestId);
        next();
    };
}
//# sourceMappingURL=requestId.js.map