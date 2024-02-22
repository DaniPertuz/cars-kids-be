import request from 'supertest';
import { testServer } from '../../test-server';
import { VehicleModel } from '../../../src/database/models';
import { ICategory, IStatus, IVehicleSize } from '../../../src/interfaces';

describe('Vehicles routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await VehicleModel.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const vehicle1 = {
    nickname: 'Test Name',
    img: 'Test image',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Large,
    status: IStatus.Active
  };

  const vehicle2 = {
    nickname: 'Test Name 2',
    img: 'Test image 2',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Medium,
    status: IStatus.Active
  };

  const vehicle3 = {
    img: 'Test image 2',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Medium,
    status: IStatus.Active
  };

  test('should return Vehicles api/vehicles', async () => {
    await VehicleModel.create(vehicle1);
    await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .get('/api/vehicles')
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.vehicles.length).toBe(2);
    expect(body.vehicles[0].nickname).toBe('Test Name');
  });

  test('should return Vehicles by color api/vehicles/color', async () => {
    await VehicleModel.create(vehicle1);
    await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .get('/api/vehicles/color')
      .send({ color: vehicle1.color })
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.vehicles.length).toBe(2);
    expect(body.vehicles[0].nickname).toBe('Test Name');
  });

  test('should return Vehicles by size api/vehicles/size', async () => {
    await VehicleModel.create(vehicle1);
    await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .get('/api/vehicles/size')
      .send({ size: vehicle1.size })
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.vehicles.length).toBe(1);
    expect(body.vehicles[0].nickname).toBe('Test Name');
  });

  test('should return Vehicles by color and size api/vehicles/props', async () => {
    await VehicleModel.create(vehicle1);
    await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .get('/api/vehicles/size')
      .send({ color: vehicle1.color, size: vehicle1.size })
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.vehicles.length).toBe(1);
    expect(body.vehicles[0].nickname).toBe('Test Name');
  });

  test('should return Vehicles by status api/vehicles/status', async () => {
    await VehicleModel.create(vehicle1);
    await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .get('/api/vehicles/status')
      .send({ status: IStatus.Active })
      .expect(200);

    expect(body).toBeInstanceOf(Object);
    expect(body.vehicles.length).toBe(2);
    expect(body.vehicles[0].nickname).toBe('Test Name');
  });

  test('should create a new Vehicle api/vehicles', async () => {
    const { body } = await request(testServer.app)
      .post('/api/vehicles')
      .send(vehicle1);

    const imgValue = body.img ? body.img : '';

    expect(body).toEqual(expect.objectContaining({
      nickname: vehicle1.nickname,
      img: imgValue,
      category: vehicle1.category,
      color: vehicle1.color,
      size: vehicle1.size,
      status: vehicle1.status
    }));
  });

  test('should return a bad request if a required field is not provided api/vehicles', async () => {
    const { body } = await request(testServer.app)
      .post('/api/vehicles')
      .send(vehicle3)
      .expect(400);

    expect(body).toEqual({ error: expect.any(String) });
  });

  test('should return an updated vehicle api/:nickname', async () => {
    const vehicleDB = await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .put(`/api/vehicles/${vehicleDB.nickname}`)
      .send({ color: '#222222' })
      .expect(200);

    expect(body).toEqual(expect.objectContaining({
      nickname: 'Test Name 2',
      category: 'car',
      color: '#222222',
      img: 'Test image 2',
      size: 'M',
      status: 'active'
    }));
  });

  test('should return a bad request to update a vehicle if not found api/vehicles/:nickname', async () => {
    const vehicleDB = await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .put(`/api/vehicles/${vehicleDB.nickname}x`)
      .send({ color: '#222222' })
      .expect(404);

    expect(body).toEqual({ error: 'Vehículo no encontrado' });
  });

  test('should deactivate a vehicle api/:nickname', async () => {
    const vehicleDB = await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .delete(`/api/vehicles/${vehicleDB.nickname}`)
      .expect(200);

    expect(body).toEqual({ status: 'inactive' });
  });

  test('should deactivate a bad request if vehicle is not found to be deleted api/:nickname', async () => {
    const vehicleDB = await VehicleModel.create(vehicle2);

    const { body } = await request(testServer.app)
      .delete(`/api/vehicles/${vehicleDB.nickname}x`)
      .expect(404);

    expect(body).toEqual({ error: 'Vehículo no encontrado' });
  });
});
