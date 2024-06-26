import { IPurchase } from '../../../interfaces';
import { Validators } from '../../../plugins/validators';

export class PurchaseDTO {
  private constructor(public params: IPurchase) { }

  static create(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, payment, purchaseDate, quantity, user, desk } = object;

    if (!price) return ['Precio de compra es requerido'];
    if (!product) return ['ID de producto es requerido'];
    if (!payment) return ['Forma de pago es requerida'];
    if (!purchaseDate) return ['Fecha de compra es requerida'];
    if (!quantity) return ['Cantidad de items comprados es requerida'];
    if (!user) return ['Usuario es requerido'];
    if (!desk) return ['Puesto de trabajo es requerido'];
    if (!Validators.isMongoID(product)) return ['Invalid product ID'];
    if (!Validators.isMongoID(desk)) return ['Invalid desk ID'];
    if (!Validators.isMongoID(user)) return ['Invalid User ID'];

    return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user, desk })];
  }

  static update(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, payment, purchaseDate, quantity, user, desk } = object;

    if (!_id) return ['ID de compra es requerido'];

    return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user, desk })];
  }
}
