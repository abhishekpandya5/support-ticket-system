import { asyncHandler } from '../middleware/asyncHandler.js';
import { userService } from '../services/UserService.js';
import { notFoundError } from '../utils/errors.js';
import { serializeUser } from '../utils/serializers.js';
export class UserController {
    users;
    constructor(users = userService) {
        this.users = users;
    }
    list = asyncHandler(async (_req, res) => {
        const users = await this.users.listUsers();
        res.status(200).json({
            users: users.map((user) => serializeUser(user)),
        });
    });
    getById = asyncHandler(async (req, res) => {
        const user = await this.users.getUserById(req.params.id);
        if (!user) {
            throw notFoundError('User');
        }
        res.status(200).json({ user: serializeUser(user) });
    });
}
export const userController = new UserController();
//# sourceMappingURL=UserController.js.map