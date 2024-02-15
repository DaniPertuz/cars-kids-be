import { PurchaseEntity } from '../entities/purchase.entity';

export abstract class PurchaseDatasource {
  abstract createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity>;
  abstract getAllPurchases(): Promise<PurchaseEntity[]>;
  abstract getPurchasesByDay(day: string, month: string, year: string): Promise<PurchaseEntity[]>;
  abstract getPurchasesByMonth(month: string, year: string): Promise<PurchaseEntity[]>;
  abstract getPurchasesByPeriod(starting: string, ending: string): Promise<PurchaseEntity[]>;
  abstract getPurchase(id: string): Promise<PurchaseEntity | null>;
  abstract updatePurchase(id: string, purchase: PurchaseEntity): Promise<PurchaseEntity | null>;
  abstract deletePurchase(id: string): Promise<PurchaseEntity | null>;
}
