import { PurchaseModel } from '../../database/models';
import { PurchaseDatasource } from '../../domain/datasources/purchase.datasource';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { CustomError } from '../../domain/errors';

export class MongoPurchaseDatasource implements PurchaseDatasource {
  async createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity> {
    try {
      return PurchaseEntity.fromObject((await PurchaseModel.create(purchase.params)));
    } catch (error) {
      throw CustomError.serverError(`Error al crear compra: ${error}`);
    }
  }

  async getAllPurchases(): Promise<PurchaseEntity[]> {
    try {
      return (await PurchaseModel.find({}).populate('product', '-_id name')).map(PurchaseEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener compras: ${error}`);
    }
  }

  async getPurchasesByDay(day: string, month: string, year: string): Promise<PurchaseEntity[]> {
    try {
      const dayNumber = parseInt(day, 10);
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      const selectedDate = new Date(yearNumber, monthNumber - 1, dayNumber);

      const result = await PurchaseModel.find({
        purchaseDate: {
          $gte: selectedDate,
          $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      return result.map(PurchaseEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener compras por día: ${error}`);
    }
  }

  async getPurchasesByMonth(month: string, year: string): Promise<PurchaseEntity[]> {
    try {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      const firstDayOfMonth = new Date(Number(year), monthNumber - 1, 1);
      const lastDayOfMonth = new Date(Number(year), monthNumber, 0);

      const result = await PurchaseModel.find({
        purchaseDate: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth
        }
      });

      return result.map(PurchaseEntity.fromObject);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener las compras por mes: ${error}`);
    }
  }

  async getPurchasesByPeriod(starting: string, ending: string): Promise<PurchaseEntity[]> {
    try {
      const startingDateParts = starting.split('-').map(Number);
      const endingDateParts = ending.split('-').map(Number);
      const startDate = new Date(startingDateParts[2], startingDateParts[1] - 1, startingDateParts[0]);
      const endDate = new Date(endingDateParts[2], endingDateParts[1] - 1, endingDateParts[0]);

      const result = await PurchaseModel.find({
        purchaseDate: {
          $gte: startDate,
          $lt: endDate
        }
      });

      return result.map(PurchaseEntity.fromObject);
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
      const { quantity } = purchase.params;

      const totalPrice = (quantity * purchase.params.price);

      const data = {
        ...purchase.params,
        price: totalPrice
      };

      const purchaseData = await PurchaseModel.findByIdAndUpdate(id, data, { new: true });
      return purchaseData ? PurchaseEntity.fromObject(purchaseData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar compra: ${error}`);
    }
  }

  async deletePurchase(id: string): Promise<PurchaseEntity | null> {
    try {
      const purchase = await PurchaseModel.findByIdAndDelete(id);
      return purchase ? PurchaseEntity.fromObject(purchase) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar compra: ${error}`);
    }
  }
}
