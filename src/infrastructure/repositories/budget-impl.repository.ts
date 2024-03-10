import { BudgetDatasource } from '../../domain/datasources/budget.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { BudgetEntity } from '../../domain/entities/budget.entity';
import { BudgetRepository } from '../../domain/repository/budget.repository';
import { BudgetQueryResult } from '../../interfaces';

export class BudgetRepositoryImpl implements BudgetRepository {
  constructor(private readonly budgetDatasource: BudgetDatasource) { }
  
  createBudget(budget: BudgetEntity): Promise<BudgetEntity> {
    return this.budgetDatasource.createBudget(budget);
  }

  getAllBudgets(paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    return this.budgetDatasource.getAllBudgets(paginationDto);
  }

  getBudgetsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    return this.budgetDatasource.getBudgetsByDay(day, month, year, paginationDto);
  }

  getBudgetsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    return this.budgetDatasource.getBudgetsByMonth(month, year, paginationDto);
  }

  getBudgetsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    return this.budgetDatasource.getBudgetsByPeriod(starting, ending, paginationDto);
  }

  getBudget(_id: string): Promise<BudgetEntity | null> {
    return this.budgetDatasource.getBudget(_id);
  }

  updateBudget(_id: string, budget: BudgetEntity): Promise<BudgetEntity | null> {
    return this.budgetDatasource.updateBudget(_id, budget);
  }

  deleteBudget(_id: string): Promise<void> {
    return this.budgetDatasource.deleteBudget(_id);
  }
}
