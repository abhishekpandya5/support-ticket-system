import { z } from 'zod';
export declare function objectIdField(fieldLabel: string): z.ZodString;
export declare function nonEmptyTrimmedString(label: string, maxLength: number): z.ZodString;
export declare function optionalNonEmptyTrimmedString(label: string, maxLength: number): z.ZodString;
export declare function idParamSchema(fieldLabel: string): z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const listTicketsQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        cancelled: "cancelled";
        closed: "closed";
        in_progress: "in_progress";
        open: "open";
        resolved: "resolved";
    }>>;
}, z.core.$strip>;
export type ListTicketsQuery = z.infer<typeof listTicketsQuerySchema>;
export declare function formatZodFieldErrors(error: z.ZodError): Record<string, string>;
export declare function isObjectIdFieldError(target: 'body' | 'params' | 'query', fields: Record<string, string>): boolean;
export declare function objectIdLabelFromMessage(message: string): string;
//# sourceMappingURL=shared.d.ts.map