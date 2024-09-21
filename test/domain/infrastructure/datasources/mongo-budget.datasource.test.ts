import { connect, disconnect } from '../../../../src/database';
import { BudgetModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
import { BudgetEntity } from '../../../../src/domain/entities';
import { MongoBudgetDatasource } from '../../../../src/infrastructure/datasources/mongo-budget.datasource';

describe('Mongo Budget datasource', () => {

  const budgetDatasource = new MongoBudgetDatasource();

  const budgetOne = new BudgetEntity({
    _id: '65de48a4dcddb031324c4965',
    base: 100000,
    expenses: 0,
    loans: 0,
    payroll: 20000,
    date: new Date(2020, 0, 15).toISOString()
  });

  const budgetTwo = new BudgetEntity({
    _id: '65de48a4dcddb031324c4966',
    base: 150000,
    expenses: 0,
    loans: 0,
    payroll: 20000,
    date: new Date(2020, 0, 16).toISOString()
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await BudgetModel.deleteMany();
    await disconnect();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await BudgetModel.deleteMany();
  });

  test('should create a budget', async () => {
    const budgetDB = await budgetDatasource.createBudget(budgetOne);

    expect(budgetDB).toBeInstanceOf(BudgetEntity);
  });

  test('should throw CustomError.serverError when BudgetModel.create throws an error', async () => {
    jest.spyOn(BudgetModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(budgetDatasource.createBudget(budgetOne)).rejects.toThrow('Error al crear presupuesto: Error: Test error');
  });

  test('should get all budgets', async () => {
    await budgetDatasource.createBudget(budgetOne);
    await budgetDatasource.createBudget(budgetTwo);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await budgetDatasource.getAllBudgets(paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.budgets.length).toBe(1);
    expect(pagination1.budgets[0].params.base).toBe(budgetTwo.params.base);
    expect(pagination1.prev).toBeNull();
    expect(pagination1.next).toBe(`/budgets?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await budgetDatasource.getAllBudgets(paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.budgets.length).toBe(1);
    expect(pagination2.budgets[0].params.base).toBe(budgetOne.params.base);
    expect(pagination2.prev).toBe(`/budgets?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
  });

  test('should getAllBudgets throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(BudgetModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(budgetDatasource.getAllBudgets(paginationDto!)).rejects.toThrow('Error al obtener presupuestos: Error: Test error');
  });

  test('should return the budget corresponding to the provided ID', async () => {
    const budgetId = '65d648a4dcddb031324c4965';
    const mockBudget = new BudgetEntity({
      _id: budgetId,
      base: 100000,
      expenses: 0,
      loans: 0,
      payroll: 20000,
      date: new Date(Date.UTC(2020, 1, 17)).toISOString()
    });

    await budgetDatasource.createBudget(mockBudget);

    const result = await budgetDatasource.getBudget(budgetId);

    expect(result).toBeDefined();
    expect(result?.params).toEqual(expect.objectContaining({
      base: 100000,
      expenses: 0,
      loans: 0,
      date: new Date(Date.UTC(2020, 1, 17))
    }));
  });

  test('should throw an error when getting a budget', async () => {
    jest.spyOn(BudgetModel, 'findById').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = budgetDatasource.getBudget('1');

    await expect(result).rejects.toThrow('Error al obtener presupuesto: Error: Test error');
  });

  test('should return null when budget is not found', async () => {
    jest.spyOn(BudgetModel, 'findById').mockResolvedValueOnce(null);

    const result = await budgetDatasource.getBudget('wrong_id');

    expect(result).toBeNull();
  });

  test('should get budgets by day', async () => {
    await budgetDatasource.createBudget(budgetOne);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const { budgets, prev, next } = await budgetDatasource.getBudgetsByDay('15', '01', '2020', paginationDto!);

    expect(error).toBeUndefined();
    expect(budgets.length).toBe(1);
    expect(budgets[0].params.base).toBe(budgetOne.params.base);
    expect(prev).toBeNull();
    expect(next).toBeNull();
  });

  test('should getBudgetsByDay throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(BudgetModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const day = '04';
    const month = '01';
    const year = '2020';

    await expect(budgetDatasource.getBudgetsByDay(day, month, year, paginationDto!)).rejects.toThrow('Error al obtener los presupuestos por día: Error: Test error');
  });

  test('should get budgets by month', async () => {
    await budgetDatasource.createBudget(budgetOne);
    await budgetDatasource.createBudget(budgetTwo);

    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await budgetDatasource.getBudgetsByMonth('01', '2020', paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.budgets.length).toBeGreaterThanOrEqual(1);
    expect(pagination1.next).toBe(`/budgets?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await budgetDatasource.getBudgetsByMonth('01', '2020', paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.budgets.length).toBeGreaterThanOrEqual(1);
    expect(pagination2.prev).toBe(`/budgets?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
  });

  test('should getBudgetsByMonth throw an error', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(BudgetModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const month = '1';
    const year = '2020';

    await expect(budgetDatasource.getBudgetsByMonth(month, year, paginationDto!)).rejects.toThrow('Error al obtener los presupuestos por mes: Error: Test error');
  });

  test('should get budgets within the specified period', async () => {
    await budgetDatasource.createBudget(budgetOne);
    await budgetDatasource.createBudget(budgetTwo);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const starting = '20-12-2019';
    const ending = '01-05-2020';

    const pagination1 = await budgetDatasource.getBudgetsByPeriod(starting, ending, paginationDto1!);

    expect(error1).toBeUndefined();
    expect(pagination1.budgets.length).toBeGreaterThanOrEqual(1);
    expect(pagination1.next).toBe(`/budgets?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await budgetDatasource.getBudgetsByPeriod(starting, ending, paginationDto2!);

    expect(error2).toBeUndefined();
    expect(pagination2.budgets.length).toBeGreaterThanOrEqual(1);
    expect(pagination2.prev).toBe(`/budgets?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
  });

  test('should throw an error when querying within the specified period', async () => {
    const [, paginationDto] = PaginationDto.create();
    jest.spyOn(BudgetModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const starting = '10-11-2022';
    const ending = '01-02-2023';

    await expect(budgetDatasource.getBudgetsByPeriod(starting, ending, paginationDto!)).rejects.toThrow('Error al obtener los presupuestos por periodo: Error: Test error');
  });

  test('should return updated budget when budgetData is valid', async () => {
    const validBudget: BudgetEntity = new BudgetEntity({
      base: 10000,
      expenses: 0,
      loans: 0,
      payroll: 20000,
      date: '01-01-2020'
    });
    const validId = 'validBudgetId';

    jest.spyOn(BudgetModel, 'findByIdAndUpdate').mockResolvedValueOnce(validBudget.params);

    const updatedBudget = await budgetDatasource.updateBudget(validId, validBudget);

    expect(updatedBudget).toBeInstanceOf(BudgetEntity);
  });

  test('should return null when no budget is found for the provided ID', async () => {
    jest.spyOn(BudgetModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await budgetDatasource.updateBudget('999', budgetOne);

    expect(result).toBeNull();
  });

  test('should throw an error when updating budget', async () => {
    jest.spyOn(BudgetModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = budgetDatasource.updateBudget('1', budgetOne);

    await expect(result).rejects.toThrow('Error al actualizar presupuesto: Error: Test error');
  });

  test('should return null when budget to be updated is not found', async () => {
    jest.spyOn(BudgetModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

    const result = await budgetDatasource.updateBudget('wrong_id', budgetOne);

    expect(result).toBeNull();
  });

  test('should delete a budget', async () => {
    const budgetId = '1';
    jest.spyOn(BudgetModel, 'findByIdAndDelete').mockResolvedValueOnce(null);

    await budgetDatasource.deleteBudget(budgetId);

    expect(BudgetModel.findByIdAndDelete).toHaveBeenCalledWith(budgetId);
  });

  test('should throw an error when deleting a budget', async () => {
    jest.spyOn(BudgetModel, 'findByIdAndDelete').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const result = budgetDatasource.deleteBudget('1');

    await expect(result).rejects.toThrow('Error al eliminar presupuesto: Error: Test error');
  });
});
