import type { NextFunction, Request, Response } from 'express';
import type { ZodError, ZodType } from 'zod';

import {
  invalidObjectIdError,
  statusUpdateNotAllowedError,
  validationError,
} from '../utils/errors.js';
import type { AppError } from '../utils/AppError.js';
import {
  formatZodFieldErrors,
  isObjectIdFieldError,
  objectIdLabelFromMessage,
} from '../validators/shared.js';

export type ValidationTarget = 'body' | 'params' | 'query';

export interface ValidateBodyOptions {
  /** Rejects these body fields before schema parsing (e.g. `status` on field update). */
  forbiddenFields?: string[];
}

export interface RequestValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export interface ValidateRequestOptions {
  forbiddenFields?: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertForbiddenFields(
  value: unknown,
  forbiddenFields: string[] | undefined,
): void {
  if (!forbiddenFields || !isRecord(value)) {
    return;
  }

  for (const field of forbiddenFields) {
    if (!(field in value)) {
      continue;
    }

    if (field === 'status') {
      throw statusUpdateNotAllowedError();
    }

    throw validationError('Validation failed', {
      [field]: `${field} is not allowed`,
    });
  }
}

function resolveValidationError(
  target: ValidationTarget,
  error: ZodError,
): AppError {
  const fields = formatZodFieldErrors(error);

  if (isObjectIdFieldError(target, fields)) {
    const key = Object.keys(fields)[0] as string;
    return invalidObjectIdError(objectIdLabelFromMessage(fields[key] as string));
  }

  return validationError('Validation failed', fields);
}

function parseTarget<TSchema extends ZodType>(
  target: ValidationTarget,
  schema: TSchema,
  value: unknown,
): TSchema['_output'] {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw resolveValidationError(target, result.error);
  }

  return result.data;
}

/**
 * Validates a single request property against a Zod schema and replaces it with parsed data.
 */
export function validate<TSchema extends ZodType>(
  schema: TSchema,
  target: ValidationTarget = 'body',
  options?: ValidateBodyOptions,
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (target === 'body') {
        assertForbiddenFields(req.body, options?.forbiddenFields);
      }

      req[target] = parseTarget(target, schema, req[target]) as Request[typeof target];
      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}

/** Validates `req.body` against a Zod schema. */
export function validateBody<TSchema extends ZodType>(
  schema: TSchema,
  options?: ValidateBodyOptions,
) {
  return validate(schema, 'body', options);
}

/** Validates `req.params` against a Zod schema. */
export function validateParams<TSchema extends ZodType>(schema: TSchema) {
  return validate(schema, 'params');
}

/** Validates `req.query` against a Zod schema. */
export function validateQuery<TSchema extends ZodType>(schema: TSchema) {
  return validate(schema, 'query');
}

/**
 * Validates multiple request properties in one middleware.
 * Runs params → query → body so path/query failures short-circuit first.
 */
export function validateRequest(
  schemas: RequestValidationSchemas,
  options?: ValidateRequestOptions,
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        req.params = parseTarget(
          'params',
          schemas.params,
          req.params,
        ) as Request['params'];
      }

      if (schemas.query) {
        req.query = parseTarget(
          'query',
          schemas.query,
          req.query,
        ) as Request['query'];
      }

      if (schemas.body) {
        assertForbiddenFields(req.body, options?.forbiddenFields);
        req.body = parseTarget('body', schemas.body, req.body);
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
}
