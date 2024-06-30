"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
class ProductsRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { createProduct, deleteProduct, getProduct, getAllProducts, getProductsByStatus, updateProduct } = new controllers_1.ProductsController();
        router.get('/', getAllProducts);
        router.get('/status/:status', getProductsByStatus);
        router.get('/:name', getProduct);
        router.post('/', createProduct);
        router.put('/:name', updateProduct);
        router.delete('/:name', deleteProduct);
        return router;
    }
}
exports.ProductsRoutes = ProductsRoutes;
