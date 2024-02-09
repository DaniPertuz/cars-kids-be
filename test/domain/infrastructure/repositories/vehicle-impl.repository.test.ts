import { VehicleDatasource } from '../../../../src/domain/datasources/vehicle.datasource';
import { VehicleEntity } from '../../../../src/domain/entities/vehicle.entity';
import { VehicleRepositoryImpl } from '../../../../src/infrastructure/repositories/vehicle-impl.repository';
import { ICategory, IStatus, IVehicleSize } from '../../../../src/interfaces';

type MockVehicleDatasource = VehicleDatasource & {
  [key: string]: jest.Mock<any, any>;
};

describe('Vehicle repository implementation', () => {
  const mockVehicleDatasource: MockVehicleDatasource = {
    createVehicle: jest.fn(),
    getVehicleByNickname: jest.fn(),
    getVehicles: jest.fn(),
    getVehiclesByColor: jest.fn(),
    getVehiclesByColorAndSize: jest.fn(),
    getVehiclesBySize: jest.fn(),
    getVehiclesByStatus: jest.fn(),
    updateVehicle: jest.fn(),
    deactivateVehicle: jest.fn(),
  };

  const vehicleRepositoryImpl = new VehicleRepositoryImpl(mockVehicleDatasource);
  const vehicle = new VehicleEntity({
    nickname: 'Test Name',
    img: 'Test image',
    category: ICategory.Car,
    color: '#000000',
    size: IVehicleSize.Large,
    status: IStatus.Active,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    { method: 'createVehicle', args: [vehicle], },
    { method: 'getVehicles', args: [], },
    { method: 'getVehicleByNickname', args: ['Test Name'], },
    { method: 'getVehiclesByColor', args: ['Test Color'], },
    { method: 'getVehiclesByColorAndSize', args: ['Test Color', 'Test Size' as IVehicleSize], },
    { method: 'getVehiclesBySize', args: ['Test Size' as IVehicleSize], },
    { method: 'getVehiclesByStatus', args: ['Test Status' as IStatus], },
    { method: 'updateVehicle', args: ['Test Name', vehicle], },
    { method: 'deactivateVehicle', args: ['Test ID'], },
  ];

  testCases.forEach(({ method, args }) => {
    test(`should call ${method} on the datasource`, async () => {
      await (vehicleRepositoryImpl as any)[method](...args);
      expect(mockVehicleDatasource[method]).toHaveBeenCalled();
    });
  });
});
