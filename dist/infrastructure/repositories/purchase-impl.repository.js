"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseRepositoryImpl = void 0;
class PurchaseRepositoryImpl {
    constructor(purchaseDatasource) {
        this.purchaseDatasource = purchaseDatasource;
    }
    createPurchase(purchase) {
        return this.purchaseDatasource.createPurchase(purchase);
    }
    getAllPurchases(paginationDto) {
        return this.purchaseDatasource.getAllPurchases(paginationDto);
    }
    getPurchasesByDay(day, month, year, paginationDto) {
        return this.purchaseDatasource.getPurchasesByDay(day, month, year, paginationDto);
    }
    getPurchasesByMonth(month, year, paginationDto) {
        return this.purchaseDatasource.getPurchasesByMonth(month, year, paginationDto);
    }
    getPurchasesByPeriod(starting, ending, paginationDto) {
        return this.purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto);
    }
    getPurchase(id) {
        return this.purchaseDatasource.getPurchase(id);
    }
    updatePurchase(id, purchase) {
        return this.purchaseDatasource.updatePurchase(id, purchase);
    }
    deletePurchase(id) {
        return this.purchaseDatasource.deletePurchase(id);
    }
}
exports.PurchaseRepositoryImpl = PurchaseRepositoryImpl;
