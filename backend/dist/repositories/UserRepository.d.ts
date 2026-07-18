import type { Types } from 'mongoose';
import { type IUser, type UserDocument, type UserModel } from '../models/User.js';
export type CreateUserInput = Pick<IUser, 'name' | 'email' | 'role'>;
export declare class UserRepository {
    private readonly model;
    constructor(model?: UserModel);
    findAll(): Promise<UserDocument[]>;
    findById(id: Types.ObjectId | string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    existsById(id: Types.ObjectId | string): Promise<boolean>;
    create(data: CreateUserInput): Promise<UserDocument>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=UserRepository.d.ts.map