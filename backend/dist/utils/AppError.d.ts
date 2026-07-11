import type { ErrorCode } from '../constants/errorCodes.js';
export declare class AppError extends Error {
    readonly code: ErrorCode;
    readonly statusCode: number;
    readonly details?: Record<string, unknown>;
    constructor(code: ErrorCode, statusCode: number, message: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=AppError.d.ts.map