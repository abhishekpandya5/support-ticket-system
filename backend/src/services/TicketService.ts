import type { QueryFilter, Types } from 'mongoose';

import {
  TICKET_PRIORITY_VALUES,
  TICKET_STATUS,
  TICKET_STATUS_VALUES,
  type TicketPriority,
  type TicketStatus,
} from '../constants/enums.js';
import type { ITicket } from '../models/Ticket.js';
import type { TicketDocument } from '../models/Ticket.js';
import type { CommentDocument } from '../models/Comment.js';
import {
  commentRepository,
  type CommentRepository,
} from '../repositories/CommentRepository.js';
import {
  ticketRepository,
  type TicketRepository,
  type UpdateTicketFieldsInput,
} from '../repositories/TicketRepository.js';
import {
  InvalidTransitionError,
  ticketStateMachine,
  type TicketStateMachine,
} from '../stateMachine/index.js';
import { AppError } from '../utils/AppError.js';
import {
  invalidObjectIdError,
  notFoundError,
  statusUpdateNotAllowedError,
  validationError,
} from '../utils/errors.js';
import { isValidObjectId, toObjectId } from '../utils/objectId.js';
import { escapeRegex } from '../utils/regex.js';
import { userService, type UserService } from './UserService.js';

export type ListTicketsQuery = {
  search?: string;
  status?: string;
};

export type CreateTicketInput = {
  title: string;
  description: string;
  priority: string;
  createdBy: string;
  assignedTo?: string | null;
  status?: string;
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  priority?: string;
  assignedTo?: string | null;
  status?: string;
};

export type TicketDetailResult = {
  ticket: TicketDocument;
  comments: CommentDocument[];
};

export class TicketService {
  constructor(
    private readonly tickets: TicketRepository = ticketRepository,
    private readonly comments: CommentRepository = commentRepository,
    private readonly users: UserService = userService,
    private readonly stateMachine: TicketStateMachine = ticketStateMachine,
  ) {}

  async listTickets(query: ListTicketsQuery = {}): Promise<TicketDocument[]> {
    const filter = this.buildListFilter(query);
    return this.tickets.findMany(filter, { populate: true });
  }

  async getTicketById(id: string): Promise<TicketDetailResult> {
    this.assertValidObjectId(id, 'ticket ID');

    const ticket = await this.tickets.findByIdPopulated(id);

    if (!ticket) {
      throw notFoundError('Ticket');
    }

    const comments = await this.comments.findByTicketId(id);

    return { ticket, comments };
  }

  async createTicket(input: CreateTicketInput): Promise<TicketDocument> {
    const fieldErrors = this.collectCreateFieldErrors(input);

    if (Object.keys(fieldErrors).length > 0) {
      throw validationError('Validation failed', fieldErrors);
    }

    const creator = await this.users.assertUserExists(input.createdBy);
    const assignedTo = await this.resolveAssignee(input.assignedTo);

    const ticket = await this.tickets.create({
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority as TicketPriority,
      status: TICKET_STATUS.OPEN,
      createdBy: creator._id as Types.ObjectId,
      assignedTo,
    });

    const populated = await this.tickets.findByIdPopulated(ticket._id);

    if (!populated) {
      throw notFoundError('Ticket');
    }

    return populated;
  }

