import { type UserRole } from '../constants/enums.js';
export interface UserSeed {
    name: string;
    email: string;
    role: UserRole;
}
export declare const USER_SEEDS: readonly UserSeed[];
export interface SeedUsersResult {
    inserted: string[];
    skipped: string[];
}
/**
 * Inserts seed users by email when they do not already exist.
 * Safe to run multiple times (idempotent).
 */
export declare function seedUsers(): Promise<SeedUsersResult>;
//# sourceMappingURL=seedUsers.d.ts.map