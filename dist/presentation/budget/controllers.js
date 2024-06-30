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
exports.BudgetController = void 0;
const mongo_budget_datasource_1 = require("../../infrastructure/datasources/mongo-budget.datasource");
const budget_impl_repository_1 = require("../../infrastructure/repositories/budget-impl.repository");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
const budget_entity_1 = require("../../domain/entities/budget.entity");
const budget_1 = require("../../domain/dtos/budget");
const interfaces_1 = require("../../interfaces");
class BudgetController {
    constructor() {
        this.budgetRepo = new budget_impl_repository_1.BudgetRepositoryImpl(new mongo_budget_datasource_1.MongoBudgetDatasource());
        this.getBudgets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const budgets = yield this.budgetRepo.getAllBudgets(paginationDto);
            const { page: budgetPage, limit: limitPage, total, next, prev, budgets: data } = budgets;
            return res.json({
                page: budgetPage,
                limit: limitPage,
                total,
                next,
                prev,
                budgets: data.map(budget => budget.params)
            });
        });
        this.getBudget = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const budget = yield this.budgetRepo.getBudget(id);
            return (budget) ? res.json(budget.params) : res.status(404).json({ error: `Presupuesto con ID ${id} no encontrado` });
        });
        this.getBudgetsByDay = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { day, month, year } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const budgets = yield this.budgetRepo.getBudgetsByDay(day, month, year, paginationDto);
            const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                next,
                prev,
                budgets: data.map(budget => budget.params)
            });
        });
        this.getBudgetsByMonth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { month, year } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const budgets = yield this.budgetRepo.getBudgetsByMonth(month, year, paginationDto);
            const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                next,
                prev,
                budgets: data.map(budget => budget.params)
            });
        });
        this.getBudgetsByPeriod = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { starting, ending } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const budgets = yield this.budgetRepo.getBudgetsByPeriod(starting, ending, paginationDto);
            const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;
            return res.json({
                page: rentalPage,
                limit: limitPage,
                total,
                next,
                prev,
                budgets: data.map(budget => budget.params)
            });
        });
        this.createBudget = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, budgetDTO] = budget_1.BudgetDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const budgetData = budget_entity_1.BudgetEntity.fromObject(budgetDTO.params);
            const budget = (yield this.budgetRepo.createBudget(budgetData)).params;
            return res.json(budget);
        });
        this.updateBudget = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const [error, budgetDTO] = budget_1.BudgetDTO.create(req.body);
            if (error)
                return res.status(404).json({ error });
            const budgetDB = yield this.budgetRepo.getBudget(id);
            if (!budgetDB) {
                return res.status(404).json({ error: 'Presupuesto no encontrado' });
            }
            const updatedBudgetEntity = budget_entity_1.BudgetEntity.fromObject(budgetDTO === null || budgetDTO === void 0 ? void 0 : budgetDTO.params);
            const updatedBudget = yield this.budgetRepo.updateBudget(id, updatedBudgetEntity);
            return res.json(updatedBudget === null || updatedBudget === void 0 ? void 0 : updatedBudget.params);
        });
        this.deleteBudget = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const budgetDB = yield this.budgetRepo.getBudget(id);
            if (!budgetDB) {
                return res.status(404).json({ error: 'Presupuesto no encontrado' });
            }
            yield this.budgetRepo.deleteBudget(id);
            return res.json({ status: interfaces_1.IStatus.Inactive });
        });
    }
}
exports.BudgetController = BudgetController;
