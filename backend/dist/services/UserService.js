import { userRepository, } from '../repositories/UserRepository.js';
import { invalidObjectIdError, notFoundError } from '../utils/errors.js';
import { isValidObjectId } from '../utils/objectId.js';
export class UserService {
    users;
    constructor(users = userRepository) {
        this.users = users;
    }
    async listUsers() {
        return this.users.findAll();
    }
    async getUserById(id) {
        this.assertValidObjectId(id, 'user ID');
        return this.users.findById(id);
    }
    async assertUserExists(id) {
        const normalizedId = typeof id === 'string' ? id : id.toString();
        this.assertValidObjectId(normalizedId, 'user ID');
        const user = await this.users.findById(normalizedId);
        if (!user) {
            throw notFoundError('User');
        }
        return user;
    }
    assertValidObjectId(value, fieldLabel) {
        if (!isValidObjectId(value)) {
            throw invalidObjectIdError(fieldLabel);
        }
    }
}
export const userService = new UserService();
//# sourceMappingURL=UserService.js.map