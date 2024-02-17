import { connect, disconnect } from '../../../../src/database';
import { PurchaseModel } from '../../../../src/database/models';
import { PurchaseEntity } from '../../../../src/domain/entities/purchase.entity';
import { MongoPurchaseDatasource } from '../../../../src/infrastructure/datasources/mongo-purchase.datasource';

describe('Mongo Purchase datasource', () => {

  const purchaseDatasource = new MongoPurchaseDatasource();

  const purchase = new PurchaseEntity({
    product: '65cec1ef73d47156e24f0c32',
    quantity: 1,
    price: 10000,
    purchaseDate: '01-01-2020'
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await PurchaseModel.deleteMany();
    await disconnect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a purchase', async () => {
    const purchaseDB = await purchaseDatasource.createPurchase(purchase);

    expect(purchaseDB).toBeInstanceOf(PurchaseEntity);

    await PurchaseModel.findOneAndDelete({ product: purchaseDB.params.product });
  });

  test('should throw CustomError.serverError when PurchaseModel.create throws an error', async () => {
    jest.spyOn(PurchaseModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(purchaseDatasource.createPurchase(purchase)).rejects.toThrow('Error al crear compra: Error: Test error');
  });

  test('should get all purchases', async () => {
    const purchaseDB = await purchaseDatasource.createPurchase(purchase);

    const purchases = await purchaseDatasource.getAllPurchases();

    expect(purchases.length).toBeGreaterThanOrEqual(1);
    expect(purchases[0].params.price).toBe(purchase.params.price);

    await PurchaseModel.findOneAndDelete({ product: purchaseDB.params.product });
  });

  test('should getAllPurchases throw an error', async () => {
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(purchaseDatasource.getAllPurchases()).rejects.toThrow('Error al obtener compras: Error: Test error');
  });

  test('should return the purchase corresponding to the provided ID', async () => {
    const purchaseId = '1';
    const mockPurchase = { id: purchaseId };
    jest.spyOn(PurchaseModel, 'findById').mockResolvedValueOnce(mockPurchase);

    const result = await purchaseDatasource.getPurchase(purchaseId);

    expect(result).toBeDefined();
    // expect(result?.id).toBe(purchaseId); // Verificar que el ID del alquiler es el esperado
  });

  test('should throw an error when getting a purchase', async () => {
    jest.spyOn(PurchaseModel, 'findById').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = purchaseDatasource.getPurchase('1');

    await expect(result).rejects.toThrow('Error al obtener compra: Error: Test error');
  });

  test('should return null when purchase is not found', async () => {
    jest.spyOn(PurchaseModel, 'findById').mockResolvedValueOnce(null);

    const result = await purchaseDatasource.getPurchase('wrong_id');

    expect(result).toBeNull();
  });

  test('should get purchases by day', async () => {
    const purchaseDB = await purchaseDatasource.createPurchase(purchase);

    const purchases = await purchaseDatasource.getPurchasesByDay('01', '01', '2020');

    expect(purchases.length).toBeGreaterThanOrEqual(1);

    await PurchaseModel.findOneAndDelete({ product: purchaseDB.params.product });
  });

  test('should getPurchasesByDay throw an error', async () => {
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const day = '1';
    const month = '1';
    const year = '2020';

    await expect(purchaseDatasource.getPurchasesByDay(day, month, year)).rejects.toThrow('Error al obtener compras por día: Error: Test error');
  });

  test('should get purchases by month', async () => {
    const purchaseDB = await purchaseDatasource.createPurchase(purchase);

    const purchases = await purchaseDatasource.getPurchasesByMonth('01', '2020');

    expect(purchases.length).toBeGreaterThanOrEqual(1);

    await PurchaseModel.findOneAndDelete({ product: purchaseDB.params.product });
  });

  test('should getPurchasesByMonth throw an error', async () => {
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const month = '1';
    const year = '2020';

    await expect(purchaseDatasource.getPurchasesByMonth(month, year)).rejects.toThrow('Error al obtener las compras por mes: Error: Test error');
  });

  test('should get purchases within the specified period', async () => {
    const purchaseDB = await purchaseDatasource.createPurchase(purchase);

    const starting = '10-11-2019';
    const ending = '01-02-2020';

    const result = await purchaseDatasource.getPurchasesByPeriod(starting, ending);

    expect(result).toHaveLength(1);

    await PurchaseModel.findOneAndDelete({ product: purchaseDB.params.product });
  });

  test('should throw an error when querying within the specified period', async () => {
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const starting = '10-11-2022';
    const ending = '01-02-2023';

    await expect(purchaseDatasource.getPurchasesByPeriod(starting, ending)).rejects.toThrow('Error al obtener las compras por periodo: Error: Test error');
  });

  test('should return null when no purchase is found for the provided ID', async () => {
    jest.spyOn(PurchaseModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await purchaseDatasource.updatePurchase('999', purchase);

    expect(result).toBeNull();
  });

  test('should throw an error when updating purchase', async () => {
    jest.spyOn(PurchaseModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = purchaseDatasource.updatePurchase('1', purchase);

    await expect(result).rejects.toThrow('Error al actualizar compra: Error: Test error');
  });

  test('should return null when purchase to be updated is not found', async () => {
    jest.spyOn(PurchaseModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await purchaseDatasource.updatePurchase('wrong_id', purchase);

    expect(result).toBeNull();
  });

  test('should delete a purchase', async () => {
    const purchaseId = '1';
    jest.spyOn(PurchaseModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

    await purchaseDatasource.deletePurchase(purchaseId);

    expect(PurchaseModel.findByIdAndDelete).toHaveBeenCalledWith(purchaseId);
  });

  test('should throw an error when deleting a purchase', async () => {
    jest.spyOn(PurchaseModel, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = purchaseDatasource.deletePurchase('1');

    await expect(result).rejects.toThrow('Error al eliminar compra: Error: Test error');
  });

});
