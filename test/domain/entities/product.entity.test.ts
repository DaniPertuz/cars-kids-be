import { IStatus } from '../../../src/interfaces';
import { ProductEntity } from '../../../src/domain/entities/product.entity';

describe('Product entity', () => {
  const data = {
    name: 'Test Product',
    price: 10000,
    status: IStatus.Active
  };

  test('should create a ProductEntity instance', () => {
    const product = new ProductEntity(data);

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.params.name).toBe(data.name);
    expect(product.params.price).toBe(data.price);
    expect(product.params.status).toBe(data.status);
  });

  test('should create a ProductEntity from object', () => {
    const product = ProductEntity.fromObject(data);

    expect(product).toBeInstanceOf(ProductEntity);
    expect(product.params.name).toBe('Test Product');
    expect(product.params.price).toBe(10000);
    expect(product.params.status).toBe(IStatus.Active);
  });
});
