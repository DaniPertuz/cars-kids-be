import { IProduct } from '../../../interfaces';

export class ProductDTO {
  private constructor(public params: IProduct) { }

  static create(object: { [key: string]: any; }): [string?, ProductDTO?] {
    const { name, price, status } = object;

    if (!name) return ['Nombre de producto es requerido'];
    if (!price) return ['Precio de producto es requerido'];
    if (!status) return ['Estado de producto es requerido'];

    return [undefined, new ProductDTO({ name, price, status })];
  }
}
