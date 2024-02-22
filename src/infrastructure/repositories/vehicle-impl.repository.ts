import { VehicleDatasource } from '../../domain/datasources/vehicle.datasource';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/repository/vehicle.repository';
import { IVehicleSize, IStatus, VehicleQueryResult } from '../../interfaces';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';

export class VehicleRepositoryImpl implements VehicleRepository {
  constructor(private readonly vehicleDatasource: VehicleDatasource) { }

  createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
    return this.vehicleDatasource.createVehicle(vehicle);
  }

  getVehicleByNickname(id: string): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.getVehicleByNickname(id);
  }

  getVehicles(paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    return this.vehicleDatasource.getVehicles(paginationDto);
  }

  getVehiclesByColor(color: string, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    return this.vehicleDatasource.getVehiclesByColor(color, paginationDto);
  }

  getVehiclesByColorAndSize(color: string, size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    return this.vehicleDatasource.getVehiclesByColorAndSize(color, size, paginationDto);
  }

  getVehiclesBySize(size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    return this.vehicleDatasource.getVehiclesBySize(size, paginationDto);
  }

  getVehiclesByStatus(status: IStatus, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    return this.vehicleDatasource.getVehiclesByStatus(status, paginationDto);
  }

  updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.updateVehicle(nickname, vehicle);
  }

  deactivateVehicle(id: string): Promise<VehicleEntity | null> {
    return this.vehicleDatasource.deactivateVehicle(id);
  }
}
