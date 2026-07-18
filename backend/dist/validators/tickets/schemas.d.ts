import { z } from 'zod';
export declare const createTicketSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodEnum<{
        critical: "critical";
        high: "high";
        low: "low";
        medium: "medium";
    }>;
    createdBy: z.ZodString;
    assignedTo: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strip>;
export declare const updateTicketSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        critical: "critical";
        high: "high";
        low: "low";
        medium: "medium";
    }>>;
    assignedTo: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        cancelled: "cancelled";
        closed: "closed";
        in_progress: "in_progress";
        open: "open";
        resolved: "resolved";
    }>;
}, z.core.$strip>;
export type CreateTicketBody = z.infer<typeof createTicketSchema>;
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>;
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>;
//# sourceMappingURL=schemas.d.ts.map