  async updateTicket(
    id: string,
    input: UpdateTicketInput,
  ): Promise<TicketDocument> {
    this.assertValidObjectId(id, 'ticket ID');

    if (input.status !== undefined) {
      throw statusUpdateNotAllowedError();
    }

    const fields: UpdateTicketFieldsInput = {};
    const fieldErrors: Record<string, string> = {};

    if (input.title !== undefined) {
      const title = input.title.trim();

      if (!title) {
        fieldErrors.title = 'Title cannot be empty';
      } else {
        fields.title = title;
      }
    }

    if (input.description !== undefined) {
      const description = input.description.trim();

      if (!description) {
        fieldErrors.description = 'Description cannot be empty';
      } else {
        fields.description = description;
      }
    }

    if (input.priority !== undefined) {
      try {
        fields.priority = this.parsePriority(input.priority);
      } catch (error: unknown) {
        if (error instanceof AppError && error.details?.fields) {
          Object.assign(
            fieldErrors,
            error.details.fields as Record<string, string>,
          );
        }
      }
    }

    if (input.assignedTo !== undefined) {
      try {
        fields.assignedTo = await this.resolveAssignee(input.assignedTo);
      } catch (error: unknown) {
        if (error instanceof AppError && error.code === 'NOT_FOUND') {
          fieldErrors.assignedTo = 'Assigned user not found';
        } else {
          throw error;
        }
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw validationError('Validation failed', fieldErrors);
    }

    if (Object.keys(fields).length === 0) {
      throw validationError('Validation failed', {
        _form: 'At least one field must be provided',
      });
    }

    const existing = await this.tickets.findById(id);

    if (!existing) {
      throw notFoundError('Ticket');
    }

    const updated = await this.tickets.updateFieldsByIdPopulated(id, fields);

    if (!updated) {
      throw notFoundError('Ticket');
    }

    return updated;
  }

  async changeStatus(
    id: string,
    newStatus: string,
  ): Promise<TicketDocument> {
    this.assertValidObjectId(id, 'ticket ID');

    let parsedStatus: TicketStatus;

    try {
      parsedStatus = this.parseStatus(newStatus);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      throw validationError('Validation failed', {
        status: 'Status is required',
      });
    }

    const ticket = await this.tickets.findById(id);

    if (!ticket) {
      throw notFoundError('Ticket');
    }

    try {
      ticket.status = this.stateMachine.changeStatus(ticket.status, parsedStatus);
    } catch (error: unknown) {
      if (error instanceof InvalidTransitionError) {
        throw new AppError(
          error.code,
          400,
          error.message,
          error.toDetails(),
        );
      }

      throw error;
    }

    await this.tickets.save(ticket);

    const populated = await this.tickets.findByIdPopulated(id);

    if (!populated) {
      throw notFoundError('Ticket');
    }

    return populated;
  }

  private collectCreateFieldErrors(
    input: CreateTicketInput,
  ): Record<string, string> {
    const fieldErrors: Record<string, string> = {};

    if (!input.title?.trim()) {
      fieldErrors.title = 'Title is required';
    }

    if (!input.description?.trim()) {
      fieldErrors.description = 'Description is required';
    }

    try {
      this.parsePriority(input.priority);
    } catch (error: unknown) {
      if (error instanceof AppError && error.details?.fields) {
        Object.assign(
          fieldErrors,
          error.details.fields as Record<string, string>,
        );
      }
    }

    return fieldErrors;
  }

  private buildListFilter(query: ListTicketsQuery): QueryFilter<ITicket> {
    const filter: QueryFilter<ITicket> = {};

    if (query.status !== undefined && query.status !== '') {
      if (!(TICKET_STATUS_VALUES as readonly string[]).includes(query.status)) {
        throw validationError('Validation failed', {
          status: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
        });
      }

      filter.status = query.status as TicketStatus;
    }

    const search = query.search?.trim();

    if (search) {
      const pattern = escapeRegex(search);
      filter.$or = [
        { title: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
      ];
    }

    return filter;
  }

  private async resolveAssignee(
    assignedTo: string | null | undefined,
  ): Promise<Types.ObjectId | null> {
    if (assignedTo === undefined || assignedTo === null || assignedTo === '') {
      return null;
    }

    if (!isValidObjectId(assignedTo)) {
      throw validationError('Validation failed', {
        assignedTo: 'Invalid assignee ID',
      });
    }

    const user = await this.users.assertUserExists(assignedTo);
    return user._id as Types.ObjectId;
  }

  private parsePriority(value: string | undefined): TicketPriority {
    if (!value || !(TICKET_PRIORITY_VALUES as readonly string[]).includes(value)) {
      throw validationError('Validation failed', {
        priority: `Priority must be one of: ${TICKET_PRIORITY_VALUES.join(', ')}`,
      });
    }

    return value as TicketPriority;
  }

  private parseStatus(value: string | undefined): TicketStatus {
    if (!value || !(TICKET_STATUS_VALUES as readonly string[]).includes(value)) {
      throw validationError('Validation failed', {
        status: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
      });
    }

    return value as TicketStatus;
  }

  private assertValidObjectId(value: string, fieldLabel: string): void {
    if (!isValidObjectId(value)) {
      throw invalidObjectIdError(fieldLabel);
    }
  }
}

export const ticketService = new TicketService();
