"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const routes_1 = require("./auth/routes");
const routes_2 = require("./products/routes");
const routes_3 = require("./rentals/routes");
const routes_4 = require("./users/routes");
const routes_5 = require("./vehicles/routes");
const routes_6 = require("./purchases/routes");
const routes_7 = require("./budget/routes");
const routes_8 = require("./desks/routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        router.use('/api/auth', routes_1.AuthRoutes.routes);
        router.use('/api/budgets', routes_7.BudgetRoutes.routes);
        router.use('/api/desks', routes_8.DesksRoutes.routes);
        router.use('/api/purchases', routes_6.PurchasesRoutes.routes);
        router.use('/api/products', routes_2.ProductsRoutes.routes);
        router.use('/api/rentals', routes_3.RentalsRoutes.routes);
        router.use('/api/users', routes_4.UsersRoutes.routes);
        router.use('/api/vehicles', routes_5.VehiclesRoutes.routes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;
