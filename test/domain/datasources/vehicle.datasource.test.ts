import { VehicleDatasource } from '../../../src/domain/datasources/vehicle.datasource';
import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';
import { VehicleEntity } from '../../../src/domain/entities/vehicle.entity';
import { IVehicleSize, IStatus, VehicleQueryResult, ICategory } from '../../../src/interfaces';

describe('Vehicle datasource', () => {
  class MockDatasource implements VehicleDatasource {
    createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
      throw new Error('Method not implemented.');
    }
    getVehicleByNickname(nickname: string): Promise<VehicleEntity | null> {
      throw new Error('Method not implemented.');
    }
    getVehicles(paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    getVehiclesByCategory(category: ICategory, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    getVehiclesByColor(color: string, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    getVehiclesByColorAndSize(color: string, size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    getVehiclesBySize(size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    getVehiclesByStatus(status: IStatus, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
      throw new Error('Method not implemented.');
    }
    updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null> {
      throw new Error('Method not implemented.');
    }
    deactivateVehicle(nickname: string): Promise<VehicleEntity | null> {
      throw new Error('Method not implemented.');
    }
  }

  test('should test the abstract Vehicle class', async () => {
    const mockDatasource = new MockDatasource();

    expect(mockDatasource).toBeInstanceOf(MockDatasource);
    expect(typeof mockDatasource.createVehicle).toBe('function');
    expect(typeof mockDatasource.getVehicles).toBe('function');
    expect(typeof mockDatasource.getVehicleByNickname).toBe('function');
    expect(typeof mockDatasource.getVehiclesByCategory).toBe('function');
    expect(typeof mockDatasource.getVehiclesByColor).toBe('function');
    expect(typeof mockDatasource.getVehiclesByColorAndSize).toBe('function');
    expect(typeof mockDatasource.getVehiclesBySize).toBe('function');
    expect(typeof mockDatasource.getVehiclesByStatus).toBe('function');
    expect(typeof mockDatasource.updateVehicle).toBe('function');
    expect(typeof mockDatasource.deactivateVehicle).toBe('function');
  });
});
