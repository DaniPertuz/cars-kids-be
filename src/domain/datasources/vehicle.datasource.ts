import { IStatus, IVehicle, IVehicleSize } from '../../interfaces';
import { VehicleEntity } from '../entities/vehicle.entity';

export abstract class VehicleDatasource {
  abstract createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity>;
  abstract getVehicleByNickname(nickname: string): Promise<VehicleEntity | null>;
  abstract getVehicles(): Promise<VehicleEntity[]>;
  abstract getVehiclesByColor(color: string): Promise<VehicleEntity[]>;
  abstract getVehiclesByColorAndSize(color: string, size: IVehicleSize): Promise<VehicleEntity[]>;
  abstract getVehiclesBySize(size: IVehicleSize): Promise<VehicleEntity[]>;
  abstract getVehiclesByStatus(status: IStatus): Promise<VehicleEntity[]>;
  abstract updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null>;
  abstract deactivateVehicle(nickname: string): Promise<VehicleEntity | null>;
}
