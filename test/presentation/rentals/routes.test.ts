import request from 'supertest';
import { RentalModel } from '../../../src/database/models';
import { IPayment, IStatus } from '../../../src/interfaces';
import { testServer } from '../../test-server';

describe('Rentals routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await RentalModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const testRental = {
    _id: '15c42112217250e579833f0e',
    client: 'NN Test',
    time: 15,
    date: '01-24-2023',
    vehicle: '15c42daad17250e579833f0e',
    payment: IPayment.Cash,
    amount: 10000,
    user: 'd4ba2daad17250e579833f0e',
    exception: ''
  };

  test('should create a rental /api/rentals', async () => {
    const { body } = await request(testServer.app)
      .post('/api/rentals')
      .send(testRental);

    expect(body).toEqual(expect.objectContaining({
      client: testRental.client,
      time: testRental.time,
      date: new Date(testRental.date).toISOString(),
      vehicle: testRental.vehicle,
      payment: testRental.payment,
      amount: testRental.amount
    }));
  });

  test('should get rentals /api/rentals', async () => {
    await RentalModel.create(testRental);

    const { body } = await request(testServer.app)
      .get('/api/rentals')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.rentals.length).toBe(1);
    expect(body.rentals[0].client).toBe(testRental.client);
  });

  test('should get rentals by day /api/rentals/dates/day/:day/:month/:year', async () => {
    await RentalModel.create(testRental);

    const dateSplit = testRental.date.split('-');

    const { body } = await request(testServer.app)
      .get(`/api/rentals/dates/day/${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.rentals.length).toBe(1);
    expect(body.rentals[0].client).toBe(testRental.client);
  });

  test('should get rentals by month /api/rentals/dates/month/:month/:year', async () => {
    await RentalModel.create(testRental);

    const dateSplit = testRental.date.split('-');

    const { body } = await request(testServer.app)
      .get(`/api/rentals/dates/month/${dateSplit[0]}/${dateSplit[2]}`)
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.rentals.length).toBe(1);
    expect(body.rentals[0].client).toBe(testRental.client);
  });

  test('should get rentals by period /api/rentals/dates/period/:starting/:ending', async () => {
    await RentalModel.create(testRental);

    const { body } = await request(testServer.app)
      .get('/api/rentals/dates/period/01-12-2022/31-01-2023')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.rentals.length).toBe(1);
    expect(body.rentals[0].client).toBe(testRental.client);
  });

  test('should update rental /api/rentals/:id', async () => {
    await RentalModel.create(testRental);

    const { body } = await request(testServer.app)
      .put(`/api/rentals/${testRental._id}`)
      .send({ client: 'Testing Update' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      client: 'Testing Update',
      time: 15,
      date: '2023-01-24T05:00:00.000Z',
      vehicle: '15c42daad17250e579833f0e',
      payment: IPayment.Cash,
      amount: 10000,
      user: 'd4ba2daad17250e579833f0e',
      exception: ''
    }));
  });

  test('should delete rental /api/rentals/:id', async () => {
    await RentalModel.create(testRental);

    const { body } = await request(testServer.app)
      .delete(`/api/rentals/${testRental._id}`)
      .expect(200);

    expect(body).toEqual({ status: IStatus.Inactive });
  });
});
