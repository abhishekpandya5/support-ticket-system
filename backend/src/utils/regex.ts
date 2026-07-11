/**
 * Escapes special characters for safe use in MongoDB $regex queries.
 */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
