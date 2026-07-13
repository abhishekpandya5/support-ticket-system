import type { Request, Response } from 'express';

import { asyncHandler } from '../middleware/asyncHandler.js';
import { userService, type UserService } from '../services/UserService.js';
import { notFoundError } from '../utils/errors.js';
import { serializeUser } from '../utils/serializers.js';

export class UserController {
  constructor(private readonly users: UserService = userService) {}

  list = asyncHandler(async (_req: Request, res: Response) => {
    const users = await this.users.listUsers();
    res.status(200).json({
      users: users.map((user) => serializeUser(user)),
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.users.getUserById(req.params.id as string);

    if (!user) {
      throw notFoundError('User');
    }

    res.status(200).json({ user: serializeUser(user) });
  });
}

export const userController = new UserController();
