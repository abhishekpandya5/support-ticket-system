import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
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
/**
 * Validates a single request property against a Zod schema and replaces it with parsed data.
 */
export declare function validate<TSchema extends ZodType>(schema: TSchema, target?: ValidationTarget, options?: ValidateBodyOptions): (req: Request, _res: Response, next: NextFunction) => void;
/** Validates `req.body` against a Zod schema. */
export declare function validateBody<TSchema extends ZodType>(schema: TSchema, options?: ValidateBodyOptions): (req: Request, _res: Response, next: NextFunction) => void;
/** Validates `req.params` against a Zod schema. */
export declare function validateParams<TSchema extends ZodType>(schema: TSchema): (req: Request, _res: Response, next: NextFunction) => void;
/** Validates `req.query` against a Zod schema. */
export declare function validateQuery<TSchema extends ZodType>(schema: TSchema): (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Validates multiple request properties in one middleware.
 * Runs params → query → body so path/query failures short-circuit first.
 */
export declare function validateRequest(schemas: RequestValidationSchemas, options?: ValidateRequestOptions): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map