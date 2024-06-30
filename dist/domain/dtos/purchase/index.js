"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDTO = void 0;
const validators_1 = require("../../../plugins/validators");
class PurchaseDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { _id, price, product, payment, purchaseDate, quantity, user, desk } = object;
        if (!price)
            return ['Precio de compra es requerido'];
        if (!product)
            return ['ID de producto es requerido'];
        if (!payment)
            return ['Forma de pago es requerida'];
        if (!purchaseDate)
            return ['Fecha de compra es requerida'];
        if (!quantity)
            return ['Cantidad de items comprados es requerida'];
        if (!user)
            return ['Usuario es requerido'];
        if (!desk)
            return ['Puesto de trabajo es requerido'];
        if (!validators_1.Validators.isMongoID(product))
            return ['Invalid product ID'];
        if (!validators_1.Validators.isMongoID(desk))
            return ['Invalid desk ID'];
        if (!validators_1.Validators.isMongoID(user))
            return ['Invalid User ID'];
        return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user, desk })];
    }
    static update(object) {
        const { _id, price, product, payment, purchaseDate, quantity, user, desk } = object;
        if (!_id)
            return ['ID de compra es requerido'];
        return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user, desk })];
    }
}
exports.PurchaseDTO = PurchaseDTO;
