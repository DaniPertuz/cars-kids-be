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
exports.PurchasesController = void 0;
const mongo_purchase_datasource_1 = require("../../infrastructure/datasources/mongo-purchase.datasource");
const purchase_impl_repository_1 = require("../../infrastructure/repositories/purchase-impl.repository");
const purchase_entity_1 = require("../../domain/entities/purchase.entity");
const purchase_1 = require("../../domain/dtos/purchase");
const pagination_dto_1 = require("../../domain/dtos/shared/pagination.dto");
class PurchasesController {
    constructor() {
        this.purchaseRepo = new purchase_impl_repository_1.PurchaseRepositoryImpl(new mongo_purchase_datasource_1.MongoPurchaseDatasource());
        this.getPurchases = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const purchases = yield this.purchaseRepo.getAllPurchases(paginationDto);
            const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;
            return res.json({
                page: purchasePage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                purchases: data.map(rental => rental.params)
            });
        });
        this.getPurchase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const purchase = yield this.purchaseRepo.getPurchase(id);
            return (purchase) ? res.json(purchase.params) : res.status(404).json({ error: `Compra con ID ${id} no encontrada` });
        });
        this.getPurchasesByDay = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { day, month, year } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const purchases = yield this.purchaseRepo.getPurchasesByDay(day, month, year, paginationDto);
            const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;
            return res.json({
                page: purchasePage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                purchases: data.map(purchase => purchase.params)
            });
        });
        this.getPurchasesByMonth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { month, year } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const purchases = yield this.purchaseRepo.getPurchasesByMonth(month, year, paginationDto);
            const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;
            return res.json({
                page: purchasePage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                purchases: data.map(purchase => purchase.params)
            });
        });
        this.getPurchasesByPeriod = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { starting, ending } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const [error, paginationDto] = pagination_dto_1.PaginationDto.create(+page, +limit);
            if (error)
                return res.status(400).json({ error });
            const purchases = yield this.purchaseRepo.getPurchasesByPeriod(starting, ending, paginationDto);
            const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;
            return res.json({
                page: purchasePage,
                limit: limitPage,
                total,
                sum,
                next,
                prev,
                purchases: data.map(purchase => purchase.params)
            });
        });
        this.createPurchase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, purchaseDto] = purchase_1.PurchaseDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            const purchaseData = purchase_entity_1.PurchaseEntity.fromObject(purchaseDto.params);
            const purchase = yield this.purchaseRepo.createPurchase(purchaseData);
            return (!purchase) ? res.status(404).json({ error: 'Producto no disponible' }) : res.json(purchase.params);
        });
        this.updatePurchase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const [error, purchaseDto] = purchase_1.PurchaseDTO.update(Object.assign(Object.assign({}, req.body), { _id: id }));
            if (error)
                return res.status(400).json({ error });
            const purchaseDB = yield this.purchaseRepo.getPurchase(id);
            if (!purchaseDB)
                return res.status(404).json({ error: 'Compra no encontrada' });
            const updatedPurchaseEntity = purchase_entity_1.PurchaseEntity.fromObject(purchaseDto === null || purchaseDto === void 0 ? void 0 : purchaseDto.params);
            const updatedPurchase = yield this.purchaseRepo.updatePurchase(id, updatedPurchaseEntity);
            return res.json(updatedPurchase === null || updatedPurchase === void 0 ? void 0 : updatedPurchase.params);
        });
        this.deletePurchase = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const purchase = yield this.purchaseRepo.deletePurchase(id);
            if (!purchase)
                return res.status(404).json({ error: 'Compra no encontrada' });
            return res.json(purchase === null || purchase === void 0 ? void 0 : purchase.params);
        });
    }
}
exports.PurchasesController = PurchasesController;
