import request from 'supertest';
import { PurchaseModel } from '../../../src/database/models';
import { testServer } from '../../test-server';
import { IPayment } from '../../../src/interfaces';

describe('Purchases routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await PurchaseModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const testPurchase = {
    _id: '65d048a4dcddb031324c4965',
    product: '65cec1ef73d47156e24f0c32',
    quantity: 1,
    price: 10000,
    payment: IPayment.Cash,
    purchaseDate: '01-01-2020',
    user: 'd4ba2daad17250e579833f0e'
  };

  test('should create a purchase /api/purchases', async () => {
    const { body } = await request(testServer.app)
      .post('/api/purchases')
      .send(testPurchase);

    expect(body).toEqual(expect.objectContaining({
      product: testPurchase.product,
      quantity: testPurchase.quantity,
      price: testPurchase.price,
      purchaseDate: new Date(testPurchase.purchaseDate).toISOString()
    }));
  });

  test('should get purchases /api/purchases', async () => {
    await PurchaseModel.create(testPurchase);

    const { body } = await request(testServer.app)
      .get('/api/purchases')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.purchases.length).toBe(1);
    expect(body.purchases[0].price).toBe(testPurchase.price);
  });

  test('should get purchase /api/purchases/:id', async () => {
    await PurchaseModel.create(testPurchase);

    const { body } = await request(testServer.app)
      .get(`/api/purchases/${testPurchase._id}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.price).toBe(testPurchase.price);
  });

  test('should get purchases by day /api/purchases/dates/day/:day/:month/:year', async () => {
    await PurchaseModel.create(testPurchase);

    const dateSplit = testPurchase.purchaseDate.split('-');

    const { body } = await request(testServer.app)
      .get(`/api/purchases/dates/day/${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.purchases.length).toBe(1);
    expect(body.purchases[0].price).toBe(testPurchase.price);
  });

  test('should get purchases by month /api/purchases/dates/month/:month/:year', async () => {
    await PurchaseModel.create(testPurchase);

    const dateSplit = testPurchase.purchaseDate.split('-');

    const { body } = await request(testServer.app)
      .get(`/api/purchases/dates/month/${dateSplit[0]}/${dateSplit[2]}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.purchases.length).toBe(1);
    expect(body.purchases[0].price).toBe(testPurchase.price);
  });

  test('should get purchases by period /api/purchases/dates/period/:starting/:ending', async () => {
    await PurchaseModel.create(testPurchase);

    const { body } = await request(testServer.app)
      .get('/api/purchases/dates/period/01-12-2019/31-01-2020')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.purchases.length).toBe(1);
    expect(body.purchases[0].price).toBe(testPurchase.price);
  });

  test('should update purchase /api/purchases/:id', async () => {
    await PurchaseModel.create(testPurchase);

    const { body } = await request(testServer.app)
      .put(`/api/purchases/${testPurchase._id}`)
      .send({ quantity: 2, price: 20000 })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      quantity: 2,
      price: 20000,
      purchaseDate: new Date('01-01-2020').toISOString(),
      user: 'd4ba2daad17250e579833f0e'
    }));
  });

  test('should delete purchase /api/purchases/:id', async () => {
    await PurchaseModel.create(testPurchase);

    const { body } = await request(testServer.app)
      .delete(`/api/purchases/${testPurchase._id}`)
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      product: '65cec1ef73d47156e24f0c32',
      quantity: 1,
      price: 10000
    }));
  });
});
