import { IPurchase } from '../../interfaces';

export class PurchaseEntity {
  constructor(public params: IPurchase) { }

  static fromObject = (object: IPurchase): PurchaseEntity => {
    const { _id, price, product, purchaseDate, quantity } = object;
    return new PurchaseEntity({ _id, price, product, purchaseDate, quantity });
  };
}
