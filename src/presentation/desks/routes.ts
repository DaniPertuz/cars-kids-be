import { Router } from 'express';
import { DeskController } from './controllers';

export class DesksRoutes {
  static get routes(): Router {
    const router = Router();

    const { createDesk, getDesks, getDesk, updateDesk, deleteDesk } = new DeskController();

    router.get('/', getDesks);
    router.get('/:name', getDesk);
    router.post('/', createDesk);
    router.put('/:name', updateDesk);
    router.delete('/:name', deleteDesk);

    return router;
  }
}
