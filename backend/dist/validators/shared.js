import { z } from 'zod';
import { TICKET_STATUS_VALUES, } from '../constants/enums.js';
import { isValidObjectId } from '../utils/objectId.js';
export function objectIdField(fieldLabel) {
    return z
        .string()
        .refine(isValidObjectId, { message: `Invalid ${fieldLabel}` });
}
export function nonEmptyTrimmedString(label, maxLength) {
    return z
        .string({ error: `${label} is required` })
        .trim()
        .min(1, { message: `${label} is required` })
        .max(maxLength, {
        message: `${label} cannot exceed ${maxLength} characters`,
    });
}
export function optionalNonEmptyTrimmedString(label, maxLength) {
    return z
        .string()
        .trim()
        .min(1, { message: `${label} cannot be empty` })
        .max(maxLength, {
        message: `${label} cannot exceed ${maxLength} characters`,
    });
}
export function idParamSchema(fieldLabel) {
    return z.object({
        id: objectIdField(fieldLabel),
    });
}
export const listTicketsQuerySchema = z.object({
    search: z.string().optional(),
    status: z
        .enum(TICKET_STATUS_VALUES, {
        error: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
    })
        .optional(),
});
export function formatZodFieldErrors(error) {
    const fields = {};
    for (const issue of error.issues) {
        const path = issue.path.length > 0 ? issue.path.join('.') : '_form';
        if (!fields[path]) {
            fields[path] = issue.message;
        }
    }
    return fields;
}
export function isObjectIdFieldError(target, fields) {
    if (target !== 'params' && target !== 'body') {
        return false;
    }
    const keys = Object.keys(fields);
    if (keys.length !== 1) {
        return false;
    }
    const key = keys[0];
    if (!key) {
        return false;
    }
    const message = fields[key];
    return ((key === 'id' || key.endsWith('Id') || key.endsWith('By')) &&
        typeof message === 'string' &&
        message.startsWith('Invalid '));
}
export function objectIdLabelFromMessage(message) {
    return message.replace(/^Invalid\s+/, '');
}
//# sourceMappingURL=shared.js.map