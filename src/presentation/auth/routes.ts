import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.service';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const authService = new AuthService();

    const { registerUser, loginUser, checkAuthStatus } = new AuthController(authService);

    router.post('/login', loginUser);
    router.post('/register', registerUser);
    router.post('/check', checkAuthStatus);

    return router;
  }
}
