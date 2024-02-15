import { Router } from 'express';
import { PurchasesController } from './controllers';

export class PurchasesRoutes {
  static get routes(): Router {
    const router = Router();

    const { createPurchase, deletePurchase, getPurchase, getPurchases, getPurchasesByDay, getPurchasesByMonth, getPurchasesByPeriod, updatePurchase } = new PurchasesController();

    router.get('/', getPurchases);
    router.get('/dates/day/:day/:month/:year', getPurchasesByDay);
    router.get('/dates/month/:month/:year', getPurchasesByMonth);
    router.get('/dates/period/:starting/:ending', getPurchasesByPeriod);
    router.get('/:id', getPurchase);
    router.post('/', createPurchase);
    router.put('/:id', updatePurchase);
    router.delete('/:id', deletePurchase);

    return router;
  }
}
