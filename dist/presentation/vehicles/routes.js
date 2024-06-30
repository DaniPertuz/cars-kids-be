"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class VehiclesRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { getVehicles, getVehicleByNickname, getVehiclesByCategory, getVehiclesByColor, getVehiclesByColorAndSize, getVehiclesBySize, getVehiclesByStatus, createVehicle, updateVehicle, deactivateVehicle } = new controllers_1.VehiclesController();
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
exports.VehiclesRoutes = VehiclesRoutes;
