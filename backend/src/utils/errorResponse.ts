import type { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { ERROR_CODES } from '../constants/errorCodes.js';
import type { ErrorCode } from '../constants/errorCodes.js';
import { AppError } from './AppError.js';
import { formatZodFieldErrors } from '../validators/shared.js';
import { InvalidTransitionError } from '../stateMachine/InvalidTransitionError.js';

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

type BodyParserError = Error & {
  status?: number;
  type?: string;
};

function isBodyParserError(error: unknown): error is BodyParserError {
  return (
    error instanceof Error &&
    'type' in error &&
    typeof (error as BodyParserError).type === 'string'
  );
}

function isMongooseValidationError(
  error: unknown,
): error is MongooseError.ValidationError {
  return error instanceof MongooseError.ValidationError;
}

function isMongooseCastError(error: unknown): error is MongooseError.CastError {
  return error instanceof MongooseError.CastError;
}

function isDocumentNotFoundError(
  error: unknown,
): error is MongooseError.DocumentNotFoundError {
  return error instanceof MongooseError.DocumentNotFoundError;
}

function isMongoServerError(
  error: unknown,
): error is mongoose.mongo.MongoServerError {
  return error instanceof mongoose.mongo.MongoServerError;
}

function mapMongooseValidationError(
  error: MongooseError.ValidationError,
): ApiErrorEnvelope {
  const fields: Record<string, string> = {};

  for (const [field, issue] of Object.entries(error.errors)) {
    fields[field] = issue.message;
  }

  return {
    code: ERROR_CODES.VALIDATION_ERROR,
    message: 'Validation failed',
    details: { fields },
  };
}

function mapDuplicateKeyError(
  error: mongoose.mongo.MongoServerError,
): ApiErrorEnvelope {
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

function mapBodyParserError(error: BodyParserError): MappedError {
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
export function mapErrorToResponse(error: unknown): MappedError {
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

export function isUnexpectedError(error: unknown): boolean {
  return mapErrorToResponse(error).statusCode === 500;
}

export function buildErrorResponseBody(
  requestId: string,
  envelope: ApiErrorEnvelope,
  options?: { stack?: string },
): ApiErrorResponseBody {
  const body: ApiErrorResponseBody = {
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

export function sendErrorResponse(
  res: Response,
  requestId: string,
  mapped: MappedError,
  options?: { includeStack?: boolean; stack?: string },
): void {
  const stack =
    options?.includeStack === true && options.stack
      ? options.stack
      : undefined;

  res.status(mapped.statusCode).json(
    buildErrorResponseBody(
      requestId,
      mapped.envelope,
      stack ? { stack } : undefined,
    ),
  );
}
