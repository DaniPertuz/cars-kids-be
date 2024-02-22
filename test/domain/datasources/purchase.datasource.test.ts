import { PurchaseDatasource } from '../../../src/domain/datasources/purchase.datasource';
import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';
import { PurchaseEntity } from '../../../src/domain/entities/purchase.entity';
import { PurchaseQueryResult } from '../../../src/interfaces';

describe('Purchase datasource', () => {
  class MockDatasource implements PurchaseDatasource {
    createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
      throw new Error('Method not implemented.');
    }
    getAllPurchases(paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
      throw new Error('Method not implemented.');
    }
    getPurchasesByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
      throw new Error('Method not implemented.');
    }
    getPurchasesByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
      throw new Error('Method not implemented.');
    }
    getPurchasesByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
      throw new Error('Method not implemented.');
    }
    getPurchase(id: string): Promise<PurchaseEntity | null> {
      throw new Error('Method not implemented.');
    }
    updatePurchase(id: string, purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
      throw new Error('Method not implemented.');
    }
    deletePurchase(id: string): Promise<PurchaseEntity | null> {
      throw new Error('Method not implemented.');
    }
}

  test('should test the abstract Purchase class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createPurchase).toBe('function');
    expect(typeof mockDatasource.getAllPurchases).toBe('function');
    expect(typeof mockDatasource.getPurchase).toBe('function');
    expect(typeof mockDatasource.getPurchasesByDay).toBe('function');
    expect(typeof mockDatasource.getPurchasesByMonth).toBe('function');
    expect(typeof mockDatasource.getPurchasesByPeriod).toBe('function');
    expect(typeof mockDatasource.updatePurchase).toBe('function');
    expect(typeof mockDatasource.deletePurchase).toBe('function');
  });
});
