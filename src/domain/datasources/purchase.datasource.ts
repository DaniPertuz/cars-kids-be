import { PaginationDto } from '../dtos/shared/pagination.dto';
import { PurchaseEntity } from '../entities/purchase.entity';
import { PurchaseQueryResult } from '../../interfaces';

export abstract class PurchaseDatasource {
  abstract createPurchase(purchase: PurchaseEntity): Promise<PurchaseEntity | null>;
  abstract getAllPurchases(paginationDto: PaginationDto): Promise<PurchaseQueryResult>;
  abstract getPurchasesByDay(day: string, month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult>;
  abstract getPurchasesByMonth(month: string, year: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult>;
  abstract getPurchasesByPeriod(starting: string, ending: string, paginationDto: PaginationDto): Promise<PurchaseQueryResult>;
  abstract getPurchase(id: string): Promise<PurchaseEntity | null>;
  abstract updatePurchase(id: string, purchase: PurchaseEntity): Promise<PurchaseEntity | null>;
  abstract deletePurchase(id: string): Promise<PurchaseEntity | null>;
}
