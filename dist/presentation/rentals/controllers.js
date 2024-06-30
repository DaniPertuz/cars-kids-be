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
exports.RentalsController = void 0;
const rental_1 = require("../../domain/dtos/rental");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
const rental_entity_1 = require("../../domain/entities/rental.entity");
const rental_impl_repository_1 = require("../../infrastructure/repositories/rental-impl.repository");
const mongo_rental_datasource_1 = require("../../infrastructure/datasources/mongo-rental.datasource");
const interfaces_1 = require("../../interfaces");
class RentalsController {
    constructor() {
        this.rentalRepo = new rental_impl_repository_1.RentalRepositoryImpl(new mongo_rental_datasource_1.MongoRentalDatasource());
        this.getRentals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const rentals = yield this.rentalRepo.getRentals(paginationDto);
            const { page: rentalPage, limit: limitPage, total, sum, next, prev, rentals: data } = rentals;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                rentals: data.map(rental => rental.params)
            });
        });
        this.getRental = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const rental = yield this.rentalRepo.getRental(id);
            return (rental) ? res.json(rental.params) : res.status(404).json({ error: `Rental with ID ${id} not found` });
        });
        this.getRentalsByDay = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { day, month, year } = req.params;
            const { page = 1, limit = 5 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const rentals = yield this.rentalRepo.getRentalsByDay(day, month, year, paginationDto);
            const { page: rentalPage, limit: limitPage, total, sum, next, prev, rentals: data } = rentals;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                rentals: data.map(rental => rental.params)
            });
        });
        this.getRentalsByMonth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { month, year } = req.params;
            const { page = 1, limit = 5 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const rentals = yield this.rentalRepo.getRentalsByMonth(month, year, paginationDto);
            const { page: rentalPage, limit: limitPage, total, sum, next, prev, rentals: data } = rentals;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                rentals: data.map(rental => rental.params)
            });
        });
        this.getRentalsByPeriod = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { starting, ending } = req.params;
            const { page = 1, limit = 5 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const rentals = yield this.rentalRepo.getRentalsByPeriod(starting, ending, paginationDto);
            const { page: rentalPage, limit: limitPage, total, sum, next, prev, rentals: data } = rentals;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                rentals: data.map(rental => rental.params)
            });
        });
        this.createRental = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, rentalDto] = rental_1.RentalDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const rentalData = rental_entity_1.RentalEntity.fromObject(rentalDto.params);
            const rental = (yield this.rentalRepo.createRental(rentalData)).params;
            return res.json(rental);
        });
        this.updateRental = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const [error, rentalDto] = rental_1.RentalDTO.update(Object.assign(Object.assign({}, req.body), { _id: id }));
            if (error)
                return res.status(400).json({ error });
            const rentalDB = yield this.rentalRepo.getRental(id);
            if (!rentalDB) {
                return res.status(404).json({ error: 'Alquiler no encontrado' });
            }
            const updatedRentalEntity = rental_entity_1.RentalEntity.fromObject(rentalDto === null || rentalDto === void 0 ? void 0 : rentalDto.params);
            const updatedRental = yield this.rentalRepo.updateRental(id, updatedRentalEntity);
            return res.json(updatedRental === null || updatedRental === void 0 ? void 0 : updatedRental.params);
        });
        this.deactivateRental = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.rentalRepo.deactivateRental(id);
            return res.json({ status: interfaces_1.IStatus.Inactive });
        });
    }
}
exports.RentalsController = RentalsController;
