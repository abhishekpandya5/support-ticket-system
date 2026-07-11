import { ERROR_CODES } from '../constants/errorCodes.js';
import { AppError } from './AppError.js';

export function notFoundError(
  resource: string,
  message?: string,
): AppError {
  return new AppError(
    ERROR_CODES.NOT_FOUND,
    404,
    message ?? `${resource} not found`,
  );
}

export function validationError(
  message: string,
  fields?: Record<string, string>,
): AppError {
  return new AppError(
    ERROR_CODES.VALIDATION_ERROR,
    400,
    message,
    fields ? { fields } : undefined,
  );
}

export function invalidObjectIdError(fieldLabel: string): AppError {
  return new AppError(
    ERROR_CODES.INVALID_OBJECT_ID,
    400,
    `Invalid ${fieldLabel}`,
    { fields: { [fieldLabel]: `Invalid ${fieldLabel}` } },
  );
}

export function statusUpdateNotAllowedError(): AppError {
  return new AppError(
    ERROR_CODES.STATUS_UPDATE_NOT_ALLOWED,
    400,
    'Use the status endpoint to change ticket status',
  );
}
