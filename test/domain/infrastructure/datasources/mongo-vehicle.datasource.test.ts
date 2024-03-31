import { connect, disconnect } from '../../../../src/database';
import { VehicleModel } from '../../../../src/database/models';
import { PaginationDto } from '../../../../src/domain/dtos/shared/pagination.dto';
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

  beforeEach(async () => {
    await VehicleModel.deleteMany();
  });  

  afterAll(async () => {
    await disconnect();
  });

  test('should create a vehicle', async () => {
    const vehicleDB = await vehicleDatasource.createVehicle(vehicle);

    expect(vehicleDB).toBeInstanceOf(VehicleEntity);
  });

  test('should throw an error if failed to create a vehicle', async () => {
    jest.spyOn(VehicleModel, 'create').mockRejectedValueOnce(new Error('Test error'));

    await expect(vehicleDatasource.createVehicle(vehicle)).rejects.toThrow('Error al crear vehículo: Error: Test error');
  });

  test('should get vehicles', async () => {
    await vehicleDatasource.createVehicle(vehicle);
    const [error, paginationDto] = PaginationDto.create(1, 1);

    const { vehicles } = await vehicleDatasource.getVehicles(paginationDto!);

    expect(error).toBeUndefined();
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(ICategory.Car);
  });

  test('should getVehicles generate prev and next URLs', async () => {
    const vehicle1 = new VehicleEntity({
      nickname: 'Testing Name 1',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    const vehicle2 = new VehicleEntity({
      nickname: 'Testing Name 2',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicle1);
    await vehicleDatasource.createVehicle(vehicle2);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await vehicleDatasource.getVehiclesByQuery({}, paginationDto1!);

    expect(pagination1.next).toBe(`/vehicles?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await vehicleDatasource.getVehiclesByQuery({}, paginationDto2!);

    expect(pagination2.prev).toBe(`/vehicles?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();
  });

  test('should throw an error if failed to get vehicles', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(VehicleModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehicles(paginationDto!)).rejects.toThrow('Error al obtener vehículos: Error: Test error');
  });

  test('should get vehicle by Nickname', async () => {
    const vehicleTest = new VehicleEntity({
      nickname: 'Test Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const vehicleDB = await vehicleDatasource.getVehicleByNickname('Test Nickname');
    const vehicleDB2 = await vehicleDatasource.getVehicleByNickname('Testing Name');

    expect(vehicleDB).toBeInstanceOf(VehicleEntity);
    expect(vehicleDB?.params.nickname).toEqual(expect.any(String));
    expect(vehicleDB2).toBeNull();
  });

  test('should throw an error if failed to get vehicle', async () => {
    jest.spyOn(VehicleModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehicleByNickname('Nickname')).rejects.toThrow('Error al obtener vehículo: Error: Test error');
  });

  test('should get vehicles by size', async () => {
    const [error, paginationDto] = PaginationDto.create(1, 1);
    const vehicleTest = new VehicleEntity({
      nickname: 'Large Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const { vehicles } = await vehicleDatasource.getVehiclesBySize(IVehicleSize.Large, paginationDto!);

    expect(error).toBeUndefined();
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(ICategory.Car);
  });

  test('should throw an error if failed to get vehicles by size', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(VehicleModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehiclesBySize(IVehicleSize.Large, paginationDto!)).rejects.toThrow('Error al obtener vehículos por tamaño: Error: Test error');
  });

  test('should get vehicles by color', async () => {
    const [error, paginationDto] = PaginationDto.create(1, 1);
    const vehicleTest = new VehicleEntity({
      nickname: 'Color Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const { vehicles } = await vehicleDatasource.getVehiclesByColor('#000000', paginationDto!);

    expect(error).toBeUndefined();
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(vehicleTest.params.category);
  });

  test('should throw an error if failed to get vehicles by color', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(VehicleModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehiclesByColor('blue', paginationDto!)).rejects.toThrow('Error al obtener vehículos por color: Error: Test error');
  });

  test('should get vehicles by color and size', async () => {
    const [error, paginationDto] = PaginationDto.create(1, 1);
    const vehicleTest = new VehicleEntity({
      nickname: 'Color Large Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const { vehicles } = await vehicleDatasource.getVehiclesByColorAndSize('#000000', IVehicleSize.Large, paginationDto!);

    expect(error).toBeUndefined();
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(ICategory.Car);
  });

  test('should throw an error if failed to get vehicles by color and size', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    const color = 'blue';
    jest.spyOn(VehicleModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehiclesByColorAndSize(color, IVehicleSize.Large, paginationDto!)).rejects.toThrow('Error al obtener vehículos por color y tamaño: Error: Test error');
  });

  test('should get vehicles by status', async () => {
    const [error, paginationDto] = PaginationDto.create(1, 1);
    const vehicleTest = new VehicleEntity({
      nickname: 'Status Nickname',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicleTest);

    const { vehicles } = await vehicleDatasource.getVehiclesByStatus(IStatus.Active, paginationDto!);

    expect(error).toBeUndefined();
    expect(vehicles.length).toBeGreaterThanOrEqual(1);
    expect(vehicles[0].params.category).toBe(ICategory.Car);
  });

  test('should getVehiclesByStatus generate prev and next URLs', async () => {
    const vehicle1 = new VehicleEntity({
      nickname: 'Testing Name 1',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    const vehicle2 = new VehicleEntity({
      nickname: 'Testing Name 2',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    await vehicleDatasource.createVehicle(vehicle1);
    await vehicleDatasource.createVehicle(vehicle2);
    const [error1, paginationDto1] = PaginationDto.create(1, 1);

    const pagination1 = await vehicleDatasource.getVehiclesByStatus(IStatus.Active, paginationDto1!);

    expect(pagination1.next).toBe(`/vehicles/status/${IStatus.Active}?page=${paginationDto1!.page + 1}&limit=${paginationDto1!.limit}`);
    expect(pagination1.prev).toBeNull();
    expect(error1).toBeUndefined();

    const [error2, paginationDto2] = PaginationDto.create(2, 1);

    const pagination2 = await vehicleDatasource.getVehiclesByStatus(IStatus.Active, paginationDto2!);

    expect(pagination2.prev).toBe(`/vehicles/status/${IStatus.Active}?page=${paginationDto2!.page - 1}&limit=${paginationDto2!.limit}`);
    expect(pagination2.next).toBeNull();
    expect(error2).toBeUndefined();
  });

  test('should throw an error if failed to get vehicles by status', async () => {
    const [, paginationDto] = PaginationDto.create(1, 1);
    jest.spyOn(VehicleModel, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    await expect(vehicleDatasource.getVehiclesByStatus(IStatus.Active, paginationDto!)).rejects.toThrow('Error al obtener vehículos por estado: Error: Test error');
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

    expect(vehicleDB?.params).toEqual(expect.objectContaining({
      nickname: 'Test Name 4',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    }));
    expect(vehicleDB2).toBeNull();
  });

  test('should throw an error when updating vehicle', async () => {
    const nickname = 'vehicle_nickname';
    const vehicle = new VehicleEntity({
      nickname: 'Test Name Update',
      img: 'Test image',
      category: ICategory.Car,
      color: '#000000',
      size: IVehicleSize.Large,
      status: IStatus.Active
    });

    const error = new Error('Failed to update vehicle');

    const mockFindOneAndUpdate = jest.spyOn(VehicleModel, 'findOneAndUpdate');

    mockFindOneAndUpdate.mockRejectedValue(error);

    await expect(vehicleDatasource.updateVehicle(nickname, vehicle)).rejects.toThrow(`Error al actualizar vehículo: ${error}`);

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ nickname }, vehicle.params, { new: true });

    mockFindOneAndUpdate.mockRestore();
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

  test('should throw an error when deleting a vehicle', async () => {
    const nickname = 'vehicle_nickname';
    const error = new Error('Test Error');

    const mockFindOneAndUpdate = jest.spyOn(VehicleModel, 'findOneAndUpdate');

    mockFindOneAndUpdate.mockRejectedValue(error);

    await expect(vehicleDatasource.deactivateVehicle(nickname)).rejects.toThrow(`Error al eliminar vehículo: ${error}`);

    expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ nickname }, { status: 'inactive' }, { new: true });

    mockFindOneAndUpdate.mockRestore();
  });
});
