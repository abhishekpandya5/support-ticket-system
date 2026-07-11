import { USER_ROLE, type UserRole } from '../constants/enums.js';
import { User } from '../models/User.js';

export interface UserSeed {
  name: string;
  email: string;
  role: UserRole;
}

export const USER_SEEDS: readonly UserSeed[] = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    role: USER_ROLE.ADMIN,
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: USER_ROLE.AGENT,
  },
  {
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: USER_ROLE.VIEWER,
  },
] as const;

export interface SeedUsersResult {
  inserted: string[];
  skipped: string[];
}

/**
 * Inserts seed users by email when they do not already exist.
 * Safe to run multiple times (idempotent).
 */
export async function seedUsers(): Promise<SeedUsersResult> {
  const inserted: string[] = [];
  const skipped: string[] = [];

  for (const seed of USER_SEEDS) {
    const existing = await User.findOne({ email: seed.email })
      .select('_id')
      .lean()
      .exec();

    if (existing) {
      skipped.push(seed.email);
      continue;
    }

    await User.create({
      name: seed.name,
      email: seed.email,
      role: seed.role,
    });

    inserted.push(seed.email);
  }

  return { inserted, skipped };
}
