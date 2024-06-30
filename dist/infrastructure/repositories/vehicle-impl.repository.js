"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepositoryImpl = void 0;
class VehicleRepositoryImpl {
    constructor(vehicleDatasource) {
        this.vehicleDatasource = vehicleDatasource;
    }
    createVehicle(vehicle) {
        return this.vehicleDatasource.createVehicle(vehicle);
    }
    getVehicleByNickname(id) {
        return this.vehicleDatasource.getVehicleByNickname(id);
    }
    getVehicles(paginationDto) {
        return this.vehicleDatasource.getVehicles(paginationDto);
    }
    getVehiclesByCategory(category, paginationDto) {
        return this.vehicleDatasource.getVehiclesByCategory(category, paginationDto);
    }
    getVehiclesByColor(color, paginationDto) {
        return this.vehicleDatasource.getVehiclesByColor(color, paginationDto);
    }
    getVehiclesByColorAndSize(color, size, paginationDto) {
        return this.vehicleDatasource.getVehiclesByColorAndSize(color, size, paginationDto);
    }
    getVehiclesBySize(size, paginationDto) {
        return this.vehicleDatasource.getVehiclesBySize(size, paginationDto);
    }
    getVehiclesByStatus(status, paginationDto) {
        return this.vehicleDatasource.getVehiclesByStatus(status, paginationDto);
    }
    updateVehicle(nickname, vehicle) {
        return this.vehicleDatasource.updateVehicle(nickname, vehicle);
    }
    deactivateVehicle(id) {
        return this.vehicleDatasource.deactivateVehicle(id);
    }
}
exports.VehicleRepositoryImpl = VehicleRepositoryImpl;
