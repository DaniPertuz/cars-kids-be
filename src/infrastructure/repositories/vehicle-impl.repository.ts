import { VehicleDatasource } from '../../domain/datasources/vehicle.datasource';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/repository/vehicle.repository';
import { IVehicleSize, IStatus } from '../../interfaces';

export class VehicleRepositoryImpl implements VehicleRepository {
  constructor(private readonly vehicleDatasource: VehicleDatasource) { }

  createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
    return this.vehicleDatasource.createVehicle(vehicle);
  }

  getVehicleByNickname(id: string): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.getVehicleByNickname(id);
  }

  getVehicles(): Promise<VehicleEntity[]> {
    return this.vehicleDatasource.getVehicles();
  }

  getVehiclesByColor(color: string): Promise<VehicleEntity[]> {
    return this.vehicleDatasource.getVehiclesByColor(color);
  }

  getVehiclesByColorAndSize(color: string, size: IVehicleSize): Promise<VehicleEntity[]> {
    return this.vehicleDatasource.getVehiclesByColorAndSize(color, size);
  }

  getVehiclesBySize(size: IVehicleSize): Promise<VehicleEntity[]> {
    return this.vehicleDatasource.getVehiclesBySize(size);
  }

  getVehiclesByStatus(status: IStatus): Promise<VehicleEntity[]> {
    return this.vehicleDatasource.getVehiclesByStatus(status);
  }

  updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.updateVehicle(nickname, vehicle);
  }

  deactivateVehicle(id: string): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.deactivateVehicle(id);
  }
}
