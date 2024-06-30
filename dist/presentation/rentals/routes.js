"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class RentalsRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { getRentals, getRental, getRentalsByDay, getRentalsByMonth, getRentalsByPeriod, createRental, updateRental, deactivateRental } = new controllers_1.RentalsController();
        router.get('/', getRentals);
        router.get('/:id', getRental);
        router.get('/dates/day/:day/:month/:year', getRentalsByDay);
        router.get('/dates/month/:month/:year', getRentalsByMonth);
        router.get('/dates/period/:starting/:ending', getRentalsByPeriod);
        router.post('/', createRental);
        router.put('/:id', updateRental);
        router.delete('/:id', deactivateRental);
        return router;
    }
}
exports.RentalsRoutes = RentalsRoutes;
