import { IBudget } from '../../interfaces';

export class BudgetEntity {
  constructor(public params: IBudget) { }

  static fromObject = (object: IBudget): BudgetEntity => {
    const { _id, base, expenses, loans, date } = object;
    return new BudgetEntity({ _id, base, expenses, loans, date });
  };
}
