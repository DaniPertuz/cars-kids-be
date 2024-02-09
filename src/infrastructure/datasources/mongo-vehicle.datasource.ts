import { VehicleModel } from '../../database/models';
import { VehicleDatasource } from '../../domain/datasources/vehicle.datasource';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { IVehicleSize, IStatus } from '../../interfaces';

export class MongoVehicleDatasource implements VehicleDatasource {
  private async getVehiclesByQuery(query: any): Promise<VehicleEntity[]> {
    const vehicleData = await VehicleModel.find(query).select('-status');
    return vehicleData.map(VehicleEntity.fromObject);
  }

  async createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
    const data = await VehicleModel.create(vehicle.params);

    return VehicleEntity.fromObject(data);
  }

  async getVehicleByNickname(nickname: string): Promise<VehicleEntity | null> {
    const vehicleData = await VehicleModel.findOne({ nickname }).select('-status');

    return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
  }

  getVehicles = (): Promise<VehicleEntity[]> => this.getVehiclesByQuery({});

  getVehiclesByColor = (color: string): Promise<VehicleEntity[]> => this.getVehiclesByQuery({ color });

  getVehiclesByColorAndSize = (color: string, size: IVehicleSize): Promise<VehicleEntity[]> => this.getVehiclesByQuery({ color, size });

  getVehiclesBySize = (size: IVehicleSize): Promise<VehicleEntity[]> => this.getVehiclesByQuery({ size });

  getVehiclesByStatus = (status: IStatus): Promise<VehicleEntity[]> => this.getVehiclesByQuery({ status });

  async updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null> {

    const vehicleData = await VehicleModel.findOneAndUpdate({ nickname }, vehicle.params, { new: true });

    return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
  }

  async deactivateVehicle(nickname: string): Promise<VehicleEntity | null> {
    const vehicleData = await VehicleModel.findOneAndUpdate({ nickname }, { status: IStatus.Inactive }, { new: true });
    return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
  }
}
