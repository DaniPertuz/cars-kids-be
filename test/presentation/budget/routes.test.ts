import request from 'supertest';
import { testServer } from '../../test-server';
import { BudgetModel, ProductModel } from '../../../src/database/models';
import { IStatus } from '../../../src/interfaces';

describe('Budget routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await BudgetModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const budgetOne = {
    _id: '65de48a4dcddb031324c4965',
    base: 100000,
    expenses: 0,
    loans: 0,
    date: new Date('01-01-2020').toISOString()
  };

  const budgetTwo = {
    _id: '65d648a4dcddb031324c4965',
    base: 150000,
    expenses: 0,
    loans: 0,
    date: new Date('01-02-2020').toISOString()
  };

  test('should create a budget /api/budgets', async () => {
    const { body } = await request(testServer.app)
      .post('/api/budgets')
      .send(budgetOne);

    expect(body).toEqual(expect.objectContaining({
      base: budgetOne.base,
      expenses: budgetOne.expenses,
      loans: budgetOne.loans,
      date: new Date(budgetOne.date).toISOString()
    }));

    await BudgetModel.findOneAndDelete({ base: budgetOne.base });
  });

  test('should return an error if base field is not provided /api/budgets', async () => {
    const invalidBudget = {
      date: new Date().toISOString()
    };

    const { body } = await request(testServer.app)
      .post('/api/budgets')
      .send(invalidBudget);

    expect(body).toEqual({ error: 'Base es requerida' });
  });

  test('should return an error if date field is not provided /api/budgets', async () => {
    const invalidBudget = {
      base: 100000
    };

    const { body } = await request(testServer.app)
      .post('/api/budgets')
      .send(invalidBudget);

    expect(body).toEqual({ error: 'Fecha de presupuesto es requerida' });
  });

  test('should get all budgets /api/budgets', async () => {
    await BudgetModel.create(budgetOne);
    await BudgetModel.create(budgetTwo);

    const { body } = await request(testServer.app)
      .get('/api/budgets')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.budgets.length).toBe(2);
    expect(body.budgets[0].base).toBe(budgetTwo.base);
    expect(body.budgets[1].base).toBe(budgetOne.base);

    await BudgetModel.findOneAndDelete({ base: budgetOne.base });
    await BudgetModel.findOneAndDelete({ base: budgetTwo.base });
  });

  test('should get budget /api/budgets/:id', async () => {
    await BudgetModel.create(budgetOne);

    const { body } = await request(testServer.app)
      .get(`/api/budgets/${budgetOne._id}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      base: 100000,
      expenses: 0,
      loans: 0
    }));

    await BudgetModel.findOneAndDelete({ base: budgetOne.base });
  });

  test('should return a 404 response if budget was not found /api/budgets/:id', async () => {
    const { body } = await request(testServer.app)
      .get(`/api/budgets/${budgetOne._id}`)
      .expect(404);

    expect(body).toEqual(expect.objectContaining({ error: `Presupuesto con ID ${budgetOne._id} no encontrado` }));
  });

  test('should update budget /api/budgets/:id', async () => {
    await BudgetModel.create(budgetTwo);

    const response = await request(testServer.app)
      .put(`/api/budgets/${budgetTwo._id}`)
      .send({ base: 100000, loans: 10000, date: '01-01-2020'})
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      base: 100000,
      expenses: 0,
      loans: 10000
    }));

    await BudgetModel.findOneAndDelete({ base: budgetTwo.base });
  });

  test('should return a not found request if budget to update was not found /api/budgets/:id', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/budgets/${budgetOne._id}`)
      .send({ base: 100000, expenses: 10000, date: '01-01-2020' })
      .expect(404);

    expect(body).toEqual({ error: 'Presupuesto no encontrado' });
  });

  test('should delete budget /api/budgets/:id', async () => {
    await BudgetModel.create(budgetOne);

    const { body } = await request(testServer.app)
      .delete(`/api/budgets/${budgetOne._id}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({ status: IStatus.Inactive }));
  });

  test('should return a not found request if budget to delete was not found /api/budget/:id', async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/budgets/${budgetOne._id}`)
      .expect(404);

    expect(body).toEqual({ error: 'Presupuesto no encontrado' });
  });
});
