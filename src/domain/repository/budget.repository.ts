import { BudgetQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { BudgetEntity } from '../entities/budget.entity';

export abstract class BudgetRepository {
  abstract createBudget(budget: BudgetEntity): Promise<BudgetEntity>;
  abstract getAllBudgets(paginationDto: PaginationDto): Promise<BudgetQueryResult>;
  abstract getBudgetsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult>;
  abstract getBudgetsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult>;
  abstract getBudgetsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<BudgetQueryResult>;
  abstract getBudget(_id: string): Promise<BudgetEntity | null>;
  abstract updateBudget(_id: string, budget: BudgetEntity): Promise<BudgetEntity | null>;
  abstract deleteBudget(_id: string): Promise<void>;
}
