"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoProductDatasource = void 0;
const models_1 = require("../../database/models");
const product_entity_1 = require("../../domain/entities/product.entity");
const errors_1 = require("../../domain/errors");
const interfaces_1 = require("../../interfaces");
class MongoProductDatasource {
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield models_1.ProductModel.create(product.params);
                return product_entity_1.ProductEntity.fromObject(data);
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al crear producto: ${error}`);
            }
        });
    }
    getAllProducts(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = paginationDto;
                const [total, products] = yield Promise.all([
                    models_1.ProductModel.countDocuments(),
                    models_1.ProductModel.find({})
                        .sort({ name: 1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                ]);
                return {
                    page,
                    limit,
                    total,
                    next: ((page * limit) < total) ? `/products?page=${(page + 1)}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/products?page=${(page - 1)}&limit=${limit}` : null,
                    products: products.map(product_entity_1.ProductEntity.fromObject)
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener todos los productos: ${error}`);
            }
        });
    }
    getProductsByStatus(status, paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = paginationDto;
                const [total, products] = yield Promise.all([
                    models_1.ProductModel.countDocuments({ status }),
                    models_1.ProductModel.find({ status })
                        .sort({ name: 1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                ]);
                return {
                    page,
                    limit,
                    total,
                    next: ((page * limit) < total) ? `/products/status/${status}?page=${(page + 1)}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/products/status/${status}?page=${(page - 1)}&limit=${limit}` : null,
                    products: products.map(product_entity_1.ProductEntity.fromObject)
                };
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener productos por estado: ${error}`);
            }
        });
    }
    getProduct(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = yield models_1.ProductModel.findOne({ name });
                return productData ? product_entity_1.ProductEntity.fromObject(productData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al obtener producto: ${error}`);
            }
        });
    }
    updateProduct(name, product) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = yield models_1.ProductModel.findOneAndUpdate({ name }, product.params, { new: true });
                return productData ? product_entity_1.ProductEntity.fromObject(productData) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al actualizar producto: ${error}`);
            }
        });
    }
    deleteProduct(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield models_1.ProductModel.findOneAndUpdate({ name }, { status: interfaces_1.IStatus.Inactive }, { new: true });
                return product ? product_entity_1.ProductEntity.fromObject(product) : null;
            }
            catch (error) {
                throw errors_1.CustomError.serverError(`Error al eliminar producto: ${error}`);
            }
        });
    }
}
exports.MongoProductDatasource = MongoProductDatasource;
