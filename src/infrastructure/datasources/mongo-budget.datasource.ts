import { BudgetModel } from '../../database/models';
import { BudgetDatasource } from '../../domain/datasources/budget.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { BudgetEntity } from '../../domain/entities/budget.entity';
import { CustomError } from '../../domain/errors';
import { BudgetQueryResult } from '../../interfaces';

export class MongoBudgetDatasource implements BudgetDatasource {
  public async getBudgetsByQuery(query: any, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    const { page, limit } = paginationDto;

    const [total, budgets] = await Promise.all([
      BudgetModel.countDocuments(query),
      BudgetModel.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return {
      page,
      limit,
      total,
      next: ((page * limit) < total) ? `/budgets?page=${(page + 1)}&limit=${limit}` : null,
      prev: (page - 1 > 0) ? `/budgets?page=${(page - 1)}&limit=${limit}` : null,
      budgets: budgets.map(BudgetEntity.fromObject)
    };
  }

  async createBudget(budget: BudgetEntity): Promise<BudgetEntity> {
    try {
      const data = await BudgetModel.create(budget.params);
      return BudgetEntity.fromObject(data);
    } catch (error) {
      throw CustomError.serverError(`Error al crear presupuesto: ${error}`);
    }
  }

  async getAllBudgets(paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    try {
      return await this.getBudgetsByQuery({}, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener presupuestos: ${error}`);
    }
  }

  async getBudgetsByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    try {
      const dayNumber = parseInt(day, 10);
      const monthNumber = parseInt(month, 10) - 1;
      const yearNumber = parseInt(year, 10);

      const selectedDate = new Date(yearNumber, monthNumber, dayNumber);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const query = {
        date: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      };

      return await this.getBudgetsByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los presupuestos por día: ${error}`);
    }
  }

  async getBudgetsByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(Number(year), monthNumber, 0);

      const query = {
        date: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      };

      return await this.getBudgetsByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los presupuestos por mes: ${error}`);
    }
  }

  async getBudgetsByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<BudgetQueryResult> {
    try {
      const startingDateParts = starting.split('-').map(Number);
      const endingDateParts = ending.split('-').map(Number);
      const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
      const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);

      const query = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };

      return await this.getBudgetsByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener los presupuestos por periodo: ${error}`);
    }
  }

  async getBudget(_id: string): Promise<BudgetEntity | null> {
    try {
      const budgetData = await BudgetModel.findById(_id);
      return budgetData ? BudgetEntity.fromObject(budgetData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener presupuesto: ${error}`);
    }
  }

  async updateBudget(_id: string, budget: BudgetEntity): Promise<BudgetEntity | null> {
    try {
      const rentalData = await BudgetModel.findByIdAndUpdate(_id, budget.params, { new: true });

      return rentalData ? BudgetEntity.fromObject(rentalData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar presupuesto: ${error}`);
    }
  }

  async deleteBudget(_id: string): Promise<void> {
    try {
      await BudgetModel.findByIdAndDelete(_id);
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar presupuesto: ${error}`);
    }
  }
}
