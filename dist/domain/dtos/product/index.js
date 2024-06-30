"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDTO = void 0;
class ProductDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { name, cost, price, status } = object;
        if (!name)
            return ['Nombre de producto es requerido'];
        if (!cost)
            return ['Costo de producto es requerido'];
        if (!price)
            return ['Precio de venta de producto es requerido'];
        if (!status)
            return ['Estado de producto es requerido'];
        return [undefined, new ProductDTO({ name, cost, price, status })];
    }
}
exports.ProductDTO = ProductDTO;
