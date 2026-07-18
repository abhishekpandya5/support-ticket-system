import { User, } from '../models/User.js';
export class UserRepository {
    model;
    constructor(model = User) {
        this.model = model;
    }
    async findAll() {
        return this.model.find().sort({ name: 1 }).exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findByEmail(email) {
        return this.model.findOne({ email: email.toLowerCase().trim() }).exec();
    }
    async existsById(id) {
        const count = await this.model
            .countDocuments({ _id: id })
            .limit(1)
            .exec();
        return count > 0;
    }
    async create(data) {
        return this.model.create(data);
    }
}
export const userRepository = new UserRepository();
//# sourceMappingURL=UserRepository.js.map