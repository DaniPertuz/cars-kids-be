import { IProduct } from '../../interfaces';

export class ProductEntity {
  constructor(public params: IProduct) { }

  static fromObject = (object: IProduct): ProductEntity => {
    const { name, price, status } = object;
    return new ProductEntity({ name, price, status });
  };
}
