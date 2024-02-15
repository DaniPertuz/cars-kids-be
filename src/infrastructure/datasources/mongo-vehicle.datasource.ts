import { VehicleModel } from '../../database/models';
import { VehicleDatasource } from '../../domain/datasources/vehicle.datasource';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { CustomError } from '../../domain/errors';
import { IVehicleSize, IStatus } from '../../interfaces';

export class MongoVehicleDatasource implements VehicleDatasource {
  private async getVehiclesByQuery(query: any): Promise<VehicleEntity[]> {
    const vehicleData = await VehicleModel.find(query).select('-status');
    return vehicleData.map(VehicleEntity.fromObject);
  }

  async createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
    try {
      const data = await VehicleModel.create(vehicle.params);

      return VehicleEntity.fromObject(data);
    } catch (error) {
      throw CustomError.serverError(`Error al crear vehículo: ${error}`);
    }
  }

  async getVehicleByNickname(nickname: string): Promise<VehicleEntity | null> {
    try {
      const vehicleData = await VehicleModel.findOne({ nickname }).select('-status');

      return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículo: ${error}`);
    }
  }

  async getVehicles(): Promise<VehicleEntity[]> {
    try {
      return await this.getVehiclesByQuery({});
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos: ${error}`);
    }
  }

  async getVehiclesByColor(color: string): Promise<VehicleEntity[]> {
    try {
      return await this.getVehiclesByQuery({ color });
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por color: ${error}`);
    }
  }

  async getVehiclesByColorAndSize(color: string, size: IVehicleSize): Promise<VehicleEntity[]> {
    try {
      return await this.getVehiclesByQuery({ color, size });
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por color y tamaño: ${error}`);
    }
  }

  async getVehiclesBySize(size: IVehicleSize): Promise<VehicleEntity[]> {
    try {
      return await this.getVehiclesByQuery({ size });
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por tamaño: ${error}`);
    }
  }

  async getVehiclesByStatus(status: IStatus): Promise<VehicleEntity[]> {
    try {
      return await this.getVehiclesByQuery({ status });
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por estado: ${error}`);
    }
  }

  async updateVehicle(nickname: string, vehicle: VehicleEntity): Promise<VehicleEntity | null> {
    try {
      const vehicleData = await VehicleModel.findOneAndUpdate({ nickname }, vehicle.params, { new: true });
      return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al actualizar vehículo: ${error}`);
    }
  }

  async deactivateVehicle(nickname: string): Promise<VehicleEntity | null> {
    try {
      const vehicleData = await VehicleModel.findOneAndUpdate({ nickname }, { status: IStatus.Inactive }, { new: true });
      return vehicleData ? VehicleEntity.fromObject(vehicleData) : null;
    } catch (error) {
      throw CustomError.serverError(`Error al eliminar vehículo: ${error}`);
    }
  }
}
