import { IProduct } from '../../interfaces';

export class ProductEntity {
  constructor(public params: IProduct) { }

  static fromObject = (object: IProduct): ProductEntity => {
    const { name, payment, amount, status } = object;
    return new ProductEntity({ name, payment, amount, status });
  };
}
