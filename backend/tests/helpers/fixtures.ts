import type { Types } from 'mongoose';

import {
  TICKET_PRIORITY,
  TICKET_STATUS,
  USER_ROLE,
  type TicketPriority,
  type TicketStatus,
  type UserRole,
} from '../../src/constants/enums.js';
import { Comment } from '../../src/models/Comment.js';
import { Ticket } from '../../src/models/Ticket.js';
import { User } from '../../src/models/User.js';
import type { UserDocument } from '../../src/models/User.js';
import type { TicketDocument } from '../../src/models/Ticket.js';
import type { CommentDocument } from '../../src/models/Comment.js';

export type SeedUsers = {
  admin: UserDocument;
  agent: UserDocument;
  viewer: UserDocument;
};

let userCounter = 0;

function nextEmail(prefix: string): string {
  userCounter += 1;
  return `${prefix}-${userCounter}@test.example`;
}

export async function createUser(input?: {
  name?: string;
  email?: string;
  role?: UserRole;
}): Promise<UserDocument> {
  return User.create({
    name: input?.name ?? 'Test User',
    email: input?.email ?? nextEmail('user'),
    role: input?.role ?? USER_ROLE.AGENT,
  });
}

export async function seedUsers(): Promise<SeedUsers> {
  const [admin, agent, viewer] = await Promise.all([
    createUser({
      name: 'Admin User',
      email: nextEmail('admin'),
      role: USER_ROLE.ADMIN,
    }),
    createUser({
      name: 'Agent User',
      email: nextEmail('agent'),
      role: USER_ROLE.AGENT,
    }),
    createUser({
      name: 'Viewer User',
      email: nextEmail('viewer'),
      role: USER_ROLE.VIEWER,
    }),
  ]);

  return { admin, agent, viewer };
}

export async function createTicket(input: {
  title: string;
  description: string;
  createdBy: Types.ObjectId | string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assignedTo?: Types.ObjectId | string | null;
}): Promise<TicketDocument> {
  return Ticket.create({
    title: input.title,
    description: input.description,
    priority: input.priority ?? TICKET_PRIORITY.MEDIUM,
    status: input.status ?? TICKET_STATUS.OPEN,
    createdBy: input.createdBy,
    assignedTo: input.assignedTo ?? null,
  });
}

export async function createComment(input: {
  ticketId: Types.ObjectId | string;
  message: string;
  createdBy: Types.ObjectId | string;
}): Promise<CommentDocument> {
  return Comment.create({
    ticketId: input.ticketId,
    message: input.message,
    createdBy: input.createdBy,
  });
}
