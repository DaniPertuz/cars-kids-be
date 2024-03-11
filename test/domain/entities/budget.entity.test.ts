import { BudgetEntity } from '../../../src/domain/entities';

describe('Budget entity', () => {
  const data = {
    base: 100000,
    expenses: 0,
    loans: 0,
    date: new Date().toISOString()
  };

  test('should create a BudgetEntity instance', () => {
    const budget = new BudgetEntity(data);

    expect(budget).toBeInstanceOf(BudgetEntity);
    expect(budget.params.base).toBe(data.base);
    expect(budget.params.expenses).toBe(data.expenses);
    expect(budget.params.loans).toBe(data.loans);
    expect(budget.params.date).toBe(data.date);
  });
});
