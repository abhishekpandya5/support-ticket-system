import type { QueryFilter, Types } from 'mongoose';
import { type ITicket, type TicketDocument, type TicketModel } from '../models/Ticket.js';
export type CreateTicketInput = {
    title: string;
    description: string;
    priority: ITicket['priority'];
    status: ITicket['status'];
    createdBy: Types.ObjectId;
    assignedTo: Types.ObjectId | null;
};
export type UpdateTicketFieldsInput = Partial<Pick<ITicket, 'title' | 'description' | 'priority' | 'assignedTo'>>;
export declare class TicketRepository {
    private readonly model;
    constructor(model?: TicketModel);
    findById(id: Types.ObjectId | string): Promise<TicketDocument | null>;
    findByIdPopulated(id: Types.ObjectId | string): Promise<TicketDocument | null>;
    findMany(filter?: QueryFilter<ITicket>, options?: {
        populate?: boolean;
    }): Promise<TicketDocument[]>;
    create(data: CreateTicketInput): Promise<TicketDocument>;
    updateFieldsById(id: Types.ObjectId | string, fields: UpdateTicketFieldsInput): Promise<TicketDocument | null>;
    updateFieldsByIdPopulated(id: Types.ObjectId | string, fields: UpdateTicketFieldsInput): Promise<TicketDocument | null>;
    save(document: TicketDocument): Promise<TicketDocument>;
}
export declare const ticketRepository: TicketRepository;
//# sourceMappingURL=TicketRepository.d.ts.map