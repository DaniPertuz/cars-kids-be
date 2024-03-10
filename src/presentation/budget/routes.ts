import { Router } from 'express';
import { BudgetController } from './controllers';

export class BudgetRoutes {
  static get routes(): Router {
    const router = Router();

    const { getBudgets, getBudget, createBudget, getBudgetsByDay, getBudgetsByMonth, getBudgetsByPeriod, updateBudget, deleteBudget } = new BudgetController();

    router.get('/', getBudgets);
    router.get('/:id', getBudget);
    router.get('/dates/day/:day/:month/:year', getBudgetsByDay);
    router.get('/dates/month/:month/:year', getBudgetsByMonth);
    router.get('/dates/period/:starting/:ending', getBudgetsByPeriod);
    router.post('/', createBudget);
    router.put('/:id', updateBudget);
    router.delete('/:id', deleteBudget);

    return router;
  }
}
