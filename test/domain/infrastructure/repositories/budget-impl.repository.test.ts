import { BudgetDatasource } from '../../../../src/domain/datasources/budget.datasource';
import { BudgetEntity } from '../../../../src/domain/entities';
import { BudgetRepositoryImpl } from '../../../../src/infrastructure/repositories/budget-impl.repository';

type MockBudgetDatasource = BudgetDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Budget repository implementation', () => {
  const mockBudgetDatasource: MockBudgetDatasource = {
    createBudget: jest.fn(),
    getBudget: jest.fn(),
    getAllBudgets: jest.fn(),
    getBudgetsByDay: jest.fn(),
    getBudgetsByMonth: jest.fn(),
    getBudgetsByPeriod: jest.fn(),
    updateBudget: jest.fn(),
    deleteBudget: jest.fn()
  };

  const budgetRepositoryImpl = new BudgetRepositoryImpl(mockBudgetDatasource);

  const budget = new BudgetEntity({
    base: 100000,
    expenses: 0,
    loans: 0,
    date: '01-01-2020'
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createBudget', args: [budget], },
    { method: 'getBudget', args: [budget] },
    { method: 'getAllBudgets', args: [] },
    { method: 'getBudgetsByDay', args: ['01', '01', '2020'] },
    { method: 'getBudgetsByMonth', args: ['01', '2020'] },
    { method: 'getBudgetsByPeriod', args: ['01-01-2020', '01-12-2020'] },
    { method: 'updateBudget', args: ['d3ba2daad17250e579833f0e'] },
    { method: 'deleteBudget', args: ['d3ba2daad17250e579833f0e'] },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (budgetRepositoryImpl as any)[method](...args);
      expect(mockBudgetDatasource[method]).toHaveBeenCalled();
    });
  });
});
