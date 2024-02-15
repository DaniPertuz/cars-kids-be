import { Request, Response } from 'express';
import { MongoPurchaseDatasource } from '../../infrastructure/datasources/mongo-purchase.datasource';
import { PurchaseRepositoryImpl } from '../../infrastructure/repositories/purchase-impl.repository';
import { PurchaseEntity } from '../../domain/entities/purchase.entity';
import { PurchaseDTO } from '../../domain/dtos/purchase';

export class PurchasesController {
  readonly purchaseRepo = new PurchaseRepositoryImpl(
    new MongoPurchaseDatasource()
  );

  public getPurchases = async (req: Request, res: Response) => {
    const purchases = (await this.purchaseRepo.getAllPurchases()).map(rental => rental.params);

    return res.json(purchases);
  };

  public getPurchase = async (req: Request, res: Response) => {
    const { id } = req.params;

    const purchase = await this.purchaseRepo.getPurchase(id);

    return (purchase) ? res.json(purchase.params) : res.status(404).json({ error: `Compra con ID ${id} no encontrada` });
  };

  public getPurchasesByDay = async (req: Request, res: Response) => {
    const { day, month, year } = req.params;

    const purchases = (await this.purchaseRepo.getPurchasesByDay(day, month, year)).map(purchase => purchase.params);

    return res.json(purchases);
  };

  public getPurchasesByMonth = async (req: Request, res: Response) => {
    const { month, year } = req.params;

    const purchases = (await this.purchaseRepo.getPurchasesByMonth(month, year)).map(purchase => purchase.params);

    return res.json(purchases);
  };

  public getPurchasesByPeriod = async (req: Request, res: Response) => {
    const { starting, ending } = req.params;

    const purchases = (await this.purchaseRepo.getPurchasesByPeriod(starting, ending)).map(purchase => purchase.params);

    return res.json(purchases);
  };

  public createPurchase = async (req: Request, res: Response) => {
    const [error, purchaseDto] = PurchaseDTO.create(req.body);

    if (error) return res.status(400).json({ error });

    const purchaseData: PurchaseEntity = PurchaseEntity.fromObject(purchaseDto!.params);

    const purchase = (await this.purchaseRepo.createPurchase(purchaseData)).params;

    return res.json(purchase);
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
