import { IStatus } from '../../../../src/interfaces';
import { PurchaseDatasource } from '../../../../src/domain/datasources/purchase.datasource';
import { PurchaseEntity } from '../../../../src/domain/entities/purchase.entity';
import { PurchaseRepositoryImpl } from '../../../../src/infrastructure/repositories/purchase-impl.repository';

type MockPurchaseDatasource = PurchaseDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Purchase repository implementation', () => {
  const mockPurchaseDatasource: MockPurchaseDatasource = {
    createPurchase: jest.fn(),
    getPurchase: jest.fn(),
    getAllPurchases: jest.fn(),
    getPurchasesByDay: jest.fn(),
    getPurchasesByMonth: jest.fn(),
    getPurchasesByPeriod: jest.fn(),
    updatePurchase: jest.fn(),
    deletePurchase: jest.fn()
  };

  const purchaseRepositoryImpl = new PurchaseRepositoryImpl(mockPurchaseDatasource);

  const product = new PurchaseEntity({
    product: '65cec1ef73d47156e24f0ccc',
    quantity: 1,
    price: 10000,
    purchaseDate: '01-01-2020'
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createPurchase', args: [product], },
    { method: 'getPurchase', args: [product] },
    { method: 'getAllPurchases', args: [] },
    { method: 'getPurchasesByDay', args: ['01', '01', '2020'] },
    { method: 'getPurchasesByMonth', args: ['01', '2020'] },
    { method: 'getPurchasesByPeriod', args: ['01-01-2020', '01-12-2020'] },
    { method: 'updatePurchase', args: ['65abc1ef73d47156e24f0ccc'] },
    { method: 'deletePurchase', args: ['65abc1ef73d47156e24f0ccc'] },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (purchaseRepositoryImpl as any)[method](...args);
      expect(mockPurchaseDatasource[method]).toHaveBeenCalled();
    });
  });
});
