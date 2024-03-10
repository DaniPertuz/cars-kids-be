import { IBudget } from '../../interfaces';

export class BudgetEntity {
  constructor(public params: IBudget) { }

  static fromObject = (object: IBudget): BudgetEntity => {
    const { base, expenses, loans, date } = object;
    return new BudgetEntity({ base, expenses, loans, date });
  };
}
