import type { Types } from 'mongoose';
import { type UserRepository } from '../repositories/UserRepository.js';
import type { UserDocument } from '../models/User.js';
export declare class UserService {
    private readonly users;
    constructor(users?: UserRepository);
    listUsers(): Promise<UserDocument[]>;
    getUserById(id: string): Promise<UserDocument | null>;
    assertUserExists(id: Types.ObjectId | string): Promise<UserDocument>;
    private assertValidObjectId;
}
export declare const userService: UserService;
//# sourceMappingURL=UserService.d.ts.map