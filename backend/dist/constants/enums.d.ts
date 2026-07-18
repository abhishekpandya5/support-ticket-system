/**
 * Domain enumerations for tickets and users.
 * Values match API and database contracts (docs/api-design.md, docs/database-design.md).
 */
export declare const TICKET_STATUS: {
    readonly OPEN: 'open';
    readonly IN_PROGRESS: 'in_progress';
    readonly RESOLVED: 'resolved';
    readonly CLOSED: 'closed';
    readonly CANCELLED: 'cancelled';
};
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
export declare const TICKET_STATUS_VALUES: readonly ["open", "in_progress", "resolved", "closed", "cancelled"];
export declare const TICKET_PRIORITY: {
    readonly LOW: 'low';
    readonly MEDIUM: 'medium';
    readonly HIGH: 'high';
    readonly CRITICAL: 'critical';
};
export type TicketPriority = (typeof TICKET_PRIORITY)[keyof typeof TICKET_PRIORITY];
export declare const TICKET_PRIORITY_VALUES: readonly ["low", "medium", "high", "critical"];
export declare const USER_ROLE: {
    readonly AGENT: 'agent';
    readonly ADMIN: 'admin';
    readonly VIEWER: 'viewer';
};
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export declare const USER_ROLE_VALUES: readonly ["agent", "admin", "viewer"];
//# sourceMappingURL=enums.d.ts.map