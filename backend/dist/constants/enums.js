/**
 * Domain enumerations for tickets and users.
 * Values match API and database contracts (docs/api-design.md, docs/database-design.md).
 */
export const TICKET_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
    CANCELLED: 'cancelled',
};
export const TICKET_STATUS_VALUES = [
    TICKET_STATUS.OPEN,
    TICKET_STATUS.IN_PROGRESS,
    TICKET_STATUS.RESOLVED,
    TICKET_STATUS.CLOSED,
    TICKET_STATUS.CANCELLED,
];
export const TICKET_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
};
export const TICKET_PRIORITY_VALUES = [
    TICKET_PRIORITY.LOW,
    TICKET_PRIORITY.MEDIUM,
    TICKET_PRIORITY.HIGH,
    TICKET_PRIORITY.CRITICAL,
];
export const USER_ROLE = {
    AGENT: 'agent',
    ADMIN: 'admin',
    VIEWER: 'viewer',
};
export const USER_ROLE_VALUES = [
    USER_ROLE.AGENT,
    USER_ROLE.ADMIN,
    USER_ROLE.VIEWER,
];
//# sourceMappingURL=enums.js.map