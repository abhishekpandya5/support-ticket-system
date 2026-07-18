/**
 * Shared utility functions.
 */
export { AppError } from './AppError.js';
export { buildErrorResponseBody, isUnexpectedError, mapErrorToResponse, sendErrorResponse, type ApiErrorEnvelope, type ApiErrorResponseBody, type MappedError, } from './errorResponse.js';
export { invalidObjectIdError, notFoundError, statusUpdateNotAllowedError, validationError, } from './errors.js';
export { isValidObjectId, toObjectId } from './objectId.js';
export { escapeRegex } from './regex.js';
export { serializeComment, serializeTicket, serializeUser, serializeUserSummary, type CommentJson, type TicketJson, type UserJson, type UserSummaryJson, } from './serializers.js';
//# sourceMappingURL=index.d.ts.map