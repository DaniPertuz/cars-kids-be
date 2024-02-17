import { ProductDatasource } from '../../../src/domain/datasources/product.datasource';
import { ProductEntity } from '../../../src/domain/entities/product.entity';

describe('Product datasource', () => {
  class MockDatasource implements ProductDatasource {
    createProduct(product: ProductEntity): Promise<ProductEntity> {
      throw new Error('Method not implemented.');
    }
    getActiveProducts(): Promise<ProductEntity[]> {
      throw new Error('Method not implemented.');
    }
    getAllProducts(): Promise<ProductEntity[]> {
      throw new Error('Method not implemented.');
    }
    getProduct(name: string): Promise<ProductEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateProduct(name: string, product: ProductEntity): Promise<ProductEntity | null> {
      throw new Error('Method not implemented.');
    }
    deleteProduct(name: string): Promise<ProductEntity | null> {
      throw new Error('Method not implemented.');
    }
}

  test('should test the abstract Product class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createProduct).toBe('function');
    expect(typeof mockDatasource.getProduct).toBe('function');
    expect(typeof mockDatasource.getActiveProducts).toBe('function');
    expect(typeof mockDatasource.getAllProducts).toBe('function');
    expect(typeof mockDatasource.updateProduct).toBe('function');
    expect(typeof mockDatasource.deleteProduct).toBe('function');
  });
});
