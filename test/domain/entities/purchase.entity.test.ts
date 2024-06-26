import { PurchaseEntity } from '../../../src/domain/entities/purchase.entity';
import { IPayment } from '../../../src/interfaces';

describe('Purchase entity', () => {
  const data = {
    product: '65cec1ef73d47156e24f0c32',
    quantity: 1,
    price: 10000,
    payment: IPayment.Cash,
    purchaseDate: '01-01-2020',
    user: 'd4ba2daad17250e579833f0e',
    desk: 'd4ba2daad17250e579833f2e'
  };

  test('should create a PurchaseEntity instance', () => {
    const purchase = new PurchaseEntity(data);

    expect(purchase).toBeInstanceOf(PurchaseEntity);
    expect(purchase.params.product).toBe(data.product);
    expect(purchase.params.quantity).toBe(data.quantity);
    expect(purchase.params.price).toBe(data.price);
    expect(purchase.params.purchaseDate).toBe(data.purchaseDate);
    expect(purchase.params.payment).toBe(data.payment);
    expect(purchase.params.user).toBe(data.user);
    expect(purchase.params.desk).toBe(data.desk);
  });

  test('should create a PurchaseEntity from object', () => {
    const purchase = PurchaseEntity.fromObject(data);

    expect(purchase).toBeInstanceOf(PurchaseEntity);
    expect(typeof purchase.params.product).toBe('string');
    expect(typeof purchase.params.quantity).toBe('number');
    expect(typeof purchase.params.price).toBe('number');
    expect(typeof purchase.params.purchaseDate).toBe('string');
    expect(typeof purchase.params.user).toBe('string');
    expect(typeof purchase.params.desk).toBe('string');
  });
});
