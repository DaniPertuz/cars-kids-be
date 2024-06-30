"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class BudgetRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { getBudgets, getBudget, createBudget, getBudgetsByDay, getBudgetsByMonth, getBudgetsByPeriod, updateBudget, deleteBudget } = new controllers_1.BudgetController();
        router.get('/', getBudgets);
        router.get('/:id', getBudget);
        router.get('/dates/day/:day/:month/:year', getBudgetsByDay);
        router.get('/dates/month/:month/:year', getBudgetsByMonth);
        router.get('/dates/period/:starting/:ending', getBudgetsByPeriod);
        router.post('/', createBudget);
        router.put('/:id', updateBudget);
        router.delete('/:id', deleteBudget);
        return router;
    }
}
exports.BudgetRoutes = BudgetRoutes;
