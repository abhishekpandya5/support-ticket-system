function isPopulatedUser(value) {
    return (typeof value === 'object' &&
        value !== null &&
        '_id' in value &&
        'name' in value &&
        'email' in value);
}
export function serializeUserSummary(value) {
    if (!isPopulatedUser(value)) {
        throw new Error('Expected populated user reference');
    }
    return {
        id: value._id.toString(),
        name: value.name,
        email: value.email,
    };
}
export function serializeUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
export function serializeTicket(ticket) {
    return {
        id: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assignedTo: ticket.assignedTo
            ? serializeUserSummary(ticket.assignedTo)
            : null,
        createdBy: serializeUserSummary(ticket.createdBy),
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
    };
}
export function serializeComment(comment) {
    return {
        id: comment._id.toString(),
        ticketId: comment.ticketId.toString(),
        message: comment.message,
        createdBy: serializeUserSummary(comment.createdBy),
        createdAt: comment.createdAt.toISOString(),
    };
}
//# sourceMappingURL=serializers.js.map