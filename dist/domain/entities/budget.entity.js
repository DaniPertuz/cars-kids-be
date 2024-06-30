"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetEntity = void 0;
class BudgetEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.BudgetEntity = BudgetEntity;
BudgetEntity.fromObject = (object) => {
    const { _id, base, expenses, loans, date, payroll } = object;
    return new BudgetEntity({ _id, base, expenses, loans, date, payroll });
};
