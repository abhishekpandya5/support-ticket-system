import mongoose from 'mongoose';

import { Comment } from '../../src/models/Comment.js';
import { Ticket } from '../../src/models/Ticket.js';
import { User } from '../../src/models/User.js';

/**
 * Removes all documents from application collections between tests.
 */
export async function clearDatabase(): Promise<void> {
  await Promise.all([
    Comment.deleteMany({}),
    Ticket.deleteMany({}),
    User.deleteMany({}),
  ]);
}

/** Drops the active test database (used only if a full reset is required). */
export async function dropDatabase(): Promise<void> {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
}
