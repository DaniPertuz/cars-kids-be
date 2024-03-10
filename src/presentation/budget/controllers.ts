import { Request, Response } from 'express';
import { MongoBudgetDatasource } from '../../infrastructure/datasources/mongo-budget.datasource';
import { BudgetRepositoryImpl } from '../../infrastructure/repositories/budget-impl.repository';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { IStatus } from '../../interfaces';
import { BudgetEntity } from '../../domain/entities/budget.entity';

export class BudgetController {
  readonly budgetRepo = new BudgetRepositoryImpl(
    new MongoBudgetDatasource()
  );

  public getBudgets = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const budgets = await this.budgetRepo.getAllBudgets(paginationDto!);

    const { page: budgetPage, limit: limitPage, total, next, prev, budgets: data } = budgets;

    return res.json({
      page: budgetPage,
      limit: limitPage,
      total,
      next,
      prev,
      budgets: data.map(budget => budget.params)
    });
  };

  public getBudget = async (req: Request, res: Response) => {
    const { id } = req.params;

    const budget = await this.budgetRepo.getBudget(id);

    return (budget) ? res.json(budget.params) : res.status(404).json({ error: `Budget with ID ${id} not found` });
  };

  public getBudgetsByDay = async (req: Request, res: Response) => {
    const { day, month, year } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const budgets = await this.budgetRepo.getBudgetsByDay(day, month, year, paginationDto!);

    const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;

    return res.json({
      page: rentalPage,
      limit: limitPage,
      total,
      next,
      prev,
      budgets: data.map(budget => budget.params)
    });
  };

  public getBudgetsByMonth = async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const budgets = await this.budgetRepo.getBudgetsByMonth(month, year, paginationDto!);

    const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;

    return res.json({
      page: rentalPage,
      limit: limitPage,
      total,
      next,
      prev,
      budgets: data.map(budget => budget.params)
    });
  };

  public getBudgetsByPeriod = async (req: Request, res: Response) => {
    const { starting, ending } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const budgets = await this.budgetRepo.getBudgetsByPeriod(starting, ending, paginationDto!);

    const { page: rentalPage, limit: limitPage, total, next, prev, budgets: data } = budgets;

    return res.json({
      page: rentalPage,
      limit: limitPage,
      total,
      next,
      prev,
      budgets: data.map(budget => budget.params)
    });
  };

  public createBudget = async (req: Request, res: Response) => {
    const budget = req.body as BudgetEntity;

    const rentalData: BudgetEntity = BudgetEntity.fromObject(budget!.params);

    const rental = (await this.budgetRepo.createBudget(rentalData)).params;

    return res.json(rental);
  };

  public updateBudget = async (req: Request, res: Response) => {
    const { id } = req.params;
    const budget = req.body as BudgetEntity;

    const budgetDB = await this.budgetRepo.getBudget(id);

    if (!budgetDB) {
      return res.status(404).json({ error: 'Presupuesto no encontrado' });
    }

    const updatedBudgetEntity = BudgetEntity.fromObject(budget?.params!);

    const updatedBudget = await this.budgetRepo.updateBudget(id, updatedBudgetEntity);

    return res.json(updatedBudget?.params);
  };

  public deleteBudget = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.budgetRepo.deleteBudget(id);

    return res.json({ status: IStatus.Inactive });
  };
}