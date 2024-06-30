"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasesRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class PurchasesRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { createPurchase, deletePurchase, getPurchase, getPurchases, getPurchasesByDay, getPurchasesByMonth, getPurchasesByPeriod, updatePurchase } = new controllers_1.PurchasesController();
        router.get('/', getPurchases);
        router.get('/dates/day/:day/:month/:year', getPurchasesByDay);
        router.get('/dates/month/:month/:year', getPurchasesByMonth);
        router.get('/dates/period/:starting/:ending', getPurchasesByPeriod);
        router.get('/:id', getPurchase);
        router.post('/', createPurchase);
        router.put('/:id', updatePurchase);
        router.delete('/:id', deletePurchase);
        return router;
    }
}
exports.PurchasesRoutes = PurchasesRoutes;
