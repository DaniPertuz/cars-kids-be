import { Router } from 'express';
import { VehiclesController } from './controllers';

export class VehiclesRoutes {
  static get routes(): Router {
    const router = Router();

    const { getVehicles, getVehicleById, getVehicleByNickname, getVehiclesByColor, getVehiclesByColorAndSize, getVehiclesBySize, getVehiclesByStatus, createVehicle, updateVehicle, deactivateteVehicle } = new VehiclesController();

    router.get('/', getVehicles);
    router.get('/color', getVehiclesByColor);
    router.get('/size', getVehiclesBySize);
    router.get('/props', getVehiclesByColorAndSize);
    router.get('/status', getVehiclesByStatus);
    router.get('/id/:id', getVehicleById);
    router.get('/nickname/:nickname', getVehicleByNickname);
    router.post('/', createVehicle);
    router.put('/:nickname', updateVehicle);
    router.delete('/:nickname', deactivateteVehicle);

    return router;
  }
}
