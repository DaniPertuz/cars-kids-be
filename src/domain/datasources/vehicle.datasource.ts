import { ICategory, IStatus, IVehicleSize, VehicleQueryResult } from '../../interfaces';
import { PaginationDto } from '../dtos/shared/pagination.dto';
import { VehicleEntity } from '../entities/vehicle.entity';

export abstract class VehicleDatasource {
  abstract createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity>;
  abstract getVehicleByNickname(nickname: string): Promise<VehicleEntity | null>;
  abstract getVehicles(paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract getVehiclesByCategory(category: ICategory, paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract getVehiclesByColor(color: string, paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract getVehiclesByColorAndSize(color: string, size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract getVehiclesBySize(size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract getVehiclesByStatus(status: IStatus, paginationDto: PaginationDto): Promise<VehicleQueryResult>;
  abstract updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null>;
  abstract deactivateVehicle(nickname: string): Promise<VehicleEntity | null>;
}
