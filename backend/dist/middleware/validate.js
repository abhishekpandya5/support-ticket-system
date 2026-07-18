import { invalidObjectIdError, statusUpdateNotAllowedError, validationError, } from '../utils/errors.js';
import { formatZodFieldErrors, isObjectIdFieldError, objectIdLabelFromMessage, } from '../validators/shared.js';
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function assertForbiddenFields(value, forbiddenFields) {
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
function resolveValidationError(target, error) {
    const fields = formatZodFieldErrors(error);
    if (isObjectIdFieldError(target, fields)) {
        const key = Object.keys(fields)[0];
        return invalidObjectIdError(objectIdLabelFromMessage(fields[key]));
    }
    return validationError('Validation failed', fields);
}
function parseTarget(target, schema, value) {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw resolveValidationError(target, result.error);
    }
    return result.data;
}
/**
 * Validates a single request property against a Zod schema and replaces it with parsed data.
 */
export function validate(schema, target = 'body', options) {
    return (req, _res, next) => {
        try {
            if (target === 'body') {
                assertForbiddenFields(req.body, options?.forbiddenFields);
            }
            req[target] = parseTarget(target, schema, req[target]);
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
/** Validates `req.body` against a Zod schema. */
export function validateBody(schema, options) {
    return validate(schema, 'body', options);
}
/** Validates `req.params` against a Zod schema. */
export function validateParams(schema) {
    return validate(schema, 'params');
}
/** Validates `req.query` against a Zod schema. */
export function validateQuery(schema) {
    return validate(schema, 'query');
}
/**
 * Validates multiple request properties in one middleware.
 * Runs params → query → body so path/query failures short-circuit first.
 */
export function validateRequest(schemas, options) {
    return (req, _res, next) => {
        try {
            if (schemas.params) {
                req.params = parseTarget('params', schemas.params, req.params);
            }
            if (schemas.query) {
                req.query = parseTarget('query', schemas.query, req.query);
            }
            if (schemas.body) {
                assertForbiddenFields(req.body, options?.forbiddenFields);
                req.body = parseTarget('body', schemas.body, req.body);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map