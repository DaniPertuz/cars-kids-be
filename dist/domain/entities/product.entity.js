"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = void 0;
class ProductEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.ProductEntity = ProductEntity;
ProductEntity.fromObject = (object) => {
    const { _id, name, cost, price, status } = object;
    return new ProductEntity({ _id, name, cost, price, status });
};
