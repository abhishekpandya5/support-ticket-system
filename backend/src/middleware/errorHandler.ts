import type { ErrorRequestHandler, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ERROR_CODES } from '../constants/errorCodes.js';
import { getEnv } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('error-handler');

interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

function sendError(
  res: Response,
  statusCode: number,
  body: ErrorResponseBody,
): void {
  res.status(statusCode).json(body);
}

function isMongooseValidationError(
  error: unknown,
): error is MongooseError.ValidationError {
  return error instanceof MongooseError.ValidationError;
}

function isMongooseCastError(error: unknown): error is MongooseError.CastError {
  return error instanceof MongooseError.CastError;
}

function mapMongooseValidationError(
  error: MongooseError.ValidationError,
): ErrorResponseBody {
  const fields: Record<string, string> = {};

  for (const [field, issue] of Object.entries(error.errors)) {
    fields[field] = issue.message;
  }

  return {
    error: {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      details: { fields },
    },
  };
}

/**
 * Global Express error handler — must be registered last.
 * Maps known errors to the API error envelope; logs and masks unknown errors.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.statusCode, {
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (isMongooseValidationError(err)) {
    sendError(res, 400, mapMongooseValidationError(err));
    return;
  }

  if (isMongooseCastError(err)) {
    sendError(res, 400, {
      error: {
        code: ERROR_CODES.INVALID_OBJECT_ID,
        message: 'Invalid resource ID',
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Unknown error';

  log.error('Unhandled error', {
    name: err instanceof Error ? err.name : 'UnknownError',
    message,
    ...(getEnv().NODE_ENV !== 'production' && err instanceof Error && err.stack
      ? { stack: err.stack }
      : {}),
  });

  sendError(res, 500, {
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
  });
};
