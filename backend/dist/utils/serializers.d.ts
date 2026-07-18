import type { CommentDocument } from '../models/Comment.js';
import type { TicketDocument } from '../models/Ticket.js';
import type { UserDocument } from '../models/User.js';
export type UserSummaryJson = {
    id: string;
    name: string;
    email: string;
};
export type UserJson = UserSummaryJson & {
    role: string;
};
export type TicketJson = {
    id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignedTo: UserSummaryJson | null;
    createdBy: UserSummaryJson;
    createdAt: string;
    updatedAt: string;
};
export type CommentJson = {
    id: string;
    ticketId: string;
    message: string;
    createdBy: UserSummaryJson;
    createdAt: string;
};
export declare function serializeUserSummary(value: unknown): UserSummaryJson;
export declare function serializeUser(user: UserDocument): UserJson;
export declare function serializeTicket(ticket: TicketDocument): TicketJson;
export declare function serializeComment(comment: CommentDocument): CommentJson;
//# sourceMappingURL=serializers.d.ts.map