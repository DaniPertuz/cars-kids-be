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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const vehicle_1 = __importDefault(require("../../database/models/vehicle"));
const vehicle_entity_1 = require("../../domain/entities/vehicle.entity");
const mongo_vehicle_datasource_1 = require("../../infrastructure/datasources/mongo-vehicle.datasource");
const vehicle_impl_repository_1 = require("../../infrastructure/repositories/vehicle-impl.repository");
const interfaces_1 = require("../../interfaces");
const vehicle_2 = require("../../domain/dtos/vehicle");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
class VehiclesController {
    constructor() {
        this.vehicleRepo = new vehicle_impl_repository_1.VehicleRepositoryImpl(new mongo_vehicle_datasource_1.MongoVehicleDatasource());
        this.getVehicles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const vehicles = yield this.vehicleRepo.getVehicles(paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.getVehicleByNickname = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nickname } = req.params;
            const vehicle = yield this.vehicleRepo.getVehicleByNickname(nickname);
            return (vehicle) ? res.json(vehicle.params) : res.status(404).json({ error: `No se encontró vehículo con apodo ${nickname}` });
        });
        this.getVehiclesByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { category } = req.body;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const vehicles = yield this.vehicleRepo.getVehiclesByCategory(category, paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.getVehiclesByColor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { color } = req.body;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const vehicles = yield this.vehicleRepo.getVehiclesByColor(color, paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.getVehiclesByColorAndSize = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { color, size } = req.body;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            if (!(Object.values(interfaces_1.IVehicleSize).includes(size))) {
                return res.status(400).json({ error: 'Color válido pero tamaño de vehículo no válido' });
            }
            const vehicles = yield this.vehicleRepo.getVehiclesByColorAndSize(color, size, paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.getVehiclesBySize = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { size } = req.body;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            if (!(Object.values(interfaces_1.IVehicleSize).includes(size))) {
                return res.status(400).json({ error: 'Tamaño de vehículo no válido' });
            }
            const vehicles = yield this.vehicleRepo.getVehiclesBySize(size, paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.getVehiclesByStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            if (!(Object.values(interfaces_1.IStatus).includes(status))) {
                return res.status(400).json({ error: 'Estado de vehículo no válido' });
            }
            const vehicles = yield this.vehicleRepo.getVehiclesByStatus(status, paginationDto);
            const { page: vehiclePage, limit: limitPage, total, next, prev, vehicles: data } = vehicles;
            return res.json({
                page: vehiclePage,
                limit: limitPage,
                total,
                next,
                prev,
                vehicles: data.map(vehicle => vehicle.params)
            });
        });
        this.createVehicle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nickname } = req.body;
            const [error, vehicleDto] = vehicle_2.VehicleDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const vehicleDB = yield vehicle_1.default.findOne({ nickname });
            if (vehicleDB)
                return res.status(404).json({ error: 'Ya existe un vehículo con este nombre/apodo' });
            const vehicleData = vehicle_entity_1.VehicleEntity.fromObject(vehicleDto.params);
            const vehicle = (yield this.vehicleRepo.createVehicle(vehicleData)).params;
            return res.json(vehicle);
        });
        this.updateVehicle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nickname } = req.params;
            const { nickname: newNickname, category, img, color, size, status } = req.body;
            const vehicleDB = yield this.vehicleRepo.getVehicleByNickname(nickname);
            if (!vehicleDB)
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            const existingVehicle = yield this.vehicleRepo.getVehicleByNickname(newNickname);
            if (existingVehicle)
                return res.status(404).json({ error: 'Ya existe un vehículo con este nombre/apodo' });
            const updatedVehicleData = {
                nickname: newNickname,
                category,
                img,
                color,
                size,
                status
            };
            const updatedVehicleEntity = vehicle_entity_1.VehicleEntity.fromObject(updatedVehicleData);
            const updatedVehicle = yield this.vehicleRepo.updateVehicle(nickname, updatedVehicleEntity);
            return res.json(updatedVehicle === null || updatedVehicle === void 0 ? void 0 : updatedVehicle.params);
        });
        this.deactivateVehicle = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nickname } = req.params;
            const vehicleDB = yield this.vehicleRepo.getVehicleByNickname(nickname);
            if (!vehicleDB)
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            yield this.vehicleRepo.deactivateVehicle(nickname);
            return res.json({ status: interfaces_1.IStatus.Inactive });
        });
    }
}
exports.VehiclesController = VehiclesController;
