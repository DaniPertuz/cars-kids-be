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
exports.MongoBudgetDatasource = void 0;
const models_1 = require("../../database/models");
const budget_entity_1 = require("../../domain/entities/budget.entity");
const errors_1 = require("../../domain/errors");
class MongoBudgetDatasource {
    getBudgetsByQuery(query, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            const [total, budgets] = yield Promise.all([
                models_1.BudgetModel.countDocuments(query),
                models_1.BudgetModel.find(query)
                    .sort({ date: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);
            return {
                page,
                limit,
                total,
                next: ((page * limit) < total) ? `/budgets?page=${(page + 1)}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/budgets?page=${(page - 1)}&limit=${limit}` : null,
                budgets: budgets.map(budget_entity_1.BudgetEntity.fromObject)
            };
        });
    }
    createBudget(budget) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.BudgetModel.create(budget.params);
                return budget_entity_1.BudgetEntity.fromObject(data);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear presupuesto: ${error}`);
            }
        });
    }
    getAllBudgets(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getBudgetsByQuery({}, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener presupuestos: ${error}`);
            }
        });
    }
    getBudgetsByDay(day, month, year, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dayNumber = parseInt(day, 10);
                const monthNumber = parseInt(month, 10) - 1;
                const yearNumber = parseInt(year, 10);
                const selectedDate = new Date(yearNumber, monthNumber, dayNumber);
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
                return yield this.getBudgetsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los presupuestos por día: ${error}`);
            }
        });
    }
    getBudgetsByMonth(month, year, paginationDto) {
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
                return yield this.getBudgetsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los presupuestos por mes: ${error}`);
            }
        });
    }
    getBudgetsByPeriod(starting, ending, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startingDateParts = starting.split('-').map(Number);
                const endingDateParts = ending.split('-').map(Number);
                const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
                const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);
                const query = {
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                };
                return yield this.getBudgetsByQuery(query, paginationDto);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener los presupuestos por periodo: ${error}`);
            }
        });
    }
    getBudget(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budgetData = yield models_1.BudgetModel.findById(_id);
                return budgetData ? budget_entity_1.BudgetEntity.fromObject(budgetData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener presupuesto: ${error}`);
            }
        });
    }
    updateBudget(_id, budget) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rentalData = yield models_1.BudgetModel.findByIdAndUpdate(_id, budget.params, { new: true });
                return rentalData ? budget_entity_1.BudgetEntity.fromObject(rentalData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar presupuesto: ${error}`);
            }
        });
    }
    deleteBudget(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield models_1.BudgetModel.findByIdAndDelete(_id);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar presupuesto: ${error}`);
            }
        });
    }
}
exports.MongoBudgetDatasource = MongoBudgetDatasource;
