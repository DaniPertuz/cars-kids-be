import { IStatus } from '../../../../src/interfaces';
import { ProductDatasource } from '../../../../src/domain/datasources/product.datasource';
import { ProductEntity } from '../../../../src/domain/entities/product.entity';
import { ProductRepositoryImpl } from '../../../../src/infrastructure/repositories/product-impl.repository';

type MockProductDatasource = ProductDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Product repository implementation', () => {
  const mockProductDatasource: MockProductDatasource = {
    createProduct: jest.fn(),
    getProduct: jest.fn(),
    getAllProducts: jest.fn(),
    getProductsByStatus: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn()
  };

  const productRepositoryImpl = new ProductRepositoryImpl(mockProductDatasource);

  const product = new ProductEntity({
    name: 'Test Product',
    cost: 8000,
    price: 10000,
    status: IStatus.Active
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createProduct', args: [product], },
    { method: 'getProduct', args: [product] },
    { method: 'getAllProducts', args: [] },
    { method: 'getProductsByStatus', args: ['Test Status' as IStatus] },
    { method: 'updateProduct', args: ['d34a2daad17250e579833f0e'] },
    { method: 'deleteProduct', args: ['d34a2daad17250e579833f0e'] },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (productRepositoryImpl as any)[method](...args);
      expect(mockProductDatasource[method]).toHaveBeenCalled();
    });
  });
});
