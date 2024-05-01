import { IPurchase } from '../../../interfaces';
import { Validators } from '../../../plugins/validators';

export class PurchaseDTO {
  private constructor(public params: IPurchase) { }

  static create(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, payment, purchaseDate, quantity, user } = object;

    if (!price) return ['Precio de compra es requerido'];
    if (!product) return ['ID de producto es requerido'];
    if (!payment) return ['Forma de pago es requerida'];
    if (!purchaseDate) return ['Fecha de compra es requerida'];
    if (!quantity) return ['Cantidad de items comprados es requerida'];
    if (!user) return ['Usuario es requerido'];
    if (!Validators.isMongoID(user)) return ['Invalid User ID'];

    return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user })];
  }

  static update(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, payment, purchaseDate, quantity, user } = object;

    if (!_id) return ['ID de compra es requerido'];

    return [undefined, new PurchaseDTO({ _id, price, product, payment, purchaseDate, quantity, user })];
  }
}
