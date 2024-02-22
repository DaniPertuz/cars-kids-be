import { VehicleModel } from '../../database/models';
import { VehicleDatasource } from '../../domain/datasources/vehicle.datasource';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { CustomError } from '../../domain/errors';
import { IVehicleSize, IStatus, VehicleQueryResult } from '../../interfaces';

export class MongoVehicleDatasource implements VehicleDatasource {
  public async getVehiclesByQuery(query: any, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    const { page, limit } = paginationDto;

    const [total, vehicles] = await Promise.all([
      VehicleModel.countDocuments(query),
      VehicleModel.find(query)
        .select('-status')
        .sort({ nickname: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    return {
      page,
      limit,
      total,
      next: ((page * limit) < total) ? `/rentals?page=${(page + 1)}&limit=${limit}` : null,
      prev: (page - 1 > 0) ? `/rentals?page=${(page - 1)}&limit=${limit}` : null,
      vehicles: vehicles.map(VehicleEntity.fromObject)
    };
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

  async getVehicles(paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    try {
      return await this.getVehiclesByQuery({}, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos: ${error}`);
    }
  }

  async getVehiclesByColor(color: string, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    try {
      return await this.getVehiclesByQuery({ color }, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por color: ${error}`);
    }
  }

  async getVehiclesByColorAndSize(color: string, size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    try {
      return await this.getVehiclesByQuery({ color, size }, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por color y tamaño: ${error}`);
    }
  }

  async getVehiclesBySize(size: IVehicleSize, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    try {
      return await this.getVehiclesByQuery({ size }, paginationDto);
    } catch (error) {
      throw CustomError.serverError(`Error al obtener vehículos por tamaño: ${error}`);
    }
  }

  async getVehiclesByStatus(status: IStatus, paginationDto: PaginationDto): Promise<VehicleQueryResult> {
    try {
      return await this.getVehiclesByQuery({ status }, paginationDto);
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
