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
exports.MongoPurchaseDatasource = void 0;
const models_1 = require("../../database/models");
const purchase_entity_1 = require("../../domain/entities/purchase.entity");
const errors_1 = require("../../domain/errors");
const interfaces_1 = require("../../interfaces");
class MongoPurchaseDatasource {
    createPurchase(purchase) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { product } = purchase.params;
                const productDB = yield models_1.ProductModel.findById(product);
                return (productDB === null || productDB === void 0 ? void 0 : productDB.status) === interfaces_1.IStatus.Inactive ? null : purchase_entity_1.PurchaseEntity.fromObject((yield models_1.PurchaseModel.create(purchase.params)));
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear compra: ${error}`);
            }
        });
    }
    getPurchasesByQuery(query, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            const [total, sum, purchases] = yield Promise.all([
                models_1.PurchaseModel.countDocuments(query),
                models_1.PurchaseModel.aggregate([
                    {
                        $match: query
                    },
                    {
                        $group: {
                            _id: null,
                            sum: { $sum: '$price' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            sum: 1
                        }
                    }
                ]),
                models_1.PurchaseModel.find(query)
                    .populate('product', '-_id name cost price')
                    .populate('user', '-_id name')
                    .populate('desk', '-_id name')
                    .sort({ purchaseDate: 1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);
            return {
                page,
                limit,
                total,
                sum: sum.length > 0 ? sum[0].sum : 0,
                next: ((page * limit) < total) ? `/purchases?page=${(page + 1)}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/purchases?page=${(page - 1)}&limit=${limit}` : null,
                purchases: purchases.map(purchase_entity_1.PurchaseEntity.fromObject)
            };
        });
    }
    getAllPurchases(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getPurchasesByQuery({}, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener compras: ${error}`);
            }
        });
    }
    getPurchasesByDay(day, month, year, paginationDto) {
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
                    purchaseDate: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                };
                return yield this.getPurchasesByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener compras por día: ${error}`);
            }
        });
    }
    getPurchasesByMonth(month, year, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
                const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
                const lastDayOfMonth = new Date(Number(year), monthNumber, 0);
                const query = {
                    purchaseDate: {
                        $gte: firstDayOfMonth,
                        $lt: lastDayOfMonth
                    }
                };
                return yield this.getPurchasesByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener las compras por mes: ${error}`);
            }
        });
    }
    getPurchasesByPeriod(starting, ending, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startingDateParts = starting.split('-').map(Number);
                const endingDateParts = ending.split('-').map(Number);
                const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
                const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);
                const endOfEndDate = new Date(endDate);
                endOfEndDate.setHours(23, 59, 59, 999);
                const query = {
                    purchaseDate: {
                        $gte: startDate,
                        $lt: endOfEndDate
                    }
                };
                return yield this.getPurchasesByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener las compras por periodo: ${error}`);
            }
        });
    }
    getPurchase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseData = yield models_1.PurchaseModel.findById(id);
                return purchaseData ? purchase_entity_1.PurchaseEntity.fromObject(purchaseData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener compra: ${error}`);
            }
        });
    }
    updatePurchase(id, purchase) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseData = yield models_1.PurchaseModel.findByIdAndUpdate(id, purchase.params, { new: true });
                return purchaseData ? purchase_entity_1.PurchaseEntity.fromObject(purchaseData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar compra: ${error}`);
            }
        });
    }
    deletePurchase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchase = yield models_1.PurchaseModel.findByIdAndDelete(id, { new: true });
                return purchase ? purchase_entity_1.PurchaseEntity.fromObject(purchase) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar compra: ${error}`);
            }
        });
    }
}
exports.MongoPurchaseDatasource = MongoPurchaseDatasource;
