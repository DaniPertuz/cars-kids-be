import { connect, disconnect } from '../../../../src/database';
import { ProductModel, PurchaseModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { ProductEntity } from '../../../../src/domain/entities/product.entity';
import { PurchaseEntity } from '../../../../src/domain/entities/purchase.entity';
import { MongoPurchaseDatasource } from '../../../../src/infrastructure/datasources/mongo-purchase.datasource';
import { IPayment, IStatus } from '../../../../src/interfaces';

describe('Mongo Purchase datasource', () => {

  const purchaseDatasource = new MongoPurchaseDatasource();

  const purchase = new PurchaseEntity({
    product: '65cec1ef73d47156e24f0c32',
    quantity: 1,
    price: 10000,
    payment: IPayment.Cash,
    purchaseDate: '01-01-2020',
    user: 'd4ba2daad17250e579833f0e',
    desk: 'd4ba2daad17250e579833f2e'
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

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should throw CustomError.serverError when PurchaseModel.create throws an error', async () => {
    jest.spyOn(PurchaseModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(purchaseDatasource.createPurchase(purchase)).rejects.toThrow('Error al crear compra: Error: Test error');
  });

  test('should get all purchases', async () => {
    await purchaseDatasource.createPurchase(purchase);
    await purchaseDatasource.createPurchase(purchase);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await purchaseDatasource.getAllPurchases(paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.purchases.length).toBe(1);
    expect(pagination1.purchases[0].params.price).toBe(purchase.params.price);
    expect(pagination1.prev).toBeNull();
    expect(pagination1.next).toBe(`/purchases?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await purchaseDatasource.getAllPurchases(paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.purchases.length).toBe(1);
    expect(pagination2.purchases[0].params.price).toBe(purchase.params.price);
    expect(pagination2.prev).toBe(`/purchases?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should return correct sum if there are valid results', async () => {
    const aggregateSpy = jest.spyOn(PurchaseModel, 'aggregate');
    aggregateSpy.mockResolvedValue([{ sum: 100 }]);

    const result = await purchaseDatasource.getPurchasesByQuery({}, { page: 1, limit: 10 });

    expect(result.sum).toBe(100);

    aggregateSpy.mockRestore();
  });

  test('should return 0 if there are no results in sum', async () => {
    const aggregateSpy = jest.spyOn(PurchaseModel, 'aggregate');
    aggregateSpy.mockResolvedValue([]);

    const result = await purchaseDatasource.getPurchasesByQuery({}, { page: 1, limit: 10 });

    expect(result.sum).toBe(0);

    aggregateSpy.mockRestore();
  });

  test('should return null if the product is inactive', async () => {
    const testProduct = new ProductEntity({
      _id: '25cda7f409d585a843271d25',
      name: 'Inactive Product',
      cost: 8000,
      price: 10000,
      status: IStatus.Inactive
    });

    await ProductModel.create(testProduct.params);

    const testPurchase = new PurchaseEntity({
      product: '25cda7f409d585a843271d25',
      quantity: 1,
      price: 10000,
      payment: IPayment.Cash,
      purchaseDate: '01-01-2020',
      user: 'd4ba2daad17250e579833f0e',
      desk: 'd4ba2daad17250e579833f2e',
    });

    const purchaseDB = await purchaseDatasource.createPurchase(testPurchase);

    expect(purchaseDB).toBeNull();

    await ProductModel.findByIdAndDelete(testProduct.params._id);
  });

  test('should getAllPurchases throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(purchaseDatasource.getAllPurchases(paginationDto!)).rejects.toThrow('Error al obtener compras: Error: Test error');
  });

  test('should return the purchase corresponding to the provided ID', async () => {
    const purchaseId = '1';
    const mockPurchase = { _id: purchaseId };
    jest.spyOn(PurchaseModel, 'findById').mockResolvedValueOnce(mockPurchase);

    const result = await purchaseDatasource.getPurchase(purchaseId);

    expect(result).toBeDefined();
    expect(result?.params._id).toBe(purchaseId);
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
    await purchaseDatasource.createPurchase(purchase);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const { purchases, prev, next } = await purchaseDatasource.getPurchasesByDay('01', '01', '2020', paginationDto!);

    expect(error).toBeUndefined();
    expect(purchases.length).toBe(1);
    expect(purchases[0].params.price).toBe(purchase.params.price);
    expect(prev).toBeNull();
    expect(next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should get purchases by day (more than one)', async () => {
    await purchaseDatasource.createPurchase(purchase);
    await purchaseDatasource.createPurchase(purchase);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await purchaseDatasource.getPurchasesByDay('01', '01', '2020', paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination1.next).toBe(`/purchases?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await purchaseDatasource.getPurchasesByDay('01', '01', '2020', paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination2.prev).toBe(`/purchases?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should getPurchasesByDay throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const day = '1';
    const month = '1';
    const year = '2020';

    await expect(purchaseDatasource.getPurchasesByDay(day, month, year, paginationDto!)).rejects.toThrow('Error al obtener compras por día: Error: Test error');
  });

  test('should get purchases by month', async () => {
    await purchaseDatasource.createPurchase(purchase);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const { purchases, prev, next } = await purchaseDatasource.getPurchasesByMonth('01', '2020', paginationDto!);

    expect(error).toBeUndefined();
    expect(purchases.length).toBeGreaterThanOrEqual(1);
    expect(purchases[0].params.price).toBe(purchase.params.price);
    expect(prev).toBeNull();
    expect(next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should get purchases by month (more than one)', async () => {
    await purchaseDatasource.createPurchase(purchase);
    await purchaseDatasource.createPurchase(purchase);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await purchaseDatasource.getPurchasesByMonth('01', '2020', paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination1.next).toBe(`/purchases?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await purchaseDatasource.getPurchasesByMonth('01', '2020', paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination2.prev).toBe(`/purchases?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should getPurchasesByMonth throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const month = '1';
    const year = '2020';

    await expect(purchaseDatasource.getPurchasesByMonth(month, year, paginationDto!)).rejects.toThrow('Error al obtener las compras por mes: Error: Test error');
  });

  test('should get purchases within the specified period', async () => {
    await purchaseDatasource.createPurchase(purchase);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const starting = '10-11-2019';
    const ending = '01-02-2020';

    const { purchases, prev, next } = await purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto!);

    expect(error).toBeUndefined();
    expect(purchases.length).toBeGreaterThanOrEqual(1);
    expect(purchases[0].params.price).toBe(purchase.params.price);
    expect(prev).toBeNull();
    expect(next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should get purchases within the specified period (more than one)', async () => {
    await purchaseDatasource.createPurchase(purchase);
    await purchaseDatasource.createPurchase(purchase);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const starting = '10-11-2019';
    const ending = '01-02-2020';

    const pagination1 = await purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination1.next).toBe(`/purchases?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.purchases.length).toBeGreaterThanOrEqual(1);
    expect(pagination2.prev).toBe(`/purchases?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();

    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
    await PurchaseModel.findOneAndDelete({ product: purchase.params.product });
  });

  test('should throw an error when querying within the specified period', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(PurchaseModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const starting = '10-11-2022';
    const ending = '01-02-2023';

    await expect(purchaseDatasource.getPurchasesByPeriod(starting, ending, paginationDto!)).rejects.toThrow('Error al obtener las compras por periodo: Error: Test error');
  });

  test('should return updated purchase when purchaseData is valid', async () => {
    const validPurchase: PurchaseEntity = new PurchaseEntity({
      product: '25cda7f409d585a843271d25',
      quantity: 1,
      price: 10000,
      payment: IPayment.Cash,
      purchaseDate: '01-01-2020',
      user: 'd4ba2daad17250e579833f0e',
      desk: 'd4ba2daad17250e579833f2e'
    });
    const validId = 'validPurchaseId';

    jest.spyOn(PurchaseModel, 'findByIdAndUpdate').mockResolvedValueOnce(validPurchase.params);

    const updatedPurchase = await purchaseDatasource.updatePurchase(validId, validPurchase);

    expect(updatedPurchase).toBeInstanceOf(PurchaseEntity);
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

    expect(PurchaseModel.findByIdAndDelete).toHaveBeenCalledWith(purchaseId, { "new": true });
  });

  test('should return deleted purchase when purchase is valid', async () => {
    const validId = 'validPurchaseId';

    const validPurchase = {
      _id: validId,
      product: '25cda7f409d585a843271d25',
      quantity: 1,
      price: 10000,
      purchaseDate: '01-01-2020',
      user: 'd4ba2daad17250e579833f0e',
      desk: 'd4ba2daad17250e579833f2e'
    };
    jest.spyOn(PurchaseModel, 'findByIdAndDelete').mockResolvedValueOnce(validPurchase);

    const deletedPurchase = await purchaseDatasource.deletePurchase(validId);

    expect(deletedPurchase).toBeInstanceOf(PurchaseEntity);
  });

  test('should throw an error when deleting a purchase', async () => {
    jest.spyOn(PurchaseModel, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = purchaseDatasource.deletePurchase('1');

    await expect(result).rejects.toThrow('Error al eliminar compra: Error: Test error');
  });

});
