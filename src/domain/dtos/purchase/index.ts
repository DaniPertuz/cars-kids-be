import { IPurchase } from '../../../interfaces';

export class PurchaseDTO {
  private constructor(public params: IPurchase) { }

  static create(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, purchaseDate, quantity, user } = object;

    if (!price) return ['Precio de compra es requerido'];
    if (!product) return ['ID de producto es requerido'];
    if (!purchaseDate) return ['Fecha de compra es requerida'];
    if (!quantity) return ['Cantidad de items comprados es requerida'];
    if (!user) return ['Usuario es requerido'];

    return [undefined, new PurchaseDTO({ _id, price, product, purchaseDate, quantity, user })];
  }

  static update(object: { [key: string]: any; }): [string?, PurchaseDTO?] {
    const { _id, price, product, purchaseDate, quantity, user } = object;

    if (!_id) return ['ID de compra es requerido'];

    return [undefined, new PurchaseDTO({ _id, price, product, purchaseDate, quantity, user })];
  }
}
