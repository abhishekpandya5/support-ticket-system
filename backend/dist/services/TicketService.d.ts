import type { TicketDocument } from '../models/Ticket.js';
import type { CommentDocument } from '../models/Comment.js';
import { type CommentRepository } from '../repositories/CommentRepository.js';
import { type TicketRepository } from '../repositories/TicketRepository.js';
import { type TicketStateMachine } from '../stateMachine/index.js';
import { type UserService } from './UserService.js';
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
export declare class TicketService {
    private readonly tickets;
    private readonly comments;
    private readonly users;
    private readonly stateMachine;
    constructor(tickets?: TicketRepository, comments?: CommentRepository, users?: UserService, stateMachine?: TicketStateMachine);
    listTickets(query?: ListTicketsQuery): Promise<TicketDocument[]>;
    getTicketById(id: string): Promise<TicketDetailResult>;
    createTicket(input: CreateTicketInput): Promise<TicketDocument>;
    updateTicket(id: string, input: UpdateTicketInput): Promise<TicketDocument>;
    changeStatus(id: string, newStatus: string): Promise<TicketDocument>;
    private collectCreateFieldErrors;
    private buildListFilter;
    private resolveAssignee;
    private parsePriority;
    private parseStatus;
    private assertValidObjectId;
}
export declare const ticketService: TicketService;
//# sourceMappingURL=TicketService.d.ts.map