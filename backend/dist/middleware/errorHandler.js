import { getEnv } from '../config/env.js';
import { isUnexpectedError, mapErrorToResponse, sendErrorResponse, } from '../utils/errorResponse.js';
import { createLogger } from '../utils/logger.js';
const log = createLogger('error-handler');
/**
 * Global Express error handler — must be registered last.
 * Maps known errors to the API error envelope; logs and masks unknown errors.
 */
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    const requestId = req.requestId;
    const mapped = mapErrorToResponse(err);
    const isProduction = getEnv().NODE_ENV === 'production';
    const unexpected = isUnexpectedError(err);
    if (unexpected) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        log.error('Unhandled error', {
            requestId,
            name: err instanceof Error ? err.name : 'UnknownError',
            message,
            ...(err instanceof Error && err.stack ? { stack: err.stack } : {}),
        });
    }
    else {
        log.warn('Request failed', {
            requestId,
            statusCode: mapped.statusCode,
            code: mapped.envelope.code,
            message: mapped.envelope.message,
        });
    }
    sendErrorResponse(res, requestId, mapped, {
        includeStack: !isProduction && unexpected,
        ...(unexpected && err instanceof Error && err.stack
            ? { stack: err.stack }
            : {}),
    });
};
//# sourceMappingURL=errorHandler.js.map