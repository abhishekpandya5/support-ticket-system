/**
 * Escapes special characters for safe use in MongoDB $regex queries.
 */
export function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=regex.js.map