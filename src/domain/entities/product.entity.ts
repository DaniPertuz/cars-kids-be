import { IProduct } from '../../interfaces';

export class ProductEntity {
  constructor(public params: IProduct) { }

  static fromObject = (object: IProduct): ProductEntity => {
    const { _id, name, price, status } = object;
    return new ProductEntity({ _id, name, price, status });
  };
}
