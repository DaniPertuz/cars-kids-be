import { Router } from 'express';
import { VehiclesController } from './controllers';

export class VehiclesRoutes {
  static get routes(): Router {
    const router = Router();

    const { getVehicles, getVehicleByNickname, getVehiclesByCategory, getVehiclesByColor, getVehiclesByColorAndSize, getVehiclesBySize, getVehiclesByStatus, createVehicle, updateVehicle, deactivateVehicle } = new VehiclesController();

    router.get('/', getVehicles);
    router.get('/category', getVehiclesByCategory);
    router.get('/color', getVehiclesByColor);
    router.get('/size', getVehiclesBySize);
    router.get('/props', getVehiclesByColorAndSize);
    router.get('/status/:status', getVehiclesByStatus);
    router.get('/nickname/:nickname', getVehicleByNickname);
    router.post('/', createVehicle);
    router.put('/:nickname', updateVehicle);
    router.delete('/:nickname', deactivateVehicle);

    return router;
  }
}
