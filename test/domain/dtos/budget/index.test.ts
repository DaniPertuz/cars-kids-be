import { BudgetDTO } from '../../../../src/domain/dtos/budget/index';
import { IBudget } from '../../../../src/interfaces';

describe('BudgetDTO', () => {
  const validObject: IBudget = {
    base: 100000,
    expenses: 0,
    loans: 0,
    payroll: 20000,
    date: new Date().toISOString()
  };

  describe('create', () => {
    test('should return error when base field is missing', () => {
      const invalidObject = {
        date: new Date().toISOString()
      };
      const [error, budgetDTO] = BudgetDTO.create(invalidObject);

      expect(error).toBe('Base es requerida');
      expect(budgetDTO).toBeUndefined();
    });

    test('should return error when date field is missing', () => {
      const invalidObject = {
        base: 100000
      };
      const [error, budgetDTO] = BudgetDTO.create(invalidObject);

      expect(error).toBe('Fecha de presupuesto es requerida');
      expect(budgetDTO).toBeUndefined();
    });

    test('should return BudgetDTO instance when object is valid', () => {
      const [error, budgetDTO] = BudgetDTO.create(validObject);

      expect(error).toBeUndefined();
      expect(budgetDTO).toBeInstanceOf(BudgetDTO);
    });
  });
});
