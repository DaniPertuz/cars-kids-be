import { BudgetDatasource } from '../../../src/domain/datasources/budget.datasource';
import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';
import { BudgetEntity } from '../../../src/domain/entities';
import { BudgetQueryResult } from '../../../src/interfaces';

describe('Budget datasource', () => {
  class MockDatasource implements BudgetDatasource {
    createBudget(budget: BudgetEntity): Promise<BudgetEntity> {
      throw new Error('Method not implemented.');
    }
    getAllBudgets(paginationDto: PaginationDto): Promise<BudgetQueryResult> {
      throw new Error('Method not implemented.');
    }
    getBudgetsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
      throw new Error('Method not implemented.');
    }
    getBudgetsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
      throw new Error('Method not implemented.');
    }
    getBudgetsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
      throw new Error('Method not implemented.');
    }
    getBudget(_id: string): Promise<BudgetEntity | null> {
      throw new Error('Method not implemented.');
    }
    updateBudget(_id: string, budget: BudgetEntity): Promise<BudgetEntity | null> {
      throw new Error('Method not implemented.');
    }
    deleteBudget(_id: string): Promise<void> {
      throw new Error('Method not implemented.');
    }
  }

  test('should test the abstract Budget class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createBudget).toBe('function');
    expect(typeof mockDatasource.getBudget).toBe('function');
    expect(typeof mockDatasource.getAllBudgets).toBe('function');
    expect(typeof mockDatasource.getBudgetsByDay).toBe('function');
    expect(typeof mockDatasource.getBudgetsByMonth).toBe('function');
    expect(typeof mockDatasource.getBudgetsByPeriod).toBe('function');
    expect(typeof mockDatasource.updateBudget).toBe('function');
    expect(typeof mockDatasource.deleteBudget).toBe('function');
  });
});
