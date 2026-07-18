import { TICKET_PRIORITY_VALUES, TICKET_STATUS, TICKET_STATUS_VALUES, } from '../constants/enums.js';
import { commentRepository, } from '../repositories/CommentRepository.js';
import { ticketRepository, } from '../repositories/TicketRepository.js';
import { InvalidTransitionError, ticketStateMachine, } from '../stateMachine/index.js';
import { AppError } from '../utils/AppError.js';
import { invalidObjectIdError, notFoundError, statusUpdateNotAllowedError, validationError, } from '../utils/errors.js';
import { isValidObjectId, toObjectId } from '../utils/objectId.js';
import { escapeRegex } from '../utils/regex.js';
import { userService } from './UserService.js';
export class TicketService {
    tickets;
    comments;
    users;
    stateMachine;
    constructor(tickets = ticketRepository, comments = commentRepository, users = userService, stateMachine = ticketStateMachine) {
        this.tickets = tickets;
        this.comments = comments;
        this.users = users;
        this.stateMachine = stateMachine;
    }
    async listTickets(query = {}) {
        const filter = this.buildListFilter(query);
        return this.tickets.findMany(filter, { populate: true });
    }
    async getTicketById(id) {
        this.assertValidObjectId(id, 'ticket ID');
        const ticket = await this.tickets.findByIdPopulated(id);
        if (!ticket) {
            throw notFoundError('Ticket');
        }
        const comments = await this.comments.findByTicketId(id);
        return { ticket, comments };
    }
    async createTicket(input) {
        const fieldErrors = this.collectCreateFieldErrors(input);
        if (Object.keys(fieldErrors).length > 0) {
            throw validationError('Validation failed', fieldErrors);
        }
        const creator = await this.users.assertUserExists(input.createdBy);
        const assignedTo = await this.resolveAssignee(input.assignedTo);
        const ticket = await this.tickets.create({
            title: input.title.trim(),
            description: input.description.trim(),
            priority: input.priority,
            status: TICKET_STATUS.OPEN,
            createdBy: creator._id,
            assignedTo,
        });
        const populated = await this.tickets.findByIdPopulated(ticket._id);
        if (!populated) {
            throw notFoundError('Ticket');
        }
        return populated;
    }
    async updateTicket(id, input) {
        this.assertValidObjectId(id, 'ticket ID');
        if (input.status !== undefined) {
            throw statusUpdateNotAllowedError();
        }
        const fields = {};
        const fieldErrors = {};
        if (input.title !== undefined) {
            const title = input.title.trim();
            if (!title) {
                fieldErrors.title = 'Title cannot be empty';
            }
            else {
                fields.title = title;
            }
        }
        if (input.description !== undefined) {
            const description = input.description.trim();
            if (!description) {
                fieldErrors.description = 'Description cannot be empty';
            }
            else {
                fields.description = description;
            }
        }
        if (input.priority !== undefined) {
            try {
                fields.priority = this.parsePriority(input.priority);
            }
            catch (error) {
                if (error instanceof AppError && error.details?.fields) {
                    Object.assign(fieldErrors, error.details.fields);
                }
            }
        }
        if (input.assignedTo !== undefined) {
            try {
                fields.assignedTo = await this.resolveAssignee(input.assignedTo);
            }
            catch (error) {
                if (error instanceof AppError && error.code === 'NOT_FOUND') {
                    fieldErrors.assignedTo = 'Assigned user not found';
                }
                else {
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
    async changeStatus(id, newStatus) {
        this.assertValidObjectId(id, 'ticket ID');
        let parsedStatus;
        try {
            parsedStatus = this.parseStatus(newStatus);
        }
        catch (error) {
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
        }
        catch (error) {
            if (error instanceof InvalidTransitionError) {
                throw new AppError(error.code, 400, error.message, error.toDetails());
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
    collectCreateFieldErrors(input) {
        const fieldErrors = {};
        if (!input.title?.trim()) {
            fieldErrors.title = 'Title is required';
        }
        if (!input.description?.trim()) {
            fieldErrors.description = 'Description is required';
        }
        try {
            this.parsePriority(input.priority);
        }
        catch (error) {
            if (error instanceof AppError && error.details?.fields) {
                Object.assign(fieldErrors, error.details.fields);
            }
        }
        return fieldErrors;
    }
    buildListFilter(query) {
        const filter = {};
        if (query.status !== undefined && query.status !== '') {
            if (!TICKET_STATUS_VALUES.includes(query.status)) {
                throw validationError('Validation failed', {
                    status: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
                });
            }
            filter.status = query.status;
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
    async resolveAssignee(assignedTo) {
        if (assignedTo === undefined || assignedTo === null || assignedTo === '') {
            return null;
        }
        if (!isValidObjectId(assignedTo)) {
            throw validationError('Validation failed', {
                assignedTo: 'Invalid assignee ID',
            });
        }
        const user = await this.users.assertUserExists(assignedTo);
        return user._id;
    }
    parsePriority(value) {
        if (!value || !TICKET_PRIORITY_VALUES.includes(value)) {
            throw validationError('Validation failed', {
                priority: `Priority must be one of: ${TICKET_PRIORITY_VALUES.join(', ')}`,
            });
        }
        return value;
    }
    parseStatus(value) {
        if (!value || !TICKET_STATUS_VALUES.includes(value)) {
            throw validationError('Validation failed', {
                status: `Status must be one of: ${TICKET_STATUS_VALUES.join(', ')}`,
            });
        }
        return value;
    }
    assertValidObjectId(value, fieldLabel) {
        if (!isValidObjectId(value)) {
            throw invalidObjectIdError(fieldLabel);
        }
    }
}
export const ticketService = new TicketService();
//# sourceMappingURL=TicketService.js.map