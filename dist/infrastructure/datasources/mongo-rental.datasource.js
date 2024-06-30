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
exports.MongoRentalDatasource = void 0;
const models_1 = require("../../database/models");
const rental_entity_1 = require("../../domain/entities/rental.entity");
const errors_1 = require("../../domain/errors");
class MongoRentalDatasource {
    getRentalsByQuery(query, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            const [total, sum, rentals] = yield Promise.all([
                models_1.RentalModel.countDocuments(query),
                models_1.RentalModel.aggregate([
                    {
                        $match: query
                    },
                    {
                        $group: {
                            _id: null,
                            sum: { $sum: '$amount' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            sum: 1
                        }
                    }
                ]),
                models_1.RentalModel.find(query)
                    .populate('vehicle', '-_id nickname')
                    .populate('user', '-_id name')
                    .populate('desk', '-_id name')
                    .sort({ date: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);
            return {
                page,
                limit,
                sum: sum.length > 0 ? sum[0].sum : 0,
                total,
                next: ((page * limit) < total) ? `/rentals?page=${(page + 1)}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/rentals?page=${(page - 1)}&limit=${limit}` : null,
                rentals: rentals.map(rental_entity_1.RentalEntity.fromObject)
            };
        });
    }
    createRental(rental) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.RentalModel.create(rental.params);
                return rental_entity_1.RentalEntity.fromObject(data);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear alquiler: ${error}`);
            }
        });
    }
    getRental(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentalData = yield models_1.RentalModel.findById(id);
                return rentalData ? rental_entity_1.RentalEntity.fromObject(rentalData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener alquiler: ${error}`);
            }
        });
    }
    getRentals(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getRentalsByQuery({}, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener alquileres: ${error}`);
            }
        });
    }
    getRentalsByDay(day, month, year, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dayNumber = parseInt(day, 10);
                const monthNumber = parseInt(month, 10);
                const yearNumber = parseInt(year, 10);
                const selectedDate = new Date(yearNumber, monthNumber - 1, dayNumber);
                const startOfDay = new Date(selectedDate);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(selectedDate);
                endOfDay.setHours(23, 59, 59, 999);
                const query = {
                    date: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                };
                return yield this.getRentalsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los alquileres por día: ${error}`);
            }
        });
    }
    getRentalsByMonth(month, year, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
                const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
                const lastDayOfMonth = new Date(Number(year), monthNumber, 0);
                const query = {
                    date: {
                        $gte: firstDayOfMonth,
                        $lt: lastDayOfMonth
                    }
                };
                return yield this.getRentalsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los alquileres por mes: ${error}`);
            }
        });
    }
    getRentalsByPeriod(starting, ending, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startingDateParts = starting.split('-').map(Number);
                const endingDateParts = ending.split('-').map(Number);
                const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
                const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);
                const endOfEndDate = new Date(endDate);
                endOfEndDate.setHours(23, 59, 59, 999);
                const query = {
                    date: {
                        $gte: startDate,
                        $lt: endOfEndDate
                    }
                };
                return yield this.getRentalsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los alquileres por periodo: ${error}`);
            }
        });
    }
    updateRental(id, rental) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentalData = yield models_1.RentalModel.findByIdAndUpdate(id, rental.params, { new: true });
                return rentalData ? rental_entity_1.RentalEntity.fromObject(rentalData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar alquiler: ${error}`);
            }
        });
    }
    deactivateRental(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield models_1.RentalModel.findByIdAndDelete(id);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar alquiler: ${error}`);
            }
        });
    }
}
exports.MongoRentalDatasource = MongoRentalDatasource;
