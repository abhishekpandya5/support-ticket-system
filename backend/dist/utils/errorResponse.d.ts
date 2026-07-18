import type { Response } from 'express';
import type { ErrorCode } from '../constants/errorCodes.js';
export interface ApiErrorEnvelope {
    code: ErrorCode | string;
    message: string;
    details?: Record<string, unknown>;
}
export interface ApiErrorResponseBody {
    requestId: string;
    error: ApiErrorEnvelope;
}
export interface MappedError {
    statusCode: number;
    envelope: ApiErrorEnvelope;
}
/**
 * Maps a thrown value to a consistent API error envelope and HTTP status.
 */
export declare function mapErrorToResponse(error: unknown): MappedError;
export declare function isUnexpectedError(error: unknown): boolean;
export declare function buildErrorResponseBody(requestId: string, envelope: ApiErrorEnvelope, options?: {
    stack?: string;
}): ApiErrorResponseBody;
export declare function sendErrorResponse(res: Response, requestId: string, mapped: MappedError, options?: {
    includeStack?: boolean;
    stack?: string;
}): void;
//# sourceMappingURL=errorResponse.d.ts.map