"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesksRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class DesksRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { createDesk, getDesks, getDesk, updateDesk, deleteDesk } = new controllers_1.DeskController();
        router.get('/', getDesks);
        router.get('/:name', getDesk);
        router.post('/', createDesk);
        router.put('/:name', updateDesk);
        router.delete('/:name', deleteDesk);
        return router;
    }
}
exports.DesksRoutes = DesksRoutes;
