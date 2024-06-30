"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepositoryImpl = void 0;
class BudgetRepositoryImpl {
    constructor(budgetDatasource) {
        this.budgetDatasource = budgetDatasource;
    }
    createBudget(budget) {
        return this.budgetDatasource.createBudget(budget);
    }
    getAllBudgets(paginationDto) {
        return this.budgetDatasource.getAllBudgets(paginationDto);
    }
    getBudgetsByDay(day, month, year, paginationDto) {
        return this.budgetDatasource.getBudgetsByDay(day, month, year, paginationDto);
    }
    getBudgetsByMonth(month, year, paginationDto) {
        return this.budgetDatasource.getBudgetsByMonth(month, year, paginationDto);
    }
    getBudgetsByPeriod(starting, ending, paginationDto) {
        return this.budgetDatasource.getBudgetsByPeriod(starting, ending, paginationDto);
    }
    getBudget(_id) {
        return this.budgetDatasource.getBudget(_id);
    }
    updateBudget(_id, budget) {
        return this.budgetDatasource.updateBudget(_id, budget);
    }
    deleteBudget(_id) {
        return this.budgetDatasource.deleteBudget(_id);
    }
}
exports.BudgetRepositoryImpl = BudgetRepositoryImpl;
