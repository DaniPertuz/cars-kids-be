"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepositoryImpl = void 0;
class ProductRepositoryImpl {
    constructor(productDatasource) {
        this.productDatasource = productDatasource;
    }
    createProduct(product) {
        return this.productDatasource.createProduct(product);
    }
    getAllProducts(paginationDto) {
        return this.productDatasource.getAllProducts(paginationDto);
    }
    getProductsByStatus(status, paginationDto) {
        return this.productDatasource.getProductsByStatus(status, paginationDto);
    }
    getProduct(name) {
        return this.productDatasource.getProduct(name);
    }
    updateProduct(name, product) {
        return this.productDatasource.updateProduct(name, product);
    }
    deleteProduct(name) {
        return this.productDatasource.deleteProduct(name);
    }
}
exports.ProductRepositoryImpl = ProductRepositoryImpl;
