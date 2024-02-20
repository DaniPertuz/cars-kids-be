import { Router } from 'express';
import { UsersController } from './controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const { getUsers, updateUserRole, deactivateUser } = new UsersController();

    router.get('/', [AuthMiddleware.validateJWT], getUsers);
    router.put('/', [AuthMiddleware.validateJWT], updateUserRole);
    router.delete('/', [AuthMiddleware.validateJWT], deactivateUser);

    return router;
  }
}
