import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { ProductsRoutes } from './products/routes';
import { RentalsRoutes } from './rentals/routes';
import { UsersRoutes } from './users/routes';
import { VehiclesRoutes } from './vehicles/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/products', ProductsRoutes.routes);
    router.use('/api/rentals', RentalsRoutes.routes);
    router.use('/api/users', UsersRoutes.routes);
    router.use('/api/vehicles', VehiclesRoutes.routes);

    return router;
  }
}
