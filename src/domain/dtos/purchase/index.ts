import { IPurchase } from '../../../interfaces';

export class PurchaseDTO {
  private constructor(public params: IPurchase) { }

  static create(object: IPurchase): [string?, PurchaseDTO?] {
    const { price, product, purchaseDate, quantity } = object;

    if (!price) return ['Precio de compra es requerido'];
    if (!product) return ['ID de producto es requerido'];
    if (!purchaseDate) return ['Fecha de compra es requerida'];
    if (!quantity) return ['Cantidad de items comprados es requerida'];

    return [undefined, new PurchaseDTO(object)];
  }

  static update(object: IPurchase): [string?, PurchaseDTO?] {
    const { _id, price, product, purchaseDate, quantity } = object;

    if (!_id) return ['ID de compra es requerido'];

    return [undefined, new PurchaseDTO({ _id, price, product, purchaseDate, quantity })];
  }
}
