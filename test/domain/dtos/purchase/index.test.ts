import { PurchaseDTO } from '../../../../src/domain/dtos/purchase';
import { IPurchase } from '../../../../src/interfaces';

describe('PurchaseDTO', () => {
  const validObject: IPurchase = {
    _id: 'ID',
    price: 10000,
    purchaseDate: '2020-12-10',
    quantity: 1,
    product: 'productID',
    user: 'd4ba2daad17250e579833f0e'
  };

  describe('create', () => {
    test('should return error when price field is missing', () => {
      const invalidObject = {
        purchaseDate: '2020-12-10',
        quantity: 1,
        product: 'productID',
        user: 'd4ba2daad17250e579833f0e'
      };

      const [error, purchaseDTO] = PurchaseDTO.create(invalidObject);

      expect(error).toBe('Precio de compra es requerido');
      expect(purchaseDTO).toBeUndefined();
    });

    test('should return error when date field is missing', () => {
      const invalidObject = {
        price: 10000,
        quantity: 1,
        product: 'productID',
        user: 'd4ba2daad17250e579833f0e'
      };

      const [error, purchaseDTO] = PurchaseDTO.create(invalidObject);

      expect(error).toBe('Fecha de compra es requerida');
      expect(purchaseDTO).toBeUndefined();
    });

    test('should return error when quantity field is missing', () => {
      const invalidObject = {
        price: 10000,
        purchaseDate: '2020-12-10',
        product: 'productID',
        user: 'd4ba2daad17250e579833f0e'
      };
      
      const [error, purchaseDTO] = PurchaseDTO.create(invalidObject);
      
      expect(error).toBe('Cantidad de items comprados es requerida');
      expect(purchaseDTO).toBeUndefined();
    });
    
    test('should return error when product field is missing', () => {
      const invalidObject = {
        price: 10000,
        purchaseDate: '2020-12-10',
        quantity: 1,
        user: 'd4ba2daad17250e579833f0e'
      };
      
      const [error, purchaseDTO] = PurchaseDTO.create(invalidObject);
      
      expect(error).toBe('ID de producto es requerido');
      expect(purchaseDTO).toBeUndefined();
    });
    
    test('should return error when user field is missing', () => {
      const invalidObject = {
        price: 10000,
        product: 'productID',
        purchaseDate: '2020-12-10',
        quantity: 1
      };

      const [error, purchaseDTO] = PurchaseDTO.create(invalidObject);

      expect(error).toBe('Usuario es requerido');
      expect(purchaseDTO).toBeUndefined();
    });

    test('should return ProductDTO instance when object is valid', () => {
      const [error, purchaseDTO] = PurchaseDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(purchaseDTO).toBeInstanceOf(PurchaseDTO);
    });
  });

  describe('update', () => {
    test('should return error when ID is missing', () => {
      const invalidObject = {
        price: 10000,
        purchaseDate: '2020-12-10',
        quantity: 1,
        product: 'productID',
        user: 'd4ba2daad17250e579833f0e'
      };

      const [error, purchaseDTO] = PurchaseDTO.update(invalidObject);

      expect(error).toBe('ID de compra es requerido');
      expect(purchaseDTO).toBeUndefined();
    });

    test('should return RentalDTO instance with default ID when object is valid', () => {
      const [error, purchaseDTO] = PurchaseDTO.update(validObject);

      expect(error).toBeUndefined();
      expect(purchaseDTO).toBeInstanceOf(PurchaseDTO);
    });
  });
});
