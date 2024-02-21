import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { PurchaseDatasource } from '../../domain/datasources/purchase.datasource';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseRepository } from '../../domain/repository/purchase.repository';
import { PurchaseQueryResult } from '../../interfaces';

export class PurchaseRepositoryImpl implements PurchaseRepository {
  constructor(private readonly purchaseDatasource: PurchaseDatasource) { }

  createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity | null> {
    return this.purchaseDatasource.createPurchase(purchase);
  }

  getAllPurchases(paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    return this.purchaseDatasource.getAllPurchases(paginationDto);
  }

  getPurchasesByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    return this.purchaseDatasource.getPurchasesByDay(day, month, year, paginationDto);
  }

  getPurchasesByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    return this.purchaseDatasource.getPurchasesByMonth(month, year, paginationDto);
  }

  getPurchasesByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult> {
    return this.purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto);
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
