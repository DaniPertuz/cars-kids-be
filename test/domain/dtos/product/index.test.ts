import { IProduct, IStatus } from '../../../../src/interfaces';
import { ProductDTO } from '../../../../src/domain/dtos/product';

describe('ProductDTO', () => {
  const validObject: IProduct = {
    name: 'Valid Product',
    price: 10000,
    status: IStatus.Active
  };

  describe('create', () => {
    test('should return error when name field is missing', () => {
      const invalidObject = {
        price: 10000,
        status: IStatus.Active
      };
      const [error, productDTO] = ProductDTO.create(invalidObject);

      expect(error).toBe('Nombre de producto es requerido');
      expect(productDTO).toBeUndefined();
    });

    test('should return error when price field is missing', () => {
      const invalidObject = {
        name: 'Invalid Product',
        status: IStatus.Active
      };
      const [error, productDTO] = ProductDTO.create(invalidObject);

      expect(error).toBe('Precio de producto es requerido');
      expect(productDTO).toBeUndefined();
    });

    test('should return error when status field is missing', () => {
      const invalidObject = {
        name: 'Invalid Product',
        price: 10000
      };
      const [error, productDTO] = ProductDTO.create(invalidObject);

      expect(error).toBe('Estado de producto es requerido');
      expect(productDTO).toBeUndefined();
    });

    test('should return ProductDTO instance when object is valid', () => {
      const [error, productDTO] = ProductDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(productDTO).toBeInstanceOf(ProductDTO);
    });
  });
});
