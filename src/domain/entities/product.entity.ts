import { IProduct } from '../../interfaces';

export class ProductEntity {
  constructor(public params: IProduct) { }

  static fromObject = (object: IProduct): ProductEntity => {
    const { name, amount, status } = object;
    return new ProductEntity({ name, amount, status });
  };
}
