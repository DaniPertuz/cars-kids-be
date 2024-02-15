import { PurchaseDatasource } from '../../domain/datasources/purchase.datasource';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseRepository } from '../../domain/repository/purchase.repository';

export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(private readonly purchaseDatasource: PurchaseDatasource) { }

  createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity> {
    return this.purchaseDatasource.createPurchase(purchase);
  }

  getAllPurchases(): Promise<PurchaseEntity[]> {
    return this.purchaseDatasource.getAllPurchases();
  }

  getPurchasesByDay(day: string, month: string, year: string): Promise<PurchaseEntity[]> {
    return this.purchaseDatasource.getPurchasesByDay(day, month, year);
  }

  getPurchasesByMonth(month: string, year: string): Promise<PurchaseEntity[]> {
    return this.purchaseDatasource.getPurchasesByMonth(month, year);
  }

  getPurchasesByPeriod(starting: string, ending: string): Promise<PurchaseEntity[]> {
    return this.purchaseDatasource.getPurchasesByPeriod(starting, ending);
  }

  getPurchase(id: string): Promise<PurchaseEntity | null> {
    return this.purchaseDatasource.getPurchase(id);
  }

  updatePurchase(id: string, purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
    return this.purchaseDatasource.updatePurchase(id, purchase);
  }

  deletePurchase(id: string): Promise<PurchaseEntity | null> {
    return this.purchaseDatasource.deletePurchase(id);
  }
}
