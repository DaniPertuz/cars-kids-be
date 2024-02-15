import { IProduct } from '../../../interfaces';

export class ProductDTO {
  private constructor(public params: IProduct) { }

  static create(object: IProduct): [string?, ProductDTO?] {
    const { name, payment, amount, status } = object;

    if (!name) return ['Nombre de producto es requerido'];
    if (!payment) return ['Tipo de pago es requerido'];
    if (!amount) return ['Valor de producto es requerido'];
    if (!status) return ['Estado de producto es requerido'];

    return [undefined, new ProductDTO(object)];
  }
}
