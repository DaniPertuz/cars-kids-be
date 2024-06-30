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
exports.ProductsController = void 0;
const mongo_product_datasource_1 = require("../../infrastructure/datasources/mongo-product.datasource");
const product_impl_repository_1 = require("../../infrastructure/repositories/product-impl.repository");
const product_1 = require("../../domain/dtos/product");
const product_entity_1 = require("../../domain/entities/product.entity");
const interfaces_1 = require("../../interfaces");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
class ProductsController {
    constructor() {
        this.productRepo = new product_impl_repository_1.ProductRepositoryImpl(new mongo_product_datasource_1.MongoProductDatasource());
        this.getAllProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const products = yield this.productRepo.getAllProducts(paginationDto);
            const { page: productPage, limit: limitPage, total, next, prev, products: data } = products;
            return res.json({
                page: productPage,
                limit: limitPage,
                total,
                next,
                prev,
                products: data.map(product => product.params)
            });
        });
        this.getProductsByStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            if (!(Object.values(interfaces_1.IStatus).includes(status))) {
                return res.status(400).json({ error: 'Estado de producto no válido' });
            }
            const products = yield this.productRepo.getProductsByStatus(status, paginationDto);
            const { page: productPage, limit: limitPage, total, next, prev, products: data } = products;
            return res.json({
                page: productPage,
                limit: limitPage,
                total,
                next,
                prev,
                products: data.map(product => product.params)
            });
        });
        this.getProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const product = yield this.productRepo.getProduct(name);
            return (product) ? res.json(product.params) : res.status(404).json({ error: `No se encontró el producto ${name}` });
        });
        this.createProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, productDto] = product_1.ProductDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const productDB = yield this.productRepo.getProduct(productDto.params.name);
            if (productDB)
                return res.status(400).json({ error: 'Ya existe producto con este nombre' });
            const productData = product_entity_1.ProductEntity.fromObject(productDto.params);
            const product = (yield this.productRepo.createProduct(productData)).params;
            return res.json(product);
        });
        this.updateProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const { name: newName, cost, price, status } = req.body;
            const productDB = yield this.productRepo.getProduct(name);
            if (!productDB)
                return res.status(404).json({ error: 'Producto no encontrado' });
            const existingProduct = yield this.productRepo.getProduct(newName);
            if (existingProduct)
                return res.status(404).json({ error: 'Ya existe un producto con este nombre' });
            const updatedProductData = {
                name: newName,
                cost,
                price,
                status
            };
            const updatedProductEntity = product_entity_1.ProductEntity.fromObject(updatedProductData);
            const updatedProduct = yield this.productRepo.updateProduct(name, updatedProductEntity);
            return res.json(updatedProduct.params);
        });
        this.deleteProduct = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name } = req.params;
            const productDB = yield this.productRepo.getProduct(name);
            if (!productDB)
                return res.status(404).json({ error: 'Producto no encontrado' });
            const product = yield this.productRepo.deleteProduct(name);
            return res.json(product.params);
        });
    }
}
exports.ProductsController = ProductsController;
