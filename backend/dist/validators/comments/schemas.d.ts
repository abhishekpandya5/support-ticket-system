import { z } from 'zod';
export declare const addCommentSchema: z.ZodObject<{
    message: z.ZodString;
    createdBy: z.ZodString;
}, z.core.$strip>;
export type AddCommentBody = z.infer<typeof addCommentSchema>;
//# sourceMappingURL=schemas.d.ts.map