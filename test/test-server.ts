import { envs } from '../src/plugins';
import { AppRoutes } from '../src/presentation/routes';
import { Server } from '../src/presentation/server';

export const testServer = new Server({
  port: envs.PORT,
  routes: AppRoutes.routes
});
