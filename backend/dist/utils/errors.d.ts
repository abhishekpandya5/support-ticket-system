import { AppError } from './AppError.js';
export declare function notFoundError(resource: string, message?: string): AppError;
export declare function validationError(message: string, fields?: Record<string, string>): AppError;
export declare function invalidObjectIdError(fieldLabel: string): AppError;
export declare function statusUpdateNotAllowedError(): AppError;
//# sourceMappingURL=errors.d.ts.map