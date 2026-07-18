import { Ticket, } from '../models/Ticket.js';
const USER_SUMMARY_FIELDS = 'name email';
export class TicketRepository {
    model;
    constructor(model = Ticket) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findByIdPopulated(id) {
        return this.model
            .findById(id)
            .populate('createdBy', USER_SUMMARY_FIELDS)
            .populate('assignedTo', USER_SUMMARY_FIELDS)
            .exec();
    }
    async findMany(filter = {}, options = {}) {
        let query = this.model.find(filter).sort({ updatedAt: -1 });
        if (options.populate) {
            query = query
                .populate('createdBy', USER_SUMMARY_FIELDS)
                .populate('assignedTo', USER_SUMMARY_FIELDS);
        }
        return query.exec();
    }
    async create(data) {
        return this.model.create(data);
    }
    async updateFieldsById(id, fields) {
        return this.model
            .findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true })
            .exec();
    }
    async updateFieldsByIdPopulated(id, fields) {
        return this.model
            .findByIdAndUpdate(id, { $set: fields }, { new: true, runValidators: true })
            .populate('createdBy', USER_SUMMARY_FIELDS)
            .populate('assignedTo', USER_SUMMARY_FIELDS)
            .exec();
    }
    async save(document) {
        return document.save();
    }
}
export const ticketRepository = new TicketRepository();
//# sourceMappingURL=TicketRepository.js.map