import { ProductModel, PurchaseModel } from '../../database/models';
import { PurchaseDatasource } from '../../domain/datasources/purchase.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { CustomError } from '../../domain/errors';
import { IStatus, PurchaseQueryResult } from '../../interfaces';

export class MongoPurchaseDatasource implements PurchaseDatasource {
  async createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
    try {
      const { product } = purchase.params;

      const productDB = await ProductModel.findById(product);

      return productDB?.status === IStatus.Inactive ? null : PurchaseEntity.fromObject((await PurchaseModel.create(purchase.params)));
    } catch (error) {
      throw CustomError.serverError(`Error al crear compra: ${error}`);
    }
  }

  public async getPurchasesByQuery(query: any, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    const { page, limit } = paginationDto;

    const [total, sum, purchases] = await Promise.all([
      PurchaseModel.countDocuments(query),
      PurchaseModel.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: null,
            sum: { $sum: '$price' }
          }
        },
        {
          $project: {
            _id: 0,
            sum: 1
          }
        }
      ]),
      PurchaseModel.find(query)
        .populate('product', '-_id name cost price')
        .populate('user', '-_id name')
        .populate('desk', '-_id name')
        .sort({ purchaseDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return {
      page,
      limit,
      total,
      sum: sum.length > 0 ? sum[0].sum : 0,
      next: ((page * limit) < total) ? `/purchases?page=${(page + 1)}&limit=${limit}` : null,
      prev: (page - 1 > 0) ? `/purchases?page=${(page - 1)}&limit=${limit}` : null,
      purchases: purchases.map(PurchaseEntity.fromObject)
    };
  }

  async getAllPurchases(paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    try {
      return await this.getPurchasesByQuery({}, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener compras: ${error}`);
    }
  }

  async getPurchasesByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    try {
      const dayNumber = parseInt(day, 10);
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      const selectedDate = new Date(yearNumber, monthNumber - 1, dayNumber);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const query = {
        purchaseDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      };

      return await this.getPurchasesByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener compras por día: ${error}`);
    }
  }

  async getPurchasesByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(Number(year), monthNumber, 0);

      const query = {
        purchaseDate: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      };

      return await this.getPurchasesByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener las compras por mes: ${error}`);
    }
  }

  async getPurchasesByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    try {
      const startingDateParts = starting.split('-').map(Number);
      const endingDateParts = ending.split('-').map(Number);
      const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
      const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);

      const endOfEndDate = new Date(endDate);
      endOfEndDate.setHours(23, 59, 59, 999);

      const query = {
        purchaseDate: {
          $gte: startDate,
          $lt: endOfEndDate
        }
      };

      return await this.getPurchasesByQuery(query, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener las compras por periodo: ${error}`);
    }
  }

  async getPurchase(id: string): Promise<PurchaseEntity | null> {
    try {
      const purchaseData = await PurchaseModel.findById(id);
      return purchaseData ? PurchaseEntity.fromObject(purchaseData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener compra: ${error}`);
    }
  }

  async updatePurchase(id: string, purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
    try {
      const purchaseData = await PurchaseModel.findByIdAndUpdate(id, purchase.params, { new: true });
      return purchaseData ? PurchaseEntity.fromObject(purchaseData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar compra: ${error}`);
    }
  }

  async deletePurchase(id: string): Promise<PurchaseEntity | null> {
    try {
      const purchase = await PurchaseModel.findByIdAndDelete(id, { new: true });
      return purchase ? PurchaseEntity.fromObject(purchase) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar compra: ${error}`);
    }
  }
}
