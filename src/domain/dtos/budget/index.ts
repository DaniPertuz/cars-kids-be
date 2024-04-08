import { IBudget } from '../../../interfaces';

export class BudgetDTO {
  private constructor(public params: IBudget) { }

  static create(object: { [key: string]: any; }): [string?, BudgetDTO?] {
    const { base, expenses = 0, loans = 0, payroll = 0, date } = object;

    if (!base) return ['Base es requerida'];
    if (!date) return ['Fecha de presupuesto es requerida'];

    return [undefined, new BudgetDTO({ base, expenses, loans, payroll, date })];
  }
}
