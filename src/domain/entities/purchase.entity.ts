import { IPurchase } from '../../interfaces';

export class PurchaseEntity {
  constructor(public params: IPurchase) { }

  static fromObject = (object: IPurchase): PurchaseEntity => {
    const { _id, price, product, payment, purchaseDate, quantity, user } = object;
    return new PurchaseEntity({ _id, product, quantity, price, payment, purchaseDate, user });
  };
}
