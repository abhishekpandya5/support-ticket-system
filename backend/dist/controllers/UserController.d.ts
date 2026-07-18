import { type UserService } from '../services/UserService.js';
export declare class UserController {
    private readonly users;
    constructor(users?: UserService);
    list: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    getById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
export declare const userController: UserController;
//# sourceMappingURL=UserController.d.ts.map