"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetDTO = void 0;
class BudgetDTO {
    constructor(params) {
        this.params = params;
    }
    static create(object) {
        const { base, expenses = 0, loans = 0, payroll = 0, date } = object;
        if (!base)
            return ['Base es requerida'];
        if (!date)
            return ['Fecha de presupuesto es requerida'];
        return [undefined, new BudgetDTO({ base, expenses, loans, payroll, date })];
    }
}
exports.BudgetDTO = BudgetDTO;
