import { Router } from 'express';
import { UsersController } from './controllers';

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const { getUsers, updateUserRole, deactivateUser } = new UsersController();

    router.get('/', getUsers);
    router.put('/', updateUserRole);
    router.delete('/', deactivateUser);

    return router;
  }
}
