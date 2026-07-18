import { Error as MongooseError } from 'mongoose';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { AppError } from './AppError.js';
import { formatZodFieldErrors } from '../validators/shared.js';
import { InvalidTransitionError } from '../stateMachine/InvalidTransitionError.js';
function isBodyParserError(error) {
    return (error instanceof Error &&
        'type' in error &&
        typeof error.type === 'string');
}
function isMongooseValidationError(error) {
    return error instanceof MongooseError.ValidationError;
}
function isMongooseCastError(error) {
    return error instanceof MongooseError.CastError;
}
function isDocumentNotFoundError(error) {
    return error instanceof MongooseError.DocumentNotFoundError;
}
function isMongoServerError(error) {
    return error instanceof mongoose.mongo.MongoServerError;
}
function mapMongooseValidationError(error) {
    const fields = {};
    for (const [field, issue] of Object.entries(error.errors)) {
        fields[field] = issue.message;
    }
    return {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details: { fields },
    };
}
function mapDuplicateKeyError(error) {
    const keyPattern = error.keyPattern ?? {};
    const field = Object.keys(keyPattern)[0] ?? 'field';
    return {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details: {
            fields: {
                [field]: `${field} already exists`,
            },
        },
    };
}
function mapBodyParserError(error) {
    if (error.type === 'entity.parse.failed') {
        return {
            statusCode: 400,
            envelope: {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: 'Invalid JSON body',
            },
        };
    }
    if (error.type === 'entity.too.large') {
        return {
            statusCode: 400,
            envelope: {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: 'Request body is too large',
            },
        };
    }
    return {
        statusCode: error.status ?? 400,
        envelope: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: error.message || 'Invalid request body',
        },
    };
}
/**
 * Maps a thrown value to a consistent API error envelope and HTTP status.
 */
export function mapErrorToResponse(error) {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            envelope: {
                code: error.code,
                message: error.message,
                ...(error.details ? { details: error.details } : {}),
            },
        };
    }
    if (error instanceof InvalidTransitionError) {
        return {
            statusCode: 400,
            envelope: {
                code: error.code,
                message: error.message,
                details: error.toDetails(),
            },
        };
    }
    if (error instanceof ZodError) {
        return {
            statusCode: 400,
            envelope: {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: 'Validation failed',
                details: { fields: formatZodFieldErrors(error) },
            },
        };
    }
    if (isBodyParserError(error)) {
        return mapBodyParserError(error);
    }
    if (isMongooseValidationError(error)) {
        return {
            statusCode: 400,
            envelope: mapMongooseValidationError(error),
        };
    }
    if (isMongooseCastError(error)) {
        return {
            statusCode: 400,
            envelope: {
                code: ERROR_CODES.INVALID_OBJECT_ID,
                message: 'Invalid resource ID',
            },
        };
    }
    if (isDocumentNotFoundError(error)) {
        return {
            statusCode: 404,
            envelope: {
                code: ERROR_CODES.NOT_FOUND,
                message: 'Resource not found',
            },
        };
    }
    if (isMongoServerError(error) && error.code === 11000) {
        return {
            statusCode: 400,
            envelope: mapDuplicateKeyError(error),
        };
    }
    return {
        statusCode: 500,
        envelope: {
            code: ERROR_CODES.INTERNAL_ERROR,
            message: 'An unexpected error occurred',
        },
    };
}
export function isUnexpectedError(error) {
    return mapErrorToResponse(error).statusCode === 500;
}
export function buildErrorResponseBody(requestId, envelope, options) {
    const body = {
        requestId,
        error: envelope,
    };
    if (options?.stack) {
        body.error = {
            ...body.error,
            details: {
                ...(body.error.details ?? {}),
                stack: options.stack,
            },
        };
    }
    return body;
}
export function sendErrorResponse(res, requestId, mapped, options) {
    const stack = options?.includeStack === true && options.stack
        ? options.stack
        : undefined;
    res.status(mapped.statusCode).json(buildErrorResponseBody(requestId, mapped.envelope, stack ? { stack } : undefined));
}
//# sourceMappingURL=errorResponse.js.map