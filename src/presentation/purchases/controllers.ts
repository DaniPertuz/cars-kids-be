import { Request, Response } from 'express';
import { MongoPurchaseDatasource } from '../../infrastructure/datasources/mongo-purchase.datasource';
import { PurchaseRepositoryImpl } from '../../infrastructure/repositories/purchase-impl.repository';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseDTO } from '../../domain/dtos/purchase';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class PurchasesController {
  readonly purchaseRepo = new PurchaseRepositoryImpl(
    new MongoPurchaseDatasource()
  );

  public getPurchases = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const purchases = await this.purchaseRepo.getAllPurchases(paginationDto!);

    const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;

    return res.json({
      page: purchasePage,
      limit: limitPage,
      total,
      sum,
      next,
      prev,
      purchases: data.map(rental => rental.params)
    });
  };

  public getPurchase = async (req: Request, res: Response) => {
    const { id } = req.params;

    const purchase = await this.purchaseRepo.getPurchase(id);

    return (purchase) ? res.json(purchase.params) : res.status(404).json({ error: `Compra con ID ${id} no encontrada` });
  };

  public getPurchasesByDay = async (req: Request, res: Response) => {
    const { day, month, year } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const purchases = await this.purchaseRepo.getPurchasesByDay(day, month, year, paginationDto!);

    const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;

    return res.json({
      page: purchasePage,
      limit: limitPage,
      total,
      sum,
      next,
      prev,
      purchases: data.map(purchase => purchase.params)
    });
  };

  public getPurchasesByMonth = async (req: Request, res: Response) => {
    const { month, year } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const purchases = await this.purchaseRepo.getPurchasesByMonth(month, year, paginationDto!);

    const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;

    return res.json({
      page: purchasePage,
      limit: limitPage,
      total,
      sum,
      next,
      prev,
      purchases: data.map(purchase => purchase.params)
    });
  };

  public getPurchasesByPeriod = async (req: Request, res: Response) => {
    const { starting, ending } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    const purchases = await this.purchaseRepo.getPurchasesByPeriod(starting, ending, paginationDto!);

    const { page: purchasePage, limit: limitPage, total, sum, next, prev, purchases: data } = purchases;

    return res.json({
      page: purchasePage,
      limit: limitPage,
      total,
      sum,
      next,
      prev,
      purchases: data.map(purchase => purchase.params)
    });
  };

  public createPurchase = async (req: Request, res: Response) => {
    const [error, purchaseDto] = PurchaseDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const purchaseData: PurchaseEntity = PurchaseEntity.fromObject(purchaseDto!.params);

    const purchase = await this.purchaseRepo.createPurchase(purchaseData);

    return (!purchase) ? res.status(404).json({ error: 'Producto no disponible' }) : res.json(purchase.params);
  };

  public updatePurchase = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, purchaseDto] = PurchaseDTO.update({ ...req.body, _id: id });

    if (error) return res.status(400).json({ error });

    const purchaseDB = await this.purchaseRepo.getPurchase(id);

    if (!purchaseDB) return res.status(404).json({ error: 'Compra no encontrada' });

    const updatedPurchaseEntity = PurchaseEntity.fromObject(purchaseDto?.params!);

    const updatedPurchase = await this.purchaseRepo.updatePurchase(id, updatedPurchaseEntity);

    return res.json(updatedPurchase?.params);
  };

  public deletePurchase = async (req: Request, res: Response) => {
    const { id } = req.params;

    const purchase = await this.purchaseRepo.deletePurchase(id);

    if (!purchase) return res.status(404).json({ error: 'Compra no encontrada' });

    return res.json(purchase?.params);
  };
}
