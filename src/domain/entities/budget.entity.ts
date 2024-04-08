import { IBudget } from '../../interfaces';

export class BudgetEntity {
  constructor(public params: IBudget) { }

  static fromObject = (object: IBudget): BudgetEntity => {
    const { _id, base, expenses, loans, date, payroll } = object;
    return new BudgetEntity({ _id, base, expenses, loans, date, payroll });
  };
}
