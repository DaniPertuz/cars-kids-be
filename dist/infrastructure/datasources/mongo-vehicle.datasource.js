"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoVehicleDatasource = void 0;
const models_1 = require("../../database/models");
const vehicle_entity_1 = require("../../domain/entities/vehicle.entity");
const errors_1 = require("../../domain/errors");
const interfaces_1 = require("../../interfaces");
class MongoVehicleDatasource {
    getVehiclesByQuery(query, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            const [total, vehicles] = yield Promise.all([
                models_1.VehicleModel.countDocuments(query),
                models_1.VehicleModel.find(query)
                    .sort({ nickname: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);
            return {
                page,
                limit,
                total,
                next: ((page * limit) < total) ? `/vehicles?page=${(page + 1)}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/vehicles?page=${(page - 1)}&limit=${limit}` : null,
                vehicles: vehicles.map(vehicle_entity_1.VehicleEntity.fromObject)
            };
        });
    }
    createVehicle(vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.VehicleModel.create(vehicle.params);
                return vehicle_entity_1.VehicleEntity.fromObject(data);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear vehículo: ${error}`);
            }
        });
    }
    getVehicleByNickname(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicleData = yield models_1.VehicleModel.findOne({ nickname }).select('-status');
                return vehicleData ? vehicle_entity_1.VehicleEntity.fromObject(vehicleData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículo: ${error}`);
            }
        });
    }
    getVehicles(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getVehiclesByQuery({}, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos: ${error}`);
            }
        });
    }
    getVehiclesByCategory(category, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getVehiclesByQuery({ category }, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos por color: ${error}`);
            }
        });
    }
    getVehiclesByColor(color, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getVehiclesByQuery({ color }, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos por color: ${error}`);
            }
        });
    }
    getVehiclesByColorAndSize(color, size, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getVehiclesByQuery({ color, size }, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos por color y tamaño: ${error}`);
            }
        });
    }
    getVehiclesBySize(size, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getVehiclesByQuery({ size }, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos por tamaño: ${error}`);
            }
        });
    }
    getVehiclesByStatus(status, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = paginationDto;
                const [total, vehicles] = yield Promise.all([
                    models_1.VehicleModel.countDocuments({ status }),
                    models_1.VehicleModel.find({ status })
                        .sort({ nickname: 1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                ]);
                return {
                    page,
                    limit,
                    total,
                    next: ((page * limit) < total) ? `/vehicles/status/${status}?page=${(page + 1)}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/vehicles/status/${status}?page=${(page - 1)}&limit=${limit}` : null,
                    vehicles: vehicles.map(vehicle_entity_1.VehicleEntity.fromObject)
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener vehículos por estado: ${error}`);
            }
        });
    }
    updateVehicle(nickname, vehicle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicleData = yield models_1.VehicleModel.findOneAndUpdate({ nickname }, vehicle.params, { new: true });
                return vehicleData ? vehicle_entity_1.VehicleEntity.fromObject(vehicleData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar vehículo: ${error}`);
            }
        });
    }
    deactivateVehicle(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vehicleData = yield models_1.VehicleModel.findOneAndUpdate({ nickname }, { status: interfaces_1.IStatus.Inactive }, { new: true });
                return vehicleData ? vehicle_entity_1.VehicleEntity.fromObject(vehicleData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar vehículo: ${error}`);
            }
        });
    }
}
exports.MongoVehicleDatasource = MongoVehicleDatasource;
