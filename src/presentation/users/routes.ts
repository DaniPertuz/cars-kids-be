import { Router } from 'express';
import { UsersController } from './controllers';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const { getUsers, updateUserName, updateUserImage, updateUserEmail, updateUserPassword, updateUserRole, updateUserStatus, deactivateUser } = new UsersController();

    router.get('/', [AuthMiddleware.validateJWT], getUsers);
    router.put('/name', updateUserName);
    router.put('/image', updateUserImage);
    router.put('/email', updateUserEmail);
    router.put('/password', updateUserPassword);
    router.put('/role', [AuthMiddleware.validateJWT], updateUserRole);
    router.put('/status', [AuthMiddleware.validateJWT], updateUserStatus);
    router.delete('/', [AuthMiddleware.validateJWT], deactivateUser);

    return router;
  }
}
