"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseEntity = void 0;
class PurchaseEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.PurchaseEntity = PurchaseEntity;
PurchaseEntity.fromObject = (object) => {
    const { _id, price, product, payment, purchaseDate, quantity, user, desk } = object;
    return new PurchaseEntity({ _id, product, quantity, price, payment, purchaseDate, user, desk });
};
