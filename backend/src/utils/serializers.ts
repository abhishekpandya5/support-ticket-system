import type { Types } from 'mongoose';

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

function isPopulatedUser(
  value: unknown,
): value is { _id: Types.ObjectId; name: string; email: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    'name' in value &&
    'email' in value
  );
}

export function serializeUserSummary(value: unknown): UserSummaryJson {
  if (!isPopulatedUser(value)) {
    throw new Error('Expected populated user reference');
  }

  return {
    id: value._id.toString(),
    name: value.name,
    email: value.email,
  };
}

export function serializeUser(user: UserDocument): UserJson {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function serializeTicket(ticket: TicketDocument): TicketJson {
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

export function serializeComment(comment: CommentDocument): CommentJson {
  return {
    id: comment._id.toString(),
    ticketId: comment.ticketId.toString(),
    message: comment.message,
    createdBy: serializeUserSummary(comment.createdBy),
    createdAt: comment.createdAt.toISOString(),
  };
}
