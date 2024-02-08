import { Router } from 'express';
import { RentalsController } from './controllers';

export class RentalsRoutes {
  static get routes(): Router {
    const router = Router();

    const { getRentals, getRental, getRentalsByDay, getRentalsByMonth, getRentalsByPeriod, createRental, updateRental, deactivateRental } = new RentalsController();

    router.get('/', getRentals);
    router.get('/:id', getRental);
    router.get('/dates/day/:day/:month/:year', getRentalsByDay);
    router.get('/dates/month/:month/:year', getRentalsByMonth);
    router.get('/dates/period/:starting/:ending', getRentalsByPeriod);
    router.post('/', createRental);
    router.put('/:id', updateRental);
    router.delete('/:id', deactivateRental);

    return router;
  }
}
