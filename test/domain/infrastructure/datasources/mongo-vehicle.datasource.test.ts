import { connect, disconnect } from '../../../../src/database';
import { VehicleModel } from '../../../../src/database/models';
import { VehicleEntity } from '../../../../src/domain/entities/vehicle.entity';
import { MongoVehicleDatasource } from '../../../../src/infrastructure/datasources/mongo-vehicle.datasource';
import { ICategory, IStatus, IVehicleSize } from '../../../../src/interfaces';

describe('Mongo Vehicle datasource', () => {

  const vehicleDatasource = new MongoVehicleDatasource();

  const vehicle = new VehicleEntity({
    nickname: 'Test Name',
    img: 'Test image',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Large,
    status: IStatus.Active
  });

  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await VehicleModel.deleteMany();
    await disconnect();
  });

  test('should create a vehicle', async () => {

    const vehicleDB = await vehicleDatasource.createVehicle(vehicle);

    expect(vehicleDB).toBeInstanceOf(VehicleEntity);

    await VehicleModel.findOneAndDelete({ nickname: vehicleDB.params.nickname });
  });

  test('should get vehicles', async () => {
    await vehicleDatasource.createVehicle(vehicle);

    const vehicles = await vehicleDatasource.getVehicles();

    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(ICategory.Car);
  });

  test('should get vehicle by Nickname', async () => {
    const vehicleTest = new VehicleEntity({
      nickname: 'Test Name 2',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const vehicleDB = await vehicleDatasource.getVehicleByNickname('Test Name 2');
    const vehicleDB2 = await vehicleDatasource.getVehicleByNickname('Testing Name');

    expect(vehicleDB).toBeInstanceOf(VehicleEntity);
    expect(vehicleDB?.params.nickname).toEqual(expect.any(String));
    expect(vehicleDB2).toBeNull();
  });

  test('should update vehicle', async () => {
    const vehicleTest = new VehicleEntity({
      nickname: 'Test Name 3',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const updatedVehicle = new VehicleEntity({
      nickname: 'Test Name 4',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    const vehicleDB = await vehicleDatasource.updateVehicle('Test Name 3', updatedVehicle);
    const vehicleDB2 = await vehicleDatasource.updateVehicle('Testing Name', updatedVehicle);

    expect(vehicleDB).toEqual(updatedVehicle);
    expect(vehicleDB2).toBeNull();
  });

  test('should deactivate vehicle', async () => {
    const vehicleTest = new VehicleEntity({
      nickname: 'Test Name 5',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const vehicleDB = await vehicleDatasource.deactivateVehicle('Test Name 5');
    const vehicleDB2 = await vehicleDatasource.deactivateVehicle('Testing Name');

    expect(vehicleDB?.params.status).toBe(IStatus.Inactive);
    expect(vehicleDB2).toBeNull();
  });

});
